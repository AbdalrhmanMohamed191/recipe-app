// import React, { useEffect, useRef, useState } from "react";
// import { useCart } from "../../component/CartContext/CartContext";
// import { FaTrash, FaPlus, FaMinus } from "react-icons/fa";
// import { useNavigate, useLocation } from "react-router-dom";
// import api from "../../api/api";
// import "./cart.css";

// const Cart = () => {
//   const {
//     cart,
//     removeFromCart,
//     increaseQty,
//     decreaseQty,
//     clearCart,
//     addToCart,
//   } = useCart();

//   const location = useLocation();
//   const go = useNavigate();

//   const [address, setAddress] = useState({
//     street: "",
//     city: "",
//     notes: "",
//   });

//   // 🔥 منع تكرار الري-أوردر
//   const didReorder = useRef(false);

//   // ================= RE-ORDER =================
//   useEffect(() => {
//     if (location.state?.reorderItems && !didReorder.current) {
//       didReorder.current = true;

//       location.state.reorderItems.forEach((item) => {
//         addToCart({
//           _id: item._id,
//           title: item.title,
//           price: item.originalPrice || item.price,
//           discount: item.discount || 0,
//           isActive: item.isActive,
//         });
//       });

//       window.history.replaceState({}, document.title);
//     }
//   }, [location.state, addToCart]);

//   const totalItems = cart.reduce(
//     (sum, item) => sum + Number(item.quantity || 0),
//     0
//   );

//   const totalPrice = cart.reduce(
//     (sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 0),
//     0
//   );

//   const btnStyle = {
//     border: "none",
//     padding: 8,
//     borderRadius: 8,
//     cursor: "pointer",
//     background: "#eee",
//   };

//   // ================= CREATE ORDER =================
//   const createOrder = async () => {
//     const token = localStorage.getItem("token");

//     if (!address.street || !address.city) {
//       return alert("Please enter full address");
//     }

//     const payload = {
//       items: cart,
//       address,
//     };

//     try {
//       const res = await api.post("/api/v1/orders/create", payload, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       clearCart();
//       go("/myorders");

//       console.log("ORDER CREATED:", res.data);
//     } catch (err) {
//       console.log(err);
//       alert(err?.response?.data?.message || "Something went wrong");
//     }
//   };

//   return (
//     <div style={{ padding: 20, maxWidth: 700, margin: "auto" }}>
//       <h2 style={{ marginBottom: 10, fontWeight: "bold", marginTop: 70 }}>
//         🛒 Your Cart
//       </h2>

//        {/* FLOATING BUTTON */}
//       <button className="myorders-btn" onClick={() => go("/myorders")}>
//         📦 My Orders
//       </button>

//       {/* SUMMARY */}
//       <div
//         style={{
//           display: "flex",
//           justifyContent: "space-between",
//           marginBottom: 20,
//           background: "#f5f5f5",
//           padding: 10,
//           borderRadius: 10,
//         }}
//       >
//         <span style={{ fontWeight: "bold", marginTop: 10 }}>
//           Total Items: {totalItems}
//         </span>

//         <span style={{ fontWeight: "bold", marginTop: 10 }}>
//           Total: {totalPrice.toFixed(2)} EGP
//         </span>
//       </div>

//       {/* EMPTY */}
//       {cart.length === 0 ? (
//         <p style={{ textAlign: "center", color: "#777" }}>
//           Your cart is empty 🥲
//         </p>
//       ) : (
//         cart.map((item) => (
//           <div
//             key={item._id}
//             style={{
//               display: "flex",
//               justifyContent: "space-between",
//               alignItems: "center",
//               marginBottom: 15,
//               padding: 15,
//               borderRadius: 12,
//               boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
//               background: "#fff",
//             }}
//           >
//             <div>
//               <h4 style={{ margin: 0 }}>{item.title}</h4>

//               <p style={{ margin: "5px 0", color: "#777" }}>
//                 {Number(item.price).toFixed(2)} EGP × {item.quantity}
//               </p>
//             </div>

//             <div style={{ display: "flex", gap: 8 }}>
//               <button onClick={() => decreaseQty(item._id)} style={btnStyle}>
//                 <FaMinus />
//               </button>

//               <button onClick={() => increaseQty(item._id)} style={btnStyle}>
//                 <FaPlus />
//               </button>

//               <button
//                 onClick={() => removeFromCart(item._id)}
//                 style={{ ...btnStyle, background: "#ff4d4f", color: "#fff" }}
//               >
//                 <FaTrash />
//               </button>
//             </div>
//           </div>
//         ))
//       )}

