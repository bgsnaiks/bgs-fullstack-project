import express from 'express';
import axios from 'axios';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

// In-memory storage for products and users (in a real app, you'd use a database)
let localProducts = [];
let productIdCounter = 1000;
let users = [];
let userIdCounter = 1;
let shippingData = [];

// GET all products
app.get('/api/products', async (req, res) => {
  try {
    // Get products from FakeStoreAPI
    const response = await axios.get('https://fakestoreapi.com/products');
    const apiProducts = response.data;
    
    // Combine API products with locally stored products
    const allProducts = [...apiProducts, ...localProducts];
    
    console.log(`Returning ${allProducts.length} products (${apiProducts.length} from API, ${localProducts.length} local)`);
    res.json(allProducts);
  } catch (error) {
    console.error('GET Products Error:', error.message);
    // If API fails, just return local products
    res.json(localProducts);
  }
});

// POST: Add a new product
app.post('/api/products', async (req, res) => {
  try {
    const product = req.body;
    
    // Create a new product with a unique ID and timestamp
    const newProduct = {
      id: product.id || productIdCounter++,
      title: product.title,
      description: product.description,
      price: product.price || 0,
      category: product.category || 'custom',
      image: product.image || 'https://via.placeholder.com/200x200?text=Product',
      createdAt: new Date().toISOString()
    };
    
    // Store locally
    localProducts.push(newProduct);
    
    console.log('Product added:', newProduct);
    console.log(`Total local products: ${localProducts.length}`);
    
    res.status(201).json(newProduct);
  } catch (error) {
    console.error('Add Product Error:', error.message);
    res.status(500).json({ error: 'Failed to add product' });
  }
});

// PUT: Update a product
app.put('/api/products/:id', async (req, res) => {
  try {
    const productId = parseInt(req.params.id);
    const updatedData = req.body;
    
    // Find and update local product
    const localIndex = localProducts.findIndex(p => p.id === productId);
    if (localIndex !== -1) {
      localProducts[localIndex] = { ...localProducts[localIndex], ...updatedData, updatedAt: new Date().toISOString() };
      console.log('Local product updated:', localProducts[localIndex]);
      res.json(localProducts[localIndex]);
      return;
    }
    
    // If not a local product, try to update via API (though it won't persist)
    try {
      const response = await axios.put(`https://fakestoreapi.com/products/${productId}`, updatedData);
      console.log('API product update response:', response.data);
      res.json(response.data);
    } catch (apiError) {
      console.log('API update failed, returning updated data anyway');
      res.json({ id: productId, ...updatedData });
    }
  } catch (error) {
    console.error('Update Product Error:', error.message);
    res.status(500).json({ error: 'Failed to update product' });
  }
});

// DELETE: Remove a product
app.delete('/api/products/:id', async (req, res) => {
  try {
    const productId = parseInt(req.params.id);
    
    // Find and remove local product
    const localIndex = localProducts.findIndex(p => p.id === productId);
    if (localIndex !== -1) {
      const deletedProduct = localProducts.splice(localIndex, 1)[0];
      console.log('Local product deleted:', deletedProduct);
      res.json({ message: 'Product deleted successfully', product: deletedProduct });
      return;
    }
    
    // If not a local product, try to delete via API (though it won't actually delete)
    try {
      const response = await axios.delete(`https://fakestoreapi.com/products/${productId}`);
      console.log('API delete response:', response.data);
      res.json(response.data);
    } catch (apiError) {
      console.log('API delete failed, returning success anyway');
      res.json({ message: 'Product deleted successfully' });
    }
  } catch (error) {
    console.error('Delete Product Error:', error.message);
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

// API 1: JSONPlaceholder posts
app.get('/api/posts', async (req, res) => {
  try {
    const response = await axios.get('https://jsonplaceholder.typicode.com/posts', {
      headers: {
        'Authorization': `Bearer ${process.env.BEARER_TOKEN || ''}`,
        'x-api-key': process.env.API_KEY || '',
        'Content-Type': 'application/json'
      }
    });
    res.json(response.data);
  } catch (error) {
    console.error('API Error (posts):', error.message);
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
});

// GET: Menu API
const menu = [
  { label: "Home", path: "/" },
  { label: "Shop", path: "/shop" },
  { label: "Categories", path: "/categories" },
  { label: "Cart", path: "/cart" },
  { label: "Profile", path: "/profile" },
  { label: "Cards", path: "/cards" },
  // { label: "Sample", path: "/sample" },
  { label: "Products", path: "/products" }
];

app.get('/api/menu', (req, res) => {
  res.json(menu);
});

// ===== USER AUTHENTICATION ENDPOINTS =====

// Helper function to hash passwords (simple for demo - use bcrypt in production)
function hashPassword(password) {
  // For demo purposes, we'll use a simple hash. In production, use bcrypt!
  return Buffer.from(password).toString('base64');
}

function verifyPassword(password, hashedPassword) {
  return hashPassword(password) === hashedPassword;
}

// POST: Register new user
app.post('/api/auth/register', async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    
    // Validate input
    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }
    
    // Check if user already exists
    const existingUser = users.find(user => user.email === email);
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists'
      });
    }
    
    // Create new user
    const newUser = {
      id: userIdCounter++,
      firstName,
      lastName,
      email,
      password: hashPassword(password), // Hash the password
      createdAt: new Date().toISOString()
    };
    
    users.push(newUser);
    
    // Return user data without password
    const { password: _, ...userWithoutPassword } = newUser;
    
    console.log(`New user registered: ${email}`);
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      user: userWithoutPassword
    });
  } catch (error) {
    console.error('Registration Error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Registration failed. Please try again.'
    });
  }
});

// POST: Login user
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }
    
    // Find user by email
    const user = users.find(user => user.email === email);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }
    
    // Verify password
    if (!verifyPassword(password, user.password)) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }
    
    // Return user data without password
    const { password: _, ...userWithoutPassword } = user;
    
    console.log(`User logged in: ${email}`);
    res.json({
      success: true,
      message: 'Login successful',
      user: userWithoutPassword
    });
  } catch (error) {
    console.error('Login Error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Login failed. Please try again.'
    });
  }
});

// GET: Get all users (for testing - remove in production)
app.get('/api/auth/users', (req, res) => {
  const usersWithoutPasswords = users.map(({ password, ...user }) => user);
  res.json({
    success: true,
    users: usersWithoutPasswords,
    count: users.length
  });
});

// POST: Save shipping information
app.post('/api/shipping', (req, res) => {
  const data = req.body;
  if (!data.name || !data.address || !data.city || !data.state || !data.zip || !data.phone) {
    return res.status(400).json({ error: 'All fields are required' });
  }
  shippingData.push({ ...data, createdAt: new Date().toISOString() });
  console.log('Shipping data received:', data);
  res.status(201).json({ success: true, message: 'Shipping info saved', data });
});

// Start server
app.listen(PORT, () => {
  console.log(`Backend running at http://localhost:${PORT}`);
});
