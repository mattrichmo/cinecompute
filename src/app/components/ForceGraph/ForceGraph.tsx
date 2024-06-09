"use client";
import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import data from "../../../../public/data/datasets/producers.json";

// Dynamically import the ForceGraph3D component, with SSR disabled
const ForceGraph3D = dynamic(() => import('react-force-graph').then(mod => mod.ForceGraph3D), {
  ssr: false, // Disable server-side rendering for this component
});

const ForceGraphComponent = () => {
  return (
    <div style={{ height: '100vh', width: '100vw' }}>
      <ForceGraph3D
        graphData={data}
        nodeAutoColorBy="type"
        linkDirectionalParticles={1}
        warmupTicks={50}
        cooldownTicks={0}
      />
    </div>
  );
};

export default ForceGraphComponent;