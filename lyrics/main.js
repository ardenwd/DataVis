var colorScale = ["#1e6cc0", "#5a6cc4", "#806bc3", "#a069bf", "#bb68b8", "#d268af", "#e56aa3", "#f46f96",
                "#ff7a85", "#ff8a73", "#ff9d63", "#ffb356", "#fdc950", "#ebdf56", "#d2f468"];

var colors = d3.scaleOrdinal(["#1e6cc0", "#5a6cc4", "#806bc3", "#a069bf", "#bb68b8", "#d268af", "#e56aa3", "#f46f96",
                "#ff7a85", "#ff8a73", "#ff9d63", "#ffb356", "#fdc950", "#ebdf56", "#d2f468"]);
var songInfo = [];
var songData = [];
var wordTotals = [];
var list = [];
var sideInfo = d3.select("#vis")
    .append("div")
    .attr("class","info")
    .html("<p class=\"info-text\">Each bubble is a word. Hover over one to see how many times its said!</p>");

// var width = +svg.attr('width');
var width = window.innerWidth-250, height = window.innerHeight-50, sizeDivisor = 100, nodePadding = 1.5;

var nodes = [{},{},{}];

var svg = d3.select("#vis")
    .append("svg")
    .attr("id","svg")
    // .attr("width", width)
     .attr("height", height);
     width = document.getElementById("svg").clientWidth;


var padding = {t: 40, r: 40, b: 40, l: 40};

var vis = svg.append('g')
    .attr('transform', 'translate('+[padding.l,padding.t]+')');
// create a tooltip


//combine into just one svg later
var svg2 = d3.select("#songVis")
    .append("svg")
    .attr("id","svg")
    .attr("width", 700)
     .attr("height", height);
    //  width = document.getElementById("svg").clientWidth;   
   
var sVis = svg2.append('g')
    .attr('transform', 'translate('+[padding.l,padding.t]+')');


var nameText = sVis.append('text')
    .attr("class","nameText")
    .text("");

// Three function that changes the tooltip when user hovers / moves / leaves a cell
var mouseover = function(d) {
  d=d.target.__data__;
    sideInfo
      .html("<p class=\"info-text\" > in <span style=\"color:"+ colors(d.Song) +"; font-style: italic; font-weight: 700\">" + d.Song + ",</span></p><p class=\"info-text\" style=\"position: absolute; top: 200px; font-size: 35px\">Charli says <span style=\"font-style: italic; color:"+ colors(d.Song) +";\">" + d.Word + "</span></p><p class=\"info-text\" style = \"position: absolute; top: 275px\"><span style=\"color:" + colors(d.Song) + " \">" + d.Count + "</span> times</p>")
      .transition().duration(200);
    //  .text(d.Count);
    d3.select(this)
      .style("opacity", 1)
      .style("stroke", "1px solid white");
}

var mousemove = function(event, d) {
    var[x,y] = d3.pointer(event);
}
  
var mouseleave = function(d) {
  d3.select(this)
      .style("opacity", 1)
      .style("border", "none");
      
}

var simulation = d3.forceSimulation(nodes)
        .force("forceX", d3.forceX().strength(.1).x(width * .5))
        .force("forceY", d3.forceY().strength(.1).y(height * .5))
        .force("center", d3.forceCenter().x(width * .5).y(height * .5))
        .force("charge", d3.forceManyBody().strength(-3.5));

d3.csv('charli.csv', dataPreprocessor).then(function(dataset) {

  //load the json file
  d3.json('Lyrics_Charli.json').then(function(data){
    //  console.log(data.tracks);
     list = data.tracks;
    // console.log(list);
    dataPreprocessorSongs(list);
    songVis(songInfo);
  //   featureVis(songInfo);
  //  featureVis2(songData);
  circleVis(dataset);
  });
  //  titleVis(dataset);
  //  console.log(dataset);
});

// Recall that when data is loaded into memory, numbers are loaded as Strings
// This function converts numbers into Strings during data preprocessing
function dataPreprocessor(row) {
    return {
        Count: +row.Count,
        Word: row.Word,
        Song: row.Song,
        radius: (((+row.Count)**0.7+2)*0.8)
    };
}

function dataPreprocessorSongs(data){
//make an array with the song name, list of artists, popularity
//go through each song
//  console.log(data);
var features = [];
var temp = [];
  data.forEach((d,i) => {
    var featuresBySong = [];
    
    var index;
    
    //name: , features: , length: ,
    var name = d.song.title;
    var fIndex = 0;
    //go in to each song
    d.song.featured_artists.forEach((d)=>{
      
      //add all the artists to an array
      index = temp.indexOf(d.name);
      
      if( index == -1){
      temp.push(d.name);
      
    }
     index = temp.indexOf(d.name);
    
      songData.push({artist: d.name, title: name, num: i, artistNum: index, featureNum: fIndex}
        //each artist has unique id int
        )
        
      fIndex++;
    }
    );
// console.log(temp);
    

    songInfo.push({name: d.song.title,
    features: d.song.featured_artists}
    );
    
    features=songInfo[i].features;
    features.forEach((d) => {featuresBySong.push(d.name);});
    songInfo[i].features=featuresBySong;
  });

  // console.log(songData);
  //  console.log(songInfo.length);
  
  
  // songInfo.forEach((d,i)=> {  
  //   // console.log(d.features);
  //     features = d.features;
  //     console.log(features);
  //     // if(features.length > 0)
  
  //   });

  // console.log(features);
  // songInfo.forEach((d)=>{console.log(d);});
  // console.log(songInfo);
  // console.log(features);
  // var a = d3.rollups(data, d => d[0]);
  // console.log(a);
  // console.log(songInfo);
  // songInfo = d3.rollups(data, v => v.song.primary_artist.name); 
  //  console.log(data.song);

}

