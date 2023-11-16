function onCategoryChanged() {
    var select = d3.select('#xSelector').node();
    // Get current value of select element
    var x = select.options[select.selectedIndex].value;
    //console.log(x);
    select = d3.select('#ySelector').node();
    var y = select.options[select.selectedIndex].value;
    // Update chart with the selected category of letters
    updateChart(x,y);
    //console.log(x);
}

//define svg + design elements
var svg = d3.select('svg');


// Get layout parameters
var svgWidth = +svg.attr('width');
var svgHeight = +svg.attr('height');

// Map for referencing min/max per each attribute
var extentByAttribute = {};

var padding = {t: 50, r: 50, b: 20, l: 20};

var chartWidth = (svgWidth/2-padding.r);
var chartHeight = (svgHeight - padding.r);


//the bar will use Y and the scatter will use both!
//update regularly
var xScale = d3.scaleLinear().range([0, chartWidth]);
var yScale = d3.scaleLinear().range([chartHeight , 0]);
// // axes that are rendered already for you
var xAxis = d3.axisTop(xScale).ticks(6).tickSize(-chartHeight + 40, 0, 0);
var yAxis = d3.axisLeft(yScale).ticks(6).tickSize(-chartWidth, 0, 0);

//var cellPadding = 10;
//define reusable code
var chartA = svg.append('g')
    .selectAll('.background')
    .data(['chartA', 'chartB']) // names of the classes to pull as a var
    .enter()
    .append('g') // Append 2 rectangles
    .attr('class', function(d, i) {
        
       return d + ' background';})
    .attr('width', (chartWidth)) 
    .attr('height', (chartHeight))
    .attr('transform', function(d, i) {
        var tx = (i*(svgWidth/2) + padding.r) ;
        var ty = padding.t ;
        return 'translate('+[tx, ty]+')';
    });

var chartA = d3.select('.chartA');
var chartB = d3.select('.chartB');

var dataAttributes = ['cylinders', 'economy (mpg)','displacement (cc)', 'power (hp)', 'weight (lb)', '0-60 mph (s)', 'year'];
var N = dataAttributes.length;

var cellWidth = 400;
var cellHeight = (svgHeight - padding.t - padding.b) / 2;

//enter the data and make points for the scatterplot
//also make points for the bar chart

d3.csv('cars.csv', dataPreprocessor).then(function(dataset) {
    
    cars = dataset;

    chartA.selectAll('.bar').data();

    // Create map for each attribute's extent
    dataAttributes.forEach(function(attribute){
        extentByAttribute[attribute] = d3.extent(dataset, function(d){
            return d[attribute];
        });
    });



    updateChart('cylinders','economy');

});

    function updateChart(xCat,yCat) {
         // Pre-render gridlines and labels

        chartA.append('g').call(xAxis).attr('transform', 'translate(0,0)').attr('class', 'x axis');
        chartB.append('g').call(xAxis).attr('transform', 'translate(0,0)').attr('class', 'x axis');

        var xALabelText = chartA.append('text');
        xALabelText.text(xCat).attr('class', 'x axis-label')
          .attr('transform', function(){ return 'translate('+ (chartWidth/2 - 30) + ', ' + (chartHeight - 10)+ ')'});

        var xBLabelText = chartB.append('text');
        xBLabelText.text(xCat).attr('class', 'x axis-label')
          .attr('transform', function(){ return 'translate('+ (chartWidth/2 - 30) + ', ' + (chartHeight - 10)+ ')'});

        var yALabelText = chartA.append('text');
        yALabelText.text(yCat).attr('class', 'y axis-label')
            .attr('transform', 'translate('+[-20, (chartHeight/2 + 20)]+')rotate(270)');

        var yBLabelText = chartB.append('text');
        yBLabelText.text("count").attr('class', 'y axis-label')
            .attr('transform', 'translate('+[-20, (chartHeight/2 + 20)]+')rotate(270)');

        //make rectangles
        //width for each bar will be chartWidth/num of options

}


function dataPreprocessor(row) {
    return {
        'name': row['name'],
        'economy (mpg)': +row['economy (mpg)'],
        'cylinders': +row['cylinders'],
        'displacement (cc)': +row['displacement (cc)'],
        'power (hp)': +row['power (hp)'],
        'weight (lb)': +row['weight (lb)'],
        '0-60 mph (s)': +row['0-60 mph (s)'],
        'year': +row['year']
    };
}
