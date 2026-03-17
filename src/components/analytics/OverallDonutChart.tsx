import { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface OverallDonutChartProps {
  percentage: number;
}

export const OverallDonutChart = ({ percentage }: OverallDonutChartProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const width = container.clientWidth || 240;
    const height = width;
    const margin = 20;
    const radius = Math.min(width, height) / 2 - margin;

    d3.select(container).selectAll("*").remove();

    const svg = d3.select(container)
      .append("svg")
      .attr("width", "100%")
      .attr("height", "100%")
      .attr("viewBox", `0 0 ${width} ${height}`)
      .append("g")
      .attr("transform", `translate(${width / 2},${height / 2})`);

    // Define gradient
    const defs = svg.append("defs");
    const gradient = defs.append("linearGradient")
      .attr("id", "donutGradient")
      .attr("x1", "0%")
      .attr("y1", "0%")
      .attr("x2", "100%")
      .attr("y2", "100%");

    gradient.append("stop")
      .attr("offset", "0%")
      .attr("stop-color", "#3b82f6"); // blue-500

    gradient.append("stop")
      .attr("offset", "100%")
      .attr("stop-color", "#06b6d4"); // cyan-500

    const arc = d3.arc<any>()
      .innerRadius(radius * 0.75)
      .outerRadius(radius)
      .cornerRadius(radius * 0.1);

    // Background arc
    svg.append("path")
      .datum({ startAngle: 0, endAngle: 2 * Math.PI })
      .style("fill", "rgba(255, 255, 255, 0.05)")
      .attr("d", arc);

    // Foreground arc
    const foreground = svg.append("path")
      .datum({ startAngle: 0, endAngle: 0 })
      .style("fill", "url(#donutGradient)")
      .attr("d", arc);

    foreground.transition()
      .duration(1500)
      .ease(d3.easeCubicOut)
      .attrTween("d", (d: any) => {
        const interpolate = d3.interpolate(d.endAngle, (percentage / 100) * 2 * Math.PI);
        return (t: number) => {
          d.endAngle = interpolate(t);
          return arc(d) as string;
        };
      });

    // Center text
    svg.append("text")
      .attr("text-anchor", "middle")
      .attr("dy", "-0.2em")
      .style("fill", "#fff")
      .style("font-size", "2.5rem")
      .style("font-weight", "bold")
      .style("font-family", "Syne, sans-serif")
      .text(`${Math.round(percentage)}%`);

    svg.append("text")
      .attr("text-anchor", "middle")
      .attr("dy", "1.5em")
      .style("fill", "rgba(191, 219, 254, 0.7)") // blue-200/70
      .style("font-size", "0.875rem")
      .style("font-weight", "500")
      .style("font-family", "Inter, sans-serif")
      .text("Complete");

    const resizeObserver = new ResizeObserver(() => {
      // Simple re-render on resize could be done by state, but SVG viewBox handles scaling well
    });
    resizeObserver.observe(container);

    return () => resizeObserver.disconnect();
  }, [percentage]);

  return <div ref={containerRef} className="w-full max-w-[240px] aspect-square mx-auto" />;
};
