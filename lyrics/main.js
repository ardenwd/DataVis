var colors = d3.scaleOrdinal(["#1e6cc0", "#5a6cc4", "#806bc3", "#a069bf", "#bb68b8", "#d268af", "#e56aa3", "#f46f96",
                "#ff7a85", "#ff8a73", "#ff9d63", "#ffb356", "#fdc950", "#ebdf56", "#d2f468"]);

var sideInfo = d3.select("#vis")
    .append("div")
    .attr("class","info")
    .html("<p class=\"info-text\">Each bubble is a word. Hover over one to see how many times its said!</p>");

// var width = +svg.attr('width');
var width = window.innerWidth-250, height = window.innerHeight-50, sizeDivisor = 100, nodePadding = 1.5;

var nodes = [{},{},{}];
var svg = d3.select("#vis")
    .append("svg")
    .attr("id","svg")
    // .attr("width", width)
     .attr("height", height);
     width = document.getElementById("svg").clientWidth;

var padding = {t: 40, r: 40, b: 40, l: 40};

var vis = svg.append('g')
    .attr('transform', 'translate('+[padding.l,padding.t]+')');
// create a tooltip

     
   
// Three function that changes the tooltip when user hovers / moves / leaves a cell
var mouseover = function(d) {
  d=d.target.__data__;
    sideInfo
      .html("<p class=\"info-text\" > in <span style=\"color:"+ colors(d.Song) +"; font-style: italic; font-weight: 700\">" + d.Song + ",</span></p><p class=\"info-text\" style=\"position: absolute; top: 200px; font-size: 35px\">Charli says <span style=\"font-style: italic; color:"+ colors(d.Song) +";\">" + d.Word + "</span></p><p class=\"info-text\" style = \"position: absolute; top: 275px\"><span style=\"color:" + colors(d.Song) + " \">" + d.Count + "</span> times</p>")
      .transition().duration(200);
    //  .text(d.Count);
    d3.select(this)
      .style("opacity", 1)
      .style("stroke", "1px solid white");
}

var mousemove = function(event, d) {
    var[x,y] = d3.pointer(event);
}
  
var mouseleave = function(d) {
  d3.select(this)
      .style("opacity", 1)
      .style("border", "none");
      
}

var simulation = d3.forceSimulation(nodes)
        .force("forceX", d3.forceX().strength(.1).x(width * .5))
        .force("forceY", d3.forceY().strength(.1).y(height * .5))
        .force("center", d3.forceCenter().x(width * .5).y(height * .5))
        .force("charge", d3.forceManyBody().strength(-3.5));

d3.csv('charli.csv', dataPreprocessor).then(function(dataset) {
   circleVis(dataset);
});

// Recall that when data is loaded into memory, numbers are loaded as Strings
// This function converts numbers into Strings during data preprocessing
function dataPreprocessor(row) {
    return {
        Count: +row.Count,
        Word: row.Word,
        Song: row.Song,
        radius: (((+row.Count)**0.7+2)*0.8)
    };
}

function circleVis(dataset){

    graph = dataset;
    simulation.nodes(graph)
        .force("collide", d3.forceCollide().strength(1).radius(function(d){ return d.radius + nodePadding; }).iterations(1))
         .on("tick", function(d){
            node
                .attr("cx", function(d){ return d.x - 30; })
                .attr("cy", function(d){ return d.y - 35; })
          });

    var node = vis.append("g")
          .attr("class", "node")
        .selectAll("circle")
        .data(graph)
        .enter().append("circle")
          .attr("r", function(d) { return d.radius; })
          .attr("fill", function(d) { return colors(d.Song); })
          .attr("cx", function(d){ return d.x; })
          .attr("cy", function(d){ return d.y; })
          .attr("z-index",1)
          .on("mouseover", mouseover)
          .on("mousemove", mousemove)
          .on("mouseleave", mouseleave);

}

//if there isn't that word there, then skip space
