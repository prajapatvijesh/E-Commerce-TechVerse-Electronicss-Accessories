import { Request, Response } from 'express';
import { getProducts } from '../../src/controllers/productController';
import { Product } from '../../src/models/Product';

jest.mock('../../src/models/Product');

describe('Product Controller', () => {
  describe('getProducts', () => {
    it('should return a list of products', async () => {
      const mockProducts = [
        { name: 'Test Product 1', price: 100 },
        { name: 'Test Product 2', price: 200 }
      ];

      (Product.find as jest.Mock).mockReturnValue({
        populate: jest.fn().mockResolvedValue(mockProducts)
      });

      const req = {
        query: {}
      } as unknown as Request;

      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis()
      } as unknown as Response;

      await getProducts(req, res);

      expect(res.json).toHaveBeenCalledWith({
        status: 'success',
        results: 2,
        data: mockProducts
      });
    });
  });
});
