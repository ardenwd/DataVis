var controller = new ScrollMagic.Controller();


// var scene01 = new ScrollMagic.Scene({
//   triggerElement: '#intro-wrapper', // starting scene, when reaching this element
// //   offset: 10,
//   duration: 300 // pin the element for a total of 400px
// })
// .setPin('#intro-text'); // the element we want to pin

// // Add Scene to ScrollMagic Controller
// controller.addScene(scene01);

var scene2 = new ScrollMagic.Scene({
  triggerElement: '#start-vis'
})
.addTo(controller); // Add Scene to ScrollMagic Controller

scene2.on("enter", function(){console.log('hi');});