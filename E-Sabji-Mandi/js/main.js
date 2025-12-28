let cart = JSON.parse(localStorage.getItem('esabji_cart')) || [];

function init() {
    renderProducts(products);
    updateHeader();
}

function renderProducts(items) {
    const grid = document.getElementById('product-grid');
    if (!grid) return;
    
    grid.innerHTML = items.map(p => {
        const inCart = cart.find(item => item.id === p.id);
        const qty = inCart ? inCart.quantity : 0;
        
        return `
            <div class="product-card">
                <div style="height:100px; background:${p.color}; border-radius:10px; margin-bottom:10px; display:flex; align-items:center; justify-content:center; color:white; font-weight:bold; font-size:2rem;">${p.name[0]}</div>
                <h3 style="margin:5px 0;">${p.name}</h3>
                <p style="color:gray; margin-bottom:10px;">₹${p.price} / ${p.unit}</p>
                <div id="btn-container-${p.id}">
                    ${qty > 0 ? renderQtyControls(p.id, qty) : `<button class="add-btn" onclick="addToCart(${p.id})">ADD</button>`}
                </div>
            </div>
        `;
    }).join('');
}

function addToCart(id) {
    const product = products.find(p => p.id === id);
    if (!product) return;
    
    cart.push({ ...product, quantity: 1 });
    saveAndRefresh();
}

function updateQty(id, delta) {
    const index = cart.findIndex(item => item.id === id);
    if (index === -1) return;
    
    cart[index].quantity += delta;
    if (cart[index].quantity <= 0) cart.splice(index, 1);
    saveAndRefresh();
}

function renderQtyControls(id, qty) {
    return `
        <div class="qty-controls">
            <button class="qty-btn" onclick="updateQty(${id}, -1)">−</button>
            <span style="font-weight:bold;">${qty}</span>
            <button class="qty-btn" onclick="updateQty(${id}, 1)">+</button>
        </div>
    `;
}

function saveAndRefresh() {
    localStorage.setItem('esabji_cart', JSON.stringify(cart));
    renderProducts(products);
    updateHeader();
}

function updateHeader() {
    const cartStatus = document.getElementById('cart-status');
    if (!cartStatus) return;
    
    const total = cart.reduce((sum, item) => {
        const itemPrice = parseFloat(item.price) || 0;
        const itemQty = parseInt(item.quantity) || 0;
        return sum + (itemPrice * itemQty);
    }, 0);
    
    cartStatus.innerHTML = `🛒 ₹${total.toFixed(0)}`;
}

// Redirect Functions
function openInstagram() {
    window.open('https://www.instagram.com/e_sabjimandi', '_blank');
}

function contactWhatsApp() {
    window.open('https://wa.me/919109679553', '_blank');
}

function handleSearch(query) {
    const q = query.toLowerCase().trim();
    const filtered = products.filter(p => 
        p.name.toLowerCase().includes(q) || 
        (p.keywords && p.keywords.some(k => k.toLowerCase().includes(q)))
    );
    renderProducts(filtered);
}

window.onload = init;
// Sidebar Filter Logic
function filterCategory(cat) {
    if (cat === 'All') {
        renderProducts(products);
    } else {
        const filtered = products.filter(p => p.category === cat);
        renderProducts(filtered);
    }
}

// Reorder Logic for Profile Page
function reorder(previousItems) {
    // previousItems would be an array of IDs from a past order
    previousItems.forEach(id => {
        const product = products.find(p => p.id === id);
        if (product) {
            addToCart(product.id);
        }
    });
    window.location.href = 'cart.html';
}
