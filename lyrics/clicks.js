document.addEventListener("DOMContentLoaded", function () {
  function setupGallery(galleryId) {
    const items = document.querySelectorAll(`#${galleryId} .gallery-img`);
    container = items[0];
    const dotsWrapper = document.querySelectorAll(`#${galleryId} .gallery-dot`);

    let currentIndex = 0;

    // Initially show only the first item
    items.forEach((item, index) => {
      if (index !== currentIndex) {
        item.classList.add("hidden");
        dotsWrapper[index].classList.remove("active");
      } else {
        item.classList.remove("hidden");
        dotsWrapper[index].classList.add("active");
      }

      //same index of the dots array
      //filled or empty
    });

    // Function to show the next item
    function showNext() {
        items[currentIndex].classList.add("hidden");
        dotsWrapper[currentIndex].classList.remove("active");
        currentIndex += 1;
        currentIndex %=3;
        items[currentIndex].classList.remove("hidden");
        dotsWrapper[currentIndex].classList.add("active");
        items[currentIndex].addEventListener("click", showNext);
        items[currentIndex].addEventListener("touchend", showNext);

        
      
    }

    // Add click and touchend event listener to the current item
    items[currentIndex].addEventListener("click", showNext);
    items[currentIndex].addEventListener("touchend", showNext);
  }

  function updateSize() {  
    const dotContainer = document.querySelectorAll('.dots-wrapper');
    const img = document.querySelector('.gallery-img');

    console.log(img.width);

    dotContainer.forEach((cont, index) => {
      const width = img.offsetWidth;
      dotContainer[index].style.width = width + 'px';
    });

    // const items = document.querySelectorAll(`.gallery-img`);
    // container = items[0];
    // const dotsWrapper = document.querySelectorAll(`#dots-wrapper`);
    // console.log(dotsWrapper);
    // dotsWrapper.style.width = container.width  + 'px';
  }


  // Set up both galleries and fix sizes
  setupGallery("gallery1");
  setupGallery("gallery2");
  updateSize();

  
  window.addEventListener('resize', updateSize);

});
