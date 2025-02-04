import { Box, Button, TextField } from "@mui/material";
import { ICart } from "../state/carts/types";

const Cart = ({ cart }: { cart: ICart }) => {
  return (
    <Box sx={{ listStyle: "none", mb: 4 }}>
      {cart.products.map((product) => {
        return (
          <li style={{ marginBottom: 10 }}>
            <TextField variant="outlined" value={product.title} label="Title" />
            <TextField
              variant="outlined"
              value={product.quantity}
              label="Quantity"
            />
            <Button>Update</Button>
            <Button>Delete</Button>
          </li>
        );
      })}
    </Box>
  );
};

export default Cart;
