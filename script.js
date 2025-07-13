// Loader logic
window.addEventListener("load", () => {
  document.getElementById("loader").style.display = "none";
});

// Light/Dark Mode Toggle
document.getElementById("modeToggle").addEventListener("click", () => {
  document.body.classList.toggle("dark");
});

// Image enlarge modal logic
const modal = document.getElementById('imageModal');
const modalImg = modal.querySelector('img');

document.querySelectorAll('.enlargeable').forEach(img => {
img.addEventListener('click', () => {
  modal.classList.add('active');
  modalImg.src = img.src;
  modalImg.alt = img.alt || '';
});
});

modal.addEventListener('click', (e) => {
if (e.target === modal) {
  modal.classList.remove('active');
  modalImg.src = '';
}
});

// Hero carousel logic
const carouselImgs = document.querySelectorAll('.carousel-img');
const indicators = document.querySelectorAll('.indicator');
const leftArrow = document.querySelector('.carousel-arrow.left');
const rightArrow = document.querySelector('.carousel-arrow.right');
let currentSlide = 0;
let carouselInterval;

function showSlide(idx) {
carouselImgs.forEach((img, i) => {
  img.classList.toggle('active', i === idx);
});
indicators.forEach((dot, i) => {
  dot.classList.toggle('active', i === idx);
});
currentSlide = idx;
}

function nextSlide() {
showSlide((currentSlide + 1) % carouselImgs.length);
}

function prevSlide() {
showSlide((currentSlide - 1 + carouselImgs.length) % carouselImgs.length);
}

rightArrow && rightArrow.addEventListener('click', () => {
nextSlide();
resetCarouselInterval();
});
leftArrow && leftArrow.addEventListener('click', () => {
prevSlide();
resetCarouselInterval();
});
indicators.forEach((dot, i) => {
dot.addEventListener('click', () => {
  showSlide(i);
  resetCarouselInterval();
});
});

function startCarouselInterval() {
carouselInterval = setInterval(nextSlide, 4000);
}
function resetCarouselInterval() {
clearInterval(carouselInterval);
startCarouselInterval();
}
if (carouselImgs.length > 0) {
startCarouselInterval();
}

// Nav active link logic
const navLinks = document.querySelectorAll('.nav-links a');
function setActiveNavLink() {
navLinks.forEach(link => {
  link.classList.remove('active');
  if (
    (link.getAttribute('href') === 'index.html' && (window.location.pathname.endsWith('index.html') || window.location.pathname === '/' || window.location.pathname === '/index.html')) ||
    (link.getAttribute('href') !== 'index.html' && window.location.pathname.endsWith(link.getAttribute('href')))
  ) {
    link.classList.add('active');
  }
});
}
navLinks.forEach(link => {
link.addEventListener('click', function() {
  navLinks.forEach(l => l.classList.remove('active'));
  this.classList.add('active');
});
});
setActiveNavLink();

// Card link active state logic
const cardLinks = document.querySelectorAll('.card-link');
function setActiveCardLink() {
cardLinks.forEach(link => {
  link.classList.remove('active');
  if (window.location.pathname.endsWith(link.getAttribute('href'))) {
    link.classList.add('active');
  }
});
}
cardLinks.forEach(link => {
link.addEventListener('click', function(e) {
  cardLinks.forEach(l => l.classList.remove('active'));
  this.classList.add('active');
});
});
setActiveCardLink();


// Add to Cart button logic
function getCart() {
return JSON.parse(localStorage.getItem('cart') || '[]');
}
function setCart(cart) {
localStorage.setItem('cart', JSON.stringify(cart));
}

// Loader magic fade-out with 5 second delay
window.addEventListener('load', () => {
const loaderMagic = document.getElementById('loader-magic');
if (loaderMagic) {
  setTimeout(() => {
    loaderMagic.classList.add('hide');
    setTimeout(() => loaderMagic.style.display = 'none', 800);
  }, 1000);
}
});

