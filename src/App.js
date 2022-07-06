import logo from "./logo.svg";
import "./App.css";
import Home from "./pages/Home";
import React from "react";
import Cart from "./pages/Cart";
import Header from "./components/Header";

function App() {
  const [cart, setCart] = React.useState([]);
  const [mode, setmode] = React.useState(true);

  const handleMode = () => {
    setmode((prev) => !prev);
  };

  const cartOption = {
    cart,
    setCart,
  };
  return (
    <div className="">
      <Header handleMode={handleMode} />

      {mode ? <Home {...cartOption} /> : <Cart {...cartOption} />}
    </div>
  );
}

export default App;
