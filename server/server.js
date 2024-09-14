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

app.get('/cart/:user_id', async (req, res) => {
    const userId = parseInt(req.params.user_id, 10);

    console.log('Received user_id:', userId);

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


// Example route for adding an item to the cart
app.post('/cart/add', async (req, res) => {
    const { user_id, product_id, quantity } = req.body;
    console.log('Request Body:', req.body);
  
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
  

// Remove product from cart endpoint
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


// sign up

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


// login

app.post('/login', async(req, res) => {
    const { email, password } = req.body;

    try {
        const users = await pool.query('SELECT * FROM users WHERE email=$1', [email]);

        if(!users.rows.length) return res.json({ detail: "User does not exist!" });

        const success = await bcrypt.compare(password, users.rows[0].password);
        const token = jwt.sign({ email, user_id: users.rows[0].id }, 'secret', { expiresIn: '1hr' });
        
        if(success) {
            res.json({ 'email' : users.rows[0].email, token, user_id: users.rows[0].id });
        
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