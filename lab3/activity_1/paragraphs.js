
// **** Your JavaScript code goes here ****
d3.csv('baseball_hr_leaders_2017.csv').then(function(dataset) {
	console.log(dataset);
    
       d3.select("#homerun-leaders").selectAll("p").data(dataset).enter().append("p").text(function(d,i) {return d.rank + ' ' + d.name + ' '+ d.homeruns;}).style("color", function(d) {
            if (d.rank < 4) {   //Threshold of 15
                return "green";
            } else {
                return "black";
            }
        });

        d3.select('thead').style("background-color", "pink");
    
        var tbody =  d3.select("#homerun-table").select("tbody");
        var row = tbody.selectAll("tr")
            .data(dataset)
            .enter()
            .append("tr");
        

        var col1 = row.append("td").text(function(d){return d.rank;});
        var col2 = row.append("td").text(function(d){return d.name});
        var col3 = row.append("td").text(function(d){return d.homeruns});
        
        //text(function(d,i) {return d.rank + ' ' + d.name + ' '+ d.homeruns;});
    
    

    // the variable `dataset` is an array of data elements
});

