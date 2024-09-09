import asyncHandler from "../middlewares/asyncHandler.js";
import Product from "../models/productModel.js";

export const addProduct = asyncHandler(async (req, res) => {
    try {
        const { name, description, price, category, quantity, brand, countInStock } = req.body;

        // Validate fields
        if (!name || !description || !price || !category || !quantity || !brand || !countInStock) {
            return res.status(400).json({ error: "All fields are required" });
        }

        const product = new Product({ ...req.body });
        await product.save();
        res.status(201).json({ product });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});

export const updateProduct = asyncHandler(async (req, res) => {
    try {
        const { name, description, price, category, quantity, brand } = req.body;

        // Validate fields
        if (!name || !description || !price || !category || !quantity || !brand) {
            return res.status(400).json({ error: "All fields are required" });
        }

        const product = await Product.findByIdAndUpdate(req.params.id, { ...req.body }, { new: true });
        if (!product) {
            return res.status(404).json({ error: "Product not found" });
        }
        await product.save();
        res.json(product);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});

export const removeProduct = asyncHandler(async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) {
            return res.status(404).json({ error: "Product not found" });
        }
        res.json(product);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
});

export const fetchProducts = asyncHandler(async (req, res) => {
    try {
        const pageSize = 6;
        const page = Number(req.query.page) || 1;
        const keyword = req.query.keyword ? { name: { $regex: req.query.keyword, $options: "i" } } : {};
        const count = await Product.countDocuments({ ...keyword });
        const products = await Product.find({ ...keyword }).limit(pageSize).skip(pageSize * (page - 1));

        res.json({ products, page, pages: Math.ceil(count / pageSize), hasMore: page * pageSize < count });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
});

export const fetchProductsById = asyncHandler(async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (product) {
            res.json(product);
        } else {
            res.status(404).json({ error: "Product not found" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
});

export const fetchAllProducts = asyncHandler(async (req, res) => {
    try {
        const products = await Product.find({}).populate('category').sort({ createdAt: -1 });
        res.json(products);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
});

export const addProductReview = asyncHandler(async (req, res) => {
    try {
        const { rating, comment } = req.body;
        const product = await Product.findById(req.params.id);

        if (product) {
            const alreadyReviewed = product.reviews.find(
                (r) => r.user.toString() === req.user._id.toString()
            );

            if (alreadyReviewed) {
                return res.status(400).json({ message: "Product already reviewed" });
            }

            const review = {
                name: req.user.username,
                rating: Number(rating),
                comment,
                user: req.user._id,
            };

            product.reviews.push(review);
            product.numReviews = product.reviews.length;
            product.rating = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length;

            await product.save();
            res.status(201).json({ message: "Review added" });
        } else {
            res.status(404).json({ error: "Product not found" });
        }
    } catch (error) {
        console.error(error);
        res.status(400).json({ error: error.message });
    }
});

export const fetchTopProducts = asyncHandler(async (req, res) => {
    try {
        const products = await Product.find({}).sort({ rating: -1 }).limit(4);
        res.json(products);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
});

export const fetchNewProducts = asyncHandler(async (req, res) => {
    try {
        const products = await Product.find().sort({ _id: -1 }).limit(4);
        res.json(products);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
});

export const filteredProducts = asyncHandler(async (req, res) => {
    try {
        const { checked, radio } = req.body;
        let args = {};
        if (checked?.length > 0) args.category = { $in: checked };
        if (radio?.length > 0) args.price = { $gte: radio[0], $lte: radio[1] };

        const products = await Product.find(args);
        res.json(products);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
});
