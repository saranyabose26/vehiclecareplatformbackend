import Category from '../models/categoryModel.js'
import asyncHandler from "../middlewares/asyncHandler.js";

const createCategory = asyncHandler(async (req, res) => {
    try {
        const { name } = req.body;

        if (!name) {
            return res.status(400).json({ error: "Name is required" });
        }

        const existingCategory = await Category.findOne({ name });

        if (existingCategory) {
            return res.status(400).json({ error: "Category Already Exists" });
        }

        const newCategory = new Category({ name });
        await newCategory.save();

        res.status(201).json(newCategory); // Use 201 Created for successful creation

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

const updateCategory = asyncHandler(async (req, res) => {
    try {
        const { categoryId } = req.params;

        const category = await Category.findById(categoryId);
        if (!category) {
            return res.status(404).json({ error: "Category Not Found" });
        }

        const { name } = req.body;
        category.name = name || category.name;
        await category.save();

        res.json(category);

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

const removeCategory = asyncHandler(async (req, res) => {
    try {
        const { categoryId } = req.params;

        const category = await Category.findById(categoryId);
        if (!category) {
            return res.status(404).json({ error: "Category Not Found" });
        }

        const removed = await Category.findByIdAndDelete(categoryId);

        res.json(removed);

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

const allCategories = asyncHandler(async (req, res) => {
    try {
        const all = await Category.find({});
        res.json(all);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

const readCategory = asyncHandler(async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        if (!category) {
            return res.status(404).json({ error: "Category Not Found" });
        }
        res.json(category);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

export { createCategory, updateCategory, removeCategory, allCategories, readCategory };
