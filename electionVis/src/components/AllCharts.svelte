<script>
  import Chart from "./Chart.svelte";
  import * as d3 from "d3";

  let data;

  // Function to process the CSV data
  async function loadData() {
    const rawData = await d3.csv("./data/summary.csv");
    const dataByRace = d3.rollup(
      rawData,
      (v) => d3.sum(v, (d) => d.value), // Change aggregation as needed
      (d) => d.contest
    );

    let chartContainer = document.getElementById("chartContainer");

    dataByRace.forEach(function (d) {
      console.log(chartContainer);
      //   how to append a Chart component with props passed in?
      chartContainer.append("g");
    });
  }

  // Load data when the component is mounted
  loadData();
</script>

<main>
  <h1>Chart Below</h1>
  <div id="chartContainer"></div>
  {#if data}
    <!-- <Chart chartData={data} /> -->
  {/if}
</main>
