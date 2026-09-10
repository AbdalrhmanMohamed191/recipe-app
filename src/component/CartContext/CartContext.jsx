// import React, {
//   createContext,
//   useContext,
//   useEffect,
//   useState,
// } from "react";

// const CartContext = createContext();

// export const CartProvider = ({ children }) => {
//   // =====================================================
//   // LOAD CART FROM LOCAL STORAGE
//   // =====================================================

//   const [cart, setCart] = useState(() => {
//     const stored = localStorage.getItem("cart");

//     try {
//       return stored ? JSON.parse(stored) : [];
//     } catch (error) {
//       console.error("CART LOAD ERROR:", error);
//       return [];
//     }
//   });

//   // =====================================================
//   // SAVE CART TO LOCAL STORAGE
//   // =====================================================

//   useEffect(() => {
//     localStorage.setItem("cart", JSON.stringify(cart));
//   }, [cart]);

//   // =====================================================
//   // GET VARIANT
//   // =====================================================

//   const getVariant = (item) => {
//     return item.selectedVariant || item.variant || null;
//   };

//   // =====================================================
//   // GET VARIANT NAME
//   // =====================================================

//   const getVariantName = (variant) => {
//     if (!variant) {
//       return "default";
//     }

//     if (typeof variant === "string") {
//       return variant;
//     }

//     return (
//       variant.name ||
//       variant.size ||
//       "default"
//     );
//   };

//   // =====================================================
//   // GET UNIQUE KEY
//   // =====================================================

//   const getKey = (item) => {
//     /*
//       لو Offer
//       نستخدم offerId

//       لو Recipe
//       نستخدم _id
//     */

//     const itemId = item.isOffer
//       ? item.offerId || item._id
//       : item._id;

//     const variant = getVariant(item);

//     const variantName =
//       getVariantName(variant);

//     const type = item.isOffer
//       ? "offer"
//       : "product";

//     return `${type}-${itemId}-${variantName}`;
//   };

//   // =====================================================
//   // ADD TO CART
//   // =====================================================

//   const addToCart = (item) => {
//     setCart((prev) => {

//       // =================================================
//       // VALIDATION
//       // =================================================

//       if (!item?._id && !item?.offerId) {
//         console.error(
//           "ADD TO CART ERROR: Item ID is missing",
//           item
//         );

//         return prev;
//       }

//       // =================================================
//       // RESTAURANT CHECK
//       // =================================================

//       if (
//         prev.length > 0 &&
//         prev[0].restaurantId &&
//         item.restaurantId &&
//         prev[0].restaurantId.toString() !==
//           item.restaurantId.toString()
//       ) {
//         alert(
//           "You can only order from one restaurant at a time 🚫"
//         );

//         return prev;
//       }

//       // =================================================
//       // UNIQUE KEY
//       // =================================================

//       const key = getKey(item);

//       // =================================================
//       // CHECK EXISTING ITEM
//       // =================================================

//       const existingItem = prev.find(
//         (cartItem) =>
//           cartItem.key === key
//       );

//       // =================================================
//       // INCREASE EXISTING
//       // =================================================

//       if (existingItem) {
//         return prev.map((cartItem) =>
//           cartItem.key === key
//             ? {
//                 ...cartItem,

//                 quantity:
//                   Number(cartItem.quantity || 0) +
//                   1,
//               }
//             : cartItem
//         );
//       }

//       // =================================================
//       // ADD NEW ITEM
//       // =================================================

//       const newItem = {
//         ...item,

//         key,

//         quantity: 1,

//         price: Number(item.price || 0),

//         restaurantId:
//           item.restaurantId || null,

//         selectedVariant:
//           getVariant(item),

//         // =================================================
//         // OFFER DATA
//         // =================================================

//         isOffer:
//           Boolean(item.isOffer),

//         offerId:
//           item.offerId || null,

//         discount:
//           Number(item.discount || 0),

//         // =================================================
//         // OTHER DATA
//         // =================================================

//         image:
//           item.image || "",

//         restaurantName:
//           item.restaurantName || "",
//       };

//       return [
//         ...prev,
//         newItem,
//       ];
//     });
//   };

//   // =====================================================
//   // REMOVE FROM CART
//   // =====================================================

//   const removeFromCart = (key) => {
//     setCart((prev) =>
//       prev.filter(
//         (item) => item.key !== key
//       )
//     );
//   };

//   // =====================================================
//   // INCREASE QUANTITY
//   // =====================================================

//   const increaseQty = (key) => {
//     setCart((prev) =>
//       prev.map((item) =>
//         item.key === key
//           ? {
//               ...item,

//               quantity:
//                 Number(item.quantity || 0) +
//                 1,
//             }
//           : item
//       )
//     );
//   };

