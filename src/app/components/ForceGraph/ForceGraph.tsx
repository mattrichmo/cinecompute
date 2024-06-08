"use client";

import React, { useRef, useState } from 'react';
import { ForceGraph3D } from 'react-force-graph';
import InfoCard from '@/app/components/InfoCard/InfoCard'; // Ensure the import path is correct

const ForceGraph = ({ data }) => {
    console.log(`Number of Nodes In Force Graph: ${data.nodes.length}`, `Number of Links: ${data.links.length}`);

    const fgRef = useRef();
    const [highlightNodes, setHighlightNodes] = useState(new Set());
    const [highlightLinks, setHighlightLinks] = useState(new Set());
    const [clickedNodes, setClickedNodes] = useState(new Set());
    const [clickedLinks, setClickedLinks] = useState(new Set());
    const [activeNode, setActiveNode] = useState(null); // State to hold the active node for InfoCard

    // Define colors
    const highlightColor = 'rgb(255,0,0)';
    const filmColor = 'rgba(229, 93, 226, 0.8)';
    const defaultColor = 'rgba(17, 239, 225, 0.8)';
    const clickedColor = 'rgb(255,255,0)'; // Yellow color for clicked links

    return (
        <div style={{ position: 'relative', height: '100%', width: '100%' }}>
            <ForceGraph3D
                ref={fgRef}
                graphData={data}
                nodeColor={node => {
                    if (highlightNodes.has(node) || clickedNodes.has(node)) {
                        return highlightColor;
                    }
                    return node.type === 'film' ? filmColor : defaultColor;
                }}
            />
        </div>
    );
};

export default ForceGraph;
