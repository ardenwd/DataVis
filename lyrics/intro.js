var controller = new ScrollMagic.Controller();

// var scene01 = new ScrollMagic.Scene({
//   triggerElement: '#intro-wrapper', // starting scene, when reaching this element
// //   offset: 10,
//   duration: 300 // pin the element for a total of 400px
// })
// .setPin('#intro-text'); // the element we want to pin

// // Add Scene to ScrollMagic Controller
// controller.addScene(scene01);

//pin the svg the whole time
var svgVis =  new ScrollMagic.Scene({
  triggerElement: '#vis-1',
  duration: 300
})
.addTo(controller); // Add Scene to ScrollMagic Controller


var start = new ScrollMagic.Scene({
  triggerElement: '#hide-vis',
  // duration: 300
})
.addTo(controller); // Add Scene to ScrollMagic Controller

start.on("enter", function(){
  //here is where you call the relevant viz function
  //make svg opacity 0
  console.log('hi');
  songVis(data);

  //hide what isn't shown this time
  svg2.attr("visibility","hidden");


});


//songVis is the name of the vis
var songVis = new ScrollMagic.Scene({
  triggerElement: '#songVis',
  duration: 300
})
.addTo(controller); // Add Scene to ScrollMagic Controller

songVis.on("enter", function(){
  //here is where you call the relevant viz function
  console.log('hi1');});


//featureVis
var featureVis = new ScrollMagic.Scene({
  triggerElement: '#featureVis'
})
.addTo(controller); // Add Scene to ScrollMagic Controller

featureVis.on("enter", function(){
  //here is where you call the relevant viz function
  console.log('hi2');});

//lyricVis
var lyricVis = new ScrollMagic.Scene({
  triggerElement: '#lyricVis'
  })
  .addTo(controller); // Add Scene to ScrollMagic Controller

lyricVis.on("enter", function(){
  //here is where you call the relevant viz function
  console.log('hi3');});


//so when you get to the next section, change the vis 
