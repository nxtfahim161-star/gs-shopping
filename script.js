// --- GS. SHOPPING CORE JAVASCRIPT (PART 1) ---

const products = [
    // Tops
    { id: 't1', name: 'Silk Draped Overcoat', category: 'tops', price: 480, image: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=800&q=80', desc: 'Hand-crafted Italian silk overcoat designed for fluid kinetic movement.' },
    { id: 't2', name: 'Cashmere Velvet Blazer', category: 'tops', price: 620, image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80', desc: 'Plush cashmere blazer with structured shoulders and minimalist satin lapels.' },
    { id: 't3', name: 'Minimalist Linen Shirt', category: 'tops', price: 290, image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=800&q=80', desc: 'Breathable organic Belgian linen tailored for relaxed summer elegance.' },
    
    // Pants
    { id: 'p1', name: 'Pleated Gravity Trousers', category: 'pants', price: 340, image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=800&q=80', desc: 'High-waisted tailored trousers engineered to sway naturally with pendulum physics.' },
    { id: 'p2', name: 'Wide-Leg Woolen Slacks', category: 'pants', price: 410, image: 'https://images.unsplash.com/photo-1554412933-514a83d2f3c8?auto=format&fit=crop&w=800&q=80', desc: 'Luxurious heavy wool slacks with a fluid architectural drape.' },
    { id: 'p3', name: 'Relaxed Silk Joggers', category: 'pants', price: 310, image: 'https://images.unsplash.com/photo-1516762689617-e16ffcef449d?auto=format&fit=crop&w=800&q=80', desc: 'Refined lounge trousers combining absolute comfort with haute couture aesthetics.' },
    
    // Shoes
    { id: 's1', name: 'Levitating Leather Loafers', category: 'shoes', price: 520, image: 'https://images.unsplash.com/photo-1533867617858-e7d97e06a506?auto=format&fit=crop&w=800&q=80', desc: 'Hand-polished calfskin loafers featuring anti-gravity cushioned insoles.' },
    { id: 's2', name: 'Velvet Evening Slippers', category: 'shoes', price: 450, image: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=800&q=80', desc: 'Rich midnight velvet slippers accented with gold embroidered insignia.' },
    { id: 's3', name: 'Architectural Oxford Boots', category: 'shoes', price: 590, image: 'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?auto=format&fit=crop&w=800&q=80', desc: 'Contemporary ankle boots with sculptural heels and supple leather finish.' }
];

let cart = [];
let currentStudio = {
    top: products.find(p => p.category === 'tops'),
    pants: products.find(p => p.category === 'pants'),
    shoes: products.find(p => p.category === 'shoes')
};

document.addEventListener('DOMContentLoaded', () => {
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    initThreeBackground();
    initOutfitStudio();
    initProductGrid();
    initCartDrawer();
    initModal();
    initHeroInteractions();
    initScrollAnimations();
    initSearch();
});

// --- Three.js Kinetic Ambient Background ---
function initThreeBackground() {
    const canvas = document.getElementById('ambientCanvas');
    if (!canvas) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const particlesCount = 70;
    const posArray = new Float32Array(particlesCount * 3);

    for (let i = 0; i < particlesCount * 3; i++) {
        posArray[i] = (Math.random() - 0.5) * 15;
    }

    const particlesGeo = new THREE.BufferGeometry();
    particlesGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

    const particlesMat = new THREE.PointsMaterial({
        size: 0.04,
        color: 0xAA9174,
        transparent: true,
        opacity: 0.6,
    });

    const particlesMesh = new THREE.Points(particlesGeo, particlesMat);
    scene.add(particlesMesh);
    camera.position.z = 5;

    let mouseX = 0;
    let mouseY = 0;
    window.addEventListener('mousemove', (e) => {
        mouseX = (e.clientX / window.innerWidth - 0.5) * 0.5;
        mouseY = (e.clientY / window.innerHeight - 0.5) * 0.5;
    });

    function animate() {
        requestAnimationFrame(animate);
        particlesMesh.rotation.y += 0.001;
        particlesMesh.rotation.x += 0.0005;

        camera.position.x += (mouseX - camera.position.x) * 0.05;
        camera.position.y += (-mouseY - camera.position.y) * 0.05;
        camera.lookAt(scene.position);

        renderer.render(scene, camera);
    }
    animate();

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
}

// --- Interactive Outfit Studio ---
function initOutfitStudio() {
    renderStudioSelectors();
    updateStudioDisplay();

    document.getElementById('addStudioBundleBtn').addEventListener('click', () => {
        const bundle = [currentStudio.top, currentStudio.pants, currentStudio.shoes];
        bundle.forEach(item => addToCart(item, false));
        openCart();
        
        if (typeof confetti !== 'undefined') {
            confetti({
                particleCount: 80,
                spread: 70,
                origin: { y: 0.6 },
                colors: ['#AA9174', '#93755A', '#0B0906', '#F4ECE4']
            });
        }
    });
}

function renderStudioSelectors() {
    const topContainer = document.getElementById('topSelector');
    const pantsContainer = document.getElementById('pantsSelector');
    const shoesContainer = document.getElementById('shoesSelector');

    topContainer.innerHTML = '';
    pantsContainer.innerHTML = '';
    shoesContainer.innerHTML = '';

    products.filter(p => p.category === 'tops').forEach(item => {
        topContainer.appendChild(createStudioThumb(item, 'top'));
    });
    products.filter(p => p.category === 'pants').forEach(item => {
        pantsContainer.appendChild(createStudioThumb(item, 'pants'));
    });
    products.filter(p => p.category === 'shoes').forEach(item => {
        shoesContainer.appendChild(createStudioThumb(item, 'shoes'));
    });
}

function createStudioThumb(item, type) {
    const btn = document.createElement('button');
    const isSelected = currentStudio[type].id === item.id;
    btn.className = `relative aspect-square rounded-2xl overflow-hidden border-2 transition-all transform hover:scale-105 ${isSelected ? 'border-brand-accent shadow-md scale-105' : 'border-brand-accent/20 opacity-70 hover:opacity-100'}`;
    btn.innerHTML = `<img src="${item.image}" alt="${item.name}" class="w-full h-full object-cover">`;
    
    btn.addEventListener('click', () => {
        currentStudio[type] = item;
        renderStudioSelectors();
        updateStudioDisplay();
        
        const pieceEl = document.getElementById(`studio${type.charAt(0).toUpperCase() + type.slice(1)}Piece`); pieceEl.classList.remove('animate-garment-drop'); void pieceEl.offsetWidth; pieceEl.classList.add('animate-garment-drop'); });  return btn; }  function updateStudioDisplay() { document.getElementById('studioTopImg').src = currentStudio.top.image; document.getElementById('studioPantsImg').src = currentStudio.pants.image; document.getElementById('studioShoesImg').src = currentStudio.shoes.image;  const totalPrice = currentStudio.top.price + currentStudio.pants.price + currentStudio.shoes.price; document.getElementById('studioTotalPrice').innerText = `$${totalPrice}`;
}
// --- GS. SHOPPING CORE JAVASCRIPT (PART 2) ---

// --- Product Catalog Grid & Filtering & Search ---
function initProductGrid(filter = 'all', searchQuery = '') {
    const grid = document.getElementById('productGrid');
    grid.innerHTML = '';

    let filtered = filter === 'all' ? products : products.filter(p => p.category === filter);

    if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase();
        filtered = filtered.filter(p => p.name.toLowerCase().includes(query) || p.desc.toLowerCase().includes(query));
    }

    if (filtered.length === 0) {
        grid.innerHTML = `<div class="col-span-full text-center py-16 text-brand-muted font-cinzel text-lg">No matching couture pieces found.</div>`;
        return;
    }

    filtered.forEach(product => {
        const card = document.createElement('div');
        card.className = 'group relative bg-brand-card rounded-3xl overflow-hidden border border-brand-accent/20 shadow-lg flex flex-col justify-between transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl';
        card.innerHTML = `
            <div class="relative aspect-[4/5] overflow-hidden cursor-pointer product-thumb" data-id="${product.id}">
                <img src="${product.image}" alt="${product.name}" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105">
                <div class="absolute inset-0 bg-gradient-to-t from-brand-dark/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                    <span class="text-white text-xs font-semibold tracking-wider uppercase bg-brand-dark/85 backdrop-blur-md px-3 py-1.5 rounded-full border border-brand-accent/30">Quick View</span>
                </div>
            </div>
            <div class="p-6 flex flex-col justify-between flex-1 bg-brand-card">
                <div>
                    <span class="text-[11px] font-bold uppercase tracking-widest text-brand-accent">${product.category}</span>
                    <h3 class="font-cinzel text-xl font-bold text-white mt-1">${product.name}</h3>
                </div>
                <div class="flex items-center justify-between mt-4 pt-4 border-t border-brand-accent/15">
                    <span class="font-cinzel text-lg font-bold text-white">$${product.price}</span>
                    <button class="add-to-cart-quick p-3 rounded-full bg-brand-accent text-white hover:bg-brand-brown transition-all transform hover:scale-105 active:scale-95 shadow-md" data-id="${product.id}">
                        <i data-lucide="shopping-bag" class="w-4 h-4"></i>
                    </button>
                </div>
            </div>
        `;
        grid.appendChild(card);
    });

    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    grid.querySelectorAll('.product-thumb').forEach(thumb => {
        thumb.addEventListener('click', () => openModal(thumb.getAttribute('data-id')));
    });

    grid.querySelectorAll('.add-to-cart-quick').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const product = products.find(p => p.id === btn.getAttribute('data-id'));
            addToCart(product);
        });
    });
}

