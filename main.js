// Charts for the innovation story. The numbers themselves live in data.js.
// Every chart below is just: pick a size, build a scale, draw some shapes, add labels.

// ---------- Chart 1: how innovation changed over four survey periods ----------
function drawTrendChart() {
  const width = 680;
  const height = 320;
  const margin = { top: 20, right: 160, bottom: 30, left: 45 };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  const svg = d3.select("#chart-trend")
    .append("svg")
    .attr("viewBox", `0 0 ${width} ${height}`);

  const g = svg.append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  // x: one point per survey period. y: percentage of companies.
  const x = d3.scalePoint()
    .domain(trend.periods)
    .range([0, innerWidth])
    .padding(0.5);

  const y = d3.scaleLinear()
    .domain([0, 50])
    .range([innerHeight, 0]);

  g.append("g")
    .attr("class", "axis")
    .attr("transform", `translate(0,${innerHeight})`)
    .call(d3.axisBottom(x));

  g.append("g")
    .attr("class", "axis")
    .call(d3.axisLeft(y).ticks(5).tickFormat(d => d + "%"));

  const lineColors = ["#2b6777", "#d17a4a", "#8a8f5c"];
  const line = d3.line()
    .x((d, i) => x(trend.periods[i]))
    .y(d => y(d));

  // one line + dots + label per series (any activity, product, process)
  for (let i = 0; i < trend.series.length; i++) {
    const series = trend.series[i];
    const color = lineColors[i];

    g.append("path")
      .datum(series.values)
      .attr("class", "line")
      .attr("stroke", color)
      .attr("d", line);

    g.selectAll(null)
      .data(series.values)
      .join("circle")
      .attr("class", "dot")
      .attr("fill", color)
      .attr("cx", (d, j) => x(trend.periods[j]))
      .attr("cy", d => y(d))
      .attr("r", 3.5);

    const lastValue = series.values[series.values.length - 1];
    g.append("text")
      .attr("class", "line-label")
      .attr("fill", color)
      .attr("x", innerWidth + 8)
      .attr("y", y(lastValue))
      .attr("dy", "0.35em")
      .text(series.name);
  }
}

// ---------- Reusable horizontal bar chart (all values 0 or higher) ----------
function drawBarChart(selector, data, unit, highlightLabel) {
  const width = 680;
  const margin = { top: 20, right: 60, bottom: 10, left: 220 };
  const rowHeight = 52;
  const height = data.length * rowHeight;
  const innerWidth = width - margin.left - margin.right;

  const svg = d3.select(selector)
    .append("svg")
    .attr("viewBox", `0 0 ${width} ${height + margin.top + margin.bottom}`);

  const g = svg.append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  const maxValue = d3.max(data, d => d.value);
  const x = d3.scaleLinear()
    .domain([0, maxValue])
    .nice()
    .range([0, innerWidth]);

  const y = d3.scaleBand()
    .domain(data.map(d => d.label))
    .range([0, height])
    .padding(0.3);

  g.append("g")
    .attr("class", "axis")
    .call(d3.axisTop(x).ticks(5).tickFormat(d => d + unit));

  g.append("g")
    .attr("class", "axis")
    .call(d3.axisLeft(y).tickSize(0))
    .call(axis => axis.select(".domain").remove());

  g.selectAll("rect")
    .data(data)
    .join("rect")
    .attr("class", d => (d.label === highlightLabel ? "bar highlight" : "bar"))
    .attr("y", d => y(d.label))
    .attr("height", y.bandwidth())
    .attr("x", 0)
    .attr("width", d => x(d.value));

  g.selectAll(".bar-label")
    .data(data)
    .join("text")
    .attr("class", "bar-label")
    .attr("y", d => y(d.label) + y.bandwidth() / 2)
    .attr("dy", "0.35em")
    .attr("x", d => x(d.value) + 6)
    .text(d => d.value + unit);
}

// ---------- One-off chart: change vs. the previous survey (can be negative) ----------
function drawChangeChart() {
  const width = 680;
  const margin = { top: 20, right: 60, bottom: 10, left: 220 };
  const rowHeight = 52;
  const height = sectorChange.length * rowHeight;
  const innerWidth = width - margin.left - margin.right;

  const svg = d3.select("#chart-change")
    .append("svg")
    .attr("viewBox", `0 0 ${width} ${height + margin.top + margin.bottom}`);

  const g = svg.append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  // the biggest drop is -8.3 and the biggest rise is +2.3,
  // so -10 to +4 gives every bar and its label room to breathe
  const x = d3.scaleLinear()
    .domain([-10, 4])
    .range([0, innerWidth]);

  const zeroX = x(0);

  const y = d3.scaleBand()
    .domain(sectorChange.map(d => d.label))
    .range([0, height])
    .padding(0.3);

  g.append("g")
    .attr("class", "axis")
    .call(d3.axisTop(x).ticks(7).tickFormat(d => d + " p.p."));

  g.append("g")
    .attr("class", "axis")
    .call(d3.axisLeft(y).tickSize(0))
    .call(axis => axis.select(".domain").remove());

  g.selectAll("rect")
    .data(sectorChange)
    .join("rect")
    .attr("class", d => (d.value < 0 ? "bar negative" : "bar"))
    .attr("y", d => y(d.label))
    .attr("height", y.bandwidth())
    .attr("x", d => (d.value < 0 ? x(d.value) : zeroX))
    .attr("width", d => Math.abs(x(d.value) - zeroX));

  // negative bars are long enough to hold their own label, so put the
  // label inside the bar (in white) instead of squeezing it in next to
  // the row name on the left
  g.selectAll(".bar-label")
    .data(sectorChange)
    .join("text")
    .attr("class", d => (d.value < 0 ? "bar-label bar-label-inside" : "bar-label"))
    .attr("y", d => y(d.label) + y.bandwidth() / 2)
    .attr("dy", "0.35em")
    .attr("x", d => (d.value < 0 ? x(d.value) + 8 : x(d.value) + 6))
    .attr("text-anchor", "start")
    .text(d => (d.value > 0 ? "+" : "") + d.value + " p.p.");
}

drawTrendChart();
drawBarChart("#chart-segments", whoInnovates, "%", "Large companies (250+ staff)");
drawChangeChart();
drawBarChart("#chart-spending", spendingByRegion, " M€", "Greater Lisbon");
drawBarChart("#chart-ip", ipInstruments, "%", "Trademark registration");
