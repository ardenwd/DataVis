var colorScale = ["#1e6cc0", "#5a6cc4", "#806bc3", "#a069bf", "#bb68b8", "#d268af", "#e56aa3", "#f46f96",
                "#ff7a85", "#ff8a73", "#ff9d63", "#ffb356", "#fdc950", "#ebdf56", "#d2f468"];

var colors = d3.scaleOrdinal(["#1e6cc0", "#5a6cc4", "#806bc3", "#a069bf", "#bb68b8", "#d268af", "#e56aa3", "#f46f96",
                "#ff7a85", "#ff8a73", "#ff9d63", "#ffb356", "#fdc950", "#ebdf56", "#d2f468"]);

var pastelColors = ["#4B89CD", "#7B89D0", "#9989CF", "#C48BE5", "#C986C6", "#DB86BF", "#EA88B5", "#EC88A6", "#FF959D", "#FFA18F", "#FFB182", "#FFC278", "#FFD97E", "#EFE578", "#DBF686"];
var songInfo = [];
var songData = [];
var wordTotals = [];
var list = [];
var data;
var spotify_data;
var max_duration = 0;
var durationScale;
var songNameBars;
var featuresList=[];

var lyricDataset;

var visContainer = document.getElementById("vis");
var sizeDivisor = 100, nodePadding = 1.5;
var nodes = [{},{},{}];
var padding = {t: 40, r: 40, b: 40, l: 40};
//square size
var s = 17;
var sSpacing = 1.25;
var leftAlign = 0;


var svg = d3.select("#vis")
    .append("svg")
    .attr("id","svg")
     .attr("viewBox", "0 0 700 500");
     var width = 700;
    //  (document.getElementById("svg").clientWidth);
     var height = 500;
    //  (document.getElementById("svg").clientWidth );


    svg.attr("height", height)
      .attr("width", width);


// svg.append('img').attr("href", "img/charli-brat.png");


var middleIsh  = width/2 + 10;

var vis = svg.append('g');
    // .attr('transform', 'translate('+[padding.l,padding.t]+')');
// create a tooltip

var nameText = vis.append('text')
  .attr("class","nameText")
  .text("");

var durationToolTip = svg.append('g').attr("opacity",0);

var durationToolTipRect = durationToolTip.append('rect')
  .attr("class","durationToolTip")
  .attr("fill", "#fff")
  .attr("width", 40)
  .attr("height", 20);
  //fill,height,width,stroke;

var durationToolTipText = durationToolTip.append('text')
  .attr("class","durationToolTipText")
  .attr("z-index", 4)
  .text("");

  

var artistToolTip = svg.append('g').attr("opacity",0);

var artistToolTipRect = artistToolTip.append('rect')
  .attr("class","artistToolTip")
  .attr("fill", "#fff")
  .attr("height", 24)
  .attr("width", 170);
  //fill,height,width,stroke;

var artistToolTipText = artistToolTip.append('text')
  .attr("class","artistToolTipText")
  .attr("z-index", 4)
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
    console.log(list);
    dataPreprocessorSongs(list);
  });
});

 //load spotify file
  d3.json('charli_spotify.json').then(function(values){
    spotify_data = processSpotifyData(values);
  });

function processSpotifyData(data){
  max_duration = 0;
  //compute duration in seconds
  data.forEach((d,i) => {
    const duration = d.duration_ms;
    data[i].duration = convertMsToMinutesSeconds(duration);
    if(duration > max_duration) {max_duration = duration};
  });

  // make some scales
durationScale = d3.scaleLinear([0, max_duration],[0, 390]);  // The range is the visual space (in pixels)

  return data;
}
function convertMsToMinutesSeconds(ms) {
    // Convert milliseconds to total seconds
    let totalSeconds = Math.floor(ms / 1000);
    
    // Calculate minutes and seconds
    let minutes = Math.floor(totalSeconds / 60);
    let seconds = totalSeconds % 60;
    
    // Return the result as a string in "mm:ss" format, with leading zeros if needed
    return minutes + ":" + (seconds < 10 ? "0" + seconds : seconds);
}

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
  console.log(data);
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

    featuresBySong.push("Charli XCX");
    features.forEach((d) => {featuresBySong.push(d.name);});
    songInfo[i].features=featuresBySong;

    featuresList.push(songInfo[i].features);
    
  
  });  
}





function lyricVis(dataset){
  console.log("lyricVis");

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
  console.log("removeFeatures");

    svg.selectAll('.by-artist')
      // .attr("transition-timing-function","ease-out")
      .transition()
      .duration(1200)
      .attr("x", function(d,i){ return 250; })
      // .attr("width", 0)
      .remove();
}

function removeSongs(){
  console.log("removeSongs");
    vis.selectAll('.by-song')
      .transition()
      .duration(1500)
      .attr("opacity",0)
      .remove();
}

