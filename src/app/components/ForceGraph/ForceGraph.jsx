"use client";

import React, { useCallback, useRef, useState, useEffect } from "react";
import * as THREE from 'three';
import ForceGraph3D from "react-force-graph-3d";
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass';
import SearchBar from "./components/SearchBar/SearchBar";
import InfoCard from "../InfoCard/InfoCard";
import Toggles from "./components/Toggles/Toggles";
import getProducerData from "./components/getProducerData";
import getDistributorData from "./components/getDistributorData";
import getCastData from "./components/getCastData";
import getGripsData from "./components/getGripsData";

const ForceGraph = () => {

  const fgRef = useRef();
  const [graphData, setGraphData] = useState({ nodes: [], links: [] });
  const [highlightNodes, setHighlightNodes] = useState(new Set());
  const [highlightLinks, setHighlightLinks] = useState(new Set());
  const [clickedNodes, setClickedNodes] = useState(new Set());
  const [clickedLinks, setClickedLinks] = useState(new Set());
  const [activeNode, setActiveNode] = useState(null);
  const [selectedToggle, setSelectedToggle] = useState('Producers');

  const colors = {
    nodes: {
      defaultNode: "rgb(255, 105, 180)", // Bright Pink
      selectedNode: "rgb(255, 165, 0)", // Orange
      filmNode: "rgb(0, 255, 127)", // Spring Green
      producerNode: "rgb(255, 105, 180)", // Blue Violet
    },
    links: {
      defaultLink: "rgb(255, 255, 255, 1)", // White
      selectedLink: "rgb(255, 20, 147, 1)", // Deep Pink
      highlightedLink: "rgb(50, 205, 50, 1)", // Lime Green
    },
  };
  

  useEffect(() => {
    const loadData = () => {
      let newData;
      switch (selectedToggle) {
        case 'Producers':
          newData = getProducerData();
          break;
        case 'Companies':
          newData = getDistributorData();
          break;
        case 'Cast':
          newData = getCastData();
          break;
        case 'Grips':
          newData = getGripsData();
          break;
        // Add cases for other toggles
        default:
          newData = getProducerData();
          break;
      }
      const idToNode = newData.nodes.reduce((acc, node) => {
        acc[node.id] = { ...node, neighbors: [], links: [] };
        return acc;
      }, {});

      const gData = {
        nodes: Object.values(idToNode),
        links: newData.links.map(link => ({
          ...link,
          source: idToNode[link.source],
          target: idToNode[link.target]
        }))
      };

      gData.links.forEach(link => {
        if (link.source && link.target) {
          link.source.neighbors.push(link.target);
          link.target.neighbors.push(link.source);
          link.source.links.push(link);
          link.target.links.push(link);
        }
      });

      setGraphData(gData);
    };

    loadData();
  }, [selectedToggle]);

useEffect(() => {
    if (fgRef.current && fgRef.current.postProcessingComposer) {
      // Add bloom processing to links only
      const bloomPass = new UnrealBloomPass();
      bloomPass.strength = 0.5;
      bloomPass.radius = 0.1;
      bloomPass.threshold = 0.4;
      fgRef.current.postProcessingComposer().addPass(bloomPass);
    }
  }, [fgRef]);

  const handleNodeClick = useCallback(
    (node) => {
      const distance = 500;
      const distRatio = 1 + distance / Math.hypot(node.x, node.y, node.z);
      if (fgRef.current) {
        fgRef.current.cameraPosition(
          {
            x: node.x * distRatio,
            y: node.y * distRatio,
            z: node.z * distRatio
          },
          node,
          3000
        );
      }

      setClickedNodes(new Set([node, ...node.neighbors]));
      setClickedLinks(new Set(node.links));
      setActiveNode(node);
    },
    [fgRef]
  );

  const handleBackgroundClick = () => {
    setActiveNode(null);
    setClickedNodes(new Set());
    setClickedLinks(new Set());
  };

  const handleNodeHover = node => {
    highlightNodes.clear();
    highlightLinks.clear();

    if (node) {
      highlightNodes.add(node);
      node.neighbors.forEach(neighbor => highlightNodes.add(neighbor));
      node.links.forEach(link => highlightLinks.add(link));
    }

    fgRef.current.refresh();
  };

  const handleLinkHover = link => {
    highlightNodes.clear();
    highlightLinks.clear();

    if (link) {
      highlightLinks.add(link);
      if (link.source && link.source.neighbors) {
        highlightNodes.add(link.source);
      }
      highlightNodes.add(link.target);
    }

    fgRef.current.refresh();
  };

return (
  <div style={{ backgroundColor: 'rgba(0, 0, 17, 0.5)' }} className="relative min-h-screen text-white">
    <div className="absolute top-0 left-0 w-full h-full z-10">
      <ForceGraph3D
        ref={fgRef}
        backgroundColor="#000000"
        graphData={graphData}
        nodeLabel={node => node.name || ''}
        onNodeClick={handleNodeClick}
        onBackgroundClick={handleBackgroundClick}
        onNodeHover={handleNodeHover}
        nodeColor={node => {
          if (clickedNodes.has(node) || highlightNodes.has(node)) {
            return colors.nodes.selectedNode;
          }
          return node.type === 'film' ? colors.nodes.filmNode : colors.nodes.producerNode;
        }}
        linkColor={link => {
          if (clickedLinks.has(link)) {
            return colors.links.selectedLink;
          }
          return highlightLinks.has(link) ? colors.links.highlightedLink : colors.links.defaultLink;
        }}
        linkWidth={link => highlightLinks.has(link) || clickedLinks.has(link) ? 2 : 6}
        linkDirectionalParticles={link => highlightLinks.has(link) || clickedLinks.has(link) ? 4 : 0}
        linkDirectionalParticleWidth={4}
        /* nodeThreeObject={node => {
            if (node.type === 'film') {
              // Create a cube for films
              return new THREE.Mesh(
                new THREE.BoxGeometry(10, 10, 10), // Adjust size as needed
                new THREE.MeshBasicMaterial({ color: node.color || colors.nodes.filmNode })
              );
            } else {
              // Default sphere for other types
              const radius = 7; // Adjust size as needed
              const segments = 8; // Increase or decrease for performance or quality
              return new THREE.Mesh(
                new THREE.SphereGeometry(radius, segments, segments),
                new THREE.MeshBasicMaterial({ color: node.color || colors.nodes.producerNode })
              );
            }
          }} */
          
      />
    </div>
    <div className="absolute top-0 z-20 w-full lg:w-4/12">

      <div className="hidden lg:block">
        <h1 className="text-6xl mt-20 ml-20 leading-tight">Canadian Cinema Data</h1>
        <div className="text-sm mt-10 ml-20">
          <p>This 3D graph illustrates the intricate relationships within the Canadian film industry, highlighting the connections between productions, producers, companies, cast, and grips involved. It provides a comprehensive map of these relationships, particularly focusing on producer collaborations.</p>
        </div>
        <div className="text-sm mt-2 ml-20">
          <p>The data for this visualization was meticulously sourced by scraping information from all films produced in Canada, filtered to include productions from the past year.</p>
        </div>
      </div>
      <div>
        <div className="mt-5 ml-5 mr-5 lg:mt-20 lg:ml-20 lg:mr-20">
          <div className="relative">
            <Toggles selectedToggle={selectedToggle} setSelectedToggle={setSelectedToggle} />
          </div>
        </div>
        <div className="mt-2 ml-5 mr-5 lg:mt-5 lg:ml-20 lg:mr-20">
          <SearchBar
            nodeNames={graphData.nodes}
            onNodeSelect={handleNodeClick}
          />
        </div>
      </div>

    </div>
    <div>
      {activeNode && (
        <InfoCard
          node={activeNode}
          onClose={handleBackgroundClick}
        />
      )}
    </div>
  </div>
);
};

export default ForceGraph;
