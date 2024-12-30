document.addEventListener('DOMContentLoaded', () => {
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    const cartItemCount = document.querySelector('.cart-icon span');
    const cartItemsList = document.querySelector('.cart-items');
    const cartTotal = document.querySelector('.cart-total');
    const cartIcon = document.querySelector('.cart-icon');
    const sidebar = document.querySelector('.sidebar');
    const closeButton = document.querySelector('.sidebar-close');
    const checkoutButton = document.querySelector('.checkout-btn');

    let cartItems = [];
    let totalAmount = 0;

    // Add items to cart
    addToCartButtons.forEach((button, index) => {
        button.addEventListener('click', () => {
            const item = {
                name: document.querySelectorAll('.card .card--title')[index].textContent,
                price: parseFloat(
                    document.querySelectorAll('.card .price')[index].textContent.slice(1)
                ),
                quantity: 1,
            };

            const existingItem = cartItems.find(cartItem => cartItem.name === item.name);
            if (existingItem) {
                existingItem.quantity++;
            } else {
                cartItems.push(item);
            }
            totalAmount += item.price;

            updateCartUI();
        });
    });

    // Update the cart UI
    function updateCartUI() {
        updateCartItemCount(cartItems.length);
        updateCartItemList();
        updateCartTotal();
    }

    // Update cart item count
    function updateCartItemCount(count) {
        cartItemCount.textContent = count;
    }

    // Update cart items list
    function updateCartItemList() {
        cartItemsList.innerHTML = '';
        cartItems.forEach((item, index) => {
            const cartItem = document.createElement('div');
            cartItem.classList.add('cart-item', 'individual-cart-item');
            cartItem.innerHTML = `
                <span>(${item.quantity}x) ${item.name}</span>
                <span class="cart-item-price">$${(item.price * item.quantity).toFixed(2)}</span>
                <button class="remove-item" data-index="${index}">
                    <i class="fa-solid fa-times"></i>
                </button>
            `;
            cartItemsList.append(cartItem);
        });

        // Add event listeners to remove buttons
        const removeButtons = document.querySelectorAll('.remove-item');
        removeButtons.forEach(button => {
            button.addEventListener('click', event => {
                const index = event.target.closest('.remove-item').dataset.index;
                removeItemFromCart(index);
            });
        });
    }

    // Remove item from cart
    function removeItemFromCart(index) {
        const removedItem = cartItems.splice(index, 1)[0];
        totalAmount -= removedItem.price * removedItem.quantity;
        updateCartUI();
    }

    // Update cart total amount
    function updateCartTotal() {
        cartTotal.textContent = `$${totalAmount.toFixed(2)}`;
    }

    // Toggle sidebar visibility
    cartIcon.addEventListener('click', () => {
        sidebar.classList.add('open');
    });

    closeButton.addEventListener('click', () => {
        sidebar.classList.remove('open');

        
    });

    // Handle checkout button click
checkoutButton.addEventListener('click', async () => {
    if (cartItems.length === 0) {
        alert('Your cart is empty!');
        return;
    }

    const cartData = {
        items: cartItems,
        totalAmount: totalAmount,
    };

    try {
        const response = await fetch('http://localhost:4040/checkout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(cartData),
        });

        const result = await response.json();

        if (response.ok) {
            alert('Cart saved successfully!');
            cartItems = []; // Clear the cart
            totalAmount = 0;
            updateCartUI();
        } else {
            console.error('Checkout failed:', result.message);
            alert('Failed to save cart. Please try again.');
        }
    } catch (err) {
        console.error('Error during checkout:', err);
        alert('An error occurred. Please try again.');
    }
});
});
 

// Get references to the search input, menu category buttons, and menu cards
const searchInput = document.getElementById("search-bar");
const menuCategories = document.querySelectorAll(".menu--item");
const menuItems = document.querySelectorAll(".card");

// Function to filter menu items based on query or category
function filterMenuItems(query = "", category = "") {
    query = query.toLowerCase().trim(); // Convert query to lowercase and trim whitespace
    category = category.toLowerCase().trim(); // Convert category to lowercase and trim whitespace

    // Loop through each menu item
    menuItems.forEach((item) => {
        const itemName = item.getAttribute("data-name").toLowerCase(); // Get the name from the data-name attribute

        // Show items only if they match both the query and category
        const matchesQuery = query === "" || itemName.includes(query);
        const matchesCategory = category === "" || itemName.includes(category);

        if (matchesQuery && matchesCategory) {
            item.style.display = "block"; // Show the matching item
        } else {
            item.style.display = "none"; // Hide non-matching items
        }
    });
}

