<script>
  import AllCharts from "./components/AllCharts.svelte";

  import * as d3 from "d3";
</script>

<main>
  <h1>GA Election Results</h1>
  <p></p>
  <AllCharts />
  <p class="source">
    Source: <a
      href="https://results.enr.clarityelections.com/GA/121813/web.317647/#/summary"
      class="source"
    >
      Election Night Reporting via GEORGIA SECRETARY OF STATE
    </a>
  </p>
  <p class="source">Visualization by Arden Davis</p>
</main>

<style>
  h1 {
    font-weight: 600;
  }
  main {
    font-family: "Libre Franklin", "Franklin Gothic Medium", "Arial Narrow",
      Arial, sans-serif;
    text-align: center;
    padding: 1em;
    margin: 0 auto;
    max-width: 1200px;
    font-size: 18px;
  }

  foreignObject {
    x: 100px;
  }

  .source {
    text-decoration: none;
    color: black;
    font-size: 0.8rem;
  }
</style>
