// Charts for the innovation survey story. All data comes from data.js.

const margin = { top: 20, right: 60, bottom: 30, left: 220 };
const chartWidth = 680;

// Simple horizontal bar chart. Works for plain values (0 -> value)
// and for diverging values (negative bars go left of a zero line).
function barChart(selector, data, { unit = "%", highlight = null, diverging = false } = {}) {
  const height = data.length * 50;
  const innerWidth = chartWidth - margin.left - margin.right;

  const svg = d3.select(selector)
    .append("svg")
    .attr("viewBox", `0 0 ${chartWidth} ${height + margin.top + margin.bottom}`);

  const g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);

  const y = d3.scaleBand()
    .domain(data.map(d => d.label))
    .range([0, height])
    .padding(0.35);

  const extent = d3.extent(data, d => d.value);
  // Diverging charts get extra domain padding so bar tips (and their
  // labels) don't collide with the row labels sitting right at x = 0.
  const pad = diverging ? 1.3 : 1;
  const domainMin = diverging ? Math.min(0, extent[0]) * pad : 0;
  const domainMax = Math.max(extent[1], 0) * pad;
  const x = d3.scaleLinear()
    .domain([domainMin, domainMax])
    .nice()
    .range([0, innerWidth]);

  const zeroX = x(0);

  g.append("g")
    .attr("class", "axis")
    .call(d3.axisTop(x).ticks(5).tickFormat(d => d + unit));

  g.append("g")
    .attr("class", "axis")
    .call(d3.axisLeft(y).tickSize(0))
    .call(g => g.select(".domain").remove());

  g.selectAll(".bar")
    .data(data)
    .join("rect")
    .attr("class", d => {
      if (diverging && d.value < 0) return "bar negative";
      if (d.label === highlight) return "bar highlight";
      return "bar";
    })
    .attr("y", d => y(d.label))
    .attr("height", y.bandwidth())
    .attr("x", d => x(Math.min(0, d.value)))
    .attr("width", d => Math.abs(x(d.value) - zeroX));

  g.selectAll(".bar-label")
    .data(data)
    .join("text")
    .attr("class", "bar-label")
    .attr("y", d => y(d.label) + y.bandwidth() / 2)
    .attr("dy", "0.35em")
    .attr("x", d => x(d.value) + (d.value < 0 ? -6 : 6))
    .attr("text-anchor", d => (d.value < 0 ? "end" : "start"))
    .text(d => (d.value > 0 && diverging ? "+" : "") + d.value + unit);
}

function trendChart(selector) {
  const trendMargin = { top: 20, right: 155, bottom: 30, left: 45 };
  const height = 320;
  const innerWidth = chartWidth - trendMargin.left - trendMargin.right;
  const innerHeight = height - trendMargin.top - trendMargin.bottom;

  const svg = d3.select(selector)
    .append("svg")
    .attr("viewBox", `0 0 ${chartWidth} ${height}`);

  const g = svg.append("g").attr("transform", `translate(${trendMargin.left},${trendMargin.top})`);

  const x = d3.scalePoint()
    .domain(trend.periods)
    .range([0, innerWidth])
    .padding(0.5);

  const allValues = trend.series.flatMap(s => s.values);
  const y = d3.scaleLinear()
    .domain([0, d3.max(allValues)]).nice()
    .range([innerHeight, 0]);

  const color = d3.scaleOrdinal()
    .domain(trend.series.map(s => s.name))
    .range(["#2b6777", "#d17a4a", "#8a8f5c"]);

  g.append("g")
    .attr("class", "axis")
    .attr("transform", `translate(0,${innerHeight})`)
    .call(d3.axisBottom(x));

  g.append("g")
    .attr("class", "axis")
    .call(d3.axisLeft(y).ticks(5).tickFormat(d => d + "%"));

  const line = d3.line()
    .x((d, i) => x(trend.periods[i]))
    .y(d => y(d));

  trend.series.forEach(s => {
    g.append("path")
      .datum(s.values)
      .attr("class", "line")
      .attr("stroke", color(s.name))
      .attr("d", line);

    g.selectAll(`.dot-${s.name.replace(/\s/g, "")}`)
      .data(s.values)
      .join("circle")
      .attr("class", "dot")
      .attr("fill", color(s.name))
      .attr("cx", (d, i) => x(trend.periods[i]))
      .attr("cy", d => y(d))
      .attr("r", 3.5);

    g.append("text")
      .attr("class", "line-label")
      .attr("fill", color(s.name))
      .attr("x", x(trend.periods[trend.periods.length - 1]) + 8)
      .attr("y", y(s.values[s.values.length - 1]))
      .attr("dy", "0.35em")
      .text(s.name);
  });
}

trendChart("#chart-trend");
barChart("#chart-segments", whoInnovates, { highlight: "Large companies (250+ staff)" });
barChart("#chart-change", sectorChange, { diverging: true, unit: " p.p." });
barChart("#chart-spending", spendingByRegion, { unit: " M€", highlight: "Greater Lisbon" });
barChart("#chart-ip", ipInstruments, { highlight: "Trademark registration" });
