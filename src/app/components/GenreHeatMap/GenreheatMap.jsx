"use client";

import React, { useRef, useEffect, useMemo, useState } from 'react';
import * as d3 from 'd3';
import chartData from "../../../../public/data/datasets/genreHeatMap.json";

import './GenreHeatMap.css';

const GenreHeatMap = () => {
  const svgRef = useRef();
  const [dimensions, setDimensions] = useState({
    width: 1200,
    height: 600,
  });
  const colors = useMemo(() => [
    "#ffffff", "#ffffcc", "#ffeda0", "#fed976", "#feb24c", "#fd8d3c", "#fc4e2a", "#e31a1c", "#bd0026", "#800026", "#4a0d0d"
  ], []);

  const margin = { top: 70, right: 0, bottom: 100, left: 100 };

  const updateDimensions = () => {
    const width = window.innerWidth < 768 ? window.innerWidth - 40 : 1200;
    const height = window.innerWidth < 768 ? window.innerHeight - 40 : 600;
    setDimensions({ width, height });
  };

  useEffect(() => {
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  useEffect(() => {
    const width = dimensions.width - margin.left - margin.right;
    const height = dimensions.height - margin.top - margin.bottom;

    const gridSize = window.innerWidth < 768 ? Math.floor(height / chartData.label.x.length) : Math.floor(width / 24);
    const legendElementWidth = gridSize * 2;
    const buckets = 11;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();  // Clear existing content

    const g = svg
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const xScale = d3.scaleBand()
      .domain(chartData.label.y)  // Years on x-axis
      .range([0, width])
      .padding(0.05);

    const yScale = d3.scaleBand()
      .domain(chartData.label.x)  // Genres on y-axis
      .range([height, 0])
      .padding(0.05);

    const maxCount = d3.max(chartData.data, d => d3.max(d.genres, g => g.count));
    const colorScale = d3.scaleQuantile()
      .domain([0, buckets - 1, maxCount])
      .range(colors);

    const tooltip = d3.select("body").append("div")
      .attr("class", "tooltip absolute hidden text-sm bg-white p-2 border border-gray-300 shadow-lg text-gray-800")
      .style("opacity", 0);

    // Append x-axis
    g.append("g")
      .attr("class", "x axis")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(xScale));

    // Append y-axis
    g.append("g")
      .attr("class", "y axis")
      .call(d3.axisLeft(yScale));

    // Append heatmap cells
    chartData.data.forEach((yearData) => {
      yearData.genres.forEach((genreData) => {
        g.append("rect")
          .attr("x", xScale(yearData.year))
          .attr("y", yScale(genreData.genre))
          .attr("width", xScale.bandwidth())
          .attr("height", yScale.bandwidth())
          .style("fill", colorScale(genreData.count))
          .style("stroke-width", 0)
          .on("mouseover", function(event) {
            d3.select(this).style("stroke", "black").style("stroke-width", 2);
            tooltip
              .html(`<strong>${genreData.genre}</strong> (${yearData.year}): <strong>${genreData.count}</strong> items`)
              .style("left", `${event.pageX + 10}px`)
              .style("top", `${event.pageY + 10}px`)
              .classed("hidden", false)
              .transition()
              .duration(200)
              .style("opacity", 1);
          })
          .on("mouseout", function() {
            d3.select(this).style("stroke", "none");
            tooltip
              .transition()
              .duration(500)
              .style("opacity", 0)
              .on("end", () => tooltip.classed("hidden", true));
          });
      });
    });

    // Append legend
    const legend = g.selectAll(".legend")
      .data([0].concat(colorScale.quantiles()), d => d);

    legend.enter().append("g")
      .attr("class", "legend")
      .append("rect")
      .attr("x", (d, i) => legendElementWidth * i)
      .attr("y", height + gridSize)
      .attr("width", legendElementWidth)
      .attr("height", gridSize / 2)
      .style("fill", (d, i) => colors[i]);

    legend.enter().append("text")
      .attr("class", "mono")
      .text(d => `≥ ${Math.round(d)}`)
      .attr("x", (d, i) => legendElementWidth * i)
      .attr("y", height + gridSize + 15);

    legend.exit().remove();
  }, [colors, dimensions, margin.bottom, margin.left, margin.right, margin.top]);

  return (
    <div className="w-full h-full flex genre-heatmap">
      <svg ref={svgRef}></svg>
    </div>
  );
};

export default GenreHeatMap;
