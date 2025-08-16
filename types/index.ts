export interface Product {
  product_name: string;
  price: number;
  description: string;
  brand: string;
  category: string;
}

export interface Recommendation {
  product: Product;
  reason: string;
  isTopPick?: boolean;
}



export interface Badge {
  text: string;
  icon: React.ReactNode;
};