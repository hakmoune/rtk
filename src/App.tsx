import { Box, Button, Container, Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "./state/store";
import { increment, decrement } from "./state/counter/counterSlice";
import { fetchProducts } from "./state/products/productsSlice";
import { useEffect } from "react";
import Product from "./components/Product";

function App() {
  const { value: counter } = useSelector((state: RootState) => state.counter);
  const { products, status, error } = useSelector(
    (state: RootState) => state.products
  );
  const dispatch: AppDispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  if (status === "loading") return <Typography>Loading...</Typography>;
  if (status === "failed") return <Typography>Error: {error}</Typography>;

  return (
    <Box>
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
