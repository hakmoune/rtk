import { Button, TextField } from "@mui/material";
import { TProduct } from "../state/products/types";
import { useDispatch } from "react-redux";
import {
  deleteProductById,
  updateProductById,
} from "../state/products/productsSlice";
import { AppDispatch } from "../state/store";
import { useState } from "react";

const Product = ({ product }: { product: TProduct }) => {
  const [value, setValue] = useState<string>(product.title);
  const dispatch: AppDispatch = useDispatch();

  return (
    <li style={{ listStyle: "none", marginBottom: "10px" }}>
      <TextField
        value={value}
        onChange={(e) => setValue(e.target.value)}
        variant="outlined"
      />
      <Button
        onClick={() =>
          dispatch(updateProductById({ id: product.id, title: value }))
        }
      >
        Update
      </Button>
      <Button onClick={() => dispatch(deleteProductById(product))}>
        Delete
      </Button>
    </li>
  );
};

export default Product;
