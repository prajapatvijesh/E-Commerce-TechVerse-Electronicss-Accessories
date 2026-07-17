import { Request, Response } from 'express';
import { Brand } from '../models/Brand';

export const getBrands = async (req: Request, res: Response) => {
  try {
    const brands = await Brand.find({});
    res.json({ status: 'success', data: brands });
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

export const createBrand = async (req: Request, res: Response) => {
  try {
    const { name, description, logo, isActive } = req.body;
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const brand = await Brand.create({ name, slug, description, logo, isActive });
    res.status(201).json({ status: 'success', data: brand });
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

export const updateBrand = async (req: Request, res: Response) => {
  try {
    const brand = await Brand.findById(req.params.id);
    if (brand) {
      brand.name = req.body.name || brand.name;
      if (req.body.name) {
        brand.slug = req.body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      }
      brand.description = req.body.description !== undefined ? req.body.description : brand.description;
      brand.logo = req.body.logo !== undefined ? req.body.logo : brand.logo;
      brand.isActive = req.body.isActive !== undefined ? req.body.isActive : brand.isActive;
      const updatedBrand = await brand.save();
      res.json({ status: 'success', data: updatedBrand });
    } else {
      res.status(404).json({ status: 'error', message: 'Brand not found' });
    }
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

export const deleteBrand = async (req: Request, res: Response) => {
  try {
    const brand = await Brand.findById(req.params.id);
    if (brand) {
      await Brand.deleteOne({ _id: brand._id });
      res.json({ status: 'success', message: 'Brand removed' });
    } else {
      res.status(404).json({ status: 'error', message: 'Brand not found' });
    }
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};