function initSearch() {
    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('input', (e) => {
        const activeFilterBtn = document.querySelector('.filter-btn.active');
        const currentFilter = activeFilterBtn ? activeFilterBtn.getAttribute('data-filter') : 'all';
        initProductGrid(currentFilter, e.target.value);
    });

    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            const query = searchInput.value;
            initProductGrid(e.target.getAttribute('data-filter'), query);
        });
    });
}

// --- Shopping Cart Drawer Logic ---
function initCartDrawer() {
    const cartBtn = document.getElementById('cartBtn');
    const closeCartBtn = document.getElementById('closeCartBtn');
    const cartOverlay = document.getElementById('cartOverlay');
    const checkoutBtn = document.getElementById('checkoutBtn');

    cartBtn.addEventListener('click', openCart);
    closeCartBtn.addEventListener('click', closeCart);
    cartOverlay.addEventListener('click', closeCart);

    checkoutBtn.addEventListener('click', () => {
        if (cart.length === 0) return;
        alert('🎉 Order placed successfully! Thank you for shopping with gs. Shopping.');
        cart = [];
        updateCartUI();
        closeCart();
    });
}

function openCart() {
    const cartDrawer = document.getElementById('cartDrawer');
    cartDrawer.classList.remove('pointer-events-none', 'opacity-0');
    cartDrawer.querySelector('.transform').classList.remove('translate-x-full');
}

