export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  currency: string;
  category: string;
  image: string;
  status: string;
  stock: number;
  options: {
    sizes?: string[];
    colors?: {
      name: string;
      image: string;
    }[];
  };
  tags: string[];
  moreDetails: string[];
}
