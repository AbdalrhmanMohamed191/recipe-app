// import React, { createContext, useContext, useEffect, useState } from "react";

// const CartContext = createContext();

// export const CartProvider = ({ children }) => {
//   const [cart, setCart] = useState(() => {
//     const stored = localStorage.getItem("cart");
//     return stored ? JSON.parse(stored) : [];
//   });

//   useEffect(() => {
//     localStorage.setItem("cart", JSON.stringify(cart));
//   }, [cart]);

//   // ✅ ADD TO CART (NO DUPLICATES + NO INCREMENT)
//   const addToCart = (item) => {
//     setCart((prev) => {
//       const exists = prev.find((p) => p._id === item._id);

//       // لو موجود → مفيش أي تغيير
//       if (exists) return prev;

//       // لو جديد → ضيفه بكمية 1
//       return [...prev, { ...item, quantity: 1 }];
//     });
//   };

//   const removeFromCart = (id) => {
//     setCart((prev) => prev.filter((item) => item._id !== id));
//   };

//   const increaseQty = (id) => {
//     setCart((prev) =>
//       prev.map((item) =>
//         item._id === id
//           ? { ...item, quantity: item.quantity + 1 }
//           : item
//       )
//     );
//   };

//   const decreaseQty = (id) => {
//     setCart((prev) =>
//       prev
//         .map((item) =>
//           item._id === id
//             ? { ...item, quantity: item.quantity - 1 }
//             : item
//         )
//         .filter((item) => item.quantity > 0)
//     );
//   };

//   const clearCart = () => setCart([]);

//   return (
//     <CartContext.Provider
//       value={{
//         cart,
//         setCart,
//         addToCart,
//         removeFromCart,
//         increaseQty,
//         decreaseQty,
//         clearCart,
//       }}
//     >
//       {children}
//     </CartContext.Provider>
//   );
// };

// export const useCart = () => useContext(CartContext);


import React, { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    const stored = localStorage.getItem("cart");
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  // 🔥 Unique key للمنتج + variant
  const getKey = (id, variant) => {
    return `${id}-${variant?.name || "default"}`;
  };

  // ================= ADD =================
  const addToCart = (item) => {
    const key = getKey(item._id, item.selectedVariant);

    setCart((prev) => {
      const existing = prev.find((p) => p.key === key);

      if (existing) {
        return prev.map((p) =>
          p.key === key
            ? { ...p, quantity: p.quantity + 1 }
            : p
        );
      }

      return [
        ...prev,
        {
          ...item,
          key,
          quantity: 1,
          price: Number(item.price), // 🔥 تأكيد رقم
        },
      ];
    });
  };

  // ================= REMOVE =================
  const removeFromCart = (key) => {
    setCart((prev) => prev.filter((item) => item.key !== key));
  };

  // ================= INCREASE =================
  const increaseQty = (key) => {
    setCart((prev) =>
      prev.map((item) =>
        item.key === key
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  };

  // ================= DECREASE =================
  const decreaseQty = (key) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.key === key
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const clearCart = () => setCart([]);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        increaseQty,
        decreaseQty,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);