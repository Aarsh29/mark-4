document.addEventListener("DOMContentLoaded", () => {
    // Smooth scroll function for "Shop Now" button
    const shopNowBtn = document.getElementById("shopNow");
    if (shopNowBtn) {
        shopNowBtn.addEventListener("click", () => {
            document.getElementById("products").scrollIntoView({ behavior: "smooth" });
        });
    }

    // Typing effect for hero text
    const heroText = document.querySelector(".hero-text h1");
    const heroTextContent = heroText.innerText;
    heroText.innerText = ""; // Clear existing text
    let index = 0;

    function typeEffect() {
        if (index < heroTextContent.length) {
            heroText.innerHTML += heroTextContent.charAt(index);
            index++;
            setTimeout(typeEffect, 50);
        } else {
            heroText.innerHTML += '<span class="cursor">|</span>'; // Blinking cursor
        }
    }
    typeEffect();

    // Scroll animations using IntersectionObserver
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("fade-in");
            }
        });
    }, { threshold: 0.3 });

    document.querySelectorAll(".feature, .product").forEach((el) => {
        observer.observe(el);
    });

    // Button hover and click effects
    const buttons = document.querySelectorAll("button");

    buttons.forEach((button) => {
        button.addEventListener("mouseenter", () => {
            button.style.transform = "scale(1.05)";
            button.style.boxShadow = "0px 4px 15px rgba(0, 0, 255, 0.5)";
        });

        button.addEventListener("mouseleave", () => {
            button.style.transform = "scale(1)";
            button.style.boxShadow = "none";
        });

        button.addEventListener("click", (e) => {
            let ripple = document.createElement("span");
            ripple.classList.add("ripple");
            button.appendChild(ripple);

            let x = e.clientX - button.getBoundingClientRect().left;
            let y = e.clientY - button.getBoundingClientRect().top;

            ripple.style.left = `${x}px`;
            ripple.style.top = `${y}px`;

            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });

    // Shopping cart functionality
    let cartItems = [];
    const cartSection = document.getElementById("cartItems");
    const cartTotal = document.getElementById("cartTotal");
    const cartIcon = document.querySelector(".cart a i");
    const checkoutButton = document.getElementById("checkoutButton");

    // Cart notification
    const cartNotification = document.createElement("div");
    cartNotification.classList.add("cart-notification");
    document.body.appendChild(cartNotification);

    const addToCartButtons = document.querySelectorAll(".product button");

    addToCartButtons.forEach((btn) => {
        btn.addEventListener("click", () => {
            const product = btn.parentElement;
            const productName = product.querySelector("h3").innerText;
            const productPrice = product.querySelector("p").innerText;
            const productImage = product.querySelector("img").src;

            cartItems.push({ name: productName, price: parseFloat(productPrice.replace("$", "")), image: productImage });
            updateCartDisplay();
            showNotification(`${productName} added to cart!`);

            cartIcon.classList.add("shake");
            setTimeout(() => cartIcon.classList.remove("shake"), 500);
        });
    });

    function updateCartDisplay() {
        cartSection.innerHTML = "";
        let total = 0;

        if (cartItems.length === 0) {
            cartSection.innerHTML = '<p class="empty-cart-message">Your cart is currently empty.</p>';
            cartTotal.innerText = "$0.00";
            checkoutButton.style.display = "none"; // Hide checkout button if cart is empty
            return;
        }

        checkoutButton.style.display = "block"; // Show checkout button if items exist

        cartItems.forEach((item, index) => {
            total += item.price;

            const cartItem = document.createElement("div");
            cartItem.classList.add("cart-item");

            cartItem.innerHTML = `
                <img src="${item.image}" alt="${item.name}">
                <div class="cart-item-details">
                    <h3>${item.name}</h3>
                    <p>$${item.price.toFixed(2)}</p>
                </div>
                <button class="remove-item" data-index="${index}">Remove</button>
            `;
            cartSection.appendChild(cartItem);
        });

        cartTotal.innerText = `$${total.toFixed(2)}`;

        document.querySelectorAll(".remove-item").forEach((btn) => {
            btn.addEventListener("click", (e) => {
                const index = e.target.dataset.index;
                cartItems.splice(index, 1);
                updateCartDisplay();
            });
        });
    }

    function showNotification(message) {
        cartNotification.innerText = message;
        cartNotification.classList.add("show");

        setTimeout(() => {
            cartNotification.classList.remove("show");
        }, 3000);
    }

    // Checkout Button Functionality
    checkoutButton.addEventListener("click", () => {
        if (cartItems.length === 0) {
            showNotification("Your cart is empty!");
            return;
        }

        if (confirm("Proceed with checkout?")) {
            showNotification("Order placed successfully!");
            cartItems = []; // Clear cart
            updateCartDisplay();
        }
    });

    // Initially hide checkout button if no items
    checkoutButton.style.display = "none";
});

