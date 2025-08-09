import { Product } from "./product";

export interface ProductsResponse {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
}