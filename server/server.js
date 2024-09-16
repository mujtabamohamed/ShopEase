import express from "express";
import cors from "cors";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import pool from "./db.js";

const app = express();
const PORT = process.env.PORT ?? 8000;

app.use(cors());
app.use(express.json());


function extractErrorMessage(error) {
    if (error && error.detail) {
      const match = error.detail.match(/\(([^)]+)\) already exists/);
      if (match) {
        return `${match[1]} already exists`;
      }
    }
    return 'An unknown error occurred';
  }


// Retrieve all products
app.get('/products', async (req, res) => {

    try {
        const client = await pool.connect();
        const products = await client.query('SELECT * FROM products');
        client.release();

        res.json(products.rows);

    } catch (err) {
        console.error(err); 
        res.status(500).json({ error: 'Failed to fetch products' });
    }
});


// Retrieve cart items of a specific buyer
app.get('/cart/:user_id', async (req, res) => {
    const userId = parseInt(req.params.user_id, 10);

    // console.log('Received user_id:', userId);

    if (isNaN(userId)) {
        return res.status(400).json({ error: 'Invalid user_id' });
    }

    try {
        const client = await pool.connect();
        const query = `
            SELECT products.product_name, products.price, products.description, products.imageurl, cart.quantity, cart.product_id
            FROM cart
            JOIN products ON cart.product_id = products.id
            WHERE cart.user_id = $1
        `;

        const cartItems = await client.query(query, [userId]);
        client.release(); // Release the client back to the pool

        res.json({
            success: true,
            items: cartItems.rows
        });

    } catch (err) {
        console.error('Error retrieving cart items:', err); 
        res.status(500).json({ error: 'Failed to retrieve cart items' });
    }
});


// Add product to buyer's cart
app.post('/cart/add', async (req, res) => {
    const { user_id, product_id, quantity } = req.body;
    // console.log('Request Body:', req.body);
  
    try {
      const result = await pool.query(
        'INSERT INTO cart (user_id, product_id, quantity) VALUES ($1, $2, $3) ON CONFLICT (user_id, product_id) DO UPDATE SET quantity = cart.quantity + EXCLUDED.quantity',
        [user_id, product_id, quantity]
      );
      res.status(200).json({ message: 'Product added to cart' });
    } catch (error) {
      console.error('Error adding product to cart:', error);
      res.status(500).json({ message: 'Failed to add product to cart' });
    }
  });
  

// Remove product from buyer's cart
app.delete('/cart/:user_id/:product_id', async (req, res) => {
    const { user_id, product_id } = req.params;

    if (!user_id || !product_id) {
        return res.status(400).json({ message: 'Missing user_id or product_id' });
    }

    try {
        const result = await pool.query(
            'DELETE FROM cart WHERE user_id = $1 AND product_id = $2',
            [user_id, product_id]
        );

        if (result.rowCount > 0) {
            return res.status(200).json({ message: 'Item removed from cart' });
        } else {
            return res.status(404).json({ message: 'Item not found in cart' });
        }
    } catch (error) {
        console.error('Error removing item from cart:', error);
        return res.status(500).json({ message: 'Failed to remove item from cart' });
    }
});


// Retrieve products for a specific seller
app.get('/dashboard/:user_id', async (req, res) => {
    const userId = parseInt(req.params.user_id, 10);

    // console.log('Received user_id:', userId);

    if (isNaN(userId)) {
        return res.status(400).json({ error: 'Invalid user_id' });
    }

    try {
        const client = await pool.connect();
        const query = `
            SELECT products.id, products.product_name, products.category, products.description, products.price, products.imageurl
            FROM users
            JOIN products ON users.id = products.user_id
            WHERE users.id = $1
        `;

        const sellerItems = await client.query(query, [userId]);
        client.release();

        res.json({
            success: true,
            items: sellerItems.rows
        });

    } catch (err) {
        console.error('Error retrieving products:', err); 
        res.status(500).json({ error: 'Failed to retrieve products' });
    }
});


