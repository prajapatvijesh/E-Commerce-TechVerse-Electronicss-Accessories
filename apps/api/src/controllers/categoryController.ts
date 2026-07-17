import { Request, Response } from 'express';
import { Category } from '../models/Category';

export const getCategories = async (req: Request, res: Response) => {
  try {
    const categories = await Category.find({});
    res.json({ status: 'success', data: categories });
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

export const createCategory = async (req: Request, res: Response) => {
  try {
    const { name, description, image, isActive } = req.body;
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const category = await Category.create({ name, slug, description, image, isActive });
    res.status(201).json({ status: 'success', data: category });
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

export const updateCategory = async (req: Request, res: Response) => {
  try {
    const category = await Category.findById(req.params.id);
    if (category) {
      category.name = req.body.name || category.name;
      if (req.body.name) {
        category.slug = req.body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      }
      category.description = req.body.description !== undefined ? req.body.description : category.description;
      category.image = req.body.image !== undefined ? req.body.image : category.image;
      category.isActive = req.body.isActive !== undefined ? req.body.isActive : category.isActive;
      const updatedCategory = await category.save();
      res.json({ status: 'success', data: updatedCategory });
    } else {
      res.status(404).json({ status: 'error', message: 'Category not found' });
    }
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

export const deleteCategory = async (req: Request, res: Response) => {
  try {
    const category = await Category.findById(req.params.id);
    if (category) {
      await Category.deleteOne({ _id: category._id });
      res.json({ status: 'success', message: 'Category removed' });
    } else {
      res.status(404).json({ status: 'error', message: 'Category not found' });
    }
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};
