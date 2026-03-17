import { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface SubjectBarChartProps {
  data: Array<{
    id: string;
    name: string;
    color: string;
    mcqPercent: number;
    abPercent: number;
    cdPercent: number;
    overallPercent: number;
    totalChapters: number;
  }>;
}

export const SubjectBarChart = ({ data }: SubjectBarChartProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || data.length === 0) return;

    const container = containerRef.current;
    const width = container.clientWidth || 800;
    const height = Math.max(300, data.length * 80 + 60);
    const margin = { top: 30, right: 30, bottom: 40, left: 120 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    d3.select(container).selectAll("*").remove();

    // Tooltip
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
      .style("z-index", "10");

    const svg = d3.select(container)
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const y0 = d3.scaleBand()
      .domain(data.map(d => d.name))
      .rangeRound([0, innerHeight])
      .paddingInner(0.2);

    const keys = ['mcqPercent', 'abPercent', 'cdPercent'];
    const colors = ['#22c55e', '#f59e0b', '#a855f7']; // green, amber, purple
    const labels = ['MCQ', 'A & B', 'C & D'];

    const y1 = d3.scaleBand()
      .domain(keys)
      .rangeRound([0, y0.bandwidth()])
      .padding(0.05);

    const x = d3.scaleLinear()
      .domain([0, 100])
      .range([0, innerWidth]);

    // X Axis
    svg.append("g")
      .attr("transform", `translate(0,${innerHeight})`)
      .call(d3.axisBottom(x).ticks(5).tickFormat(d => `${d}%`))
      .call(g => g.select(".domain").attr("stroke", "rgba(255,255,255,0.1)"))
      .call(g => g.selectAll(".tick line").attr("stroke", "rgba(255,255,255,0.1)"))
      .call(g => g.selectAll(".tick text").attr("fill", "rgba(255,255,255,0.5)"));

    // Y Axis
    svg.append("g")
      .call(d3.axisLeft(y0).tickSize(0))
      .call(g => g.select(".domain").remove())
      .call(g => g.selectAll(".tick text")
        .attr("fill", "#fff")
        .attr("font-size", "13px")
        .attr("font-weight", "500")
        .attr("dx", "-10px")
      );

    // Grid lines
    svg.append("g")
      .attr("class", "grid")
      .call(d3.axisBottom(x)
        .tickSize(innerHeight)
        .tickFormat(() => "")
      )
      .call(g => g.select(".domain").remove())
      .call(g => g.selectAll(".tick line")
        .attr("stroke", "rgba(255,255,255,0.05)")
        .attr("stroke-dasharray", "2,2")
      );

    const subjectGroups = svg.selectAll(".subject")
      .data(data)
      .enter().append("g")
      .attr("class", "subject")
      .attr("transform", d => `translate(0,${y0(d.name)})`);

    subjectGroups.selectAll("rect")
      .data(d => keys.map((key, i) => ({
        key,
        value: d[key as keyof typeof d] as number,
        color: colors[i],
        label: labels[i],
        subject: d.name
      })))
      .enter().append("rect")
      .attr("y", d => y1(d.key)!)
      .attr("x", 0)
      .attr("height", y1.bandwidth())
      .attr("fill", d => d.color)
      .attr("rx", 4)
      .attr("width", 0)
      .on("mouseover", function(event, d) {
        d3.select(this).attr("opacity", 0.8);
        tooltip.style("visibility", "visible")
          .html(`
            <div class="font-bold mb-1">${d.subject}</div>
            <div class="flex items-center gap-2">
              <div class="w-3 h-3 rounded-full" style="background:${d.color}"></div>
              <span>${d.label}: ${Math.round(d.value)}%</span>
            </div>
          `);
      })
      .on("mousemove", function(event) {
        tooltip.style("top", (event.pageY - 10) + "px")
          .style("left", (event.pageX + 10) + "px");
      })
      .on("mouseout", function() {
        d3.select(this).attr("opacity", 1);
        tooltip.style("visibility", "hidden");
      })
      .transition()
      .duration(1000)
      .delay((d, i) => i * 100)
      .attr("width", d => x(d.value));

  }, [data]);

  return (
    <div className="relative w-full overflow-x-auto custom-scrollbar">
      <div ref={containerRef} className="min-w-[600px]" />
    </div>
  );
};
