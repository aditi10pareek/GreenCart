// Initialize Lucide Icons
lucide.createIcons();

let PRODUCTS = [];
let cartItems = [];

// Initialize Cart from localStorage
function initCart() {
    const storedCart = localStorage.getItem('greenCart');
    if (storedCart) {
        cartItems = JSON.parse(storedCart);
    }
}

// Function to render products
function renderProducts(productsToRender = PRODUCTS) {
    const container = document.getElementById('product-list');
    if (!container) return;

    container.innerHTML = productsToRender.map(prod => {
        // Check if item is in cart to determine what buttons to show
        const cartItem = cartItems.find(item => item.id === prod.id);
        const quantity = cartItem ? cartItem.quantity : 0;
        
        const actionHTML = quantity > 0 
            ? `<div class="card-qty-controls">
                 <button class="qty-btn" onclick="updateQuantity(${prod.id}, -1)">-</button>
                 <span class="qty-val">${quantity}</span>
                 <button class="qty-btn" onclick="updateQuantity(${prod.id}, 1)">+</button>
               </div>`
            : `<button class="add-btn" onclick="addToCart(${prod.id})">ADD</button>`;

        return `
    <div class="product-card">
      ${prod.badge ? `<div class="product-badge">${prod.badge}</div>` : ''}
      <div class="product-img-wrapper">
        <img src="${prod.image}" alt="${prod.name}">
      </div>
      <div class="eco-indicator">
        <i data-lucide="leaf" style="width: 14px; height: 14px; color: var(--brand-green); fill: var(--brand-green);"></i>
        <span class="eco-score-pill">Eco ${prod.ecoScore}</span>
      </div>
      <h3 class="product-name">${prod.name}</h3>
      <p class="product-weight">${prod.weight}</p>
      <div class="product-footer">
        <div class="price-stack">
          <div class="product-price">₹${prod.price}</div>
          <div class="carbon-saved">-${prod.carbonSaved} CO2</div>
        </div>
        ${actionHTML}
      </div>
    </div>
  `}).join('');

    lucide.createIcons();
}

// Fetch JSON using AJAX (fetch API) and Render on Load
document.addEventListener('DOMContentLoaded', async () => {
    initCart(); // Load cart on startup

    try {
        const response = await fetch('products.json');
        PRODUCTS = await response.json(); 
        
        // This calculates totals AND calls renderProducts() for the first time
        updateCartUI(); 
    } catch (error) {
        console.error('Error loading product data from JSON:', error);
        document.getElementById('product-list').innerHTML = '<p>Error loading products from database.</p>';
    }
});

// --- CART LOGIC (JavaScript + jQuery) ---

window.addToCart = function(productId) {
    const product = PRODUCTS.find(p => p.id === productId);
    if(product) {
        const existingItem = cartItems.find(item => item.id === productId);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cartItems.push({ ...product, quantity: 1 });
        }
        saveCart();
        updateCartUI();
        // Removed auto-open sidebar so it doesn't pop out automatically!
    }
};

window.updateQuantity = function(productId, change) {
    const item = cartItems.find(item => item.id === productId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            window.removeFromCart(productId);
        } else {
            saveCart();
            updateCartUI();
        }
    }
};

window.removeFromCart = function(productId) {
    // Filter out item entirely
    cartItems = cartItems.filter(item => item.id !== productId);
    saveCart();
    updateCartUI();
};

function saveCart() {
    localStorage.setItem('greenCart', JSON.stringify(cartItems));
}

function updateCartUI() {
    let totalItems = 0;
    let totalPrice = 0;
    let totalCO2 = 0; 

    const cartContainer = $('#cart-items-container');
    cartContainer.empty(); 

    if (cartItems.length === 0) {
        cartContainer.append('<div class="empty-cart-msg">Your cart is currently empty.</div>');
    } else {
        cartItems.forEach((item) => {
            totalItems += item.quantity;
            totalPrice += (item.price * item.quantity);
            
            const co2Num = parseFloat(item.carbonSaved.replace('kg', ''));
            if(!isNaN(co2Num)) totalCO2 += (co2Num * item.quantity);

            cartContainer.append(`
                <div class="cart-item">
                    <img src="${item.image}" alt="${item.name}" class="cart-item-img">
                    <div class="cart-item-details">
                        <div class="cart-item-title">${item.name}</div>
                        <div class="cart-item-actions">
                            <span class="cart-item-price">₹${item.price}</span>
                            <div class="card-qty-controls" style="padding: 2px 6px;">
                                <button class="qty-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                                <span class="qty-val">${item.quantity}</span>
                                <button class="qty-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                            </div>
                        </div>
                        <div class="cart-item-actions" style="margin-top: 8px;">
                            <span class="cart-item-co2">-${(parseFloat(item.carbonSaved.replace('kg', '')) * item.quantity).toFixed(1)}kg CO₂ Saved</span>
                            <button class="remove-btn" onclick="removeFromCart(${item.id})">Remove</button>
                        </div>
                    </div>
                </div>
            `);
        });
    }

    // 1. Update Badge Count in Navbar
    $('#cart-count').text(totalItems);

    // 2. Update Text Totals in panel
    $('#cart-total-price').text(`₹${totalPrice}`);
    $('#cart-total-co2').text(`${totalCO2.toFixed(1)}kg`);
    
    // 3. Update the top banner dynamically
    if (totalCO2 > 0) {
        $('#co2-saved').text(`${(12.4 + totalCO2).toFixed(1)}kg of CO2`);
        
        // --- REAL-TIME PROGRESS BAR MATH ---
        const sessionGoal = 2.0; // 2.0kg Goal
        let progressPercentage = (totalCO2 / sessionGoal) * 100;
        
        // Don't let the bar go past 100% visually
        const visualPercentage = progressPercentage > 100 ? 100 : progressPercentage;
        
        // Change the width of the green bar
        $('#tracker-fill').css('width', `${visualPercentage}%`);
        
        // Update the text numbers
        $('#tracker-percentage').text(`${progressPercentage.toFixed(0)}%`);
        
        if (progressPercentage >= 100) {
             $('#live-footprint-tracker').html(`🎉 <strong style="color:var(--brand-green-dark)">Goal Reached!</strong> You saved ${totalCO2.toFixed(1)}kg today.`);
        } else {
             $('#live-footprint-tracker').html(`Keep going! You've saved <strong style="color:var(--brand-green-dark)">${totalCO2.toFixed(1)}kg</strong> today.`);
        }
        
    } else {
        $('#co2-saved').text(`12.4kg of CO2`);
        
        // Reset the Progress Bar if cart is emptied
        $('#tracker-fill').css('width', `0%`);
        $('#tracker-percentage').text(`0%`);
        $('#live-footprint-tracker').html(`Add eco-friendly items to fill the bar!`);
    }

    // 4. Re-render products to show the updated ADD or +/- buttons
    const searchBar = document.querySelector('.search-bar');
    let productsToRender = PRODUCTS;
    if (searchBar && searchBar.value) {
        productsToRender = PRODUCTS.filter(prod => 
            prod.name.toLowerCase().includes(searchBar.value.toLowerCase())
        );
    }
    renderProducts(productsToRender);
}

