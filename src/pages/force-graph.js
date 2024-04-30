import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { parse as csvParse } from 'csv-parse/sync';

const ForceGraph = ({ data }) => {
  const svgRef = useRef();

  useEffect(() => {
    // Parse the CSV data
    const parsedData = csvParse(data);

    // Extract nodes and links from the parsed data
    const nodes = [...new Set(parsedData.flat())].map((keyword) => ({ id: keyword }));
    const links = parsedData.map(([source, target]) => ({ source, target }));

    // Set up the SVG dimensions
    const width = 800;
    const height = 600;

    // Create the SVG container
    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height);

    // Create the force simulation
    const simulation = d3.forceSimulation(nodes)
      .force('link', d3.forceLink(links).id((d) => d.id))
      .force('charge', d3.forceManyBody())
      .force('center', d3.forceCenter(width / 2, height / 2));

    // Create the links
    const link = svg.append('g')
      .attr('class', 'links')
      .selectAll('line')
      .data(links)
      .enter()
      .append('line')
      .attr('stroke', '#999')
      .attr('stroke-opacity', 0.6);

    // Create the nodes
    const node = svg.append('g')
      .attr('class', 'nodes')
      .selectAll('circle')
      .data(nodes)
      .enter()
      .append('circle')
      .attr('r', 5)
      .attr('fill', '#fff')
      .attr('stroke', '#000')
      .attr('stroke-width', 1.5);

    // Add node labels
    const label = svg.append('g')
      .attr('class', 'labels')
      .selectAll('text')
      .data(nodes)
      .enter()
      .append('text')
      .text((d) => d.id)
      .attr('font-size', 12)
      .attr('dx', 8)
      .attr('dy', 4);

    // Update the positions of nodes and links on each simulation tick
    simulation.on('tick', () => {
      link
        .attr('x1', (d) => d.source.x)
        .attr('y1', (d) => d.source.y)
        .attr('x2', (d) => d.target.x)
        .attr('y2', (d) => d.target.y);

      node
        .attr('cx', (d) => d.x)
        .attr('cy', (d) => d.y);

      label
        .attr('x', (d) => d.x)
        .attr('y', (d) => d.y);
    });
  }, [data]);

  return <svg ref={svgRef} />;
};

export default ForceGraph;