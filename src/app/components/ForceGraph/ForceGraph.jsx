"use client";
import React, { useRef, useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import rawData from '../../../../public/data/datasets/producersFilms.json'; // Ensure the import path is correct
import InfoCard from '@/app/components/InfoCard/InfoCard'; // Ensure the import path is correct

// Dynamically import the ForceGraph3D component with SSR disabled
const ForceGraph3D = dynamic(() => import('react-force-graph').then((mod) => mod.ForceGraph3D), { ssr: false });

const ForceGraph = () => {
  const fgRef = useRef(null);
  const [graphData, setGraphData] = useState({ nodes: [], links: [] });
  const [highlightNodes, setHighlightNodes] = useState(new Set());
  const [highlightLinks, setHighlightLinks] = useState(new Set());
  const [clickedNodes, setClickedNodes] = useState(new Set());
  const [clickedLinks, setClickedLinks] = useState(new Set());
  const [activeNode, setActiveNode] = useState(null); // State to hold the active node for InfoCard

  const defaultNodeColor = 'rgba(17, 239, 225, 0.8)';
  const filmNodeColor = 'rgba(229, 93, 226, 0.8)';
  const highlightNodeColor = 'rgb(255, 255, 255)';
  const clickedNodeColor = 'rgb(255, 255, 0)';
  const clickedLinkColor = 'rgb(255, 255, 0)';
  const highlightLinkColor = 'rgba(91, 208, 83, 0.8)';
  const defaultLinkColor = 'rgba(255,255,255)';

  useEffect(() => {
    const idToNode = rawData.nodes.reduce((acc, node) => {
      acc[node.id] = {...node, neighbors: [], links: [], films: [] };
      return acc;
    }, {});

    const gData = {
      nodes: Object.values(idToNode),
      links: rawData.links.map((link) => ({
       ...link,
        source: idToNode[link.source],
        target: idToNode[link.target],
      })),
    };

    gData.links.forEach((link) => {
      if (link.source && link.target) {
        (link.source).neighbors.push(link.target);
        (link.target).neighbors.push(link.source);
        (link.source).links.push(link);
        (link.target).links.push(link);
      }
    });

    setGraphData(gData);
  }, []);

  const handleNodeClick = (node) => {
    const distance = 500;
    const distRatio = 1 + distance / Math.hypot(node.x?? 0, node.y?? 0, node.z?? 0);

    fgRef.current?.cameraPosition(
      { x: (node.x?? 0) * distRatio, y: (node.y?? 0) * distRatio, z: (node.z?? 0) * distRatio },
      node,
      3000,
    );

    setClickedNodes(new Set([node,...(node.neighbors?? [])]));
    setClickedLinks(new Set(node.links));
    setActiveNode(node);
  };

  const handleBackgroundClick = () => {
    setActiveNode(null);
    setClickedNodes(new Set());
    setClickedLinks(new Set());
  };

  const handleNodeHover = (node) => {
    highlightNodes.clear();
    highlightLinks.clear();

    if (node) {
      highlightNodes.add(node);
      node.neighbors?.forEach((neighbor) => highlightNodes.add(neighbor));
      node.links?.forEach((link) => highlightLinks.add(link));
    }

    fgRef.current?.refresh();
  };

  const handleLinkHover = (link) => {
    highlightNodes.clear();
    highlightLinks.clear();

    if (link) {
      highlightLinks.add(link);
      highlightNodes.add(link.source);
      highlightNodes.add(link.target);
    }

    fgRef.current?.refresh();
  };

  return (
    <div style={{ position: 'relative', height: '100%', width: '100%' }}>
      <ForceGraph3D
        innerRef={fgRef}
        graphData={graphData}
        nodeVal={(node) => node.val?? 1}
        nodeColor={(node) => {
          if (highlightNodes.has(node) || clickedNodes.has(node)) {
            return highlightNodeColor;
          }
          return node.type === 'film'? filmNodeColor : defaultNodeColor;
        }}
        linkColor={(link) => {
          if (clickedLinks.has(link)) {
            return clickedLinkColor;
          }
          return highlightLinks.has(link)? highlightLinkColor : defaultLinkColor;
        }}
        linkWidth={(link) => (highlightLinks.has(link) || clickedLinks.has(link)? 4 : 1)}
        linkDirectionalParticles={(link) => (highlightLinks.has(link)? 4 : 0)}
        linkDirectionalParticleWidth={4}
        onNodeClick={handleNodeClick}
        onNodeHover={handleNodeHover}
        onLinkHover={handleLinkHover}
        onBackgroundClick={handleBackgroundClick}
      />
      {activeNode && <InfoCard node={activeNode} />}
    </div>
  );
};

export default ForceGraph;
