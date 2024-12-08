const dataURL = "https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/movie-data.json";

const width = 960;
const height = 600;

const colorScale = d3.scaleOrdinal(d3.schemeCategory10);

const tooltip = d3.select("#tooltip");

const svg = d3.select("#treemap")
  .attr("width", width)
  .attr("height", height);

const legend = d3.select("#legend");

d3.json(dataURL).then(data => {
  const root = d3.hierarchy(data)
    .sum(d => d.value)
    .sort((a, b) => b.value - a.value);

  d3.treemap()
    .size([width, height])
    .paddingInner(1)(root);

  // Draw tiles
  const tiles = svg.selectAll("g")
    .data(root.leaves())
    .enter()
    .append("g")
    .attr("transform", d => `translate(${d.x0}, ${d.y0})`);

  tiles.append("rect")
    .attr("class", "tile")
    .attr("width", d => d.x1 - d.x0)
    .attr("height", d => d.y1 - d.y0)
    .attr("fill", d => colorScale(d.data.category))
    .attr("data-name", d => d.data.name)
    .attr("data-category", d => d.data.category)
    .attr("data-value", d => d.data.value)
    .on("mouseover", (event, d) => {
      tooltip
        .style("visibility", "visible")
        .style("left", `${event.pageX + 10}px`)
        .style("top", `${event.pageY - 30}px`)
        .attr("data-value", d.data.value)
        .html(`
          <strong>${d.data.name}</strong><br>
          Category: ${d.data.category}<br>
          Value: $${d.data.value.toLocaleString()}
        `);
    })
    .on("mouseout", () => tooltip.style("visibility", "hidden"));

  // Add text
  tiles.append("text")
    .attr("class", "tile-text")
    .selectAll("tspan")
    .data(d => d.data.name.split(" "))
    .enter()
    .append("tspan")
    .attr("x", 5)
    .attr("y", (d, i) => 15 + i * 10)
    .text(d => d);

  // Create legend
  const categories = root.leaves().map(d => d.data.category).filter((v, i, a) => a.indexOf(v) === i);

  const legendWidth = 20;
  const legendHeight = 20;
  const legendSpacing = 10;

  const legendSVG = legend.append("svg")
    .attr("width", width)
    .attr("height", categories.length * (legendHeight + legendSpacing));

  const legendItems = legendSVG.selectAll(".legend-item")
    .data(categories)
    .enter()
    .append("g")
    .attr("transform", (d, i) => `translate(0, ${i * (legendHeight + legendSpacing)})`);

  legendItems.append("rect")
    .attr("class", "legend-item")
    .attr("width", legendWidth)
    .attr("height", legendHeight)
    .attr("fill", d => colorScale(d));

  legendItems.append("text")
    .attr("x", legendWidth + 5)
    .attr("y", legendHeight / 2 + 4)
    .text(d => d)
    .style("font-size", "0.9rem")
    .style("alignment-baseline", "middle");
});
