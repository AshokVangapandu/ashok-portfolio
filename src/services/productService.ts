/* src/services/productService.ts */
import productsData from '../data/products.json';
import { Product } from '../types/Product';

export const productService = {
  async getProducts(): Promise<Product[]> {
    // Return all products (casting due to JSON import types)
    return productsData as Product[];
  },

  async getFeaturedProduct(): Promise<Product | null> {
    const products = await this.getProducts();
    return products.find(p => p.featured) || null;
  }
};

export default productService;