// jQuery Sidebar Toggle Logic
$(document).ready(function() {
    $('#cart-btn').click(function() {
        $('#cart-sidebar').addClass('active');
        $('#cart-overlay').addClass('active');
    });

    $('#close-cart, #cart-overlay').click(function() {
        $('#cart-sidebar').removeClass('active');
        $('#cart-overlay').removeClass('active');
    });
});

// Simple search simulation using the JSON data
const searchBar = document.querySelector('.search-bar');
if (searchBar) {
    searchBar.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const filteredProducts = PRODUCTS.filter(prod => 
            prod.name.toLowerCase().includes(searchTerm)
        );
        renderProducts(filteredProducts);
    });
}

// --- CHECKOUT LOGIC (Feature 6, 7, 12, 13) ---

// This function specifically populates the Checkout Page Summary
window.calculateCheckout = function() {
    // Only run if on checkout page
    if(!document.getElementById('checkout-items')) return;
    
    const checkoutContainer = $('#checkout-items');
    checkoutContainer.empty();
    
    let subtotal = 0;
    let totalCO2 = 0;
    
    if(cartItems.length === 0) {
        checkoutContainer.html('<p style="color:red; font-size: 0.9rem;">Your cart is empty. Please add items to checkout.</p>');
        $('.place-order-btn').prop('disabled', true).css('opacity', '0.5');
        return;
    }

    // Render tiny summary items
    cartItems.forEach(item => {
        subtotal += (item.price * item.quantity);
        const co2Num = parseFloat(item.carbonSaved.replace('kg', '')) * item.quantity;
        if(!isNaN(co2Num)) totalCO2 += co2Num;
        
        checkoutContainer.append(`
            <div style="display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 0.95rem;">
                <span style="color: var(--text-muted);">${item.quantity}x ${item.name}</span>
                <span style="font-weight: 600;">₹${item.price * item.quantity}</span>
            </div>
        `);
    });

    // Handle Delivery Logic (Feature 13 Validation)
    let deliveryFee = 0;
    let deliveryCO2Penalty = 0;
    const selectedDelivery = $('input[name="deliverySpeed"]:checked').val();
    
    if (selectedDelivery === 'express') {
        deliveryFee = 49;
        deliveryCO2Penalty = 0.8; // Express adds CO2 back
        // Hide the big green box if they choose the dirty option!
        $('#checkout-eco-feedback').hide();
    } else {
        // Green Delivery is free and doesn't penalize
        $('#checkout-eco-feedback').show();
    }

    const grandTotal = subtotal + deliveryFee;
    const finalCO2Saved = (totalCO2 - deliveryCO2Penalty).toFixed(1);

    // Update Checkout UI
    $('#chk-subtotal').text(`₹${subtotal}`);
    $('#chk-delivery-fee').text(deliveryFee === 0 ? 'Free 🌱' : `₹${deliveryFee}`);
    $('#chk-total').text(`₹${grandTotal}`);
    $('#chk-btn-total').text(`₹${grandTotal}`);
    
    // Feature 15: Sustainability Feedback math
    if(finalCO2Saved > 0) {
        $('#chk-co2').text(`${finalCO2Saved}kg`);
    } else {
        $('#checkout-eco-feedback').html('<p style="color:#ef4444; font-size:0.85rem;">Choosing express reduced your net carbon savings to 0.</p>');
    }
};

window.placeOrder = function() {
    if(cartItems.length === 0) return;
    
    // Simulate API Call delay
    $('.place-order-btn').html('<i data-lucide="loader-2" class="spin"></i> Processing...');
    lucide.createIcons();
    
    setTimeout(() => {
        // Clear Cart (Order Successful)
        cartItems = [];
        saveCart();
        
        // Very basic success feedback
        alert("🎉 Order Placed Successfully!\nThank you for choosing GreenCart and saving the planet!");
        window.location.href = 'index.html';
    }, 1500);
};