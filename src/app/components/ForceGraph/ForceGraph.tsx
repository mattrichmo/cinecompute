


"use client";

import React, { useEffect, useState } from 'react';
import { ForceGraph3D } from 'react-force-graph';
import data from "../../../../public/data/datasets/producers.json"

const ForceGraphComponent = () => {
  
  return (
    <div style={{ height: '100vh', width: '100vw' }}>
      <ForceGraph3D
        graphData={data}
        nodeAutoColorBy="type"
        linkDirectionalParticles={1}
      />
    </div>
  );
};

export default ForceGraphComponent;