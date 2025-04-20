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




    // Initialize tooltips
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
    const tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl)
    })
    
    // Quick View Modal
    document.querySelectorAll('.quick-view-btn').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const card = this.closest('.product-card');
            const productTitle = card.querySelector('.card-title').textContent;
            const productPrice = card.querySelector('.product-price').textContent;
            
            document.getElementById('modalProductTitle').textContent = productTitle;
            document.getElementById('modalProductPrice').textContent = productPrice;
            
            const modal = new bootstrap.Modal(document.getElementById('quickViewModal'));
            modal.show();
        });
    });
    
    // Wishlist toggle
    document.querySelectorAll('.wishlist-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const icon = this.querySelector('i');
            if (icon.classList.contains('far')) {
                icon.classList.remove('far');
                icon.classList.add('fas');
                icon.style.color = '#dc3545';
            } else {
                icon.classList.remove('fas');
                icon.classList.add('far');
                icon.style.color = '';
            }
        });
    });
    
    // Add to cart functionality
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', function() {
            const card = this.closest('.product-card');
            const productTitle = card.querySelector('.card-title').textContent;
            const productPrice = card.querySelector('.product-price').textContent;
            
            //  update your cart state/storage
            console.log(`Added to cart: ${productTitle} - ${productPrice}`);
            
            // Show toast notification
            const toast = new bootstrap.Toast(document.getElementById('cartToast'));
            toast.show();
            
            // Animate button
            this.innerHTML = '<i class="fas fa-check me-2"></i>Added';
            this.classList.remove('btn-warning');
            this.classList.add('btn-success');
            
            setTimeout(() => {
                this.innerHTML = 'Add to Cart';
                this.classList.remove('btn-success');
                this.classList.add('btn-warning');
            }, 2000);
        });
    });
    
    // Quantity controls in modal
    document.getElementById('decreaseQuantity').addEventListener('click', function() {
        const input = document.getElementById('quantityInput');
        const value = parseInt(input.value);
        if (value > 1) {
            input.value = value - 1;
        }
    });
    
    document.getElementById('increaseQuantity').addEventListener('click', function() {
        const input = document.getElementById('quantityInput');
        const value = parseInt(input.value);
        input.value = value + 1;
    });
    
    // Filter functionality
    document.querySelectorAll('.btn-group button').forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            document.querySelectorAll('.btn-group button').forEach(btn => {
                btn.classList.remove('active');
            });
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Get category value
            const category = this.getAttribute('data-category');
            console.log(`Filtering by: ${category}`);
            
            //  TODO: filter products by category
            // For demo purposes, we'll just log the category
        });
    });
    
    // Load more functionality
    document.getElementById('loadMoreBtn').addEventListener('click', function() {
        // Show loading spinner
        this.style.display = 'none';
        document.getElementById('loader').style.display = 'block';
        
        // Simulate loading delay
        setTimeout(() => {
            // Hide loading spinner
            document.getElementById('loader').style.display = 'none';
            this.style.display = 'inline-block';
            
            // TODO: load more products via AJAX
            // For demo purposes, we'll show a message
            alert('More products would load here from your database');
        }, 1500);
    });