// Chat Box Functionality
const chatBox = document.getElementById("chatBox");
const chatToggle = document.getElementById("chatToggle");
const closeChat = document.getElementById("closeChat");
const chatBody = document.getElementById("chatBody");
const chatInput = document.getElementById("chatInput");
const sendMessage = document.getElementById("sendMessage");

chatToggle.addEventListener("click", () => {
    chatBox.classList.toggle("open");
});

closeChat.addEventListener("click", () => {
    chatBox.classList.remove("open");
});

sendMessage.addEventListener("click", () => {
    const message = chatInput.value.trim();
    if (message) {
        // Add user message
        const userMessage = document.createElement("div");
        userMessage.classList.add("message", "user-message");
        userMessage.innerHTML = `
            <p>${message}</p>
            <span class="timestamp">${new Date().toLocaleTimeString()}</span>
        `;
        chatBody.appendChild(userMessage);

        chatInput.value = "";

        // Show typing indicator
        const typingIndicator = document.createElement("div");
        typingIndicator.classList.add("message", "typing-indicator");
        typingIndicator.innerHTML = `
            <span></span>
            <span></span>
            <span></span>
        `;
        chatBody.appendChild(typingIndicator);
        chatBody.scrollTop = chatBody.scrollHeight;

        // Simulate bot response after a delay
        setTimeout(() => {
            typingIndicator.remove();
            const botMessage = document.createElement("div");
            botMessage.classList.add("message", "bot-message");
            botMessage.innerHTML = `
                <p>Thanks for your message! How can I assist you further?</p>
                <span class="timestamp">${new Date().toLocaleTimeString()}</span>
            `;
            chatBody.appendChild(botMessage);
            chatBody.scrollTop = chatBody.scrollHeight;
        }, 2000); // 2 seconds delay for bot response
    }
});

// Allow pressing Enter to send message
chatInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        sendMessage.click();
    }
});
  // Sign Up and Sign In Modals
  const signupModal = document.getElementById("signupModal");
  const signinModal = document.getElementById("signinModal");
  const signupBtn = document.getElementById("signupBtn");
  const signinBtn = document.getElementById("signinBtn");
  const closeButtons = document.querySelectorAll(".close");

  signupBtn.addEventListener("click", () => {
      signupModal.style.display = "flex";
  });

  signinBtn.addEventListener("click", () => {
      signinModal.style.display = "flex";
  });

  closeButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
          signupModal.style.display = "none";
          signinModal.style.display = "none";
      });
  });

  window.addEventListener("click", (event) => {
      if (event.target === signupModal) {
          signupModal.style.display = "none";
      }
      if (event.target === signinModal) {
          signinModal.style.display = "none";
      }
  });

  document.getElementById("signupForm").addEventListener("submit", (e) => {
      e.preventDefault();
      alert("Sign Up Successful!");
      signupModal.style.display = "none";
  });

  document.getElementById("signinForm").addEventListener("submit", (e) => {
      e.preventDefault();
      alert("Sign In Successful!");
      signinModal.style.display = "none";
  });
