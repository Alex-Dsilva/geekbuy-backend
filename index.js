const express=require("express");
const mongoose=require("mongoose");
const { connection } = require("./config/db");
const { UserRouter } = require("./Routes/user.router");
const {ProductRouter} = require("./Routes/product.router");
const {cartRouter} = require("./Routes/cart.router");
const {WishlistRouter} = require("./Routes/wishlist.router");

const authMiddleware = require('./middleware/auth');
const app =express();
app.use(express.json());

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
  });

app.get("/",authMiddleware, (req, res) => {
    res.send("welcome");
});

app.use("/users",UserRouter)
app.use("/products", ProductRouter)
app.use("/cart", cartRouter)
app.use("/wishlist", WishlistRouter)

app.listen(process.env.port, async () => {
    try {
         await connection;
         console.log("connected to db");
    } catch (err) {
         console.log(err);
    }
    console.log(`working on ${process.env.port}`);
});

