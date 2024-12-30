const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 4040;

// Middleware
app.use(bodyParser.json());
app.use(cors());
app.use(express.static(path.join(__dirname, 'public'))); // Serve static files
// A default route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/foodApp', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

// Define Mongoose Schema and Model
const cartItemSchema = new mongoose.Schema({
    name: String,
    price: Number,
    quantity: Number,
});

const Cart = mongoose.model('Cart', cartItemSchema);

// API to save cart data
app.post('/checkout', async (req, res) => {
    const { items, totalAmount } = req.body;

    if (!items || items.length === 0) {
        return res.status(400).json({ message: 'Cart is empty' });
    }

    try {
        // Save each item to the database
        await Cart.insertMany(items);

        console.log(`Total amount: $${totalAmount}`);
        res.status(200).json({ message: '' });
    } catch (err) {
        console.error('Error saving cart:', err);
        res.status(500).json({ message: '' });
    }
});

// API to fetch all cart items (Optional)
app.get('/cart-items', async (req, res) => {
    try {
        const cartItems = await Cart.find();
        res.status(200).json(cartItems);
    } catch (err) {
        console.error('Error fetching cart items:', err);
        res.status(500).json({ message: 'Failed to fetch cart items' });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
// Schema for storing user details and food items
const userDetailsSchema = new mongoose.Schema({
    name: { type: String, required: true },
    address: { type: String, required: true },
    phone: { type: String, required: true },
    foodItems: [
      {
        itemName: String,
        cost: Number,
      },
    ],
  });
  
  const UserDetails = mongoose.model("UserDetails", userDetailsSchema);
  
  // Route to handle form submission
  app.post("/submit-details", async (req, res) => {
    try {
      const { name, address, phone, foodItems } = req.body;
  
      // Save user details and food items in MongoDB
      const newUserDetails = new UserDetails({
        name,
        address,
        phone,
        foodItems,
      });
  
      await newUserDetails.save();
      res.status(201).json({ message: "Details saved successfully!" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to save details" });
    }
  });
