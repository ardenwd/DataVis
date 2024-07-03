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

var visContainer = document.getElementById("vis");
// var width = +svg.attr('width');
var width = visContainer.width, height = visContainer.height, sizeDivisor = 100, nodePadding = 1.5;

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


//example of how to do mouseover    
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
        .force("forceX", d3.forceX().strength(.1).x(width * .4))
        .force("forceY", d3.forceY().strength(.1).y(height * .5))
        .force("center", d3.forceCenter().x(width * .5).y(height * .5))
        .force("charge", d3.forceManyBody().strength(-3.5));


//load at the start of the program
//process the data
d3.csv('charli.csv', dataPreprocessor).then(function(dataset) {
  lyricDataset = dataset;
  //load the json file
  d3.json('Lyrics_Charli.json').then(function(data){
    list = data.tracks;
    dataPreprocessorSongs(list);
  });
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

    songInfo.push({name: d.song.title,
    features: d.song.featured_artists}
    );
    
    features=songInfo[i].features;
    features.forEach((d) => {featuresBySong.push(d.name);});
    songInfo[i].features=featuresBySong;
  });
}

function lyricVis(dataset){

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
          .attr("fill", function(d) { return colors(d.Song); });
}

function removeFeatures(){
    vis.selectAll('.byArtist')
  .transition()
  .duration(1500)
      .attr("x", function(d,i){ return d.num * 30; })
      .attr("y", function(d,i){ return height - 170; })
      .remove();
}

function removeSongs(){
    vis.selectAll('.bySong')
      .transition()
      .duration(1500)
      .attr("opacity",0)
      .remove();
}

function removeLyrics(){
  vis.selectAll('circle').transition().duration(400)
    .attr('opacity',0).
    remove();
}

function songVis(data){
  
  var dots = vis.append("g")
      .attr("class", "node")
      .selectAll("rect").data(data);

  var dotsEnter = 
    dots.enter()
      .append('rect')
      .attr("class","bySong")
      .attr("width", 15)
      .attr("height", 15)
      .attr("fill", function(d,i){ 
        return colorScale[i];})
      .attr("y", function(d,i){ return i *20; })
      .attr("x", function(d,i){ return height - 170; })
      .attr("opacity", " 0.8");

    //make the dots appear slowly
    dotsEnter
      .attr("opacity","0")
      .transition()
      .duration(1200)
      .attr("opacity","0.6");

      dotsEnter
          .on("mouseover", function(event,d){
            var[x,y] = d3.pointer(event);
            nameText.text(d.name)
            .style("fill", "#f1ede9")
            .attr("x",x + 20 )
            .attr("y", (y +20));
          })
          // .on("mousemove", mousemove)
           .on("mouseleave", function(){
            nameText.text(" ");
           });
}

function songVisOld(data){
  
  var dots = vis.append("g")
      .attr("class", "node")
      .selectAll("rect").data(data);

  var dotsEnter = 
    dots.enter()
      .append('rect')
      .attr("class","bySong")
      .attr("width", 20)
      .attr("height", 20)
      .attr("fill", function(d,i){ 
        return colorScale[i];})
      .attr("x", function(d,i){ return i *30; })
      .attr("y", function(d,i){ return height - 170; });

    //make the dots appear slowly
    dotsEnter
      .attr("opacity","0")
      .transition()
      .duration(1200)
      .attr("opacity","1.0");

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
}

function featureVis(data){
  //scatter plot of the song x artists (x,y), charli as 1, 2 is the next, 3 troye, etc
removeLyrics();
 
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

/*Set up scroller
*
*   YAY!
*/

var controller = new ScrollMagic.Controller();


//songVis is the name of the vis
var songVisScene = new ScrollMagic.Scene({
  triggerElement: '#songVis',
  triggerHook: 0.15, 
  duration: 200
})
.setPin("#songText")
.addTo(controller); // Add Scene to ScrollMagic Controller

songVisScene.on("enter", function(){
  console.log('song at top');
  removeFeatures();
  });


songVisScene.on("leave", function(){
  console.log('song at top leaving');
});

//songVis is the name of the vis
var songVisSceneMid = new ScrollMagic.Scene({
  triggerElement: '#songVis',
  triggerHook: 0.6
  // duration: 300
})
.addTo(controller); // Add Scene to ScrollMagic Controller

songVisSceneMid.on("enter", function(){
  console.log('song at mid');
  // document.getElementById("vis").style.visibility = "visible"; 
    vis.attr("opacity","0") 
    .transition()
    .duration(1000)
    .attr("opacity","1.0") ;
  songVis(songInfo);});

songVisSceneMid.on("leave", function(){
  removeSongs();
  console.log('song at mid exit');
  });


  //featureVis
  //we want to stick for 100px when this element is at 0, and for side text to appear
  // and we want to call the function for the animation at 200
var featureVisScene = new ScrollMagic.Scene({
  triggerElement: '#featureVis',
  triggerHook: 0.15, 
  duration: 200
})
.setPin("#featureText")
.addTo(controller); // Add Scene to ScrollMagic Controller

featureVisScene.on("enter", function(){
  
  console.log('feature at top');});

  featureVisScene.on("leave", function(){
    console.log('feature at top leaving');
  });



  //featureVis midPoint
var featureVisSceneMid = new ScrollMagic.Scene({
  triggerElement: '#featureVis',
  triggerHook: 0.6
    
})
.addTo(controller); // Add Scene to ScrollMagic Controller

featureVisSceneMid.on("enter", function(){
  featureVis(songData);
  console.log('feature at mid');});


featureVisSceneMid.on("leave", function(){
  //make the artists disappear

  console.log('feature at mid leaving');});

  //lyricVis
  //we want to stick for 100px when this element is at 0, and for side text to appear
  // and we want to call the function for the animation at 200
var lyricVisScene = new ScrollMagic.Scene({
  triggerElement: '#lyricVis',
  triggerHook: 0.15, 
  duration: 200
})
.setPin("#lyricText")
.addTo(controller); // Add Scene to ScrollMagic Controller

lyricVisScene.on("enter", function(){

  console.log('lyric at top');});

    lyricVisScene.on("leave", function(){
    console.log('lyric at top leaving');
  });

  //lyricVis midPoint
var lyricVisSceneMid = new ScrollMagic.Scene({
  triggerElement: '#lyricVis',
  triggerHook: 0.6
    
})
.addTo(controller); // Add Scene to ScrollMagic Controller

lyricVisSceneMid.on("enter", function(){
  //make the squares disappear
  removeFeatures();
  removeSongs();
  // lyricVis(lyricDataset);
  console.log('lyric at mid');});


lyricVisSceneMid.on("leave", function(){
  //make the artists disappear
  
  featureVis(songData);
  songVis(songInfo);
  console.log('lyric at mid leaving');});

