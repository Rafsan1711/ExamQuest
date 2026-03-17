import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { motion } from 'framer-motion';

interface TaskTypePieChartProps {
  stats: {
    mcqDone: number;
    mcqTotal: number;
    abDone: number;
    abTotal: number;
    cdDone: number;
    cdTotal: number;
  };
}

export const TaskTypePieChart = ({ stats }: TaskTypePieChartProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const data = [
      { label: 'MCQ', value: stats.mcqDone, total: stats.mcqTotal, color: '#22c55e' }, // green-500
      { label: 'A & B', value: stats.abDone, total: stats.abTotal, color: '#f59e0b' }, // amber-500
      { label: 'C & D', value: stats.cdDone, total: stats.cdTotal, color: '#a855f7' }, // purple-500
    ].filter(d => d.value > 0); // Only show slices with data

    const container = containerRef.current;
    const width = container.clientWidth || 300;
    const height = 240;
    const margin = 20;
    const radius = Math.min(width, height) / 2 - margin;

    d3.select(container).selectAll("*").remove();

    if (data.length === 0) {
      d3.select(container)
        .append("div")
        .attr("class", "flex items-center justify-center h-full text-gray-500 text-sm italic")
        .text("No tasks completed yet");
      return;
    }

    const svg = d3.select(container)
      .append("svg")
      .attr("width", "100%")
      .attr("height", "100%")
      .attr("viewBox", `0 0 ${width} ${height}`)
      .append("g")
      .attr("transform", `translate(${width / 2},${height / 2})`);

    const pie = d3.pie<any>()
      .value(d => d.value)
      .sort(null);

    const arc = d3.arc<any>()
      .innerRadius(radius * 0.4)
      .outerRadius(radius);

    const outerArc = d3.arc<any>()
      .innerRadius(radius * 1.1)
      .outerRadius(radius * 1.1);

    const arcs = svg.selectAll("arc")
      .data(pie(data))
      .enter()
      .append("g")
      .attr("class", "arc");

    arcs.append("path")
      .attr("d", arc)
      .attr("fill", d => d.data.color)
      .attr("stroke", "#111827")
      .style("stroke-width", "2px")
      .style("opacity", 0.9)
      .transition()
      .duration(1000)
      .attrTween("d", function(d) {
        const i = d3.interpolate({ startAngle: d.startAngle + 0.1, endAngle: d.startAngle + 0.1 }, d);
        return function(t) {
          return arc(i(t)) as string;
        }
      });

    // Labels
    const text = svg.selectAll(".labelName")
      .data(pie(data))
      .enter()
      .append("text")
      .attr("dy", ".35em")
      .style("fill", "#fff")
      .style("font-size", "12px")
      .style("font-weight", "500")
      .style("font-family", "Inter, sans-serif")
      .text(d => `${d.data.label} (${d.data.value})`);

    function midAngle(d: any) {
      return d.startAngle + (d.endAngle - d.startAngle) / 2;
    }

    text.transition().duration(1000)
      .attrTween("transform", function(d) {
        (this as any)._current = (this as any)._current || d;
        const interpolate = d3.interpolate((this as any)._current, d);
        (this as any)._current = interpolate(0);
        return function(t) {
          const d2 = interpolate(t);
          const pos = outerArc.centroid(d2);
          pos[0] = radius * (midAngle(d2) < Math.PI ? 1.1 : -1.1);
          return `translate(${pos})`;
        };
      })
      .styleTween("text-anchor", function(d) {
        (this as any)._current = (this as any)._current || d;
        const interpolate = d3.interpolate((this as any)._current, d);
        (this as any)._current = interpolate(0);
        return function(t) {
          const d2 = interpolate(t);
          return midAngle(d2) < Math.PI ? "start" : "end";
        };
      });

    const polyline = svg.selectAll(".lines")
      .data(pie(data))
      .enter()
      .append("polyline")
      .style("fill", "none")
      .style("stroke", "rgba(255,255,255,0.2)")
      .style("stroke-width", "1px");

    polyline.transition().duration(1000)
      .attrTween("points", function(d) {
        (this as any)._current = (this as any)._current || d;
        const interpolate = d3.interpolate((this as any)._current, d);
        (this as any)._current = interpolate(0);
        return function(t) {
          const d2 = interpolate(t);
          const pos = outerArc.centroid(d2);
          pos[0] = radius * 1.05 * (midAngle(d2) < Math.PI ? 1 : -1);
          return [arc.centroid(d2), outerArc.centroid(d2), pos] as any;
        };
      });

  }, [stats]);

  return (
    <motion.div
      initial={{ rotate: -90, opacity: 0, scale: 0.8 }}
      animate={{ rotate: 0, opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="w-full h-[240px]"
      ref={containerRef}
    />
  );
};
