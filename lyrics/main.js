var colorScale = ["#1e6cc0", "#5a6cc4", "#806bc3", "#a069bf", "#bb68b8", "#d268af", "#e56aa3", "#f46f96",
                "#ff7a85", "#ff8a73", "#ff9d63", "#ffb356", "#fdc950", "#ebdf56", "#d2f468"];

var colors = d3.scaleOrdinal(["#1e6cc0", "#5a6cc4", "#806bc3", "#a069bf", "#bb68b8", "#d268af", "#e56aa3", "#f46f96",
                "#ff7a85", "#ff8a73", "#ff9d63", "#ffb356", "#fdc950", "#ebdf56", "#d2f468"]);
var songInfo = [];
var songData = [];
var wordTotals = [];
var list = [];
var data;

var lyricDataset;
var sideInfo = d3.select("#vis")
    .append("div")
    .attr("class","info");

// var width = +svg.attr('width');
var width = window.innerWidth-250, height = window.innerHeight-350, sizeDivisor = 100, nodePadding = 1.5;

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

var nameText = vis.append('text')
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


//load at the start of the program
//process the data
d3.csv('charli.csv', dataPreprocessor).then(function(dataset) {

  lyricDataset = dataset;
  //load the json file
  d3.json('Lyrics_Charli.json').then(function(data){
    //  console.log(data.tracks);
     list = data.tracks;
    // console.log(list);
    dataPreprocessorSongs(list);
    // songVis(songInfo);
  //   featureVis(songInfo);
  //  featureVis2(songData);
  // circleVis(dataset);
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
var features = [];
var temp = [];
var artists = [];
//go through the song
  data.forEach((d,i) => {
    var featuresBySong = [];
    
    var index;
    
    //name: , features: , length: ,
    var name = d.song.title;
    var fIndex = 0;
    //go in to each artist
    d.song.featured_artists.forEach((d)=>{
      // artists.push({artist: d.name, title})
      // console.log(d);

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
console.log(songData);
    

    songInfo.push({name: d.song.title,
    features: d.song.featured_artists}
    );
    
    features=songInfo[i].features;
    features.forEach((d) => {featuresBySong.push(d.name);});
    songInfo[i].features=featuresBySong;
    // console.log(features);
  });

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

    var node = vis.append("g")
          .attr("class", "node")
        .selectAll("circle")
        .data(graph)
        .enter().append("circle")
          .attr("class","circles")
          .attr("r", function(d) { return d.radius; })
          
          .attr("cx", function(d){ return d.x; })
          .attr("cy", function(d){ return d.y; })
          .attr("z-index",1)
          .on("mouseover", mouseover)
          .on("mousemove", mousemove)
          .on("mouseleave", mouseleave)
          // .transition()
          // .duration(1500)
          .attr("fill", function(d) { return colors(d.Song); });
}

function songVis(data){

  vis.selectAll('.byArtist')
  .transition()
  .duration(1500)
      .attr("x", function(d,i){ return d.num * 30; })
      .attr("y", function(d,i){ return height - 170; })
      .remove();
  
  var dots = vis.append("g")
      .attr("class", "node")
      .selectAll("rect").data(data);

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

function featureVis(data){
  //scatter plot of the song x artists (x,y), charli as 1, 2 is the next, 3 troye, etc

  // vis.selectAll('circle').transition().duration(1000)
  // .attr('opacity',0);
  // remove();
var dots = vis.append("g")
      .selectAll('rect')
      .data(data);

//artist, song name
  var dotsEnter = dots
      .enter()
      .append('rect') 
      .attr("class","byArtist")
      .attr("width", 20)
      .attr("height",  20)
      .attr("fill", function(d,i){ 
        return colorScale[d.num];})
      .attr("x", function(d,i){ return d.num * 30; })
      .attr("y", function(d,i){ return height - 170; });
      dotsEnter
      .transition()
      .duration(1200)
          .attr("x", function(d,i){ return d.num * 30; })
          .attr("y", function(d,i){ return height - 200 - d.featureNum * 30 ; });
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


var controller = new ScrollMagic.Controller();


//add the first scene to the controller
var startScene = new ScrollMagic.Scene({
  triggerElement: '#hide-vis',
  // duration: 300
})
.addTo(controller); // Add Scene to ScrollMagic Controller

//hide the vis when this point is approached
startScene.on("enter", function(){
  //here is where you call the relevant viz function
  //make svg opacity 0
  console.log('hi');
    document.getElementById("vis").style.visibility = "visible"; 
});

//hide the vis when this point is approached
startScene.on("leave", function(){
  //here is where you call the relevant viz function
  //make svg opacity 0
  console.log('hi');
    document.getElementById("vis").style.visibility = "hidden"; 
});




//songVis is the name of the vis
var songVisScene = new ScrollMagic.Scene({
  triggerElement: '#songVis',
  duration: 300
})
.addTo(controller); // Add Scene to ScrollMagic Controller

songVisScene.on("enter", function(){
  //here is where you call the relevant viz function
  console.log('hi1');
  document.getElementById("vis").style.visibility = "visible"; 
  songVis(songInfo);
      sideInfo.html("<p class=\"info-text\">Hover over a square to see the song</p>");
});


  //featureVis
var featureVisScene = new ScrollMagic.Scene({
  triggerElement: '#featureVis'
    
})
.addTo(controller); // Add Scene to ScrollMagic Controller

featureVisScene.on("enter", function(){
  //here is where you call the relevant viz function
  featureVis(songData);
    sideInfo.html("<p class=\"info-text\">Hover over a square to see the artist</p>");

  console.log('hi2');});




//lyricVis
var lyricVisScene = new ScrollMagic.Scene({
  triggerElement: '#lyricVis'
  })
  .addTo(controller); // Add Scene to ScrollMagic Controller

lyricVisScene.on("enter", function(){
  //here is where you call the relevant viz function
  vis.selectAll('rect')
    .transition()
    .duration(1200)
    .attr('opacity',0)
    .remove();

  circleVis(lyricDataset);

  sideInfo.html("<p class=\"info-text\">Each bubble is a word. Hover over one to see how many times its said!</p>");

  console.log('hi3');});

lyricVisScene.on("leave", function(){
  console.log("leaving");
  var circles = vis.selectAll('circle').enter();
  circles.transition()
  .duration(1500)
    .attr("opacity",0);


  // vis.selectAll('rect')
  // .attr('opacity',0)
  // .transition().duration(200)
  // .attr('opacity',1.0);

  featureVis(songData);

  
})