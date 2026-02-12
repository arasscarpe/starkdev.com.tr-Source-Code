/* =========================================
   STARK DEVELOPER V2 - GLOBAL JAVASCRIPT
   ========================================= */

document.addEventListener("DOMContentLoaded", () => {
    
    // 1. DAKTİLO ANİMASYONU (Sadece logo-typewriter ID'li olanlar için)
    const typewriterElement = document.getElementById("logo-typewriter");
    if (typewriterElement) {
        const textToType = "Stark Developer";
        let index = 0;
        let isDeleting = false;

        function typeWriter() {
            let currentText = "";
            if (isDeleting) {
                currentText = textToType.substring(0, index--);
            } else {
                currentText = textToType.substring(0, index++);
            }

            typewriterElement.textContent = currentText;

            let typeSpeed = isDeleting ? 60 : 100;

            if (!isDeleting && index > textToType.length) {
                isDeleting = true;
                typeSpeed = 1200; // Duraklama
            } else if (isDeleting && index < 0) {
                isDeleting = false;
                index = 0;
                typeSpeed = 500; // Başlamadan önce duraklama
            }

            setTimeout(typeWriter, typeSpeed);
        }
        typeWriter();
    }

    // 2. SCROLL REVEAL ANİMASYONU
    const revealElements = document.querySelectorAll(".reveal");
    
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("active");
                // Animasyon tetiklendikten sonra gözlemciyi kaldır (isteğe bağlı)
                // revealObserver.unobserve(entry.target); 
            }
            // Sayfadan çıkınca tekrar gizle (isteğe bağlı)
            // else {
            //     entry.target.classList.remove("active");
            // }
        });
    }, {
        threshold: 0.1 // Elementin %10'u görününce
    });

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });

    // 3. SEPET SİSTEMİ
    const cartIcon = document.querySelector(".cart-icon");
    const cartModal = document.getElementById("cart-modal");
    const closeCartBtn = document.querySelector(".close-cart");
    const cartItemsContainer = document.querySelector(".cart-items");
    const cartTotalElement = document.getElementById("cart-total-price");
    const cartCountElement = document.getElementById("cart-count");
    const addToCartButtons = document.querySelectorAll(".add-to-cart-btn");
    const cartFooter = document.querySelector(".cart-footer");

    // Sepeti localStorage'dan yükle
    let cart = JSON.parse(localStorage.getItem('starkCart')) || [];

    // Sepeti AÇ
    if (cartIcon) {
        cartIcon.addEventListener("click", () => {
            if (cartModal) {
                cartModal.style.display = "flex";
                // Animasyon için sınıf ekle
                setTimeout(() => cartModal.classList.add("show"), 10);
                updateCartUI();
            }
        });
    }

    // Sepeti KAPAT
    if (closeCartBtn) {
        closeCartBtn.addEventListener("click", () => {
            if (cartModal) {
                cartModal.classList.remove("show");
                // Animasyon bittikten sonra gizle
                setTimeout(() => cartModal.style.display = "none", 400);
            }
        });
    }

    // Dışarı tıklayınca Kapat
    if (cartModal) {
        cartModal.addEventListener("click", (e) => {
            if (e.target === cartModal) {
                cartModal.classList.remove("show");
                setTimeout(() => cartModal.style.display = "none", 400);
            }
        });
    }

    // Sepete Ekle Butonları
    addToCartButtons.forEach(button => {
        button.addEventListener("click", () => {
            const id = button.dataset.id;
            const name = button.dataset.name;
            const price = parseFloat(button.dataset.price);

            addToCart(id, name, price);
            // Buton animasyonu
            button.textContent = "Eklendi!";
            button.style.background = "var(--success)";
            
            // Orijinal rengi ve metni geri yükle
            const originalText = "Sepete Ekle";
            let originalBackground = "var(--primary)"; // Default
            
            // Pakete özel renkleri al
            const packageType = button.closest('.package-arduino, .package-linux, .package-html');
            if (packageType) {
                if (packageType.classList.contains('package-arduino')) originalBackground = "var(--arduino)";
                else if (packageType.classList.contains('package-linux')) originalBackground = "var(--linux)";
                else if (packageType.classList.contains('package-html')) originalBackground = "var(--html)";
            }

            setTimeout(() => {
                button.textContent = originalText;
                button.style.background = originalBackground;
            }, 1500);
        });
    });

    // Sepet Fonksiyonları
    function addToCart(id, name, price) {
        // Ürün sepette var mı?
        const existingItem = cart.find(item => item.id === id);
        if (existingItem) {
            // Trendyol tarzı: Miktar artmaz, sadece 1 tane eklenir.
            console.log("Ürün zaten sepette.");
        } else {
            cart.push({ id, name, price });
        }
        saveCart();
        updateCartUI();
    }

    function removeFromCart(id) {
        cart = cart.filter(item => item.id !== id);
        saveCart();
        updateCartUI();
    }

    function calculateTotal() {
        return cart.reduce((total, item) => total + item.price, 0);
    }

    function saveCart() {
        localStorage.setItem('starkCart', JSON.stringify(cart));
    }

    function updateCartUI() {
        if (!cartCountElement || !cartItemsContainer || !cartFooter || !cartTotalElement) {
            // Eğer sepet elemanları (örn. ödeme sayfasında) yoksa hata vermesin
            // Sadece sayacı güncellesek yeterli
            if(cartCountElement) cartCountElement.textContent = cart.length;
            return;
        }

        // Sepet icon sayacı
        cartCountElement.textContent = cart.length;
        
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = `
                <div class="empty-cart">
                    <i class="fas fa-shopping-basket"></i>
                    <p>Sepetiniz şu anda boş.</p>
                </div>
            `;
            cartFooter.style.display = "none";
        } else {
            cartFooter.style.display = "block";
            cartItemsContainer.innerHTML = ""; // Temizle
            cart.forEach(item => {
                const cartItemElement = document.createElement("div");
                cartItemElement.classList.add("cart-item");
                cartItemElement.innerHTML = `
                    <div class="cart-item-info">
                        <div class="cart-item-title">${item.name}</div>
                        <div class="cart-item-price">${item.price.toFixed(2)}₺</div>
                    </div>
                    <button class="cart-item-remove" data-id="${item.id}">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                `;
                cartItemsContainer.appendChild(cartItemElement);
            });
            
            // Silme butonlarına event listener ekle
            document.querySelectorAll(".cart-item-remove").forEach(button => {
                button.addEventListener("click", () => {
                    removeFromCart(button.dataset.id);
                });
            });

            // Toplamı güncelle
            cartTotalElement.textContent = `${calculateTotal().toFixed(2)}₺`;
        }
    }
    
    // Sayfa yüklendiğinde sepet sayacını güncelle
    updateCartUI();

    // 4. ÖDEME SAYFASI (Eğer ödeme sayfasındaysak)
    const summaryList = document.getElementById("summary-items-list");
    const summaryTotal = document.getElementById("summary-total-price");

    if (summaryList && summaryTotal) {
        let cart = JSON.parse(localStorage.getItem('starkCart')) || [];
        
        if (cart.length === 0) {
            summaryList.innerHTML = "<li>Sepetinizde ürün bulunmuyor.</li>";
        } else {
            cart.forEach(item => {
                const li = document.createElement("li");
                li.innerHTML = `
                    <span>${item.name}</span>
                    <strong>${item.price.toFixed(2)}₺</strong>
                `;
                summaryList.appendChild(li);
            });
        }
        
        const total = cart.reduce((total, item) => total + item.price, 0);
        summaryTotal.textContent = `${total.toFixed(2)}₺`;
    }
});
