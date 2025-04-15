<<<<<<< HEAD

// Mobile Menu Toggle
const hamburger = document.getElementById('hamburger-menu');
const navMenu = document.getElementById('nav-menu');

hamburger.addEventListener('click', () => {
navMenu.classList.toggle('show-menu');
hamburger.classList.toggle('active'); // Add/remove active class for X shape
}); 

// Close menu when clicking outside
document.addEventListener('click', (e) => {
if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
    navMenu.classList.remove('show-menu');
    hamburger.classList.remove('active'); // Remove active class when closing menu
}
});




// Carousel
document.addEventListener('DOMContentLoaded', function() {
    // Make sure Bootstrap is loaded
    if (typeof bootstrap !== 'undefined') {
      // Initialize the carousel with auto-scroll
      const carousel = new bootstrap.Carousel(document.getElementById('cherusCarousel'), {
        interval: 5000, // Time between slides in milliseconds
        wrap: true,
        pause: 'hover'
      });
      
      // Handle play/pause button
      const playPauseBtn = document.getElementById('carouselPlayPause');
      if (playPauseBtn) {
        let isPlaying = true;
        
        playPauseBtn.addEventListener('click', function() {
          if (isPlaying) {
            // Pause the carousel
            carousel.pause();
            playPauseBtn.innerHTML = '<i class="fa-solid fa-play"></i>';
            isPlaying = false;
          } else {
            // Resume the carousel
            carousel.cycle();
            playPauseBtn.innerHTML = '<i class="fa-solid fa-pause"></i>';
            isPlaying = true;
          }
        });
      } else {
        console.error('Play/pause button not found');
      }
    } else {
      console.error('Bootstrap not loaded');
    }
  });
=======

// Mobile Menu Toggle
const hamburger = document.getElementById('hamburger-menu');
const navMenu = document.getElementById('nav-menu');

hamburger.addEventListener('click', () => {
navMenu.classList.toggle('show-menu');
hamburger.classList.toggle('active'); // Add/remove active class for X shape
}); 

// Close menu when clicking outside
document.addEventListener('click', (e) => {
if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
    navMenu.classList.remove('show-menu');
    hamburger.classList.remove('active'); // Remove active class when closing menu
}
});




// Carousel
document.addEventListener('DOMContentLoaded', function() {
    // Make sure Bootstrap is loaded
    if (typeof bootstrap !== 'undefined') {
      // Initialize the carousel with auto-scroll
      const carousel = new bootstrap.Carousel(document.getElementById('cherusCarousel'), {
        interval: 5000, // Time between slides in milliseconds
        wrap: true,
        pause: 'hover'
      });
      
      // Handle play/pause button
      const playPauseBtn = document.getElementById('carouselPlayPause');
      if (playPauseBtn) {
        let isPlaying = true;
        
        playPauseBtn.addEventListener('click', function() {
          if (isPlaying) {
            // Pause the carousel
            carousel.pause();
            playPauseBtn.innerHTML = '<i class="fa-solid fa-play"></i>';
            isPlaying = false;
          } else {
            // Resume the carousel
            carousel.cycle();
            playPauseBtn.innerHTML = '<i class="fa-solid fa-pause"></i>';
            isPlaying = true;
          }
        });
      } else {
        console.error('Play/pause button not found');
      }
    } else {
      console.error('Bootstrap not loaded');
    }
  });
>>>>>>> 55ab0c834844f83d63778b7748fcba4baaa0b6af
