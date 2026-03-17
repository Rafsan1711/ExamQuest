import { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface ChapterHeatmapProps {
  data: Array<{
    subjectName: string;
    subjectColor: string;
    chapterName: string;
    completedCount: 0 | 1 | 2 | 3;
  }>;
}

export const ChapterHeatmap = ({ data }: ChapterHeatmapProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || data.length === 0) return;

    const container = containerRef.current;
    const width = container.clientWidth || 800;
    const cellSize = 24;
    const cellGap = 4;
    
    // Group by subject
    const groupedData = d3.group(data, d => d.subjectName);
    
    // Calculate height based on rows
    let currentY = 0;
    const rowHeight = cellSize + cellGap;
    const subjectMargins = 40;
    
    const layout: any[] = [];
    
    groupedData.forEach((chapters, subjectName) => {
      layout.push({ type: 'header', subjectName, y: currentY, color: chapters[0].subjectColor });
      currentY += 25; // Header height
      
      const cols = Math.floor((width - 40) / (cellSize + cellGap));
      
      chapters.forEach((chapter, i) => {
        const row = Math.floor(i / cols);
        const col = i % cols;
        layout.push({
          type: 'cell',
          ...chapter,
          x: col * (cellSize + cellGap),
          y: currentY + row * rowHeight
        });
      });
      
      const numRows = Math.ceil(chapters.length / cols);
      currentY += numRows * rowHeight + subjectMargins;
    });

    const height = currentY;

    d3.select(container).selectAll("*").remove();

    const tooltip = d3.select(container)
      .append("div")
      .style("position", "absolute")
      .style("visibility", "hidden")
      .style("background-color", "rgba(17, 24, 39, 0.9)")
      .style("color", "#fff")
      .style("padding", "8px 12px")
      .style("border-radius", "8px")
      .style("font-size", "12px")
      .style("border", "1px solid rgba(255,255,255,0.1)")
      .style("pointer-events", "none")
      .style("z-index", "10")
      .style("max-width", "200px");

    const svg = d3.select(container)
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(20, 20)`);

    // Draw headers
    svg.selectAll(".header")
      .data(layout.filter(d => d.type === 'header'))
      .enter()
      .append("text")
      .attr("class", "header")
      .attr("x", 0)
      .attr("y", d => d.y + 15)
      .style("fill", d => d.color)
      .style("font-size", "14px")
      .style("font-weight", "600")
      .style("font-family", "Inter, sans-serif")
      .text(d => d.subjectName);

    // Draw cells
    const cells = svg.selectAll(".cell")
      .data(layout.filter(d => d.type === 'cell'))
      .enter()
      .append("rect")
      .attr("class", "cell")
      .attr("x", d => d.x)
      .attr("y", d => d.y)
      .attr("width", cellSize)
      .attr("height", cellSize)
      .attr("rx", 4)
      .attr("fill", d => {
        if (d.completedCount === 0) return "rgba(255,255,255,0.05)";
        // Interpolate opacity based on completion
        const opacity = 0.3 + (d.completedCount / 3) * 0.7;
        const color = d3.color(d.subjectColor);
        if (color) {
          color.opacity = opacity;
          return color.toString();
        }
        return d.subjectColor;
      })
      .attr("stroke", "rgba(255,255,255,0.1)")
      .attr("stroke-width", 1)
      .style("cursor", "pointer")
      .on("mouseover", function(event, d) {
        d3.select(this).attr("stroke", "#fff").attr("stroke-width", 2);
        tooltip.style("visibility", "visible")
          .html(`
            <div class="font-bold mb-1" style="color: ${d.subjectColor}">${d.subjectName}</div>
            <div class="mb-1">${d.chapterName}</div>
            <div class="text-gray-300">${d.completedCount} / 3 Tasks Completed</div>
          `);
      })
      .on("mousemove", function(event) {
        tooltip.style("top", (event.pageY - 10) + "px")
          .style("left", (event.pageX + 10) + "px");
      })
      .on("mouseout", function() {
        d3.select(this).attr("stroke", "rgba(255,255,255,0.1)").attr("stroke-width", 1);
        tooltip.style("visibility", "hidden");
      });

    // Animate cells
    cells.attr("opacity", 0)
      .transition()
      .duration(500)
      .delay((d, i) => i * 10)
      .attr("opacity", 1);

  }, [data]);

  return (
    <div className="relative w-full">
      {/* Legend */}
      <div className="absolute top-0 right-4 flex items-center gap-2 text-xs text-gray-400">
        <span>0</span>
        <div className="flex gap-1">
          <div className="w-4 h-4 rounded-sm bg-white/5 border border-white/10" />
          <div className="w-4 h-4 rounded-sm bg-cyan-500/40 border border-white/10" />
          <div className="w-4 h-4 rounded-sm bg-cyan-500/70 border border-white/10" />
          <div className="w-4 h-4 rounded-sm bg-cyan-500 border border-white/10" />
        </div>
        <span>3 Tasks</span>
      </div>
      <div ref={containerRef} className="w-full" />
    </div>
  );
};