// Add a new seller product  
app.post('/dashboard/add/:user_id', async(req, res) => {
    const userId = parseInt(req.params.user_id, 10);
    const { product_name, category, description, price, imageurl } = req.body;
    // console.log('Received user_id:', userId);

    if (isNaN(userId)) {
        return res.status(400).json({ error: 'Invalid user_id' });
    }

    if (!product_name || !category || !description || !price || !imageurl) {
        return res.status(400).json({ error: 'All fields are required.' });
      }    

    try {
        const newProduct =  
        await pool.query(
            'INSERT INTO products(user_id, product_name, category, description, price, imageurl) VALUES($1, $2, $3, $4, $5, $6) RETURNING *',
            [userId, product_name, category, description, price, imageurl]);

        res.status(201).json(newProduct.rows[0]);

    } catch (err) {
        console.error('Database insert error:', err);
        return res.status(500).json({ error: 'Failed to add product' });
    }
});


// Delete seller product  
app.delete('/dashboard/delete/:user_id/:product_id', async (req, res) => {
    const { user_id, product_id } = req.params;
  
    if (isNaN(user_id) || isNaN(product_id)) {
      return res.status(400).json({ error: 'Invalid user_id or product_id' });
    }
  
    try {
      const result = await pool.query(
        'DELETE FROM products WHERE user_id = $1 AND id = $2',
        [user_id, product_id]
      );
  
      if (result.rowCount > 0) {
        res.status(200).json({ message: 'Product deleted successfully' });
      } else {
        res.status(404).json({ error: 'Product not found' });
      }
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Database error' });
    }
  });


// Edit seller product  
  app.put('/dashboard/edit/:user_id/:product_id', async(req, res) => {
    const { user_id, product_id } = req.params;
    const { product_name, category, description, price, imageurl } = req.body;
    // console.log('Received user_id:', user_id);

    if (isNaN(user_id) || isNaN(product_id)) {
        return res.status(400).json({ error: 'Invalid user_id or product_id' });
    }

    if (!product_name || !category || !description || !price || !imageurl) {
        return res.status(400).json({ error: 'All fields are required.' });
    } 

    try {
        const editProduct = 
        await pool.query(
            'UPDATE products SET product_name=$1, category=$2, description=$3, price=$4, imageurl=$5 WHERE id=$6 RETURNING *;',
            [product_name, category, description, price, imageurl, product_id]); // Notice: Using product_id here

        res.status(200).json(editProduct.rows[0]); // Corrected to send a single response

    } catch (err) {
        console.error('Database edit error:', err); 
        return res.status(500).json({ error: 'Failed to edit product' });
    }
});
 

// Sign up
app.post('/signup', async(req, res) => {
    const { email, password, role } = req.body;
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);
    try {
        const signup = await pool.query("INSERT INTO users (email, password, role) VALUES($1, $2, $3) RETURNING id",
            [email, hashedPassword, role]);
        
        const user_id = signup.rows[0].id; 
        const token = jwt.sign({ email }, 'secret', { expiresIn: '1hr' });
        res.json({ email, token, user_id });

    } catch (err) {
        console.error(err);

        if(err) {
            const errorMessage = extractErrorMessage(err);
            res.json({ detail: errorMessage });
            console.log(errorMessage);
        }
    }
});


// Login
app.post('/login', async(req, res) => {
    const { email, password } = req.body;

    try {
        const users = await pool.query('SELECT * FROM users WHERE email=$1', [email]);

        if(!users.rows.length) return res.json({ detail: "User does not exist!" });

        const success = await bcrypt.compare(password, users.rows[0].password);
        
        if(success) {
            const token = jwt.sign({ email, user_id: users.rows[0].id, role: users.rows[0].role }, 'secret', { expiresIn: '1hr' });
            res.json({ 'email' : users.rows[0].email, token, user_id: users.rows[0].id, role: users.rows[0].role });
        
        } else {
            res.json({ detail:  "Login failed" });
        }

    } catch (err) {
        console.error(err);
    }
});


app.listen(PORT, () => {
    console.log(`Server running on PORT ${PORT}`);
});