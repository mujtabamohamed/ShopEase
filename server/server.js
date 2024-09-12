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

app.get('/cart', async (req, res) => {
    const buyer_id = req.query.buyer_id;  // Assuming you're passing the buyer_id as a query param

    try {
        const client = await pool.connect();

        // Join cart and products to get product details
        const query = `
            SELECT products.name, products.price, products.description
            FROM cart
            JOIN products ON cart.product_id = products.id
            WHERE cart.buyer_id = $1
        `;
        const cartItems = await client.query(query, [buyer_id]);

        res.json(cartItems.rows);

    } catch (err) {
        console.error(err); 
        res.status(500).json({ error: 'Failed to retrieve cart items' });
    }
});



app.post('/signup', async(req, res) => {
    const { email, password, role } = req.body;
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);
    try {
        const signup = await pool.query("INSERT INTO users (email, password, role) VALUES($1, $2, $3)",
            [email, hashedPassword, role]);
        
        const token = jwt.sign({ email }, 'secret', { expiresIn: '1hr' });
        res.json({email, token});

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
        const token = jwt.sign({ email }, 'secret', { expiresIn: '1hr' });
        
        if(success) {
            res.json({ 'email' : users.rows[0].email, token});
        
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