//       {/* ADDRESS */}
//       {cart.length > 0 && (
//         <div style={{ marginTop: 20 }}>
//           <h4>📍 Delivery Address</h4>

//           <input
//             placeholder="Street"
//             value={address.street}
//             onChange={(e) =>
//               setAddress({ ...address, street: e.target.value })
//             }
//             style={{
//               width: "100%",
//               padding: 10,
//               marginBottom: 10,
//               borderRadius: 8,
//               border: "1px solid #ddd",
//             }}
//           />

//           <input
//             placeholder="City"
//             value={address.city}
//             onChange={(e) =>
//               setAddress({ ...address, city: e.target.value })
//             }
//             style={{
//               width: "100%",
//               padding: 10,
//               marginBottom: 10,
//               borderRadius: 8,
//               border: "1px solid #ddd",
//             }}
//           />

//           <input
//             placeholder="Notes (e.g. building number) (optional)"
//             value={address.notes}
//             onChange={(e) =>
//               setAddress({ ...address, notes: e.target.value })
//             }
//             style={{
//               width: "100%",
//               padding: 10,
//               marginBottom: 10,
//               borderRadius: 8,
//               border: "1px solid #ddd",
//             }}
//           />
//         </div>
//       )}

//       {/* BUTTON */}
//       {cart.length > 0 && (
//         <button
//           onClick={createOrder}
//           style={{
//             marginTop: 20,
//             width: "100%",
//             padding: 15,
//             background: "linear-gradient(135deg, #28a745, #218838)",
//             color: "#fff",
//             border: "none",
//             borderRadius: 10,
//             fontSize: 16,
//             cursor: "pointer",
//           }}
//         >
//           Confirm Your Order
//         </button>
//       )}
//     </div>
//   );
// };

// export default Cart;

// import React, { useEffect, useRef, useState } from "react";
// import { useCart } from "../../component/CartContext/CartContext";
// import { FaTrash, FaPlus, FaMinus } from "react-icons/fa";
// import { useNavigate, useLocation } from "react-router-dom";
// import api from "../../api/api";
// import "./cart.css";

// const Cart = () => {
//   const {
//     cart,
//     removeFromCart,
//     increaseQty,
//     decreaseQty,
//     clearCart,
//     addToCart,
//   } = useCart();

//   const location = useLocation();
//   const go = useNavigate();

//   const [address, setAddress] = useState({
//     street: "",
//     city: "",
//     notes: "",
//   });

//   const didReorder = useRef(false);

//   useEffect(() => {
//     if (location.state?.reorderItems && !didReorder.current) {
//       didReorder.current = true;

//       location.state.reorderItems.forEach((item) => {
//         addToCart({
//           _id: item._id,
//           title: item.title,
//           price: item.originalPrice || item.price,
//           discount: item.discount || 0,
//         });
//       });

//       window.history.replaceState({}, document.title);
//     }
//   }, [location.state, addToCart]);

//   const totalItems = cart.reduce((s, i) => s + Number(i.quantity || 0), 0);

//   const totalPrice = cart.reduce(
//     (s, i) => s + Number(i.price || 0) * Number(i.quantity || 0),
//     0
//   );

//   const createOrder = async () => {
//     const token = localStorage.getItem("token");

//     if (!address.street || !address.city) {
//       return alert("Please enter full address");
//     }

//     try {
//       await api.post(
//         "/api/v1/orders/create",
//         { items: cart, address },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       clearCart();
//       go("/myorders");
//     } catch (err) {
//       alert(err?.response?.data?.message || "Error");
//     }
//   };

//   return (
//     <div className="cart-container">

//       {/* HEADER */}
//       <div className="cart-header">
//         <h2>🛒 Your Cart</h2>

//         <button className="myorders-btn" onClick={() => go("/myorders")}>
//           📦 My Orders
//         </button>
//       </div>

//       {/* SUMMARY */}
//       <div className="cart-summary">
//         <span>Total Items: {totalItems}</span>
//         <span>Total: {totalPrice.toFixed(2)} EGP</span>
//       </div>

//       {/* EMPTY */}
//       {cart.length === 0 ? (
//         <p className="empty">Your cart is empty 🥲</p>
//       ) : (
//         cart.map((item) => (
//           <div className="cart-item" key={item._id}>
//             <div>
//               <h4>{item.title}</h4>
//               <p>
//                 {Number(item.price).toFixed(2)} EGP × {item.quantity}
//               </p>
//             </div>

//             <div className="actions">
//               <button onClick={() => decreaseQty(item._id)}>
//                 <FaMinus />
//               </button>

//               <button onClick={() => increaseQty(item._id)}>
//                 <FaPlus />
//               </button>