function circleVis(dataset){

    graph = dataset;
    simulation.nodes(graph)
        .force("collide", d3.forceCollide().strength(1).radius(function(d){ return d.radius + nodePadding; }).iterations(1))
         .on("tick", function(d){
            node
                .attr("cx", function(d){ return d.x - 30; })
                .attr("cy", function(d){ return d.y - 35; })
          });

 console.log(graph);
    var node = vis.append("g")
          .attr("class", "node")
        .selectAll("circle")
        .data(graph)
        .enter().append("circle")
          .attr("r", function(d) { return d.radius; })
          .attr("fill", function(d) { return colors(d.Song); })
          .attr("cx", function(d){ return d.x; })
          .attr("cy", function(d){ return d.y; })
          .attr("z-index",1)
          .on("mouseover", mouseover)
          .on("mousemove", mousemove)
          .on("mouseleave", mouseleave);

}

function songVis(data){


  //  var name = sVis.append("div")
  //   .attr("class", "songName")
  //   // .selectAll("text")
  //   .append("text")
  //   .text(function(){return songname;});
var name;
console.log(data);
  var dots = sVis.append("g")
          .attr("class", "node")
        .selectAll("circle").data(data);

    var dotsEnter = 
        
        dots.enter()
      .append('rect')
      .attr("class","bySong")
          .attr("width", 20)
          // .attr("height",  function(d){ return d.features.length * 20 + 20;})
          .attr("height", 20)
          .attr("fill", function(d,i){ 
            
            return colorScale[i];})
          // .attr("opacity", 0.6)
          .attr("x", function(d,i){ return i *30; })
          .attr("y", function(d,i){ return height - 170; });
 
      dotsEnter
          .on("mouseover", function(event,d){
            var[x,y] = d3.pointer(event);
            nameText.text(d.name)
            .style("fill", "#f1ede9")
            .attr("x",x - 20 )
            .attr("y", (y - 20));
          })
          // .on("mousemove", mousemove)
           .on("mouseleave", function(){
            nameText.text(" ");
           });
  //one round circle of all the songs



  //function that lists all the points on a circle
}

function featureVis2(data){
  //scatter plot of the song x artists (x,y), charli as 1, 2 is the next, 3 troye, etc

// var parent = 

//on hover the 
var dots = sVis.append("g")
      .selectAll('circle')
      .data(data);
//artist, song name
  var dotsEnter = dots
      .enter()
      .append('rect')
      .attr("class","bySong")
          .attr("width", 20)
          .attr("height",  function(d){ return 20;})
          .attr("fill", function(d,i){ 
            
            return colorScale[d.num];})
          .attr("x", function(d,i){ return d.num * 30; })
          .attr("y", function(d,i){return -d.featureNum * 30 + height - 200; });
          // .attr("z-index",1
          
      dotsEnter
          .on("mouseover", function(event,d){
            var[x,y] = d3.pointer(event);
            
            nameText.text(d.artist)
            .style("fill", "#f1ede9")
            .attr("x",x -30)
            .attr("y",y - 50);
          })
          // .on("mousemove", mousemove)
           .on("mouseleave", function(){
            nameText.text(" ");
           });
}


function featureVis(data){
  //scatter plot of the song x artists (x,y), charli as 1, 2 is the next, 3 troye, etc

// var parent = 

//on hover the 
console.log(data);
var dots = sVis.append("g")
      .selectAll('rect')
      .data(data);
//artist, song name
  var dotsEnter = dots
      .enter()
      .append('rect')
      .attr("class","bySong")
          .attr("width", 20)
          // .attr("height",  function(d){ return d.features.length * 20 + 20;})
          .attr("height", 20)
          .attr("fill", function(d,i){ 
            
            return colorScale[i];})
          // .attr("opacity", 0.6)
          .attr("x", function(d,i){ return i *30; })
          .attr("y", function(d,i){ return height - 170; });
          // .attr("z-index",1
          
      dotsEnter
          .on("mouseover", function(event,d){
           var[x,y] = d3.pointer(event); 
           nameText.style("fill", "#f1ede9")
            .text("Charli XCX")
            .attr("x",x )
            .attr("y", (330));
            
          
          })
          // .on("mousemove", mousemove)
           .on("mouseleave", function(){
            nameText.text(" ");
           });
}
//if there isn't that word there, then skip space
