// **** Code for creating scales, axes and labels ****

// var yearScale = d3.scaleLinear()
//     .domain([0,9]).range([60,700]);



var times = ["10:00","12:00","2:00","4:00","6:00"];
var timesCute = ["10am", "12pm", "2pm", "4pm", "6pm"];

var yearScale = d3.scaleOrdinal().domain(times).range([100, 250, 400, 550, 700]);

var caffeineScale = d3.scaleLinear()
    .domain([0,160]).range([320,50]);

var svg = d3.select('svg');

svg.append('text')
    .text('Caffeine and Mood')
    .attr('class', 'title')
    .style("font-size", "20px")
    .attr('transform','translate(370,40)');

var xAxis = svg.append('g').attr('class', 'x axis')
    .attr('transform', 'translate(0,345)')
    .call(d3.axisBottom(yearScale).tickFormat((d,i) => timesCute[i]));

    
    

svg.append('text')
    .text('Time')
    .attr('class', 'label')
    .attr('transform','translate(370,380)');

svg.append('g').attr('class', 'y axis')
    .attr('transform', 'translate(55,0)')
    .call(d3.axisLeft(caffeineScale));

    svg.append('text')
        .text('Caffeine')
        .attr('class', 'label')
        .attr('transform','translate(15,200) rotate(-90)');

d3.csv('caffeine-data.csv').then(function(dataset){
    var dataByNameAndDate = d3.group(dataset, d => d.Name, d => d.Date);
    dataByNameAndDate.forEach(function(d){ drawLines(svg,d)});
    
    dataset.forEach(function(d){createPlayerPixel(svg,d)});



});



function createPlayerPixel(svg, d) {
     var nameGroup = svg.append('g');

    nameGroup.attr("transform", "translate("+yearScale(d.Time)+","+caffeineScale(d.Caffeine)+")");

    var circle = nameGroup.append('circle');

    // circle.attr('cx', scaleYear(d.year));
    // circle.attr('cy', scaleHomeruns(d.homeruns));
    circle.attr('r', function(){return ((d.Sleep - 3) * 3) + "px";});

    circle.style('fill', function(){return d.Color;});

    var nameText = nameGroup.append("text");
    nameText.text(function(){return d.Name + " slept " + d.Sleep + " hours and was " + d.Feeling;}).attr('class', 'nameText')
}

function drawLines(svg,data) {
    data.forEach(function(d){
        
        var day = d;
        var l = day.length;

            day.forEach(function(d,i){ 
            if(i < (l - 1)){

                //define the specific gradient
                var defs = svg.append("defs");

                var gradient = defs.append("linearGradient")
                .attr("id", "svgGradient")
                .attr("x1", "0%")
                .attr("x2", "100%")
                .attr("y1", "0%")
                .attr("y2", "100%");

                gradient.append("stop")
                .attr('class', 'start')
                .attr("offset", "0%")
                .attr("stop-color", d.Color)
                .attr("stop-opacity", 1);

                gradient.append("stop")
                .attr('class', 'end')
                .attr("offset", "100%")
                .attr("stop-color", day[i+1].Color)
                .attr("stop-opacity", 1);

                //make a path between two of the points
                svg
                .append('path')
                .attr('d', d3.line()(
                    [[yearScale(d.Time), caffeineScale(d.Caffeine)],
                     [yearScale(day[i+1].Time), caffeineScale(day[i+1].Caffeine)]]
                ))
                .attr("stroke-width", "5px")
                .attr("stroke", "url(#svgGradient)")
                .attr("fill", "url(#svgGradient)");

                //make text that on hover appears and says the date
            }});

    });
     
 }
    //draw line between 
    // x1 = yearScale(d.Time);
    // y1 =  caffeineScale(d.Caffeine);
