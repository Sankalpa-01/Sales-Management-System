const Product = require('../models/Product');

// Get all products
const getAllProducts = async (req, res, next) => {
    try {
        const products = await Product.getAllProducts();
        res.status(200).json(products);
    } catch (err) {
        console.error('Error fetching products:', err);
        next({ statusCode: 500, message: 'Database error', error: err });
    }
};

// Get a single product by ID
const getProductById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const product = await Product.getProductById(id);

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json(product);
    } catch (err) {
        console.error('Error fetching product:', err);
        next({ statusCode: 500, message: 'Database error', error: err });
    }
};

// Add a new product
const addProduct = async (req, res) => {
    try {
        let { product_name, product_description, price, stock_quantity } = req.body;

        // Sanitize and validate
        product_name = product_name?.trim();
        product_description = product_description?.trim();

        if (!product_name || price === undefined || stock_quantity === undefined) {
            return res.status(400).json({
                message: 'Missing required fields',
                missing: {
                    product_name: !product_name,
                    price: price === undefined,
                    stock_quantity: stock_quantity === undefined
                }
            });
        }

        if (isNaN(price) || isNaN(stock_quantity) || price < 0 || stock_quantity < 0) {
            return res.status(400).json({
                message: 'Price and stock_quantity must be non-negative numbers'
            });
        }

        const insertId = await Product.addProduct(
            product_name,
            product_description,
            parseFloat(price),
            parseInt(stock_quantity)
        );

        return res.status(201).json({
            message: 'Product added successfully',
            product_id: insertId
        });
    } catch (error) {
        console.error('Error adding product:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

// Update an existing product
const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        let { product_name, price, stock_quantity } = req.body;

        // Sanitize and validate
        product_name = product_name?.trim();

        if (!product_name || price === undefined || stock_quantity === undefined) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        if (isNaN(price) || isNaN(stock_quantity) || price < 0 || stock_quantity < 0) {
            return res.status(400).json({
                message: 'Price and stock_quantity must be non-negative numbers'
            });
        }

        const success = await Product.updateProduct(
            id,
            product_name,
            parseFloat(price),
            parseInt(stock_quantity)
        );

        if (success) {
            return res.status(200).json({ message: 'Product updated successfully' });
        } else {
            return res.status(404).json({ message: 'Product not found or not updated' });
        }
    } catch (error) {
        console.error('Error updating product:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

// Delete a product
const deleteProduct = async (req, res, next) => {
    try {
        const { id } = req.params;
        const deleted = await Product.deleteProduct(id);

        if (!deleted) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.status(200).json({ message: 'Product deleted successfully' });
    } catch (err) {
        console.error('Error deleting product:', err);
        next({ statusCode: 500, message: 'Database error', error: err });
    }
};

module.exports = {
    getAllProducts,
    getProductById,
    addProduct,
    updateProduct,
    deleteProduct
};
