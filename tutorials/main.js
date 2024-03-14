

  // first, we select our svg object
  const svg = d3.select('#svg');
  
  // now, we append a rect (rectangle) element to the SVG
  const rects = svg.selectAll('rect');
  
  const data = [0,1,2,3,4,];
  // finally, we style and position the rect

  const dMin = 0, dMax = 10;
  const rMin = 0, rMax = 100;

  scale = d3.scaleLinear();
  scale
    .domain([ dMin, dMax])
    .range([ rMin, rMax]);

    colorScale = d3.scaleLinear()
        .domain([0,5])
        .range(['pink', 'blue']);

  rects
    .data (data)
    .join('rect')
    .style('fill', (d,i) => 
    {return colorScale(i)}) // rect's fill color
    .attr('height', 20) // rect's height (in pixels)
    .attr('width', 20) // rect's width (in pixels)
    .attr('x', (d,i) => {return 10 + (i * 30)}) // x position of the top-left corner
    .attr('y', 10); // y position of the top-left corner
  