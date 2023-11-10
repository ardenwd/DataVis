// Global function called when select element is changed
function onCategoryChanged() {
    var select = d3.select('#categorySelect').node();
    // Get current value of select element
    var category = select.options[select.selectedIndex].value;
    // Update chart with the selected category of letters
    updateChart(category);
    
}

// Recall that when data is loaded into memory, numbers are loaded as Strings
// This function converts numbers into Strings during data preprocessing
function dataPreprocessor(row) {
    return {
        letter: row.letter,
        frequency: +row.frequency
    };
}

var svg = d3.select('svg');
var filteredLetters;

// Get layout parameters
var svgWidth = +svg.attr('width');
var svgHeight = +svg.attr('height');

var padding = {t: 60, r: 40, b: 30, l: 40};

// Compute chart dimensions
var chartWidth = svgWidth - padding.l - padding.r;
var chartHeight = svgHeight - padding.t - padding.b;

// Create a group element for appending chart elements
var chartG = svg.append('g')
    .attr('transform', 'translate('+[padding.l, padding.t]+')');

// Compute the spacing for bar bands based on all 26 letters
var barBand = chartHeight / 26;
var barHeight = barBand * 0.7;

// A map with arrays for each category of letter sets
var lettersMap = {
    'only-consonants': 'BCDFGHJKLMNPQRSTVWXZ'.split(''),
    'only-vowels': 'AEIOUY'.split(''),
    'all-letters': 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')
};

//Axes and labels
var cLabel = svg.append("text");
 cLabel.attr('transform', 'translate(80,30)')
    .text(function(){return "Letter Frequency (%)";})
     .style('text-align', 'center');

svg.append('g');

var main = document.getElementById('main');
d3.select(main)
        .append('p')
        .append('button')
        .style("border", "1px solid black")
        .text('Filter Data')
        .on('click', function() {

            var select = d3.select('#cutoff').node();
            // Get current value of select element
            var cutoff = select.value;
            // Update chart with the selected category of letters
            updateCutoff(cutoff);
            // Add code here
        });


        

d3.csv('letter_freq.csv', dataPreprocessor).then(function(dataset) {
    // Create global variables here and intialize the chart
    

    // **** Your JavaScript code goes here ****
    chartG.selectAll('.bar').data();
    letters = dataset;
    
    
    dataset.forEach(function(d,i){
        //top axis
        var topAxis = d3.axisTop(barScale)
            .ticks(7)
            .tickSize(5, 0, 0)
            .tickFormat(d3.format('.0%'));
        chartG.append('g').call(topAxis)
            .attr('class', 'axis')
            .attr('transform', 'translate(0,-2)');

        var bottomAxis = d3.axisBottom(barScale)
            .ticks(7)
            .tickSize(5, 0, 0)
            .tickFormat(d3.format('.0%'));
        chartG.append('g').call(bottomAxis)
            .attr('class', 'axis')
            .attr('transform', 'translate(0,508)');

    });

               
    // Update the chart for all letters to initialize
   dataset = updateChart('all-letters');


});

function updateChart(filterKey) {
    // Create a filtered array of letters based on the filterKey
    filteredLetters = letters.filter(function(d){
        return lettersMap[filterKey].indexOf(d.letter) >= 0;
    });

    // **** Draw and Update your chart here ****

    var bar = chartG.selectAll('.bar')
    .data(filteredLetters, function(d){
        return d.letter;
    });
    

    var barEnter = bar.enter()
    .append('g')
    .attr('class','bar');

    bar.merge(barEnter)
    .attr('transform', function(d,i){ 
            return 'translate(' + [0, i * barBand] + ')';});

    barEnter.append('rect')
    .attr("fill", 'black')
      .attr('width', function(d) {
        return (barScale(d.frequency));
			})
            .attr('height', barHeight)
        .attr("fill", 'black')
        .attr('class','active');

    barEnter.append('text')
    .attr('x',-20)
    .attr('dy',barHeight)
    .attr('class','inactive')
    .text(function(d){
        return d.letter;
    });
    
    bar.exit().attr('class','inactive').remove();

}

function updateCutoff(cutoff) {
    // Create a filtered array of letters based on the filterKey
    var filteredLetters2 = filteredLetters.filter(function(d,i){
        return d.frequency*100 >= cutoff;
    });

    // **** Draw and Update your chart here ****
    var bar = chartG.selectAll('.bar')
    .data(filteredLetters2, function(d){
        return d.letter;
    });
    
    var barEnter = bar.enter()
    .append('g')
    .attr('class','bar');

    bar.merge(barEnter)
    .attr('transform', function(d,i){ 
            return 'translate(' + [0, i * barBand] + ')';});

    barEnter.append('rect')
    .attr("fill", 'black')
      .attr('width', function(d) {
        return (barScale(d.frequency));
			})
            .attr('height', barHeight)
        .attr("fill", 'black');

    barEnter.append('text')
    .attr('x',-20)
    .attr('dy',barHeight)
    .text(function(d){
        return d.letter;
    });
    
    bar.exit().remove();

}

var letters;
var barScale = d3.scaleLinear().range([0,chartWidth]).domain([0,0.12702]);
var axisScale = d3.scaleLinear().range([0,12.702]).domain([0,0.12702]);
// Remember code outside of the data callback function will run before the data loads