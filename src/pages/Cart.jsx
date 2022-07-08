import React from "react";
import { useEffect } from "react";
import { useState } from "react";

const Cart = ({ cart, setCart }) => {
  const [totalAmount, setTotalAmount] = useState(0);

  const calculate = (cart) => {
    let temp = cart.reduce(
      (prevVal, curr) => prevVal + curr.price * curr.qty,
      0
    );
    setTotalAmount(temp);
  };

  useEffect(() => {
    calculate(cart);
  }, [cart]);

  const removeFromCart = (item) => {
    setCart((prev) => prev.filter((p) => p.id !== item.id));
  };
  const handleQuantity = (id, value) => {
    let tempCart = cart.map((p) =>
      p.id === id ? { ...p, qty: parseInt(value) } : p
    );
    setCart(tempCart);
    // calculate(tempCart);
  };
  return (
    <div className="cart_container">
      <h3>Shopping Cart</h3>
      <div className="cart_block">
        {cart.map((product) => (
          <ProductBox
            key={product.id}
            product={product}
            removeFromCart={removeFromCart}
            handleQuantity={handleQuantity}
          />
        ))}
      </div>
      <div>
        <h2>Total Amount</h2>
        <h2>{totalAmount}</h2>
      </div>
    </div>
  );
};

export default Cart;

const ProductBox = ({ product, removeFromCart, handleQuantity }) => {
  let options = new Array(product.quantity);
  options.fill(0);
  const [qty, setQty] = useState(1);

  const handleDelete = () => {
    removeFromCart(product);
  };

  const handleOptionChange = (e) => {
    setQty(e.target.value);
    handleQuantity(product.id, e.target.value);
  };

  return (
    <div className="cart_box">
      <div className="cart_img">
        <img src={product.imageURL} alt={product.name} width="100%" />
      </div>
      <div className="cart_box_2">
        <h4>{product.name}</h4>
        <h4>{product.price}</h4>
      </div>
      <div className="cart_box_3">
        <select value={qty} onChange={handleOptionChange}>
          {options.map((a, i) => (
            <option key={i} value={i + 1}>
              {i + 1}
            </option>
          ))}
        </select>
        <button onClick={handleDelete}>Delete</button>
      </div>
    </div>
  );
};
