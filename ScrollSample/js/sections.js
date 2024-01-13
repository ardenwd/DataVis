
/**
 * scrollVis - encapsulates
 * all the code for the visualization
 * using reusable charts pattern:
 * http://bost.ocks.org/mike/chart/
 */
var scrollVis = function (data) {
  // constants to define the size
  // and margins of the vis area.
  var width = 700;
  var height = 520;
  var margin = { top: 0, left: 20, bottom: 40, right: 10 };

  // Keep track of which visualization
  // we are on and which was the last
  // index activated. When user scrolls
  // quickly, we want to call all the
  // activate functions that they pass.Pr
  var lastIndex = -1;
  var activeIndex = 0;

  // main svg used for visualization
  var svg = null;

  // d3 selection that will be used
  // for displaying visualizations
  var g = null;

  // We will set the domain when the
  // data is processed.
  // @v4 using new scale names
  var xScale = d3.scaleBand()
    .paddingInner(0.08)
    .range([0,width- 100],0.1,0.1);

  var yScale = d3.scaleLinear()
    .range([height, 40], 0.2, 0.2);

  var yAxis = d3.axisLeft()
    .scale(yScale)
    .tickFormat(function (d) {return d;});

  // @v4 using new axis name
  var xAxis = d3.axisBottom()
    .scale(xScale);

  // Color is determined just by the index of the bars
  var barColors = d3.schemeBlues[7];


  // When scrolling to a new section
  // the activation function for that
  // section is called.
  var activateFunctions = [];
  // If a section has an update function
  // then it is called while scrolling
  // through the section with the current
  // progress through the section.
  var updateFunctions = [];

  /**
   * chart
   *
   * @param selection - the current d3 selection(s)
   *  to draw the visualization in. For this
   *  example, we will be drawing it in #vis
   */
  var chart = function (selection) {
    
    selection.each(function (data) {
      // create svg and give it a width and height
      svg = d3.select(this).selectAll('svg').data([data]);
      var svgE = svg.enter().append('svg');
      // @v4 use merge to combine enter and existing selection
      svg = svg.merge(svgE);

      svg.attr('width', width + margin.left + margin.right);
      svg.attr('height', height + margin.top + margin.bottom);

      svg.append('g');


      // this group element will be used to contain all
      // other elements.
      g = svg.select('g')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

       setupVis(data);

      setupSections();
    });
  };


  /**
   * setupVis - creates initial elements for all
   * sections of the visualization.
   *
   * @param data
   */
  var setupVis = function (data) {

    g.append('text')
      .attr('class', 'title opening-title')
      .attr('x', width / 2)
      .attr('y', height / 3)
      .text('First');
    
      g.selectAll('opening-title')
      .attr('opacity', 0);
      
    // yaxis
    g.append('g')
      .attr('class', 'y axis')
      //.attr('transform', 'translate(0,' + width + ')')
      .call(yAxis);
    g.select('.y.axis').style('opacity', 0)
      .attr('transform','translate(40,0)');

     // xaxis
    g.append('g')
      .style('font-size', '7px')
      .attr('class', 'x axis')
      //.attr('transform', 'translate(0,' + width + ')')
      .call(xAxis);
    g.select('.x.axis').style('opacity', 0)
      .attr('transform','translate(50, '+ (height ) + ' )'); 

  };

  function updateBarData(data){
    var toRemove = svg.selectAll('.bar');
  
    toRemove.remove();

    var bars = g.selectAll('.bar').data(data);
    var barsE = bars.enter()
      .append('rect')
      .attr('class', 'bar');
    bars = bars.merge(barsE)
      .attr('x', function(d) {return xScale(d[0]) + 50;})
      .attr('y', height)
      .attr('fill', function (d, i) { return barColors[i]; })
      .attr('width', xScale.bandwidth())
  }
  

  /**
   * setupSections - each section is activated
   * by a separate function. Here we associate
   * these functions to the sections based on
   * the section's index.
   *
   */
  var setupSections = function () {
    // activateFunctions are called each
    // time the active section changes
    activateFunctions[0] = titleText;
    activateFunctions[1] = section1;
    activateFunctions[2] = section2;
    activateFunctions[3] = section3;
    activateFunctions[4] = section4;
    activateFunctions[5] = section5;
    activateFunctions[6] = section6;
    activateFunctions[7] = section7;
    activateFunctions[8] = section8;

    // updateFunctions are called while
    // in a particular section to update
    // the scroll progress in that section.
    // Most sections do not need to be updated
    // for all scrolling and so are set to
    // no-op functions.
     for (var i = 0; i < 9; i++) {
      updateFunctions[i] = function () {};
    }
  };

  /**
   * ACTIVATE FUNCTIONS
   *
   * These will be called their
   * section is scrolled to.
   *
   * General pattern is to ensure
   * all content for the current section
   * is transitioned in, while hiding
   * the content for the previous section
   * as well as the next section (as the
   * user may be scrolling up or down).
   *
   */

  /** shows plane emoji
   hides dot graph
  */
function titleText(){

  g.selectAll('.square')
      .transition()
      .duration(0)
      .attr('opacity', 0)
      .attr('fill', '#7d7d7d');

    g.selectAll('.opening-title')
      .transition()
      .duration(600)
      .attr('opacity', 1.0);

}

/** shows: dot graph
   hides: plane emoji
          red dots
  */
function section1(){
   g.selectAll('.opening-title')
      .transition()
      .duration(0)
      .attr('opacity', 0);

}

/** shows: red dots + gray
   hides: dot graph
          orange dots
  */
function section2(){
    

    g.selectAll('.square')
      .transition()
      .duration(0)
      .attr('opacity', 1.0)
      .attr('fill', '#7d7d7d');

    g.selectAll('.red-square')
      .transition()
      .duration(800)
      .attr('opacity', 1.0)
      .attr('fill', function (d) { return 'red';
      });
}

/** shows: gray, red and orange dots
    hides: n/a
  */
function section3 (){
    // orange and red dots
    
  g.selectAll('.square')
        .transition()
        .duration(500)
        .attr('opacity', 1.0)
        .attr('fill', '#7d7d7d');

  g.selectAll('.red-square')
      .transition()
      .duration(500)
      .attr('opacity', 1.0)
      .attr('fill', function (d) { return 'red';
        
      });

    g.selectAll('.orange-square')
      .transition()
      .duration(500)
      .attr('opacity', 1.0)
      .attr('fill', function (d) { return 'orange';
        
        // d.fatal ? '#008080' : '#7d7d7d'; 
      });
}

/** shows: n/a
    hides: gray, red and orange dots
           bar by country
  */
function section4(){
    // no graphics
     g.selectAll('.square')
      .transition()
      .duration(800)
      .attr('opacity', 0)
      .attr('fill', '#7d7d7d');

      hideAxis();

      g.selectAll('.bar')
      .transition()
      .delay(function (d, i) { return 30 * (i + 1);})
      .duration(600)
      .attr('opacity',0);
}

/** shows: bar by country
    hides: bar by carrier
  */
function section5(){
      g.selectAll('.bar')
      .attr('opacity',1.0)
      .transition()
      .delay(1000);
    // bar chart, countries x num accidents
      hideAxis();
      yScale.domain([0,countryMax ]);
      //however many countries there are  
      xScale.domain(countryNames);
   
      showAxisY(yAxis);
      showAxisX(xAxis);
      updateBarData(countryCounts);
    
    g.selectAll('.bar')
      .attr('opacity',1.0)
      .transition()
      .delay(function (d, i) { return 30 * (i + 1);})
      .duration(600)
      .attr('height', function(d,i){return ((height - yScale(d[1]))); } )
      .attr('y', function (d, i) { 
        return yScale(d[1]);
      });

}

/** shows: bar by carrier
    hides: bar by country
           bar by manufacturer
  */
function section6(){
    // bar chart, carrier x num accidents

  
    hideAxis();
      yScale.domain([0,carrierMax ]);
      xScale.domain(carrierNames);
      showAxisY(yAxis);
      showAxisX(xAxis);

     updateBarData(carrierCounts);
         
    g.selectAll('.bar')
      .attr('opacity',1.0)
      .transition()
      .delay(function (d, i) { return 30 * (i + 1);})
      .duration(600)
      .attr('height', function(d,i){return ((height - yScale(d[1]))); } )
      .attr('y', function (d, i) { 
        return yScale(d[1]);
      });

      //get rid of the last bar
}

/** shows: bar by manufacturer
    hides: bar by carrier
           bar by flight phase
  */
function section7(){
    // bar chart, Manufactuer x num accidents
      hideAxis();
      yScale.domain([0,makeMax ]);//however many countries there are
      xScale.domain(makeNames);
      showAxisY(yAxis);
      showAxisX(xAxis);
      updateBarData(makeCounts);
    
    g.selectAll('.bar')
      .attr('opacity',1.0)
      .transition()
      .delay(function (d, i) { return 30 * (i + 1);})
      .duration(600)
      .attr('height', function(d,i){return ((height - yScale(d[1]))); } )
      .attr('y', function (d, i) { 
        return yScale(d[1]);
      });
}

/** shows: bar by flight phase
    hides: bar by manufacturer
  */
function section8(){
    // bar chart, fight phase x num accidents
    hideAxis();
      yScale.domain([0,phaseMax ]);//however many countries there are
      xScale.domain(phaseNames);
      showAxisY(yAxis);
      showAxisX(xAxis);
      updateBarData(phaseCounts);
    
    g.selectAll('.bar')
      .attr('opacity',1.0)
      .transition()
      .delay(function (d, i) { return 30 * (i + 1);})
      .duration(600)
      .attr('height', function(d,i){return ((height - yScale(d[1]))); } )
      .attr('y', function (d, i) { 
        return yScale(d[1]);
      });
}

  /**
   * showAxis - helper function to
   * display particular xAxis
   *
   * @param axis - the axis to show
   *  (xAxisHist or xAxisBar)
   */
  function showAxisY(axis) {
    g.select('.y.axis')
      .call(axis)
      .transition().duration(500)
      .style('opacity', 1);
  }
  
  function showAxisX(axis) {
    g.select('.x.axis')
      .call(axis)
      .transition().duration(500)
      .style('opacity', 1);
  }

  /**
   * hideAxis - helper function
   * to hide the axis
   *
   */
  function hideAxis() {
     g.select('.x.axis')
      .transition().duration(500)
      .style('opacity', 0);

    g.select('.y.axis')
      .transition().duration(500)
      .style('opacity', 0);
  }

  /**
   * activate -
   *
   * @param index - index of the activated section
   */
  chart.activate = function (index) {
    activeIndex = index;
    var sign = (activeIndex - lastIndex) < 0 ? -1 : 1;
    var scrolledSections = d3.range(lastIndex + sign, activeIndex + sign, sign);
    scrolledSections.forEach(function (i) {
      activateFunctions[i]();
    });
    lastIndex = activeIndex;
  };

  /**
   * update
   *
   * @param index
   * @param progress
   */
  chart.update = function (index, progress) {
    updateFunctions[index](progress);
  };

  // return chart function
  return chart;
};


/**
 * display - called once data
 * has been loaded.
 * sets up the scroller and
 * displays the visualization.
 *
 * @param data - loaded tsv data
 */
function display(dataset) {
  // create a new plot and
  // display it
  var plot = scrollVis(dataset);
  d3.select('#vis')
    .datum(dataset)
    .call(plot);

  // setup scroll functionality
  var scroll = scroller()
    .container(d3.select('#graphic'));

  // pass in .step selection as the steps
  scroll(d3.selectAll('.step'));

  // setup event handling
  scroll.on('active', function (index) {
    // highlight current step text
    d3.selectAll('.step')
      .style('opacity', function (d, i) { return i === index ? 1 : 0.1; });

    // activate current section
    plot.activate(index);
  });

  scroll.on('progress', function (index, progress) {
    plot.update(index, progress);
  });
}

// // load data and display
d3.csv('data/data.csv').then(function(dataset){
  display(dataset);
});


