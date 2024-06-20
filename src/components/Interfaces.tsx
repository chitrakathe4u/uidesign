export interface User {
  phone_number: string;
  email: string | null;
  is_active: boolean;
  is_staff: boolean;
  user_registered_at: string;
}

export interface Size {
  id: number;
  name: string;
}

export interface Category {
  id: number;
  name: string;
  gender: string;
}

interface Product {
  id: number;
  product: {
    id: number;
    brand: {
      id: number;
      name: string;
    };
    name: string;
    category: Category;
  };
  size: {
    id: number;
    name: string;
  };
  product_token: string;
  color: string;
  image: string;
  description: string;
  actual_price: string;
  selling_price: string;
  discounted_price: string;
  discount_percentage: string;
  gender: string;
}

export default Product;

export interface Address {
  id: number;
  user: string;
  street_address: string;
  apartment_number: string;
  city: string;
  state: string;
  pin_code: string;
  landmark: string;
}

export interface CartItem {
  id: number;
  quantity: number;
  product: Product;
}

export interface Payment {
  user: User;
  amount: number;
  payment_method: string;
  transaction_id: string;
  created_at: string;
}

export interface OrderItems {
  user: User;
  order_id: string;
  ordered_items: Product[];
  payment: Payment;
  shipping_address: Address;
  created_at: string;
  status: string;
}

export interface SearchResultProps {
  query: string;
}

export interface Profile {
  user: User;
  date_of_birth: string | null;
  first_name: string;
  last_name: string;
  profile_picture: string | null;
}

export interface Brand extends Size {}

export interface ProductAttribute {
  id: number;
  key: string;
  value: string;
  product: Product;
}
export interface BaseProduct {
  id: number;
  name: string;
  category: Category;
  brand: Brand;
}
