// Global cart array to store items added to the cart
let cart = [];

// Function to filter products by category
function filterProducts(category) {
    const products = document.querySelectorAll('.product');
    
    products.forEach(product => {
        const productCategory = product.getAttribute('data-category');
        
        if (category === 'all' || productCategory === category) {
            product.style.display = 'block';
        } else {
            product.style.display = 'none';
        }
    });
}

// Add event listener to the category dropdown
document.querySelector('.sort-category').addEventListener('change', function() {
    const selectedCategory = this.value;
    filterProducts(selectedCategory);
});

// Function to open the popup and show size options based on category
function showPopup(product) {
    const popup = product.querySelector('.product-popup');
    const sizeSelect = popup.querySelector('.size-select');
    
    // Clear the current size options
    sizeSelect.innerHTML = '';

    // Set size options based on category
    const category = product.getAttribute('data-category');
    
    if (category === 'shoes') {
        for (let size = 1; size <= 12; size++) {
            const sizeOption = document.createElement('option');
            sizeOption.value = size;
            sizeOption.textContent = size;
            sizeSelect.appendChild(sizeOption);
        }
    } else if (category === 'beanies' || category === 'hats') {
        const sizeOption = document.createElement('option');
        sizeOption.value = 'One Size';
        sizeOption.textContent = 'One Size';
        sizeSelect.appendChild(sizeOption);
    } else {
        ['XS', 'S', 'M', 'L', 'XL', 'XXL'].forEach(size => {
            const sizeOption = document.createElement('option');
            sizeOption.value = size;
            sizeOption.textContent = size;
            sizeSelect.appendChild(sizeOption);
        });
    }

    popup.style.display = 'block'; // Show the popup
    document.body.classList.add('popup-open'); // Disable background scrolling
}

// Function to close the popup
function closePopup() {
    const popups = document.querySelectorAll('.product-popup');
    popups.forEach(popup => {
        popup.style.display = 'none'; // Hide the popup
    });
    document.body.classList.remove('popup-open'); // Re-enable background scrolling
}

// Function to add the selected product to the cart
function addToCart(popup) {
    const title = popup.querySelector('.popup-title').textContent;
    const priceText = popup.querySelector('.popup-price').textContent;
    const size = popup.querySelector('.size-select').value;
    const imageSrc = popup.querySelector('.popup-image').src;

    // Convert price text to a number
    const price = parseFloat(priceText.replace(/[^0-9.-]+/g, ''));

    const cartItem = {
        title,
        price,
        size,
        imageSrc,
    };

    cart.push(cartItem);
    updateCartCount();
    showCart(); // Update the cart display after adding
}

// Function to update the cart count displayed
function updateCartCount() {
    const cartCountElement = document.querySelector('.cart-count');
    cartCountElement.textContent = cart.length;
}

// Function to display the cart items and total amount
function showCart() {
    const cartItemsContainer = document.querySelector('.cart-items');
    cartItemsContainer.innerHTML = ''; // Clear existing items

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p>Your cart is empty!</p>';
    } else {
        let totalAmount = 0; // Initialize total amount
        cart.forEach((item, index) => {
            const cartItemDiv = document.createElement('div');
            cartItemDiv.classList.add('cart-item');
            cartItemDiv.innerHTML = `
                <img src="${item.imageSrc}" alt="${item.title}" />
                <div class="cart-item-info">
                    <h4>${item.title}</h4>
                    <p>$${item.price.toFixed(2)}</p>
                    <p>Size: ${item.size}</p>
                </div>
                <button class="remove-item" data-index="${index}">Remove</button>
            `;
            cartItemsContainer.appendChild(cartItemDiv);
            totalAmount += item.price; // Add price to total amount
        });

        // Display total amount
        const totalAmountDiv = document.createElement('div');
        totalAmountDiv.classList.add('cart-total');
        totalAmountDiv.innerHTML = `<h4>Total: $${totalAmount.toFixed(2)}</h4>`;
        cartItemsContainer.appendChild(totalAmountDiv);
    }

    // Add Proceed to Checkout button
    const proceedButton = document.createElement('button');
    proceedButton.classList.add('proceed-to-checkout');
    proceedButton.textContent = 'Proceed to Checkout';
    proceedButton.addEventListener('click', proceedToCheckout);
    cartItemsContainer.appendChild(proceedButton);

    // Show the cart popup
    const cartPopup = document.querySelector('.cart-popup');
    cartPopup.style.display = 'block'; // Ensure the cart is visible
    document.body.classList.add('popup-open'); // Disable background scrolling when cart is open

    // Add event listeners for remove buttons
    document.querySelectorAll('.remove-item').forEach(button => {
        button.addEventListener('click', function() {
            const index = this.getAttribute('data-index');
            removeFromCart(index);
        });
    });
}

// Function to remove an item from the cart
function removeFromCart(index) {
    cart.splice(index, 1); // Remove the item from the cart array
    updateCartCount(); // Update the cart count
    showCart(); // Refresh the cart display
}

// Function to handle proceeding to checkout
function proceedToCheckout() {
    alert('Proceeding to checkout...');
    closeCart();
}

// Function to close the cart popup
function closeCart() {
    const cartPopup = document.querySelector('.cart-popup');
    cartPopup.style.display = 'none'; // Hide the cart popup
    document.body.classList.remove('popup-open'); // Re-enable background scrolling
}

// Add event listeners for product buttons
document.querySelectorAll('.product-btn').forEach(button => {
    button.addEventListener('click', function() {
        const product = this.closest('.product');
        showPopup(product);
    });
});

// Add event listeners for popup close buttons
document.querySelectorAll('.popup-close').forEach(closeButton => {
    closeButton.addEventListener('click', function() {
        closePopup();
    });
});

// Add event listeners for add to cart buttons in popups
document.querySelectorAll('.add-to-cart').forEach(button => {
    button.addEventListener('click', function() {
        const popup = this.closest('.product-popup');
        addToCart(popup);
        closePopup();
    });
});

// Add event listener to close popups when clicking outside
window.addEventListener('click', function(event) {
    document.querySelectorAll('.product-popup').forEach(popup => {
        if (event.target === popup) {
            closePopup();
        }
    });
});

// Add event listener to show the cart when clicked
document.querySelector('.cart').addEventListener('click', showCart);

// Close the cart popup
document.querySelector('.popup-close.cart').addEventListener('click', closeCart);

// Rating system functionality
document.querySelectorAll('.star').forEach(star => {
    star.addEventListener('click', function() {
        const value = this.getAttribute('data-value');
        const ratingContainer = this.closest('.product-rating');
        const stars = ratingContainer.querySelectorAll('.star');
        stars.forEach(star => {
            star.classList.remove('active');
        });
        for (let i = 0; i < value; i++) {
            stars[i].classList.add('active');
        }
        const averageRating = ratingContainer.querySelector('.average-rating');
        averageRating.textContent = value; // Update the average rating to the selected value
    });
});