// Event listener for the search input
searchInput.addEventListener("input", () => {
    const query = searchInput.value; // Get the input value
    filterMenuItems(query); // Filter based on the search query
});

// Event listeners for menu categories
menuCategories.forEach((categoryItem) => {
    categoryItem.addEventListener("click", () => {
        const category = categoryItem.getAttribute("data-name"); // Use data-name for category
        searchInput.value = ""; // Clear the search bar when clicking a category
        filterMenuItems("", category); // Filter based on the selected category
    });
});

// Show all items on page load
filterMenuItems(); // Initialize to display all items


// Event listener for the search input
searchInput.addEventListener("input", () => {
    const query = searchInput.value; // Get the input value
    filterMenuItems(query); // Filter based on the search query
});

// Event listeners for the menu categories
menuCategories.forEach((categoryItem) => {
    categoryItem.addEventListener("click", () => {
        const category = categoryItem.querySelector("h5").innerText; // Get the category name
        searchInput.value = ""; // Clear the search bar when clicking a category
        filterMenuItems("", category); // Filter based on the category
    });
});

// Show all items on page load
filterMenuItems(); // Initialize to display all items



 document.addEventListener('DOMContentLoaded', () => {
    const checkoutBtn = document.getElementById('checkout-btn');
    const modal = document.getElementById('modal');
    const modalClose = document.getElementById('modal-close');
    const userDetailsForm = document.getElementById('user-details-form');
    const cartTotal = document.getElementById('cart-total');
    const cartItems = document.getElementById('cart-items');

    let cart = []; // Example cart array (you should populate this dynamically)
    let totalAmount = 0;

    // Open modal on checkout button click
    checkoutBtn.addEventListener('click', () => {
        if (cart.length === 0) {
            alert('Your cart is empty!');
            return;
        }
        modal.style.display = 'flex';
    });

    // Close modal
    modalClose.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    // Handle form submission
    userDetailsForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('name').value;
        const address = document.getElementById('address').value;
        const phone = document.getElementById('phone').value;

        // Generate bill
        alert(`Bill Generated!\n\nName: ${name}\nAddress: ${address}\nPhone: ${phone}\nTotal Amount: ${cartTotal.textContent}`);
        modal.style.display = 'none';
    });

    // Example: Adding items to cart
    function addToCart(item, price) {
        cart.push({ item, price });
        totalAmount += price;
        updateCartUI();
    }

    // Update cart UI
    function updateCartUI() {
        cartItems.innerHTML = '';
        cart.forEach((cartItem, index) => {
            const div = document.createElement('div');
            div.className = 'cart-item';
            div.innerHTML = `
                ${cartItem.item} - $${cartItem.price.toFixed(2)}
                <button onclick="removeFromCart(${index})">Remove</button>
            `;
            cartItems.appendChild(div);
        });
        cartTotal.textContent = `$${totalAmount.toFixed(2)}`;
    }

    // Remove item from cart
    window.removeFromCart = (index) => {
        totalAmount -= cart[index].price;
        cart.splice(index, 1);
        updateCartUI();
    };

    // Example items added to cart (for demonstration)
    addToCart('Pizza', 8.5);
    addToCart('Burger', 5.0);
});
document.getElementById("user-details-form").addEventListener("submit", async (event) => {
    event.preventDefault(); // Prevent default form submission
  
    // Get form values
    const name = document.getElementById("name").value;
    const address = document.getElementById("address").value;
    const phone = document.getElementById("phone").value;
  
    // Example food items and costs (replace with actual data from your app)
    const foodItems = [
      { itemName: "Pizza", cost: 15 },
      { itemName: "Burger", cost: 8 },
      { itemName: "Pasta", cost: 12 },
    ];
  
    // Send data to the backend
    try {
      const response = await fetch("http://localhost:4040/submit-details", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, address, phone, foodItems }),
      });
  
      const result = await response.json();
  
      if (response.ok) {
        alert(result.message);
        // Optionally clear the form
        document.getElementById("user-details-form").reset();
      } else {
        alert("Failed to save details: " + result.error);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Error submitting form");
    }
  });
   // Form submission handler
   const form = document.getElementById("user-details-form");
   const successPopup = document.getElementById("order-success-popup");
   const closePopupBtn = document.getElementById("close-popup");

   form.addEventListener("submit", function (event) {
       event.preventDefault(); // Prevent default form submission

       // Display the order success popup
       successPopup.style.display = "block";
   });

   // Close popup handler
   closePopupBtn.addEventListener("click", function () {
       successPopup.style.display = "none";
   });
  