// Add to Cart logic for all cards
document.addEventListener('DOMContentLoaded', () => {
  // Handle cards with book selectors (notebooks, etc.)
  document.querySelectorAll('.card').forEach(card => {
    const bookSelector = card.querySelector('.book-type-selector');
    const priceDisplay = card.querySelector('.item-rate');
    const addToCartBtn = card.querySelector('.add-to-cart-btn');
    const productImg = card.querySelector('img');
    const productName = card.querySelector('p');

    if (bookSelector && priceDisplay && addToCartBtn) {
      // Update price display when selection changes
      bookSelector.addEventListener('change', () => {
        const selectedOption = bookSelector.options[bookSelector.selectedIndex];
        priceDisplay.textContent = `₹${selectedOption.value}`;
      });

      // Add to cart on button click
      addToCartBtn.addEventListener('click', () => {
        const selectedOption = bookSelector.options[bookSelector.selectedIndex];
        const item = {
          name: selectedOption.dataset.name,
          img: productImg.src,
          price: parseFloat(selectedOption.value),
          quantity: 1
        };

        let cart = getCart();
        const existing = cart.find(i => i.name === item.name);
        if (existing) {
          existing.quantity += 1;
        } else {
          cart.push(item);
        }
        setCart(cart);
        alert(`${item.name} added to cart!`);
      });
    }
    
  
    
    // Handle cards with fixed prices (regional books, etc.)
    else if (addToCartBtn && productImg && productName) {
      addToCartBtn.addEventListener('click', () => {
        // Get data attributes if available, otherwise use DOM elements
        const itemName = addToCartBtn.dataset.name || productName.textContent;
        const itemImg = addToCartBtn.dataset.img || productImg.src;
        const itemPrice = parseFloat(addToCartBtn.dataset.price || priceDisplay.textContent.replace('₹', ''));

        const item = {
          name: itemName,
          img: itemImg,
          price: itemPrice,
          quantity: 1
        };

        let cart = getCart();
        const existing = cart.find(i => i.name === item.name);
        if (existing) {
          existing.quantity += 1;
        } else {
          cart.push(item);
        }
        setCart(cart);
        alert(`${item.name} added to cart!`);
      });
    }

    
  });
});

document.getElementById('siteSearchForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const query = document.getElementById('siteSearchInput').value.trim().toLowerCase();
  const cards = document.querySelectorAll('.cards .card');
  let found = false;

  cards.forEach(card => {
    const text = card.textContent.toLowerCase();
    if (text.includes(query)) {
      card.style.display = '';
      found = true;
    } else {
      card.style.display = 'none';
    }
  });

  // Optionally, show a message if nothing is found
  let noResults = document.getElementById('noResultsMsg');
  if (!found) {
    if (!noResults) {
      noResults = document.createElement('div');
      noResults.id = 'noResultsMsg';
      noResults.textContent = 'No results found.';
      noResults.style.textAlign = 'center';
      noResults.style.margin = '20px';
      document.querySelector('.cards').appendChild(noResults);
    }
  } else if (noResults) {
    noResults.remove();
  }
});

// Optional: Show all cards again when search is cleared
document.getElementById('siteSearchInput').addEventListener('input', function(e) {
  if (!e.target.value.trim()) {
    document.querySelectorAll('.cards .card').forEach(card => {
      card.style.display = '';
    });
    const noResults = document.getElementById('noResultsMsg');
    if (noResults) noResults.remove();
  }
});



// Make sure the DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  const searchInput = document.getElementById('siteSearchInput');
  if (!searchInput) return; // If not on this page, do nothing

  const cards = document.querySelectorAll('.cards .card');

  searchInput.addEventListener('input', function() {
    const filter = searchInput.value.toLowerCase();
    let found = false;

    cards.forEach(card => {
      const text = card.textContent.toLowerCase();
      if (text.includes(filter)) {
        card.style.display = '';
        found = true;
      } else {
        card.style.display = 'none';
      }
    });

    // Optional: show "No results" message
    let noResults = document.getElementById('noResultsMsg');
    if (!found && filter) {
      if (!noResults) {
        noResults = document.createElement('div');
        noResults.id = 'noResultsMsg';
        noResults.textContent = 'No results found.';
        noResults.style.textAlign = 'center';
        noResults.style.margin = '20px';
        document.querySelector('.cards').appendChild(noResults);
      }
    } else if (noResults) {
      noResults.remove();
    }
  });
});
