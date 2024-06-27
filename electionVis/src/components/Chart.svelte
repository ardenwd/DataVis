<script>
  import { onMount } from "svelte";
  import * as d3 from "d3";

  export let chartData;

  let chartDiv;

  const margin = { top: 20, right: 30, bottom: 40, left: 40 },
    width = 200 - margin.left - margin.right,
    height = 100 - margin.top - margin.bottom;

  onMount(async () => {
    console.log(chartData);

    const svg = d3
      .select(chartDiv)
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const x = d3
      .scaleBand()
      .range([0, width])
      .domain(chartData.map((d) => d.key))
      .padding(0.2);

    svg
      .append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x))
      .selectAll("text")
      .attr("transform", "translate(-10,0)rotate(-45)")
      .style("text-anchor", "end");

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(chartData, (d) => d.value)])
      .range([height, 0]);

    svg.append("g").call(d3.axisLeft(y));

    svg
      .selectAll("mybar")
      .data(chartData)
      .join("rect")
      .attr("class", "bar")
      .attr("x", (d) => x(d.key))
      .attr("y", (d) => y(d.value))
      .attr("width", x.bandwidth())
      .attr("height", (d) => height - y(d.value));
  });
</script>

<div bind:this={chartDiv}></div>

<style>
  .bar {
    fill: steelblue;
  }

  .bar:hover {
    fill: orange;
  }

  .axis-label {
    font-size: 12px;
  }
</style>
