<script>
  import { gsap } from "gsap";
  import { ScrollTrigger } from "gsap/ScrollTrigger";
  import { onMount } from "svelte";

  gsap.registerPlugin(ScrollTrigger);

  let anim;

  onMount(() => {
    // choose this one
    const anim = gsap.timeline({
      scrollTrigger: {
        trigger: "#img-1",
        start: "top top",
        endTrigger: "#end",
        end: "top bottom",
        pin: true,
        pinSpacing: false,
      },
    });

    //or this one
    // gsap.to("#img-2", {
    //   bottom:0%,
    //   // scroll trigger
    //   scrollTrigger: {
    //     trigger: "#img-1",
    //     start: "top top",
    //     endTrigger: "#end",
    //     end: "top bottom",
    //     pin: true,
    //     pinSpacing: false,
    //   },
    // });

    //but not both
  });
</script>

<main>
  <div class="full-container">
    <div class="container a">
      <img id="img-1" src="img/garden-old-1.jpg" />
    </div>
    <div class="container b">
      <img id="img-2" src="img/garden-new-1.jpg" />
    </div>
  </div>
  <div id="end"></div>
</main>

<style>
  main {
    margin: 0 auto;
    width: 100vw;
  }

  .container {
    width: 100%;
    height: 100vh;
    overflow: hidden;
    position: relative;
  }

  .container img {
    min-width: 100%;
    height: 100%;
    object-fit: contain;
    /* this centers img on the building */
    position: relative;
    left: 47%;
    transform: translateX(-53%);
  }

  .b {
    /* bottom: 0; */
    /* height: 90%; */
    /* top: -30%; */
  }

  #img-2 {
    /* go from bottom: 100% to bottom: 0%
    which would make the whole iamge not show 
    and then eventually show 
    cause it cuts off the top part and not the bottom
    which is what I want*/
    bottom: 0%;
  }

  /* min = for screens bigger than... */
  @media (min-width: 640px) {
    main {
      max-width: 1400px;
    }
  }
</style>