//   // =====================================================
//   // DECREASE QUANTITY
//   // =====================================================

//   const decreaseQty = (key) => {
//     setCart((prev) =>
//       prev
//         .map((item) =>
//           item.key === key
//             ? {
//                 ...item,

//                 quantity:
//                   Number(item.quantity || 0) -
//                   1,
//               }
//             : item
//         )
//         .filter(
//           (item) =>
//             Number(item.quantity) > 0
//         )
//     );
//   };

//   // =====================================================
//   // CLEAR CART
//   // =====================================================

//   const clearCart = () => {
//     setCart([]);
//     localStorage.removeItem("cart");
//   };

//   // =====================================================
//   // GET TOTAL ITEMS
//   // =====================================================

//   const getTotalItems = () => {
//     return cart.reduce(
//       (total, item) =>
//         total +
//         Number(item.quantity || 0),
//       0
//     );
//   };

//   // =====================================================
//   // GET TOTAL PRICE
//   // =====================================================

//   const getTotalPrice = () => {
//     return cart.reduce(
//       (total, item) =>
//         total +
//         Number(item.price || 0) *
//           Number(item.quantity || 0),
//       0
//     );
//   };

//   // =====================================================
//   // CHECK IF ITEM EXISTS
//   // =====================================================

//   const isInCart = (item) => {
//     if (!item) {
//       return false;
//     }

//     const key = getKey(item);

//     return cart.some(
//       (cartItem) =>
//         cartItem.key === key
//     );
//   };

//   // =====================================================
//   // CONTEXT
//   // =====================================================

//   return (
//     <CartContext.Provider
//       value={{
//         // Cart
//         cart,
//         setCart,

//         // Add / Remove
//         addToCart,
//         removeFromCart,

//         // Quantity
//         increaseQty,
//         decreaseQty,

//         // Clear
//         clearCart,

//         // Helpers
//         getTotalItems,
//         getTotalPrice,
//         isInCart,
//       }}
//     >
//       {children}
//     </CartContext.Provider>
//   );
// };

// // =======================================================
// // USE CART HOOK
// // =======================================================

// export const useCart = () => {
//   const context = useContext(CartContext);

//   if (!context) {
//     throw new Error(
//       "useCart must be used inside CartProvider"
//     );
//   }