//               <button
//                 className="delete"
//                 onClick={() => removeFromCart(item._id)}
//               >
//                 <FaTrash />
//               </button>
//             </div>
//           </div>
//         ))
//       )}

//       {/* ADDRESS */}
//       {cart.length > 0 && (
//         <div className="address">
//           <h4>📍 Delivery Address</h4>

//           <input
//             placeholder="Street"
//             value={address.street}
//             onChange={(e) =>
//               setAddress({ ...address, street: e.target.value })
//             }
//           />

//           <input
//             placeholder="City"
//             value={address.city}
//             onChange={(e) =>
//               setAddress({ ...address, city: e.target.value })
//             }
//           />

//           <input
//             placeholder="Notes (e.g. building number)"
//             value={address.notes}
//             onChange={(e) =>
//               setAddress({ ...address, notes: e.target.value })
//             }
//           />
//         </div>
//       )}

//       {/* BUTTON */}
//       {cart.length > 0 && (
//         <button className="confirm-btn" onClick={createOrder}>
//           Confirm Order
//         </button>
//       )}
//     </div>
//   );
// };

// export default Cart;





// import React, { useEffect, useRef, useState } from "react";
// import { useCart } from "../../component/CartContext/CartContext";
// import { FaTrash, FaPlus, FaMinus } from "react-icons/fa";
// import { useNavigate, useLocation } from "react-router-dom";
// import api from "../../api/api";
// import "./cart.css";

// const Cart = () => {
//   const {
//     cart,
//     removeFromCart,
//     increaseQty,
//     decreaseQty,
//     clearCart,
//     addToCart,
//   } = useCart();

//   const location = useLocation();
//   const go = useNavigate();

//   const didReorder = useRef(false);

//   const [address, setAddress] = useState({
//     street: "",
//     city: "",
//     notes: "",
//   });

//   // ================= REORDER =================
//   useEffect(() => {
//     if (location.state?.reorderItems && !didReorder.current) {
//       didReorder.current = true;

//       location.state.reorderItems.forEach((item) => {
//         addToCart({
//           _id: item._id,
//           title: item.title,
//           selectedVariant: item.selectedVariant,
//           price: Number(item.price),
//         });
//       });

//       window.history.replaceState({}, document.title);
//     }
//   }, [location.state, addToCart]);

//   // ================= TOTAL =================
//   const totalItems = cart.reduce((sum, i) => sum + i.quantity, 0);

//   const totalPrice = cart.reduce(
//     (sum, i) => sum + i.price * i.quantity,
//     0
//   );

//   // ================= ORDER =================
//   const createOrder = async () => {
//     const token = localStorage.getItem("token");

//     if (!address.street || !address.city) {
//       return alert("Please enter full address");
//     }

//     try {
//       await api.post(
//         "/api/v1/orders/create",
//         {
//           items: cart.map((i) => ({
//             productId: i._id,
//             title: i.title,
//             quantity: i.quantity,
//             variant: i.selectedVariant,
//             price: i.price,
//           })),
//           address,
//         },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       clearCart();
//       go("/myorders");
//     } catch (err) {
//       alert(err?.response?.data?.message || "Error");
//     }
//   };

//   return (
//     <div className="cart-container">

//       <div className="cart-header">
//         <h2>🛒 Your Cart</h2>

//         <button onClick={() => go("/myorders")}>
//           📦 My Orders
//         </button>
//       </div>

//       <div className="cart-summary">
//         <span>Total Items: {totalItems}</span>
//         <span>Total: {totalPrice.toFixed(2)} EGP</span>
//       </div>

//       {cart.length === 0 ? (
//         <p>Cart is empty</p>
//       ) : (
//         cart.map((item) => (
//           <div className="cart-item" key={item.key}>

//             <div>
//               <h4>{item.title}</h4>

//               <p className="variant">
//                 {item.selectedVariant?.name || "Standard"}
//               </p>

//               <p>
//                 {item.price.toFixed(2)} EGP × {item.quantity}
//               </p>
//             </div>

//             <div className="actions">

//               <button onClick={() => decreaseQty(item.key)}>
//                 <FaMinus />
//               </button>

//               <button onClick={() => increaseQty(item.key)}>
//                 <FaPlus />
//               </button>

//               <button onClick={() => removeFromCart(item.key)}>
//                 <FaTrash />
//               </button>

//             </div>

//           </div>
//         ))
//       )}

//       {cart.length > 0 && (
//         <>
//           <div className="address">
//             <input
//               placeholder="Street"
//               value={address.street}
//               onChange={(e) =>
//                 setAddress({ ...address, street: e.target.value })
//               }
//             />

