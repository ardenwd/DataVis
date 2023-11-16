var toolTip = d3.tip()
.attr("class", "d3-tip")
.offset([-12, 0])
.html(function(event, d) {
    // Inject html, when creating your html I recommend editing the html within your index.html first
    return "<h5>"+d['name']+"</h5><table><thead><tr><td>Year</td><td>Displacement (cc)</td><td>Weight (lb)</td></tr></thead>"
         + "<tbody><tr><td>"+d['year']+"</td><td>"+d['displacement (cc)']+"</td><td>"+d['weight (lb)']+"</td></tr></tbody>"
         + "<thead><tr><td>0-60 mph (s)</td><td>Economy (mpg)</td><td>Cylinders</td><td>Power (hp)</td></tr></thead>"
         + "<tbody><tr><td>"+d['0-60 mph (s)']+"</td><td>"+d['economy (mpg)']+"</td><td>"+d['cylinders']+"</td><td>"+d['power (hp)']+"</td></tr></tbody></table>"
});

var svg = d3.select('svg');

svg.call(toolTip);

function onCategoryChanged() {
    var select = d3.select('#xSelector').node();
    // Get current value of select element
    var x = select.options[select.selectedIndex].value;
    var xIndex = select.options[select.selectedIndex].index;
   // console.log(xIndex);
    select = d3.select('#ySelector').node();
    var y = select.options[select.selectedIndex].value;
    var yIndex = select.options[select.selectedIndex].index;
    // Update chart with the selected category of letters
    updateChart(x,y, xIndex, yIndex, cars);
    //console.log(x);
}


// Get layout parameters
var svgWidth = +svg.attr('width');
var svgHeight = +svg.attr('height');

// Map for referencing min/max per each attribute
var extentByAttribute = {};

var padding = {t: 50, r: 50, b: 20, l: 50};

var chartWidth = (svgWidth/2-padding.r-padding.l);
var chartHeight = (svgHeight - padding.r);
var customColors = ['#ff5733', '#ffbd69', '#45aaf2', '#2ecc71','#8e44ad','#f7dc6f', '#3498db', '#fd79a8', '#1abc9c', '#f39c12' ];
var colorScale = d3.scaleOrdinal(customColors);

//the bar will use Y and the scatter will use both!
//update regularly
var xScale = d3.scaleLinear().range([0, chartWidth]);
var yScale = d3.scaleLinear().range([chartHeight - 60 , 0]);
// // axes that are rendered already for you
var xAxis = d3.axisBottom(xScale).ticks(6).tickSize(chartHeight -50, 0, 0);
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
           // console.log(d[attribute]);
            return d[attribute];
        });
    });



    updateChart('cylinders','economy (mpg)', 1, 2,cars);

});

function updateChart(xCat,yCat, xIndex, yIndex, data) {
  
        // Pre-render gridlines and labels

    xScale.domain(extentByAttribute[xCat]);
    yScale.domain(extentByAttribute[yCat]);

    var toRemove = svg.selectAll('.update');
    toRemove.remove();
    
    chartA.append('g').call(xAxis).attr('transform', 'translate(0,0)').attr('class', 'x axis update');
    chartB.append('g').call(xAxis).attr('transform', 'translate(0,0)').attr('class', 'x axis update');
 
    var xALabelText = chartA.append('text');
    xALabelText.text(xCat).attr('class', 'x axis-label update')
        .attr('transform', function(){ return 'translate('+ (chartWidth/2 - 30) + ', ' + (chartHeight - 10)+ ')'});

    var xBLabelText = chartB.append('text');
    xBLabelText.text(xCat).attr('class', 'x axis-label update')
        .attr('transform', function(){ return 'translate('+ (chartWidth/2 - 30) + ', ' + (chartHeight - 10)+ ')'});

    var yALabelText = chartA.append('text');
    yALabelText.text(yCat).attr('class', 'y axis-label update')
        .attr('transform', 'translate('+[-20, (chartHeight/2 + 20)]+')rotate(270)');

    var yBLabelText = chartB.append('text');
    yBLabelText.text("count").attr('class', 'y axis-label update')
        .attr('transform', 'translate('+[-20, (chartHeight/2 + 20)]+')rotate(270)');


    
    //make rectangles
    //width for each bar will be chartWidth/num of options

    var dots = chartA.selectAll('.dot')
        .data(data, function(d){
            return d.name +'-'+d.year+'-'+d.cylinders; // Create a unique id for the car
        });

    var dotsEnter = dots.enter()
        .append('circle')
        .attr('class', 'dot')
        .style("fill", function(d) { return colorScale(d[xCat]); })
        .attr('r', 4);

    dotsEnter.on('mouseover', toolTip.show)
        .on('mouseout', toolTip.hide);

    dots.merge(dotsEnter).attr('cx', function(d){
            return xScale(d[xCat]);
        })
        .attr('cy', function(d){
            return yScale(d[yCat]);
        });

    //dots.exit().remove();
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