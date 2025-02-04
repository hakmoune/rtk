import { Box, Button, Container, Typography } from "@mui/material";
import Cart from "./Cart";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../state/store";
import { useEffect } from "react";
import {
  fetchCarts,
  selectAllCarts,
  selectCartsStatus,
  selectCartsError,
  createCart,
  selectCartById,
  selectCartIds,
} from "../state/carts/cartsSlice";

const Carts = () => {
  const dispatch: AppDispatch = useDispatch();

  // Carts
  const carts = useSelector(selectAllCarts);
  const cartsStatus = useSelector(selectCartsStatus);
  const cartsError = useSelector(selectCartsError);
  const cartById = useSelector((state: RootState) => selectCartById(state, 1)); // if the cart does not exist, it simply returns undefined.
  const cartsIds = useSelector(selectCartIds);

  useEffect(() => {
    dispatch(fetchCarts());
  }, [dispatch]);

  if (cartsStatus === "loading") return <Typography>Loading...</Typography>;
  if (cartsStatus === "failed") return <Typography>{cartsError}</Typography>;
  if (!cartById) return <Typography>Cart by ID is not found</Typography>;

  // Add Cart
  const handleAddCart = () => {
    dispatch(
      createCart({
        userId: 1,
        products: [
          { id: 100, quantity: 10 },
          { id: 200, quantity: 10 },
          { id: 300, quantity: 10 },
        ],
      })
    );
  };

  return (
    <Container>
      <Typography variant="h4" component="h3">
        Carts
      </Typography>
      <Box sx={{ m: 3 }}>
        <Button variant="contained" onClick={handleAddCart}>
          Add Cart
        </Button>
      </Box>
      <ul>
        {carts.map((cart) => (
          <Cart cart={cart} key={cart.id} />
        ))}
      </ul>
    </Container>
  );
};

export default Carts;