//             <input
//               placeholder="City"
//               value={address.city}
//               onChange={(e) =>
//                 setAddress({ ...address, city: e.target.value })
//               }
//             />

//             <input
//               placeholder="Notes"
//               value={address.notes}
//               onChange={(e) =>
//                 setAddress({ ...address, notes: e.target.value })
//               }
//             />
//           </div>

//           <button className="confirm-btn" onClick={createOrder}>
//             Confirm Order
//           </button>
//         </>
//       )}

//     </div>
//   );
// };

// export default Cart;


// import React, { useEffect, useRef, useState } from "react";
// import { useCart } from "../../component/CartContext/CartContext";
// import { FaTrash, FaPlus, FaMinus } from "react-icons/fa";
// import { useNavigate, useLocation } from "react-router-dom";
// import api from "../../api/api";
// import "./cart.css";

// const Cart = () => {
//   const {
//     cart,
//     removeFromCart,
//     increaseQty,
//     decreaseQty,
//     clearCart,
//     addToCart,
//   } = useCart();

//   const location = useLocation();
//   const go = useNavigate();
//   const didReorder = useRef(false);

//   const [address, setAddress] = useState({
//     street: "",
//     city: "",
//     notes: "",
//   });

//   // ================= REORDER =================
//   useEffect(() => {
//     if (location.state?.reorderItems && !didReorder.current) {
//       didReorder.current = true;

//       location.state.reorderItems.forEach((item) => {
//         addToCart({
//           _id: item._id,
//           title: item.title,
//           selectedVariant: item.selectedVariant || null,
//           price: Number(item.price),
//         });
//       });

//       window.history.replaceState({}, document.title);
//     }
//   }, [location.state, addToCart]);

//   // ================= TOTAL =================
//   const totalItems = cart.reduce((sum, i) => sum + i.quantity, 0);

//   const totalPrice = cart.reduce(
//     (sum, i) => sum + i.price * i.quantity,
//     0
//   );

//   // ================= VARIANT FIX =================
//   const getVariantName = (item) => {
//     if (!item) return "Standard";

//     // object variant
//     if (item.selectedVariant?.name) return item.selectedVariant.name;

//     // string variant
//     if (typeof item.selectedVariant === "string")
//       return item.selectedVariant;

//     // backend variant fallback
//     if (item.variant?.name) return item.variant.name;

//     if (typeof item.variant === "string") return item.variant;

//     return "Standard";
//   };

//   // ================= ORDER =================
//   const createOrder = async () => {
//     const token = localStorage.getItem("token");

//     if (!address.street || !address.city) {
//       return alert("Please enter full address");
//     }

//     try {
//       await api.post(
//         "/api/v1/orders/create",
//         {
//           items: cart.map((i) => ({
//             productId: i._id,
//             title: i.title,
//             quantity: i.quantity,
//             variant: i.selectedVariant || null,
//             price: i.price,
//           })),
//           address,
//         },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       clearCart();
//       go("/myorders");
//     } catch (err) {
//       alert(err?.response?.data?.message || "Error");
//     }
//   };

//   return (
//     <div className="cart-container">

//       <div className="cart-header">
//         <h2>🛒 Your Cart</h2>

//         <button onClick={() => go("/myorders")}>
//           📦 My Orders
//         </button>
//       </div>

//       {/* SUMMARY */}
//       <div className="cart-summary">
//         <span>Total Items: {totalItems}</span>
//         <span>Total: {totalPrice.toFixed(2)} EGP</span>
//       </div>

//       {/* EMPTY */}
//       {cart.length === 0 ? (
//         <p>Cart is empty</p>
//       ) : (
//         cart.map((item) => (
//           <div className="cart-item" key={item.key || item._id}>

//             <div>
//               <h4>{item.title}</h4>

//               {/* ✅ VARIANT FIX HERE */}
//               <p className="variant">
//                 {getVariantName(item)}
//               </p>

//               <p>
//                 {item.price.toFixed(2)} EGP × {item.quantity}
//               </p>
//             </div>

//             <div className="actions">

//               <button onClick={() => decreaseQty(item.key)}>
//                 <FaMinus />
//               </button>

//               <button onClick={() => increaseQty(item.key)}>
//                 <FaPlus />
//               </button>

//               <button onClick={() => removeFromCart(item.key)}>
//                 <FaTrash />
//               </button>

//             </div>

//           </div>
//         ))
//       )}

//       {/* ADDRESS + ORDER */}
//       {cart.length > 0 && (
//         <>
//           <div className="address">
//             <input
//               placeholder="Street"
//               value={address.street}
//               onChange={(e) =>
//                 setAddress({ ...address, street: e.target.value })
//               }
//             />

