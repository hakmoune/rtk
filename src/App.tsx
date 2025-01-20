import { Box, Button, Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "./state/store";
import { increment, decrement } from "./state/counter/counterSlice";

function App() {
  const counter = useSelector((state: RootState) => state.counter.value);
  const disptch: AppDispatch = useDispatch();

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
        <Button variant="contained" onClick={() => disptch(increment(2))}>
          Increment
        </Button>
        <Button variant="contained" onClick={() => disptch(decrement(2))}>
          Decrement
        </Button>
      </Box>
    </Box>
  );
}

export default App;
