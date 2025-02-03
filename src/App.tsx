import { Box, Button, Container, Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "./state/store";
import { increment, decrement } from "./state/counter/counterSlice";
import { fetchProducts } from "./state/products/productsSlice";
import { useEffect } from "react";
import Product from "./components/Product";
import {
  fetchCarts,
  selectAllCarts,
  selectCartsError,
  selectCartsStatus,
  createCart,
} from "./state/carts/cartsSlice";

function App() {
  // Counter
  const { value: counter } = useSelector((state: RootState) => state.counter);

  const dispatch: AppDispatch = useDispatch();

  // Products
  const { products, status, error } = useSelector(
    (state: RootState) => state.products
  );

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  // Carts
  const carts = useSelector(selectAllCarts);
  const cartsStatus = useSelector(selectCartsStatus);
  const cartsError = useSelector(selectCartsError);

  useEffect(() => {
    dispatch(fetchCarts());
  }, [dispatch]);

  if (cartsStatus === "loading") return <Typography>Loading...</Typography>;
  if (cartsStatus === "failed") return <Typography>{cartsError}</Typography>;

  if (status === "loading") return <Typography>Loading...</Typography>;
  if (status === "failed") return <Typography>{error}</Typography>;

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
    <Box>
      <Box>
        <Button variant="contained" onClick={handleAddCart}>
          Add Cart
        </Button>
      </Box>
      <Box>
        <Typography
          variant="h3"
          component="h1"
          sx={{ textAlign: "center", marginTop: "10px" }}
        >
          Counter: {counter}
        </Typography>
      </Box>
      <Box
        sx={{
          display: "flex",
          gap: 3,
          justifyContent: "center",
          margin: "30px 0",
        }}
      >
        <Button variant="contained" onClick={() => dispatch(increment(2))}>
          Increment
        </Button>
        <Button variant="contained" onClick={() => dispatch(decrement())}>
          Decrement
        </Button>
      </Box>
      <Container>
        <Typography variant="h4" component="h3">
          Products
        </Typography>
        <ul>
          {products.map((product) => (
            <Product product={product} key={product.id} />
          ))}
        </ul>
      </Container>
    </Box>
  );
}

export default App;
