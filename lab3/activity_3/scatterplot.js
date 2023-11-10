// **** Functions to call for scaled values ****

function scaleYear(year) {
    return yearScale(year);
}

function scaleHomeruns(homeruns) {
    return hrScale(homeruns);
}

// **** Code for creating scales, axes and labels ****

var yearScale = d3.scaleLinear()
    .domain([1870,2017]).range([60,700]);

var hrScale = d3.scaleLinear()
    .domain([0,75]).range([340,20]);

var svg = d3.select('svg');

svg.append('text')
    .text('Top 10 HR Leaders per MLB Season')
    .attr('class', 'title')
    .style("font-size", "20px")
    .attr('transform','translate(370,40)');

svg.append('g').attr('class', 'x axis')
    .attr('transform', 'translate(0,345)')
    .call(d3.axisBottom(yearScale).tickFormat(function(d){return d;}));

svg.append('text')
    .text('MLB Season')
    .attr('class', 'label')
    .attr('transform','translate(370,380)');

svg.append('g').attr('class', 'y axis')
    .attr('transform', 'translate(55,0)')
    .call(d3.axisLeft(hrScale));
    
// **** Your JavaScript code goes here ****
    svg.append('text')
        .text('Home Runs (HR)')
        .attr('class', 'label')
        .attr('transform','translate(15,200) rotate(-90)');

d3.csv('baseball_hr_leaders.csv').then(function(dataset){

    dataset.forEach(function(d){createPlayerPixel(svg,d)});
});

function createPlayerPixel(svg, d) {
     var playerLabelGroup = svg.append('g');
    playerLabelGroup.attr("transform", "translate("+scaleYear(d.year)+","+scaleHomeruns(d.homeruns)+")");

    var circle = playerLabelGroup.append('circle');

    // circle.attr('cx', scaleYear(d.year));
    // circle.attr('cy', scaleHomeruns(d.homeruns));
    circle.attr('r', "2px");

    circle.style('fill', function(){
        if(d.rank > 8){
            return "blue";
        }
        else if(d.rank < 4){
            return "red";
        }
        else { 
            return "green";
        }
    });

    var playerLabelText = playerLabelGroup.append("text");
    playerLabelText.text(d.name).attr('class', 'playerLabelText');

   
    
//  playerLabel.attr("translate-x", scaleYear(d.year));
//  playerLabel.attr("translate-y", scaleYear(d.rank));

}