function removeLyrics(){
  console.log("removeLyrics");
  vis.selectAll('circle').transition().duration(400)
    .attr('opacity',0).
    remove();
}

function songNameVis(data){
  console.log("songNameVis");
  var dots = vis.append("g")
      .attr("class", "node")
      .selectAll("rect").data(data);

  var dotsEnter = 
    dots.enter()
      .append('text')
      .text(function(d,i ) {return i+1 + ". " + d.name;})
      .attr("class","song-name")
      .attr("fill", function(d,i){ 
        return "#333333";})
        //position in center (x)
      .attr("y", function(d,i){  return i * (sSpacing * s) + 17; })
      .attr("x", function(d,i){ return leftAlign})
      .attr("opacity", "0")
      .transition().duration(500)
        .attr("opacity", "1");

}

function makeNamesColored(){
  console.log("makeNamesColored");
  var names = vis.selectAll(".song-name");
  
  names.attr("background-color", function(d,i){ 
        return hexToRgbOpacity(colorScale[i],0.7);});
}

function removeNames(){
  console.log("removeNames");
  var names = vis.selectAll(".song-name");
  
  names.transition().duration(500)
        .attr("opacity", "0");
}


function songVis(data){
  console.log("songVis");

  var dots = vis.append("g")
      .attr("class", "node")
      .selectAll("rect").data(data);

  var dotsEnter = 
    dots.enter()
      .append('rect')
      .attr("class","by-song")
      .attr("width", s)
      .attr("height", s)
      .attr("fill", "none")
      .attr("stroke", function(d,i){ 
        return colorScale[i];})
        //position in center (x)
      .attr("y", function(d,i){  return i * (sSpacing* s) ; })
      .attr("x", function(d,i){ return middleIsh  - (s/2) -  s*2 ; });

    //make the dots appear slowly
    dotsEnter
      .attr("opacity","0")
      .transition()
      .duration(1200)
      .attr("opacity","0.6");

}

function featureVis(data){
  console.log("featureVis");
  //scatter plot of the song x artists (x,y), charli as 1, 2 is the next, 3 troye, etc
removeLyrics();
var dotsG = svg.append("g")
 data.forEach((v,f)=>{
var dots = dotsG.append("g")
      .selectAll('rect')
      .data(v);

//artist, song name
  var dotsEnter = dots
      .enter()
      .append('rect') 
      .attr("class","by-artist")
      // .attr("width", 0)
          .attr("width",s)
      .attr("height",  s)
      .attr("z-index",1)
      .attr("fill", function(d,i){ 
              if(i!=0){return colorScale[f];}
              else{return pastelColors[f];}})
      .attr("y", function(){return 5 + f * 350/15; })
      .attr("x", function(d,i){ return 250})
      .attr("stroke", function(d,i){ 
          if(i==0){return colorScale[f];}
          else{return "none";}});;
      dotsEnter
      .transition()
      .duration(1200)
          .attr("width",s)
          .attr("y", function(){ return 5+ f * ( 350/15); })
          .attr("x", function(d,i){ return 250  +(i * (350/15)) ; });

          dotsEnter
            .on("mouseover", function(event,d,i){
            var[x,y] = d3.pointer(event);
            
            artistToolTipText
            .attr("x", 170 / 2)  // Center the text horizontally
            .attr("y", 24 / 2 + 1) // Center the text vertically
            .attr("text-anchor", "middle")     // Align text horizontally to center
            .attr("dominant-baseline", "middle") // Align text vertically to middle
            .text(d)
            .attr("z-index", 5);
          
            artistToolTip
              .attr("transform", 'translate('+[x,y]+')')
              .attr("opacity", 1.0)
              
            artistToolTipRect
              .attr("stroke", function() {return colorScale[f]})
              .attr("rx", 7)
              .attr("ry", 7);

          })
          // .on("mousemove", mousemove)
           .on("mouseleave", function(){
              artistToolTip
                .attr("opacity", 0);
           });
 })}


function makeNames(data){
  var namesG = svg.append("g")
    .attr("class", "songNames")
    .attr("transform", 'translate('+ [175,0]+')');


  songNameBars = namesG.append("g")
    .attr("class", "namesRectGroup")
    .selectAll('rect')
    .data(data);

  var barsEnter = songNameBars
    .enter()
    .append('rect') 
    .attr("class","song-bar")
    .attr("height", 350/17.5)
    .attr("width", "350")
    .attr("ry", 10)
    .attr("rx", 10)
    .attr("y", function(d,i){ return (350/15 *i + 1)})
    .attr("fill", "#333")
    .attr("stroke", function(d,i){return colorScale[i]})
    .attr("opacity", 1);

      var dots = namesG.append("g")
      .attr("class", "namesTextGroup")
      .selectAll("text").data(data);

  var dotsEnter = 
    dots.enter()
      .append('text')
      .text(function(d,i ) {return d.name;})
      .attr("class","song-name")
      .attr("fill", "#bababa")
        //position in center (x)
      .attr("x", 8)
      .attr("y", function(d,i){ return (350/15 * (i+1)) -7})
      .attr("opacity", "1");

}


