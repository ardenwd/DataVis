  var extentByAttribute = {};
  var dataAttributes = ['Country', 'Carrier', 'Make', 'Broad_Phase_of_Flight'];

  var countryCounts;
  var countryMax;
  var countryNames = [];
  var carrierCounts;
  var carrierMax;
  var carrierNames = ['Delta', 'American', 'United', 'Southwest', 'Continental','US Airways', 'Northwest', 'FedEx','America West', 'Alaska' ];
  var makeCounts;
  var makeMax;
  var makeNames = [];
  var phaseCounts;
  var phaseMax;
  var phaseNames = [];

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
  var dotsWidth = 480;
  var height = 520;
  var margin = { top: 0, left: 20, bottom: 40, right: 10 };

  // Keep track of which visualization
  // we are on and which was the last
  // index activated. When user scrolls
  // quickly, we want to call all the
  // activate functions that they pass.Pr
  var lastIndex = -1;
  var activeIndex = 0;

  // Sizing for the grid visualization
  var squareSize = 6;
  var squarePad = 2;
  var numPerRow = dotsWidth / (squareSize + squarePad);
  // main svg used for visualization
  var svg = null;

  // d3 selection that will be used
  // for displaying visualizations
  var g = null;
  // We will set the domain when the
  // data is processed.
  // @v4 using new scale names
  // var xscale = d3.scaleLinear()
  //   .range([0, width]);

  var xScale = d3.scaleBand()
    .paddingInner(0.08)
    .range([0,width- 100],0.1,0.1);

  var yScale = d3.scaleLinear()
    .range([height, 40], 0.2, 0.2);

  // The bar chart display is horizontal
  // so we can use an ordinal scale
  // to get width and y locations.
  // @v4 using new scale type
  // var yscale = d3.scaleBand()
  //   .paddingInner(0.08)
  //   .domain([0, 1, 2])
  //   .range([0, height - 50], 0.1, 0.1);

  // Color is determined just by the index of the bars
  var barColors = { 0: '#fe9ca5', 1: '#9c745e', 2: '#b9b0ab',  3: '#4f79a7', 4: '#f28e3d', 5: '#e15659',  6: '#a2ceca', 7: '#58a14f', 8: '#edc94c',  9: '#ad799f', 10: '#fe9ca5', 11: '#9c745e'};
 
  // The histogram display shows the
  // first 30 minutes of data
  // so the range goes from 0 to 30
  // @v4 using new scale name
  var xHistScale = d3.scaleLinear()
    .domain([0, 30])
    .range([0, width - 20]);

  // @v4 using new scale name
  var yHistScale = d3.scaleLinear()
    .range([height, 0]);

  // var countryMax = 1200;
  //   var yCountryScale = d3.scaleLinear()
  //     .domain([0, countryMax])
  //     .range([0, height - 20]);

  // The color translation uses this
  // scale to convert the progress
  // through the section into a
  // color value.
  // @v4 using new scale name
  // You could probably get fancy and
  // use just one axis, modifying the
  // scale, but I will use two separate
  // ones to keep things easy.
  // @v4 using new axis name
  var yAxis = d3.axisLeft()
    .scale(yScale)
    .tickFormat(function (d) {return d;});

  // @v4 using new axis name
  var xAxis = d3.axisBottom()
    .scale(xScale);

  // var yAxisBar = d3.axisLeft()
  //   .scale(yscale);

  // var yAxisCountry = d3.axisLeft()
  //   .scale(yCountryScale)
  //   .tickFormat(function (d) {return d;});

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

      // perform some preprocessing on raw data
       var flightData = getFlights(data);
      // filter to just include filler words
      // var fillerWords = getFillerWords(wordData);

      
      // getFlights(data);
      
        //Country: top 10
        countryCounts = d3.rollups(data, v => v.length, d => d.Country); 
        countryCounts.sort(function(a,b) { return b[1] - a[1];});
        countryCounts = countryCounts.filter(function(d,i){ ; return (i < 10);});
        
        //list of just values to get the max
        countryCounts.forEach(function(d,i){countryNames[i] =d[1];});
        countryMax = d3.greatest(countryNames);

        //list of just names
        countryCounts.forEach(function(d,i){countryNames[i] =d[0];});

        //fix this to filter other namess
        data.forEach(function(d,i){
          d.Air_Carrier = d.Air_Carrier.replace('"','').toLowerCase();
           // d.Air_Carrier[0] === '"'
          for(let j = 0; j<carrierNames.length; j++){
            if(d.Air_Carrier.indexOf(carrierNames[j].toLowerCase()) !== -1){
              d.Air_Carrier = carrierNames[j];
            }  
          }
      
        });
        
        carrierCounts = d3.rollups(data, v => v.length, d => d.Air_Carrier);
        carrierCounts.sort(function(a,b) { return b[1] - a[1];});
        carrierCounts = carrierCounts.filter(function(d,i){ ; return (i!=0 && i<10);});
      
        carrierCounts.forEach(function(d,i){carrierNames[i] =d[1];})
        carrierMax = d3.greatest(carrierNames);
        
        carrierCounts.forEach(function(d,i){carrierNames[i] =d[0];})
        
        //Make: all 5
        makeCounts = d3.rollups(data, v => v.length, d => d.Make); 

        makeCounts.sort(function(a,b) { return b[1] - a[1];});
        makeCounts = makeCounts.filter(function(d,i){ ; return (i < 5);});

        makeCounts.forEach(function(d,i){makeNames[i] =d[1];})
        makeMax = d3.greatest(makeNames);
        
        makeCounts.forEach(function(d,i){makeNames[i] =d[0];})
        


        //Phase: everything but unlabeled
        phaseCounts = d3.rollups(data, v => v.length, d => d.Broad_Phase_of_Flight); 
        phaseCounts = phaseCounts.filter(function(d,i){  return (d[0]!= '');});
       
         //list of just values to get the max
        phaseCounts.forEach(function(d,i){phaseNames[i] =d[1];});
        phaseMax = d3.greatest(phaseNames);

        //list of just names
        phaseCounts.forEach(function(d,i){phaseNames[i] =d[0];});
        console.log("names are " + phaseNames);
        console.log("max is "+ phaseMax);

      
      
      //  groupByWord(fillerWords);
      // set the bar scale's domain
      // var countMax = d3.max(fillerCounts, function (d) { return d.value;});
      // xscale.domain([0, countMax]);

      // get aggregated histogram data

      // var histData = getHistogram(fillerWords);
      // set histogram's domain
      // var histMax = d3.max(histData, function (d) { return d.length; });
      // yHistScale.domain([0, histMax]);
      
       setupVis(data, countryCounts);

      setupSections();
    });
  };


  /**
   * setupVis - creates initial elements for all
   * sections of the visualization.
   *
   * @param flightData - data object for each flight.
   * @param fillerCounts - nested data that includes
   *  element for each filler word type.
   * @param histData - binned histogram data
   */
  var setupVis = function (flightData, fillerCounts) {

    g.append('text')
      .attr('class', 'title opening-title')
      .attr('x', width / 2)
      .attr('y', height / 3)
      .text('✈️');
    
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

    // count filler word count title
    g.append('text')
      .attr('class', 'title count-title highlight')
      .attr('x', width / 2)
      .attr('y', height / 3)
      .text('180');

    g.append('text')
      .attr('class', 'sub-title count-title')
      .attr('x', width / 2)
      .attr('y', (height / 3) + (height / 5))
      .text('Filler Words');

    g.selectAll('.count-title')
      .attr('opacity', 0);


    // square grid
    // @v4 Using .merge here to ensure
    // new and old data have same attrs applied
    var squares = g.selectAll('.square').data(flightData, function (d) { return d.word; });
    var squaresE = squares.enter()
      .append('circle')
      .classed('square', true);
    squares = squares.merge(squaresE)
    .attr('r', 3.5)
      // .attr('width', squareSize)
      // .attr('height', squareSize)
      .attr('fill', '#eee')
      .classed('fill-square', function (d) { return d.fatal; })
      .classed('red-square', function (d) {return d.fatal;})
      .classed('orange-square', function (d) {return d.non_fatal;})
      .attr('cx', function (d) { return d.x;})
      .attr('cy', function (d) { return d.y;})
      .attr('opacity', 0);


  };

  function updateBarData(data){
    var toRemove = svg.selectAll('.bar');
  
    toRemove.remove();

    var bars = g.selectAll('.bar').data(data);
    var barsE = bars.enter()
      .append('rect')
      .attr('class', 'bar');
    bars = bars.merge(barsE)
      .attr('x', function(d,i) {return xScale(d[0]) + 50;})
      .attr('y', function (d, i) { 
        return height;
      })
      .attr('fill', function (d, i) { return barColors[i]; })
      .attr('width', xScale.bandwidth())
      
      //.attr('height', 0)
     // .attr('opacity', 0);
      console.log("bandwidth is " + xScale.bandwidth());
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
    activateFunctions[1] = worldIncidents;
    activateFunctions[2] = fatalIncidents;
    activateFunctions[3] = nonFatalIncidents;
    activateFunctions[4] = midText;
    activateFunctions[5] = byCountry;
    activateFunctions[6] = byCarrier;
    activateFunctions[7] = byManufacturer;
    activateFunctions[8] = byFlightPhase;

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
function worldIncidents(){
   g.selectAll('.opening-title')
      .transition()
      .duration(0)
      .attr('opacity', 0);

    g.selectAll('.square')
      .transition()
      .duration(600)
      .delay(function (d) {
        return 5 * d.row;
      })
      .attr('opacity', 1.0)
      .attr('fill', '#7d7d7d');
      
}

/** shows: red dots + gray
   hides: dot graph
          orange dots
  */
function fatalIncidents(){
    

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
function nonFatalIncidents (){
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
function midText(){
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
function byCountry(){
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
function byCarrier(){
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
function byManufacturer(){
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
function byFlightPhase(){
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
   * showTitle - initial title
   *
   * hides: count title
   * (no previous step to hide)
   * shows: intro title
   *
   */
  function showTitle() {
    g.selectAll('.count-title')
      .transition()
      .duration(0)
      .attr('opacity', 0);

    g.selectAll('.openvis-title')
      .transition()
      .duration(600)
      .attr('opacity', 1.0);
  }

  /**
   * showFillerTitle - filler counts
   *
   * hides: intro title
   * hides: square grid
   * shows: filler count title
   *
   */
  function showFillerTitle() {
    g.selectAll('.openvis-title')
      .transition()
      .duration(0)
      .attr('opacity', 0);

    g.selectAll('.square')
      .transition()
      .duration(0)
      .attr('opacity', 0);

    g.selectAll('.count-title')
      .transition()
      .duration(600)
      .attr('opacity', 1.0);
  }

  /**
   * showGrid - square grid
   *
   * hides: filler count title
   * hides: filler highlight in grid
   * shows: square grid
   *
   */
  function showGrid() {
    g.selectAll('.count-title')
      .transition()
      .duration(0)
      .attr('opacity', 0);

    g.selectAll('.square')
      .transition()
      .duration(600)
      .delay(function (d) {
        return 5 * d.row;
      })
      .attr('opacity', 1.0)
      .attr('fill', '#7d7d7d');
  }

  /**
   * highlightGrid - show fillers in grid
   *
   * hides: barchart, text and axis
   * shows: square grid and highlighted
   *  filler words. also ensures squares
   *  are moved back to their place in the grid
   */
  function highlightGrid() {
    hideAxis();
    g.selectAll('.bar')
      .transition()
      .duration(600)
      .attr('width', 0);

    g.selectAll('.bar-text')
      .transition()
      .duration(0)
      .attr('opacity', 0);


    g.selectAll('.square')
      .transition()
      .duration(0)
      .attr('opacity', 1.0)
      .attr('fill', '#7d7d7d');

    // use named transition to ensure
    // move happens even if other
    // transitions are interrupted.
    g.selectAll('.red-square')
      .transition('move-fills')
      .duration(800)
      .attr('x', function (d) {
        return d.x;
      })
      .attr('y', function (d) {
        return d.y;
      });

    g.selectAll('.red-square')
      .transition()
      .duration(800)
      .attr('opacity', 1.0)
      .attr('fill', function (d) {  return 'red';
        
        // d.fatal ? '#008080' : '#7d7d7d'; 
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
   * getWords - maps raw data to
   * array of data objects. There is
   * one data object for each word in the speach
   * data.
   *
   * This function converts some attributes into
   * numbers and adds attributes used in the visualization
   *
   * @param data - data read in from file
   */
  function getFlights(data) {
        // Create map for each attribute's extent

    
    return data.map(function (d, i) {
      // is this word a filler word?
      d.filler = (d.filler === '1') ? true : false;
      // time in seconds word was spoken
      d.time = +d.time;
      // time in minutes word was spoken
      d.min = Math.floor(d.time / 60);

      // positioning for square visual
      // stored here to make it easier
      // to keep track of.
      d.col = i % numPerRow;
      d.x = d.col * (squareSize + squarePad) + 60;
      d.row = Math.floor(i / numPerRow);
      d.y = d.row * (squareSize + squarePad) + 50;

      //attributes for type of incident
       d.fatal = (d.Total_Fatal_Injuries > 0) ? true : false;
      //  d.non_fatal = ((d.Total_Serious_Injuries > 0) && (!(d.fatal)));
       d.non_fatal = (d.Injury_Severity.indexOf("Non-Fatal") !== -1);

  

      return d;
    });

    
  }

  /**
   * getFillerWords - returns array of
   * only filler words
   *
   * @param data - word data from getWords
   */
  // function getFillerWords(data) {
  //   return data.filter(function (d) {return d.filler; });
  // }




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
// d3.tsv('data/words.tsv', display);
  // d3.csv('data/data.csv', display);
d3.csv('data/data.csv', dataPreprocessor).then(function(dataset){

  
  
    //map where the number of unique attribute values is 0th
    //and the number of items for attribute with the most is 1st
    // d3.least(d3.rollup(dataset, v => d3.sum(v, d => d.earnings), v= v.length), ([, sum]) => -sum)

    
  display(dataset);
});


function dataPreprocessor(row) {
    return {
      'Accident_Number': row['Accident_Number'],
      'Event_Date': row['Event_Date'],
      'Location': row['Location'],
      'Location Copy': row['Location Copy'],
      'Country': row['Country'],
      'Latitude': row['Latitude'],
      'Longitude': row['Longitude'],
      'Airport_Code': row['Airport_Code'],
      'Airport_Name': row['Airport_Name'],
      'Injury_Severity': row['Injury_Severity'],
      'Aircraft_Damage': row['Airport_Damage'],
      'Registration_Number': row['Registration_Number'],
      'Make': row['Make'],
      'Model': row['Model'],
      'Schedule': row['Schedule'],
      'Air_Carrier': row['Air_Carrier'],
      'Total_Fatal_Injuries': row['Total_Fatal_Injuries'],
      'Total_Serious_Injuries': row['Total_Serious_Injuries'],
      'Total_Uninjured': row['Total_Uninjured'],
      'Weather_Condition': row['Weather_Condition'],
      'Broad_Phase_of_Flight' : row['Broad_Phase_of_Flight']
    };
}
