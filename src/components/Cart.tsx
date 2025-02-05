import { Box, Button, TextField } from "@mui/material";
import { ICart } from "../state/carts/types";
import { deleteCart, updateCart } from "../state/carts/cartsSlice";
import { AppDispatch } from "../state/store";
import { useDispatch } from "react-redux";
import { useState } from "react";

interface IState {
  id: number;
  quantity: number;
}

const Cart = ({ cart }: { cart: ICart }) => {
  const [products, setProducts] = useState<IState>({
    id: 10,
    quantity: 0,
  });

  const dispatch: AppDispatch = useDispatch();

  const handleUpdate = () => {
    dispatch(
      updateCart({
        cartId: cart.id,
        merge: true,
        products: [
          {
            id: products.id,
            quantity: products.quantity,
          },
        ],
      })
    );
  };

  return (
    <Box sx={{ listStyle: "none", mb: 4 }}>
      {cart.products.map((product) => {
        return (
          <li style={{ marginBottom: 10 }}>
            <TextField variant="outlined" value={product.title} label="Title" />
            <TextField
              variant="outlined"
              value={products.quantity}
              label="Quantity"
              onChange={(e) =>
                setProducts({ ...products, quantity: Number(e.target.value) })
              }
            />
            <Button onClick={handleUpdate}>Update</Button>
            <Button onClick={() => dispatch(deleteCart(cart.id))}>
              Delete
            </Button>
          </li>
        );
      })}
    </Box>
  );
};

export default Cart;
