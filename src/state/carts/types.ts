import { EntityState } from "@reduxjs/toolkit";

export interface IProduct {
  id: number;
  title: string;
  price: number;
  quantity: number;
  total: number;
  discountPercentage: number;
  discountedTotal: number;
  thumbnail: string;
}

export interface ICart {
  id: number;
  products: IProduct[];
  total: number;
  discountedTotal: number;
  userId: number;
  totalProducts: number;
  totalQuantity: number;
  isDeleted?: boolean;
  deletedOn?: string;
}

export interface IinitialState extends EntityState<ICart, number> {
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}