function centerNameBars(){
  //make bars full width
   svg.selectAll(".song-bar")
    .transition()
    .duration(900)
    .attr("width", "350");

    //center whole group
    svg.selectAll('.songNames')
      .transition()
      .duration(900)
      .attr("transform", 'translate('+ [175,0]+')');
}


function shiftNamesLeft(){
  //make bars smaller
  svg.selectAll(".song-bar")
  .transition()
  .duration(900)
  .attr("width", 205);

  svg.selectAll(".songNames")
  .transition()
  .duration(900)
  .attr("transform", 'translate('+ [0,0]+')');;
}

function showLengths(data){
  var cubes = svg.append("g")
    .attr("class","bars")
      .selectAll('rect')
      .data(data);

  var cubesEnter = cubes
      .enter()
      .append('rect')   
      .attr("class","lengths")
      .attr("height",  350/20)
      .attr("width", 0)
      .attr("fill", function(d,i){ 
        return pastelColors[i];})
      .attr("y", function(d,i){ return (350/15 *i) + 2})
      .attr("x", 250);

      cubesEnter
      .transition()
      .duration(1200)
      .attr("width", function(d,i){return durationScale(d.duration_ms);});
  
      cubesEnter
          .on("mouseover", function(event,d,i){

            durationToolTipText
            .text(d.duration)
            .attr("x", 40 / 2)  // Center the text horizontally
            .attr("y", 20 / 2) // Center the text vertically
            .attr("text-anchor", "middle")     // Align text horizontally to center
            .attr("dominant-baseline", "middle") // Align text vertically to middle;
    
            durationToolTip
              .attr("transform", 'translate('+[durationScale(d.duration_ms) + 260, 350/15 *(d.track_number-1) +1 ]+')')
              .attr("opacity", 1.0)
              
            durationToolTipRect
              .attr("stroke", function() {return colorScale[d.track_number-1]})
              .attr("rx", 7)
              .attr("ry", 7);

          })
          // .on("mousemove", mousemove)
           .on("mouseleave", function(){
              durationToolTip
                .attr("opacity", 0);
           });
}

function shrinkLengthBars(){
  var bars = svg.selectAll(".lengths");
  bars.transition().duration(600).attr("width", 0);
}

/*Set up scroller
*
*   YAY!
*/

var controller = new ScrollMagic.Controller();

var albumCoverScene = new ScrollMagic.Scene({
  triggerElement: '#intro3',
  triggerHook: 0.1,
  duration: "120%"
})
.setPin("#charli-cover")
.addTo(controller);

albumCoverScene.on("enter", function(){

  svg.selectAll(".songNames").remove();
});

//make names
var makeNamesScene = new ScrollMagic.Scene({
  triggerElement: '#songVis',
  triggerHook: 0.9,
  duration: 200
})
.addTo(controller);

makeNamesScene.on("enter", function(){
  console.log("making names");
  makeNames(songInfo);
});

var centerNamesScene = new ScrollMagic.Scene({
triggerElement: '#lengthVis',
  triggerHook: 0.95, 
  duration: 200
})
.addTo(controller);

centerNamesScene.on("enter", function(){
  console.log('center names');
  centerNameBars();
  });

var shiftNamesScene = new ScrollMagic.Scene({
triggerElement: '#lengthVis',
  triggerHook: 0.75, 
  duration: 200
})
.addTo(controller);

shiftNamesScene.on("enter", function(){
  console.log('shift names');
  shiftNamesLeft();
  });

//songVis is the name of the vis
var lengthVisScene = new ScrollMagic.Scene({
  triggerElement: '#lengthVis',
  triggerHook: 0.15, 
  duration: 200
})
.setPin("#lengthText")
.addTo(controller); // Add Scene to ScrollMagic Controller

lengthVisScene.on("enter", function(){
  console.log('length at top');
  showLengths(spotify_data);
  shiftNamesLeft();
  });

lengthVisScene.on("leave", function(){
  console.log('length at end');
  shrinkLengthBars();
  //make tooltip invisible
  durationToolTip.attr("opacity", 0);
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
  featureVis(featuresList);
  shiftNamesLeft();
  console.log('feature at top');});

  featureVisScene.on("leave", function(){
    removeFeatures();
    console.log('feature at top leaving');
  });

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
  removeNames();
  // lyricVis(lyricDataset);
  console.log('lyric at mid');});


lyricVisSceneMid.on("leave", function(){
  //make the artists disappear
  
  // featureVis(songData);
  songVis(songInfo);
  console.log('lyric at mid leaving');});