function closeCart() {
    const cartDrawer = document.getElementById('cartDrawer');
    cartDrawer.classList.add('opacity-0');
    cartDrawer.querySelector('.transform').classList.add('translate-x-full');
    setTimeout(() => {
        cartDrawer.classList.add('pointer-events-none');
    }, 300);
}

function addToCart(product, openDrawer = true) {
    const existing = cart.find(item => item.id === product.id);
    if (existing) {
        existing.qty += 1;
    } else {
        cart.push({ ...product, qty: 1 });
    }
    updateCartUI();
    if (openDrawer) openCart();
}

function updateCartUI() {
    const badge = document.getElementById('cartBadge');
    const container = document.getElementById('cartItemsContainer');
    const subtotalEl = document.getElementById('cartSubtotal');
    const totalEl = document.getElementById('cartTotal');

    const totalCount = cart.reduce((sum, item) => sum + item.qty, 0);
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);

    if (totalCount > 0) {
        badge.innerText = totalCount;
        badge.classList.remove('opacity-0', 'scale-0');
    } else {
        badge.classList.add('opacity-0', 'scale-0');
    }

    container.innerHTML = '';
    if (cart.length === 0) {
        container.innerHTML = `
            <div class="text-center py-16 text-brand-muted">
                <i data-lucide="shopping-bag" class="w-12 h-12 mx-auto mb-3 opacity-30"></i>
                <p class="font-cinzel text-lg text-white">Your shopping bag is empty</p>
                <p class="text-xs mt-1">Explore our haute couture catalog to begin.</p>
            </div>
        `;
    } else {
        cart.forEach(item => {
            const div = document.createElement('div');
            div.className = 'flex items-center gap-4 bg-brand-bg p-4 rounded-2xl border border-brand-accent/15';
            div.innerHTML = `
                <img src="${item.image}" alt="${item.name}" class="w-16 h-16 object-cover rounded-xl">
                <div class="flex-1">
                    <h4 class="font-cinzel font-bold text-sm text-white">${item.name}</h4>
                    <span class="text-xs text-brand-muted">$${item.price} x ${item.qty}</span>
                </div>
                <div class="flex items-center gap-2">
                    <button class="decrease-qty w-7 h-7 rounded-full bg-brand-card border border-brand-accent/30 text-xs font-bold text-white">-</button>
                    <span class="text-sm font-semibold text-white">${item.qty}</span>
                    <button class="increase-qty w-7 h-7 rounded-full bg-brand-card border border-brand-accent/30 text-xs font-bold text-white">+</button>
                </div>
            `;
            container.appendChild(div);
        });

        container.querySelectorAll('.increase-qty').forEach(btn => {
            btn.addEventListener('click', () => {
                const item = cart.find(i => i.id === btn.getAttribute('data-id'));
                item.qty++;
                updateCartUI();
            });
        });

        container.querySelectorAll('.decrease-qty').forEach(btn => {
            btn.addEventListener('click', () => {
                const item = cart.find(i => i.id === btn.getAttribute('data-id'));
                item.qty--;
                if (item.qty <= 0) {
                    cart = cart.filter(i => i.id !== item.id);
                }
                updateCartUI();
            });
        });
    }

    subtotalEl.innerText = `$${subtotal.toFixed(2)}`;
    totalEl.innerText = `$${subtotal.toFixed(2)}`;

    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}

