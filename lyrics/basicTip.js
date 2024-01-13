  var Tooltip = d3.select("body")
    .append("div")
    .style("opacity", 1)
    .attr("class", "tooltip")
    .style("background-color", "white")
    .style("stroke", "black")
    .style("stroke-width", "2px")
    .style("position", "absolute");

// Three function that changes the tooltip when user hovers / moves / leaves a cell
var mouseover = function(d) {
  d=d.target.__data__;
    Tooltip
      .html("<p class=\"tooltip-text\"> Song: " + d.Song + "</p><p class=\"tooltip-text\">Word: " + d.Word + "</p><p class=\"tooltip-text\">Count: " + d.Count)
      .style("opacity", 1)
      .style("background-color", colors(d.Song))
      .transition().duration(200)
      .style('opacity', 1);
    //  .text(d.Count);
    d3.select(this)
      .style("opacity", 1)
      .style("stroke", "1px solid white");
    
      
}

var mousemove = function(event, d) {
    var[x,y] = d3.pointer(event);
    if(x>width/2){ x+=40;}
      else{x-=20;}
    Tooltip
      .style('left', x + 'px')
      .style('top', y + 'px')
}
  
var mouseleave = function(d) {
    Tooltip
      .style("opacity", 0);
    d3.select(this)
      .style("opacity", 1)
      .style("border", "none");
      
}