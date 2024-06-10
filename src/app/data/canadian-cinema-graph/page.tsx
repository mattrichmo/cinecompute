// @/app/[pages]/data/canadian-cinema-graph/page.tsx



// Import React for JSX
import React from 'react';
// Import server components with .server.js extensions
import ForceGraph from "@/app/components/ForceGraph/components/ForceGraphWrapper"

// Convert to default server component export
export default async function ProducerGraph() {
  // Fetch data asynchronously from the API route
  return (
    <div style={{ backgroundColor: 'rgba(0, 0, 17, 0.5)' }} className="relative min-h-screen text-white">
      <div className="absolute top-0 left-0 w-full h-full z-10">
        <ForceGraph/>
      </div>
    </div>
  );
}