// --- Quick View Product Modal ---
function initModal() {
    const overlay = document.getElementById('modalOverlay');
    const closeBtn = document.getElementById('closeModalBtn');

    overlay.addEventListener('click', closeModal);
    closeBtn.addEventListener('click', closeModal);
}

function openModal(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const modal = document.getElementById('productModal');
    const content = document.getElementById('modalContent');

    content.innerHTML = `
        <div class="relative aspect-[4/5] rounded-2xl overflow-hidden bg-brand-bg">
            <img src="${product.image}" alt="${product.name}" class="w-full h-full object-cover">
        </div>
        <div class="space-y-4">
            <div>
                <span class="text-xs font-bold uppercase tracking-widest text-brand-accent">${product.category}</span>
                <h2 class="font-cinzel text-2xl font-bold text-white mt-1">${product.name}</h2>
                <p class="font-cinzel text-xl font-bold text-brand-accent mt-2">$${product.price}</p>
            </div>
            <p class="text-brand-muted text-sm leading-relaxed">${product.desc}</p>
            <div class="pt-4 border-t border-brand-accent/15 flex items-center gap-4">
                <button id="modalAddToCart" class="flex-1 py-4 bg-brand-accent text-white rounded-xl font-medium hover:bg-brand-brown transition-all shadow-xl flex items-center justify-center gap-2">
                    <i data-lucide="shopping-bag" class="w-4 h-4"></i> Add to Bag
                </button>
            </div>
        </div>
    `;

    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    document.getElementById('modalAddToCart').addEventListener('click', () => {
        addToCart(product);
        closeModal();
    });

    modal.classList.remove('pointer-events-none', 'opacity-0');
    modal.querySelector('.transform').classList.remove('scale-95');
    modal.querySelector('.transform').classList.add('scale-100');
}

function closeModal() {
    const modal = document.getElementById('productModal');
    modal.classList.add('opacity-0');
    modal.querySelector('.transform').classList.remove('scale-100');
    modal.querySelector('.transform').classList.add('scale-95');
    setTimeout(() => {
        modal.classList.add('pointer-events-none');
    }, 300);
}

// --- Hero Garment Gravity Physics & GSAP Scroll Animations ---
function initHeroInteractions() {
    const heroGarment = document.getElementById('heroHeroGarment');
    heroGarment.addEventListener('click', () => {
        heroGarment.classList.remove('animate-garment-drop');
        void heroGarment.offsetWidth;
        heroGarment.classList.add('animate-garment-drop');
    });
}

function initScrollAnimations() {
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);

        gsap.from('#studio > div', {
            scrollTrigger: {
                trigger: '#studio',
                start: 'top 80%',
            },
            y: 40,
            opacity: 0,
            duration: 1,
            ease: 'power3.out'
        });

        gsap.from('#collections', {
            scrollTrigger: {
                trigger: '#collections',
                start: 'top 85%',
            },
            y: 30,
            opacity: 0,
            duration: 0.8,
            ease: 'power3.out'
        });
    }
      }