//             <input
//               placeholder="City"
//               value={address.city}
//               onChange={(e) =>
//                 setAddress({ ...address, city: e.target.value })
//               }
//             />

//             <input
//               placeholder="Notes"
//               value={address.notes}
//               onChange={(e) =>
//                 setAddress({ ...address, notes: e.target.value })
//               }
//             />
//           </div>

//           <button className="confirm-btn" onClick={createOrder}>
//             Confirm Order
//           </button>
//         </>
//       )}
//     </div>
//   );
// };

// export default Cart;


import React, { useEffect, useRef, useState } from "react";
import { useCart } from "../../component/CartContext/CartContext";
import { FaTrash, FaPlus, FaMinus } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../../api/api";
import "./cart.css";

const Cart = () => {
  const {
    cart,
    removeFromCart,
    increaseQty,
    decreaseQty,
    clearCart,
    addToCart,
  } = useCart();

  const location = useLocation();
  const go = useNavigate();
  const didReorder = useRef(false);

  const [address, setAddress] = useState({
    street: "",
    city: "",
    notes: "",
  });

  // ================= REORDER =================
  useEffect(() => {
    if (location.state?.reorderItems && !didReorder.current) {
      didReorder.current = true;

      location.state.reorderItems.forEach((item) => {
        addToCart({
          _id: item._id,
          title: item.title,
          price: Number(item.price),

          // 🔥 IMPORTANT FIX
          selectedVariant: item.variant || item.selectedVariant || null,
        });
      });

      window.history.replaceState({}, document.title);
    }
  }, [location.state, addToCart]);

  // ================= TOTAL =================
  const totalItems = cart.reduce((sum, i) => sum + i.quantity, 0);

  const totalPrice = cart.reduce(
    (sum, i) => sum + i.price * i.quantity,
    0
  );

  // ================= VARIANT DISPLAY =================
  const getVariantName = (item) => {
    const v = item.selectedVariant || item.variant;

    if (!v) return "Standard";

    if (typeof v === "string") return v;

    return v.name || v.size || "Standard";
  };

  // ================= ORDER =================
  const createOrder = async () => {
    const token = localStorage.getItem("token");

    if (!address.street || !address.city) {
      return alert("Please enter full address");
    }

    try {
      await api.post(
        "/api/v1/orders/create",
        {
          items: cart.map((i) => ({
            productId: i._id,
            title: i.title,
            quantity: i.quantity,
            price: i.price,

            // 🔥 FIXED VARIANT (important)
            variant: i.selectedVariant || null,
          })),
          address,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      clearCart();
      go("/myorders");
    } catch (err) {
      alert(err?.response?.data?.message || "Error");
    }
  };

  return (
    <div className="cart-container">

      <div className="cart-header">
        <h2>🛒 Your Cart</h2>

        <button onClick={() => go("/myorders")}>
          📦 My Orders
        </button>
      </div>

      {/* SUMMARY */}
      <div className="cart-summary">
        <span>Total Items: {totalItems}</span>
        <span>Total: {totalPrice.toFixed(2)} EGP</span>
      </div>

      {/* CART ITEMS */}
      {cart.length === 0 ? (
        <p>Cart is empty</p>
      ) : (
        cart.map((item) => (
          <div className="cart-item" key={item.key || item._id}>

            <div>
              <h4>{item.title}</h4>

              {/* VARIANT */}
              <p className="variant">
                {getVariantName(item)}
              </p>

              <p>
                {item.price.toFixed(2)} EGP × {item.quantity}
              </p>
            </div>

            <div className="actions">

              <button onClick={() => decreaseQty(item.key)}>
                <FaMinus />
              </button>

              <button onClick={() => increaseQty(item.key)}>
                <FaPlus />
              </button>

              <button onClick={() => removeFromCart(item.key)}>
                <FaTrash />
              </button>

            </div>

          </div>
        ))
      )}

      {/* ADDRESS */}
      {cart.length > 0 && (
        <>
          <div className="address">

            <input
              placeholder="Street"
              value={address.street}
              onChange={(e) =>
                setAddress({ ...address, street: e.target.value })
              }
            />

            <input
              placeholder="City"
              value={address.city}
              onChange={(e) =>
                setAddress({ ...address, city: e.target.value })
              }
            />

            <input
              placeholder="Notes"
              value={address.notes}
              onChange={(e) =>
                setAddress({ ...address, notes: e.target.value })
              }
            />

          </div>

          <button className="confirm-btn" onClick={createOrder}>
            Confirm Order
          </button>
        </>
      )}

    </div>
  );
};

export default Cart;