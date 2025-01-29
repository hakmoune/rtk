import { Button } from "@mui/material";
import { TProduct } from "../state/products/types";
import { useDispatch } from "react-redux";
import { deleteProductById } from "../state/products/productsSlice";
import { AppDispatch } from "../state/store";

const Product = ({ product }: { product: TProduct }) => {
  const dispatch: AppDispatch = useDispatch();

  return (
    <li>
      {product.title}
      <Button onClick={() => dispatch(deleteProductById(product))}>
        Delete
      </Button>
    </li>
  );
};

export default Product;
