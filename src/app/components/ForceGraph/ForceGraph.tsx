"use client";

import React, { useEffect, useState } from 'react';
import { ForceGraph3D } from 'react-force-graph';
import data from "../../../../public/data/datasets/producers.json";

const ForceGraphComponent = () => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(typeof window!== 'undefined');
  }, []);

  if (!isClient) {
    return null; // Return null or a loading indicator while on the server
  }

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
