//make a scale of the data, with colors from yellow to red

//make a bunch of dots

//make a list on the side

var svg = d3.select('svg');

var chart = svg.append('g');

var sideInfo = d3.select("#sideInfo")
    .append('g');

var width = 600;
var height = 400;

d3.csv('data.csv').then(function(data){

    chart.selectAll('.bar').data();

    updateChart(data);
    
});

function updateChart(data){

    //press out data
    console.log(data);

    var dots = chart.selectAll('.dot')
        .data(data, function(d){
            return d.name; // Create a unique id for the car
        });

    var dotsEnter = dots.enter()
        .append('circle')
        .attr('class', 'dot')
        .style("fill", "red")
        .attr('r', 4);

        var num = (width-100)/ data.length;
        console.log("a");

        
    //position the dots
    dots.merge(dotsEnter).attr('cx', function(d,i){

            return  i * num + 100;
        })
        .attr('cy', function(d){
            return height/2;
        });
   

}