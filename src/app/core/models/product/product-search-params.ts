export interface ProductSearchParams {
  q?: string;
  limit?: number;
  skip?: number;
  select?: string;
  sortBy?: string;
  order?: 'asc' | 'desc';
  category?: string;
}