//   return context;
// };

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  // =====================================================
  // LOAD CART FROM LOCAL STORAGE
  // =====================================================

  const [cart, setCart] = useState(() => {
    const stored = localStorage.getItem("cart");

    try {
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error("CART LOAD ERROR:", error);
      return [];
    }
  });

  // =====================================================
  // SAVE CART TO LOCAL STORAGE
  // =====================================================

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  // =====================================================
  // GET VARIANT
  // =====================================================

  const getVariant = (item) => {
    return item?.selectedVariant || item?.variant || null;
  };

  // =====================================================
  // GET VARIANT NAME
  // =====================================================

  const getVariantName = (variant) => {
    if (!variant) {
      return "default";
    }

    if (typeof variant === "string") {
      return variant;
    }

    return variant.name || variant.size || "default";
  };

  // =====================================================
  // GET RESTAURANT ID
  // =====================================================

  const getRestaurantId = (item) => {
    if (!item?.restaurantId) {
      return null;
    }

    /*
      restaurantId ممكن يكون:

      1) String
      "6aa27a10240d96c9d4ce97fe"

      2) ObjectId
      ObjectId("6aa27a10240d96c9d4ce97fe")

      3) Populated Object
      {
        _id: "6aa27a10240d96c9d4ce97fe",
        name: "Restaurant Name"
      }
    */

    if (
      typeof item.restaurantId === "object" &&
      item.restaurantId._id
    ) {
      return String(item.restaurantId._id);
    }

    return String(item.restaurantId);
  };

  // =====================================================
  // GET UNIQUE KEY
  // =====================================================

  const getKey = (item) => {
    /*
      Offer:
      نستخدم offerId

      Recipe:
      نستخدم _id
    */

    const itemId = item.isOffer
      ? item.offerId || item._id
      : item._id;

    const variant = getVariant(item);
    const variantName = getVariantName(variant);

    const type = item.isOffer ? "offer" : "product";

    return `${type}-${itemId}-${variantName}`;
  };

  // =====================================================
  // ADD TO CART
  // =====================================================

  const addToCart = (item) => {
    setCart((prev) => {
      // =================================================
      // VALIDATION
      // =================================================

      if (!item?._id && !item?.offerId) {
        console.error(
          "ADD TO CART ERROR: Item ID is missing",
          item
        );

        return prev;
      }

      // =================================================
      // RESTAURANT IDs
      // =================================================

      const itemRestaurantId = getRestaurantId(item);

      const cartRestaurantId =
        prev.length > 0
          ? getRestaurantId(prev[0])
          : null;

      // =================================================
      // DEBUG
      // =================================================

      // console.log("🛒 ADD TO CART");
      // console.log("Item:", item);
      // console.log(
      //   "Item Restaurant ID:",
      //   itemRestaurantId
      // );
      // console.log(
      //   "Cart Restaurant ID:",
      //   cartRestaurantId
      // );

      // =================================================
      // RESTAURANT CHECK
      // =================================================

      if (
        prev.length > 0 &&
        cartRestaurantId &&
        itemRestaurantId &&
        cartRestaurantId !== itemRestaurantId
      ) {
        alert(
          "You can only order from one restaurant at a time 🚫"
        );

        return prev;
      }

      // =================================================
      // MISSING RESTAURANT ID
      // =================================================

      if (
        prev.length > 0 &&
        cartRestaurantId &&
        !itemRestaurantId
      ) {
        console.error(
          "ADD TO CART ERROR: Item has no restaurantId",
          item
        );

        alert(
          "This item is missing restaurant information 🚫"
        );

        return prev;
      }

      // =================================================
      // UNIQUE KEY
      // =================================================

      const key = getKey(item);

      // =================================================
      // CHECK EXISTING ITEM
      // =================================================

      const existingItem = prev.find(
        (cartItem) => cartItem.key === key
      );

      // =================================================
      // INCREASE EXISTING
      // =================================================

      if (existingItem) {
        return prev.map((cartItem) =>
          cartItem.key === key
            ? {
                ...cartItem,
                quantity:
                  Number(cartItem.quantity || 0) + 1,
              }
            : cartItem
        );
      }

      // =================================================
      // ADD NEW ITEM
      // =================================================

      const newItem = {
        ...item,

        // =================================================
        // CART DATA
        // =================================================

        key,

        quantity: 1,

        price: Number(item.price || 0),

        // IMPORTANT:
        // Always save restaurantId as a STRING
        restaurantId: itemRestaurantId,

        selectedVariant: getVariant(item),

        // =================================================
        // OFFER DATA
        // =================================================

        isOffer: Boolean(item.isOffer),

        offerId: item.offerId || null,

        discount: Number(item.discount || 0),

        // =================================================
        // OTHER DATA
        // =================================================

        image: item.image || "",

        restaurantName: item.restaurantName || "",
      };

      return [...prev, newItem];
    });
  };

  // =====================================================
  // REMOVE FROM CART
  // =====================================================

  const removeFromCart = (key) => {
    setCart((prev) =>
      prev.filter((item) => item.key !== key)
    );
  };

  // =====================================================
  // INCREASE QUANTITY
  // =====================================================

  const increaseQty = (key) => {
    setCart((prev) =>
      prev.map((item) =>
        item.key === key
          ? {
              ...item,
              quantity:
                Number(item.quantity || 0) + 1,
            }
          : item
      )
    );
  };

  // =====================================================
  // DECREASE QUANTITY
  // =====================================================

  const decreaseQty = (key) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.key === key
            ? {
                ...item,
                quantity:
                  Number(item.quantity || 0) - 1,
              }
            : item
        )
        .filter(
          (item) => Number(item.quantity) > 0
        )
    );
  };

  // =====================================================
  // CLEAR CART
  // =====================================================

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem("cart");
  };

  // =====================================================
  // GET TOTAL ITEMS
  // =====================================================

  const getTotalItems = () => {
    return cart.reduce(
      (total, item) =>
        total + Number(item.quantity || 0),
      0
    );
  };

  // =====================================================
  // GET TOTAL PRICE
  // =====================================================

  const getTotalPrice = () => {
    return cart.reduce(
      (total, item) =>
        total +
        Number(item.price || 0) *
          Number(item.quantity || 0),
      0
    );
  };

  // =====================================================
  // CHECK IF ITEM EXISTS
  // =====================================================

  const isInCart = (item) => {
    if (!item) {
      return false;
    }

    const key = getKey(item);

    return cart.some(
      (cartItem) => cartItem.key === key
    );
  };

  // =====================================================
  // CONTEXT
  // =====================================================

  return (
    <CartContext.Provider
      value={{
        // Cart
        cart,
        setCart,

        // Add / Remove
        addToCart,
        removeFromCart,

        // Quantity
        increaseQty,
        decreaseQty,

        // Clear
        clearCart,

        // Helpers
        getTotalItems,
        getTotalPrice,
        isInCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

// =======================================================
// USE CART HOOK
// =======================================================

export const useCart = () => {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error(
      "useCart must be used inside CartProvider"
    );
  }

  return context;
};