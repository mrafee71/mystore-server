const express = require('express');
const Product = require('../models/Product');
const { protect } = require('../middleware/authmiddleware');

const router = express.Router();

// @route POST / api/products
// @desc Create a new product
// @access Private/Admin
router.post("/", protect, async (req, res) => {
    try {
        const { 
            name, 
            description, 
            price, 
            discountPrice, 
            countInStock, 
            category, 
            brand, 
            sizes, 
            colors, 
            collections, 
            material, 
            gender, 
            images, 
            isFeatured, 
            isPublished, 
            tags, 
            dimensions, 
            weight, 
            sku 
        } = req.body;

        const product = new Product({ 
            name, 
            description, 
            price, 
            discountPrice, 
            countInStock, 
            category, 
            brand, 
            sizes, 
            colors, 
            collections, 
            material, 
            gender, 
            images, 
            isFeatured, 
            isPublished, 
            tags, 
            dimensions, 
            weight, 
            sku, 
            user: req.user._id //Refrence to the Admin user who created it
        });

        const createdProduct = await product.save();
        res.status(201).json(createdProduct);

    } catch (error) {
        console.error(error);
        res.status(500).send("Server Error")
    }
});

module.exports = router;