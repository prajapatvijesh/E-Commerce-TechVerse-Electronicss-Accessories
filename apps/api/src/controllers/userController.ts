import { Request, Response } from 'express';
import { User } from '../models/User';

export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find({}).select('-password');
    res.json({ status: 'success', data: users });
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.params.id);
    if (user) {
      await User.deleteOne({ _id: user._id });
      res.json({ status: 'success', message: 'User removed' });
    } else {
      res.status(404).json({ status: 'error', message: 'User not found' });
    }
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.params.id);
    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      user.role = req.body.role || user.role;
      const updatedUser = await user.save();
      res.json({
        status: 'success',
        data: { _id: updatedUser._id, name: updatedUser.name, email: updatedUser.email, role: updatedUser.role }
      });
    } else {
      res.status(404).json({ status: 'error', message: 'User not found' });
    }
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};
