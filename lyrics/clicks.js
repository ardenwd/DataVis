document.addEventListener("DOMContentLoaded", function () {
  function setupGallery(galleryId) {
    const items = document.querySelectorAll(`#${galleryId} .gallery-img`);
    let currentIndex = 0;

    // Initially show only the first item
    items.forEach((item, index) => {
      if (index !== currentIndex) {
        item.classList.add("hidden");
      } else {
        item.classList.remove("hidden");
      }
    });

    // Function to show the next item
    function showNext() {
        items[currentIndex].classList.add("hidden");
        currentIndex += 1;
        currentIndex %=3;
        items[currentIndex].classList.remove("hidden");
        items[currentIndex].addEventListener("click", showNext);
        items[currentIndex].addEventListener("touchend", showNext);
      
    }

    // Add click and touchend event listener to the current item
    items[currentIndex].addEventListener("click", showNext);
    items[currentIndex].addEventListener("touchend", showNext);
  }

  // Set up both galleries
  setupGallery("gallery1");
  setupGallery("gallery2");
});
