// @/app/[pages]/data/canadian-cinema-graph/page.tsx



// Import React for JSX
import React from 'react';
// Import server components with .server.js extensions
import ForceGraph from "@/app/components/ForceGraph/ForceGraph";
import getProducerData from '@/app/components/utilities/getProducerData/getProducerData';

// Convert to default server component export
export default async function ProducerGraph() {
  // Fetch data asynchronously from the API route
  let data = await getProducerData();  
  return (
    <div style={{ backgroundColor: 'rgba(0, 0, 17, 0.5)' }} className="relative min-h-screen text-white">
      <div className="absolute top-0 left-0 w-full h-full z-10">
        <ForceGraph data={data}  />
      </div>

      <div className="absolute top-0 mt-20 z-20 w-1/4">
        <h1 className="text-6xl mt-20 ml-20 leading-tight">Canadian Cinema Data</h1>
        <p className="text-sm mt-10 ml-20">This graph shows relationships between Canadian productions and the producers involved. Mapping the relationships between each producer.</p>
        <p className="text-sm mt-2 ml-20">Sourced by scraping every movie made in Canada and then filtering it out for the last 5 years.</p>
        <div className="ml-20 mt-20">
        </div>
        <div className="ml-20 mt-20">
        </div>
      </div>
    </div>
  );
}