import React from "react";
import { useCart } from "../../component/CartContext/CartContext";
import { FaTrash, FaPlus, FaMinus } from "react-icons/fa";
// import axios from "axios";
import { useNavigate } from "react-router-dom";
import api from "../../api/api";

const Cart = () => {
  const { cart, removeFromCart, increaseQty, decreaseQty, clearCart } =
    useCart();

  const [address, setAddress] = React.useState({
    street: "",
    city: "",
    notes: "",
  });

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const go = useNavigate();

  const btnStyle = {
    border: "none",
    padding: 8,
    borderRadius: 8,
    cursor: "pointer",
    background: "#eee",
  };

  // ================= CREATE ORDER =================
  const createOrder = async () => {
    const token = localStorage.getItem("token");

    if (!address.street || !address.city) {
      return alert("Please enter full address");
    }

    const payload = {
      items: cart,
      address,
    };

    try {
      const res = await api.post(
        "/api/v1/orders/create",
        payload,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      clearCart();
      go("/myorders");

      console.log("ORDER CREATED:", res.data);
    } catch (err) {
      console.log(err);
      alert(err?.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div style={{ padding: 20, maxWidth: 700, margin: "auto" }}>
      <h2 style={{ marginBottom: 10, fontWeight: "bold", marginTop: 70 }}>
        🛒 Your Cart
      </h2>

      {/* SUMMARY */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 20,
          background: "#f5f5f5",
          padding: 10,
          borderRadius: 10,
        }}
      >
        <span style={{ fontWeight: "bold", marginTop: 10 }}>
          Total Items: {totalItems}
        </span>
        <span style={{ fontWeight: "bold", marginTop: 10 }}>
          Total: {totalPrice.toFixed(2)} EGP
        </span>
      </div>

      {/* EMPTY */}
      {cart.length === 0 ? (
        <p style={{ textAlign: "center", color: "#777" }}>
          Your cart is empty 🥲
        </p>
      ) : (
        cart.map((item) => (
          <div
            key={item._id}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 15,
              padding: 15,
              borderRadius: 12,
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              background: "#fff",
            }}
          >
            <div>
              <h4 style={{ margin: 0 }}>{item.title}</h4>
              <p style={{ margin: "5px 0", color: "#777" }}>
                {item.price} EGP × {item.quantity}
              </p>
            </div>

            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={() => decreaseQty(item._id)} style={btnStyle}>
                <FaMinus />
              </button>

              <button onClick={() => increaseQty(item._id)} style={btnStyle}>
                <FaPlus />
              </button>

              <button
                onClick={() => removeFromCart(item._id)}
                style={{ ...btnStyle, background: "#ff4d4f", color: "#fff" }}
              >
                <FaTrash />
              </button>
            </div>
          </div>
        ))
      )}

      {/* ADDRESS */}
      {cart.length > 0 && (
        <div style={{ marginTop: 20 }}>
          <h4>📍 Delivery Address</h4>

          <input
            placeholder="Street"
            value={address.street}
            onChange={(e) =>
              setAddress({ ...address, street: e.target.value })
            }
            style={{
              width: "100%",
              padding: 10,
              marginBottom: 10,
              borderRadius: 8,
              border: "1px solid #ddd",
            }}
          />

          <input
            placeholder="City"
            value={address.city}
            onChange={(e) =>
              setAddress({ ...address, city: e.target.value })
            }
            style={{
              width: "100%",
              padding: 10,
              marginBottom: 10,
              borderRadius: 8,
              border: "1px solid #ddd",
            }}
          />

          <input
            placeholder="Notes (optional)"
            value={address.notes}
            onChange={(e) =>
              setAddress({ ...address, notes: e.target.value })
            }
            style={{
              width: "100%",
              padding: 10,
              marginBottom: 10,
              borderRadius: 8,
              border: "1px solid #ddd",
            }}
          />
        </div>
      )}

      {/* BUTTON */}
      {cart.length > 0 && (
        <button
          onClick={createOrder}
          style={{
            marginTop: 20,
            width: "100%",
            padding: 15,
            background: "linear-gradient(135deg, #28a745, #218838)",
            color: "#fff",
            border: "none",
            borderRadius: 10,
            fontSize: 16,
            cursor: "pointer",
          }}
        >
          Confirm Your Order
        </button>
      )}
    </div>
  );
};

export default Cart;