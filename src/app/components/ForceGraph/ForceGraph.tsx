"use client";
import dynamic from 'next/dynamic';
import React, { useRef, useState, useEffect, forwardRef, Ref } from 'react';
import { ForceGraph3D } from 'react-force-graph';
import rawData from '../../../../public/data/datasets/producersFilms.json'; // Ensure the import path is correct
import InfoCard from '@/app/components/InfoCard/InfoCard'; // Ensure the import path is correct

interface Node {
  id: string;
  name: string;
  type: string;
  films: string[];
  val?: number;
  x?: number;
  y?: number;
  z?: number;
  neighbors?: Node[];
  links?: Link[];
}

interface Link {
    source: string | Node;
    target: string | Node;
    [key: string]: any;
}


// Define a custom type for ForceGraphMethods based on the methods you need
interface ForceGraphMethods {
    cameraPosition: (position: { x: number, y: number, z: number }, lookAt: Node, ms?: number) => void;
    refresh: () => void;
}

// Wrap ForceGraph3D with forwardRef to allow ref usage
const ForceGraph3DWithRef = forwardRef<ForceGraphMethods, any>((props, ref) => (
    <ForceGraph3D {...props} ref={ref} />
));

// Set the display name for the component
ForceGraph3DWithRef.displayName = 'ForceGraph3DWithRef';

const ForceGraph: React.FC = () => {
    const fgRef = useRef<ForceGraphMethods | null>(null);
    const [graphData, setGraphData] = useState<{ nodes: Node[]; links: Link[] }>({ nodes: [], links: [] });
    const [highlightNodes, setHighlightNodes] = useState<Set<Node>>(new Set());
    const [highlightLinks, setHighlightLinks] = useState<Set<Link>>(new Set());
    const [clickedNodes, setClickedNodes] = useState<Set<Node>>(new Set());
    const [clickedLinks, setClickedLinks] = useState<Set<Link>>(new Set());
    const [activeNode, setActiveNode] = useState<Node | null>(null); // State to hold the active node for InfoCard

    const defaultNodeColor = 'rgba(17, 239, 225, 0.8)';
    const filmNodeColor = 'rgba(229, 93, 226, 0.8)';
    const highlightNodeColor = 'rgb(255, 255, 255)';
    const clickedNodeColor = 'rgb(255, 255, 0)';
    const clickedLinkColor = 'rgb(255, 255, 0)';
    const highlightLinkColor = 'rgba(91, 208, 83, 0.8)';
    const defaultLinkColor = 'rgba(255,255,255)'; // Step 1: Declare the default link color


    

    useEffect(() => {
      const idToNode: { [key: string]: Node } = rawData.nodes.reduce<{ [key: string]: Node }>((acc, node) => {
        acc[node.id] = { ...node, neighbors: [], links: [], films: [] };
        return acc;
    }, {});
    


        const gData = {
            nodes: Object.values(idToNode),
            links: rawData.links.map((link: Link) => ({
                ...link,
                source: idToNode[link.source as string], // Ensure the source is a Node object from idToNode
                target: idToNode[link.target as string] // Ensure the target is a Node object from idToNode
            }))
        };

        gData.links.forEach((link: Link) => {
            if (link.source && link.target) {
                (link.source as Node).neighbors!.push(link.target as Node);
                (link.target as Node).neighbors!.push(link.source as Node);
                (link.source as Node).links!.push(link);
                (link.target as Node).links!.push(link);
            }
        });

        setGraphData(gData);
    }, []);
    const handleNodeClick = (node: Node) => {
        const distance = 500;
        const distRatio = 1 + distance / Math.hypot(node.x ?? 0, node.y ?? 0, node.z ?? 0);
        
        fgRef.current?.cameraPosition(
            { x: (node.x ?? 0) * distRatio, y: (node.y ?? 0) * distRatio, z: (node.z ?? 0) * distRatio },
            node,
            3000
        );

        setClickedNodes(new Set([node, ...(node.neighbors ?? [])]));
        setClickedLinks(new Set(node.links));
        setActiveNode(node);
    };

    const handleBackgroundClick = () => {
        setActiveNode(null);
        setClickedNodes(new Set());
        setClickedLinks(new Set());
    };

    const handleNodeHover = (node: Node | null) => {
        highlightNodes.clear();
        highlightLinks.clear();

        if (node) {
            highlightNodes.add(node);
            node.neighbors?.forEach(neighbor => highlightNodes.add(neighbor));
            node.links?.forEach(link => highlightLinks.add(link));
        }

        fgRef.current?.refresh();
    };

    const handleLinkHover = (link: Link | null) => {
        highlightNodes.clear();
        highlightLinks.clear();

        if (link) {
            highlightLinks.add(link);
            highlightNodes.add(link.source as Node);
            highlightNodes.add(link.target as Node);
        }

        fgRef.current?.refresh();
    };

    return (
        <div style={{ position: 'relative', height: '100%', width: '100%' }}>
            <ForceGraph3DWithRef
                ref={fgRef as Ref<ForceGraphMethods>}
                graphData={graphData}
                nodeVal={(node: Node) => node.val ?? 1}
                nodeColor={(node: Node) => {
                  if (highlightNodes.has(node) || clickedNodes.has(node)) {
                      return highlightNodeColor;
                  }
                  return node.type === 'film' ? filmNodeColor : defaultNodeColor;
              }}
              
              linkColor={(link: Link) => {
                if (clickedLinks.has(link)) {
                    return clickedLinkColor;
                }
                return highlightLinks.has(link) ? highlightLinkColor : defaultLinkColor; // Step 2: Use the default link color
            }}           
                linkWidth={(link: Link) => highlightLinks.has(link) || clickedLinks.has(link) ? 4 : 1}
                linkDirectionalParticles={(link: Link) => highlightLinks.has(link) ? 4 : 0}
                linkDirectionalParticleWidth={4}
                onNodeClick={handleNodeClick}
                onNodeHover={handleNodeHover}
                onLinkHover={handleLinkHover}
                onBackgroundClick={handleBackgroundClick}
            />
            {activeNode && (
              <></>

            )}
        </div>
    );
};

export default ForceGraph;
