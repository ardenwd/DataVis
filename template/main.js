var controller = new ScrollMagic.Controller();

//once approached, the graphic will always be on the screen
//in order to change the graphic, edit its contents using a function
//call the function when you hit another scene element/div
var graphic = d3.select("#graphic");


//appened and make a group to hold all the elements in your svg
//make any transformations to the svg element or this group to affect all children
graphic
    .append('g');
    
var g = graphic.select('g');

var step1 = new ScrollMagic.Scene({
    triggerElement: "#step1",
    // offset: 50,
    duration: 800
    })
    .setPin("#step1")
    //.addIndicators() // add indicators (requires plugin)
    .addTo(controller);

step1.on("enter",function(){
    console.log("step1!");
    graphic.attr("visibility","hidden");
})
 
var step2 = new ScrollMagic.Scene({
        triggerElement: "#step2",
       // offset: 150,
        duration: 700
    })
    .setPin("#step2")
    //.addIndicators() // add indicators (requires plugin)
    .addTo(controller);

step2.on("enter",function(){
    console.log("step2!");
    graphic.attr("visibility","visible");
})

var step3 = new ScrollMagic.Scene({
        triggerElement: "#step3",
       // offset: 150,
        duration: 700
    })
    .setPin("#step3")
    //.addIndicators() // add indicators (requires plugin)
    .addTo(controller);

step3.on("enter",function(){
    console.log("step3!");
})

