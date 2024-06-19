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
    margin: { top: 70, right: 0, bottom: 100, left: 100 },
  });
  const colors = useMemo(() => [
    "#ffffff", "#ffffcc", "#ffeda0", "#fed976", "#feb24c", "#fd8d3c", "#fc4e2a", "#e31a1c", "#bd0026", "#800026", "#4a0d0d"
  ], []);

  const updateDimensions = () => {
    const isMobile = window.innerWidth < 768;
    const width = isMobile ? window.innerWidth - 40 : 1200;
    const height = isMobile ? window.innerHeight - 40 : 600;
    const margin = {
      top: 70,
      right: isMobile ? 20 : 0,
      bottom: 100,
      left: isMobile ? 50 : 100,
    };
    setDimensions({ width, height, margin });
  };

  useEffect(() => {
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  useEffect(() => {
    const { width, height, margin } = dimensions;
    const adjustedWidth = width - margin.left - margin.right;
    const adjustedHeight = height - margin.top - margin.bottom;

    const gridSize = window.innerWidth < 768 ? Math.floor(adjustedHeight / chartData.label.x.length) : Math.floor(adjustedWidth / 24);
    const buckets = 11;
    const legendElementWidth = adjustedWidth / buckets;
    const legendHeight = gridSize;
    const legendTopMargin = 100;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const g = svg
      .attr("width", adjustedWidth + margin.left + margin.right)
      .attr("height", adjustedHeight + margin.top + margin.bottom + legendHeight + legendTopMargin) // Add extra height for the legend
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const xScale = d3.scaleBand()
      .domain(chartData.label.y)
      .range([0, adjustedWidth])
      .padding(0.05);

    const yScale = d3.scaleBand()
      .domain(chartData.label.x)
      .range([adjustedHeight, 0])
      .padding(0.05);

    const maxCount = d3.max(chartData.data, d => d3.max(d.genres, g => g.count));
    const colorScale = d3.scaleQuantile()
      .domain([0, buckets - 1, maxCount])
      .range(colors);

    const tooltip = d3.select("body").append("div")
      .attr("class", "tooltip absolute hidden text-sm bg-white p-2 border border-gray-300 shadow-lg text-gray-800")
      .style("opacity", 0);

    // Append x-axis
    const xAxis = g.append("g")
      .attr("class", "x axis")
      .attr("transform", `translate(0,${adjustedHeight})`)
      .call(d3.axisBottom(xScale));

    if (window.innerWidth < 768) {
      xAxis.selectAll("text")
        .attr("transform", "rotate(-90)")
        .style("text-anchor", "end")
        .attr("dx", "-0.8em")
        .attr("dy", "-0.5em");
    }

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

    const legendGroup = legend.enter().append("g")
      .attr("class", "legend");

    legendGroup.append("rect")
      .attr("x", (d, i) => legendElementWidth * i)
      .attr("y", adjustedHeight + legendTopMargin)
      .attr("width", legendElementWidth)
      .attr("height", legendHeight)
      .style("fill", (d, i) => colors[i]);

    legendGroup.append("text")
      .attr("class", "mono text-xs md:text-sm")
      .attr("text-anchor", "middle")
      .attr("x", (d, i) => legendElementWidth * i + legendElementWidth / 2)
      .attr("y", adjustedHeight + legendTopMargin + legendHeight / 2 + 5) // Center vertically
      .text(d => `≥ ${Math.round(d)}`);

    legend.exit().remove();
  }, [colors, dimensions]);

  return (
    <div className="w-full h-full flex genre-heatmap">
      <svg ref={svgRef}></svg>
    </div>
  );
};

export default GenreHeatMap;
