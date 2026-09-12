// // import React, { useEffect, useRef, useState } from "react";
// // import { useCart } from "../../component/CartContext/CartContext";
// // import { FaTrash, FaPlus, FaMinus } from "react-icons/fa";
// // import { useNavigate, useLocation } from "react-router-dom";
// // import api from "../../api/api";
// // import "./cart.css";

// // const Cart = () => {
// //   const {
// //     cart,
// //     removeFromCart,
// //     increaseQty,
// //     decreaseQty,
// //     clearCart,
// //     addToCart,
// //   } = useCart();

// //   const location = useLocation();
// //   const go = useNavigate();
// //   const didReorder = useRef(false);

// //   const [isSubmitting, setIsSubmitting] = useState(false);

// //   const [address, setAddress] = useState({
// //     street: "",
// //     city: "",
// //     notes: "",
// //   });

// //   // ================= REORDER =================
// //   useEffect(() => {
// //     if (location.state?.reorderItems && !didReorder.current) {
// //       didReorder.current = true;

// //       location.state.reorderItems.forEach((item) => {
// //         addToCart({
// //           _id: item._id,
// //           title: item.title,
// //           price: Number(item.price),

// //           selectedVariant:
// //             item.variant ||
// //             item.selectedVariant ||
// //             null,

// //           restaurantId: item.restaurantId,

// //           itemType: item.itemType || "product",
// //           offerId: item.offerId || null,
// //         });
// //       });

// //       window.history.replaceState({}, document.title);
// //     }
// //   }, [location.state, addToCart]);

// //   // ================= TOTAL =================
// //   const totalItems = cart.reduce(
// //     (sum, i) => sum + i.quantity,
// //     0
// //   );

// //   const totalPrice = cart.reduce(
// //     (sum, i) => sum + Number(i.price || 0) * i.quantity,
// //     0
// //   );

// //   // ================= VARIANT DISPLAY =================
// //   const getVariantName = (item) => {
// //     const v =
// //       item.selectedVariant ||
// //       item.variant;

// //     if (!v) return "Standard";

// //     if (typeof v === "string") return v;

// //     return (
// //       v.name ||
// //       v.size ||
// //       "Standard"
// //     );
// //   };

// //   // ================= ORDER =================
// //   const createOrder = async () => {
// //     // =================================================
// //     // PREVENT DOUBLE CLICK
// //     // =================================================

// //     if (isSubmitting) {
// //       return;
// //     }

// //     const token =
// //       localStorage.getItem("token");

// //     // ================= TOKEN =================
// //     if (!token) {
// //       alert(
// //         "You must login first"
// //       );

// //       go("/login");
// //       return;
// //     }

// //     // ================= ADDRESS =================
// //     if (
// //       !address.street ||
// //       !address.city
// //     ) {
// //       return alert(
// //         "Please enter full address"
// //       );
// //     }

// //     // ================= CART =================
// //     if (cart.length === 0) {
// //       return alert(
// //         "Cart is empty"
// //       );
// //     }

// //     // =================================================
// //     // LOCK BUTTON IMMEDIATELY
// //     // =================================================

// //     setIsSubmitting(true);

// //     try {
// //       // =================================================
// //       // BUILD ITEMS
// //       // =================================================

// //       const items = cart.map((i) => {
// //         // ===============================================
// //         // OFFER
// //         // ===============================================

// //         if (
// //           i.itemType === "offer" ||
// //           i.offerId
// //         ) {
// //           return {
// //             itemType: "offer",

// //             offerId:
// //               i.offerId || i._id,

// //             title: i.title,

// //             quantity:
// //               Number(i.quantity) || 1,

// //             price:
// //               Number(i.price) || 0,

// //             discount:
// //               Number(i.discount || 0),

// //             image:
// //               i.image || "",

// //             variant:
// //               null,
// //           };
// //         }

// //         // ===============================================
// //         // NORMAL PRODUCT
// //         // ===============================================

// //         return {
// //           itemType: "product",

// //           productId: i._id,

// //           title: i.title,

// //           quantity:
// //             Number(i.quantity) || 1,

// //           price:
// //             Number(i.price) || 0,

// //           variant:
// //             i.selectedVariant ||
// //             i.variant ||
// //             null,

// //           image:
// //             i.image || "",
// //         };
// //       });

// //       // =================================================
// //       // CREATE ORDER
// //       // =================================================

// //       await api.post(
// //         "/api/v1/orders/create",
// //         {
// //           items,

// //           address,

// //           paymentMethod: "cash",
// //         },
// //         {
// //           headers: {
// //             Authorization:
// //               `Bearer ${token}`,
// //           },
// //         }
// //       );

// //       // =================================================
// //       // SUCCESS
// //       // =================================================

// //       clearCart();

// //       go("/myorders");

// //     } catch (err) {
// //       console.error(
// //         "CREATE ORDER ERROR:",
// //         err
// //       );

// //       alert(
// //         err?.response?.data?.message ||
// //           "Error creating order"
// //       );

// //       // =================================================
// //       // UNLOCK ONLY IF ORDER FAILED
// //       // =================================================

// //       setIsSubmitting(false);
// //     }
// //   };

// //   return (
// //     <div className="cart-container">

// //       <div className="cart-header">
// //         <h2>
// //           🛒 Your Cart
// //         </h2>

// //         <button
// //           onClick={() =>
// //             go("/myorders")
// //           }
// //         >
// //           📦 My Orders
// //         </button>
// //       </div>

// //       {/* SUMMARY */}
// //       <div className="cart-summary">

// //         <span>
// //           Total Items: {totalItems}
// //         </span>

// //         <span>
// //           Total:{" "}
// //           {totalPrice.toFixed(2)} EGP
// //         </span>

// //       </div>

// //       {/* CART ITEMS */}
// //       {cart.length === 0 ? (
// //         <p>
// //           Cart is empty
// //         </p>
// //       ) : (
// //         cart.map((item) => (
// //           <div
// //             className="cart-item"
// //             key={
// //               item.key ||
// //               item._id
// //             }
// //           >

// //             <div>

// //               <h4>
// //                 {item.title}
// //               </h4>

// //               {/* OFFER */}
// //               {(
// //                 item.itemType === "offer" ||
// //                 item.offerId
// //               ) && (
// //                 <p className="variant">
// //                   🏷️ Special Offer
// //                 </p>
// //               )}

// //               {/* VARIANT */}
// //               {item.itemType !== "offer" &&
// //                 !item.offerId && (
// //                   <p className="variant">
// //                     {getVariantName(item)}
// //                   </p>
// //                 )}

// //               <p>
// //                 {Number(
// //                   item.price || 0
// //                 ).toFixed(2)}{" "}
// //                 EGP × {item.quantity}
// //               </p>

// //             </div>

// //             <div className="actions">

// //               <button
// //                 onClick={() =>
// //                   decreaseQty(
// //                     item.key
// //                   )
// //                 }
// //                 disabled={isSubmitting}
// //               >
// //                 <FaMinus />
// //               </button>

// //               <button
// //                 onClick={() =>
// //                   increaseQty(
// //                     item.key
// //                   )
// //                 }
// //                 disabled={isSubmitting}
// //               >
// //                 <FaPlus />
// //               </button>

// //               <button
// //                 onClick={() =>
// //                   removeFromCart(
// //                     item.key
// //                   )
// //                 }
// //                 disabled={isSubmitting}
// //               >
// //                 <FaTrash />
// //               </button>

// //             </div>

// //           </div>
// //         ))
// //       )}

// //       {/* ADDRESS */}
// //       {cart.length > 0 && (
// //         <>

// //           <div className="address">

// //             <input
// //               placeholder="Street"
// //               value={
// //                 address.street
// //               }
// //               onChange={(e) =>
// //                 setAddress({
// //                   ...address,
// //                   street:
// //                     e.target.value,
// //                 })
// //               }
// //               disabled={isSubmitting}
// //             />

// //             <input
// //               placeholder="City"
// //               value={
// //                 address.city
// //               }
// //               onChange={(e) =>
// //                 setAddress({
// //                   ...address,
// //                   city:
// //                     e.target.value,
// //                 })
// //               }
// //               disabled={isSubmitting}
// //             />

// //             <input
// //               placeholder="Notes"
// //               value={
// //                 address.notes
// //               }
// //               onChange={(e) =>
// //                 setAddress({
// //                   ...address,
// //                   notes:
// //                     e.target.value,
// //                 })
// //               }
// //               disabled={isSubmitting}
// //             />

// //           </div>

// //           <button
// //             className="confirm-btn"
// //             onClick={createOrder}
// //             disabled={isSubmitting}
// //           >
// //             {isSubmitting
// //               ? "Placing Order..."
// //               : "Confirm Order"}
// //           </button>

// //         </>
// //       )}

// //     </div>
// //   );
// // };

// // export default Cart;




// import React, {
//   useEffect,
//   useRef,
//   useState,
// } from "react";

// import {
//   useCart,
// } from "../../component/CartContext/CartContext";

// import {
//   FaTrash,
//   FaPlus,
//   FaMinus,
// } from "react-icons/fa";

// import {
//   useNavigate,
//   useLocation,
// } from "react-router-dom";

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

//   const [isSubmitting, setIsSubmitting] =
//     useState(false);

//   const [address, setAddress] = useState({
//     street: "",
//     city: "",
//     notes: "",
//   });

//   // =====================================================
//   // REORDER
//   // =====================================================

//   useEffect(() => {
//     if (
//       location.state?.reorderItems &&
//       !didReorder.current
//     ) {
//       didReorder.current = true;

//       location.state.reorderItems.forEach(
//         (item) => {
//           const isOffer =
//             item.itemType === "offer" ||
//             item.isOffer === true ||
//             Boolean(item.offerId);

//           addToCart({
//             _id: item._id,

//             title: item.title,

//             price: Number(item.price),

//             selectedVariant:
//               item.variant ||
//               item.selectedVariant ||
//               null,

//             restaurantId:
//               item.restaurantId,

//             // Important
//             itemType: isOffer
//               ? "offer"
//               : "product",

//             isOffer,

//             // Important for offers
//             offerId:
//               item.offerId || null,

//             // Important for normal products
//             productId:
//               item.productId ||
//               (!isOffer
//                 ? item._id
//                 : null),

//             discount:
//               Number(item.discount || 0),

//             image:
//               item.image ||
//               item.CoverImage ||
//               "",
//           });
//         }
//       );

//       window.history.replaceState(
//         {},
//         document.title
//       );
//     }
//   }, [
//     location.state,
//     addToCart,
//   ]);

//   // =====================================================
//   // TOTAL ITEMS
//   // =====================================================

//   const totalItems = cart.reduce(
//     (sum, item) =>
//       sum + Number(item.quantity || 0),
//     0
//   );

//   // =====================================================
//   // TOTAL PRICE
//   // =====================================================

//   const totalPrice = cart.reduce(
//     (sum, item) =>
//       sum +
//       Number(item.price || 0) *
//         Number(item.quantity || 0),
//     0
//   );

//   // =====================================================
//   // VARIANT DISPLAY
//   // =====================================================

//   const getVariantName = (item) => {
//     const variant =
//       item.selectedVariant ||
//       item.variant;

//     if (!variant) {
//       return "Standard";
//     }

//     if (typeof variant === "string") {
//       return variant;
//     }

//     return (
//       variant.name ||
//       variant.size ||
//       "Standard"
//     );
//   };

//   // =====================================================
//   // CREATE ORDER
//   // =====================================================

//   const createOrder = async () => {
//     // ===================================================
//     // PREVENT DOUBLE CLICK
//     // ===================================================

//     if (isSubmitting) {
//       return;
//     }

//     // ===================================================
//     // TOKEN
//     // ===================================================

//     const token =
//       localStorage.getItem("token");

//     if (!token) {
//       alert(
//         "You must login first"
//       );

//       go("/login");

//       return;
//     }

//     // ===================================================
//     // ADDRESS
//     // ===================================================

//     if (
//       !address.street.trim() ||
//       !address.city.trim()
//     ) {
//       alert(
//         "Please enter full address"
//       );

//       return;
//     }

//     // ===================================================
//     // CART
//     // ===================================================

//     if (cart.length === 0) {
//       alert("Cart is empty");

//       return;
//     }

//     // ===================================================
//     // LOCK BUTTON
//     // ===================================================

//     setIsSubmitting(true);

//     try {
//       // =================================================
//       // BUILD ORDER ITEMS
//       // =================================================

//       const items = cart.map((item) => {
//         // ===============================================
//         // DETECT OFFER
//         // ===============================================

//         const isOffer =
//           item.itemType === "offer" ||
//           item.isOffer === true ||
//           Boolean(item.offerId);

//         // ===============================================
//         // OFFER
//         // ===============================================

//         if (isOffer) {
//           const offerId =
//             item.offerId ||
//             item._id;

//           if (!offerId) {
//             throw new Error(
//               `Offer ID is missing for ${item.title}`
//             );
//           }

//           return {
//             itemType: "offer",

//             // Backend uses this
//             offerId: String(offerId),

//             // Offer does not use productId
//             productId: null,

//             title:
//               item.title || "",

//             quantity:
//               Number(item.quantity) || 1,

//             price:
//               Number(item.price) || 0,

//             discount:
//               Number(item.discount || 0),

//             image:
//               item.image ||
//               item.CoverImage ||
//               "",

//             variant: null,
//           };
//         }

//         // ===============================================
//         // NORMAL PRODUCT
//         // ===============================================

//         const productId =
//           item.productId ||
//           item._id;

//         if (!productId) {
//           throw new Error(
//             `Product ID is missing for ${item.title}`
//           );
//         }

//         return {
//           itemType: "product",

//           // Backend uses this
//           productId: String(productId),

//           // Normal product does not use offerId
//           offerId: null,

//           title:
//             item.title || "",

//           quantity:
//             Number(item.quantity) || 1,

//           price:
//             Number(item.price) || 0,

//           variant:
//             item.selectedVariant ||
//             item.variant ||
//             null,

//           image:
//             item.image ||
//             item.CoverImage ||
//             "",
//         };
//       });

//       // =================================================
//       // DEBUG
//       // =================================================

//       // console.log(
//       //   "🚀 ORDER ITEMS SENT TO BACKEND:"
//       // );

//       // console.log(
//       //   JSON.stringify(
//       //     items,
//       //     null,
//       //     2
//       //   )
//       // );

//       // =================================================
//       // CREATE ORDER
//       // =================================================

//       await api.post(
//         "/api/v1/orders/create",
//         {
//           items,

//           address: {
//             street:
//               address.street.trim(),

//             city:
//               address.city.trim(),

//             notes:
//               address.notes.trim(),
//           },

//           paymentMethod: "cash",
//         },
//         {
//           headers: {
//             Authorization:
//               `Bearer ${token}`,
//           },
//         }
//       );

//       // =================================================
//       // SUCCESS
//       // =================================================

//       clearCart();

//       go("/myorders");

//     } catch (error) {
//       console.error(
//         "CREATE ORDER ERROR:",
//         error
//       );

//       console.error(
//         "BACKEND RESPONSE:",
//         error?.response?.data
//       );

//       alert(
//         error?.response?.data?.message ||
//           error?.message ||
//           "Error creating order"
//       );

//       // =================================================
//       // UNLOCK ONLY IF FAILED
//       // =================================================

//       setIsSubmitting(false);
//     }
//   };

//   // =====================================================
//   // UI
//   // =====================================================

//   return (
//     <div className="cart-container">

//       {/* =================================================
//           HEADER
//       ================================================= */}

//       <div className="cart-header">

//         <h2>
//           🛒 Your Cart
//         </h2>

//         <button
//           onClick={() =>
//             go("/myorders")
//           }
//           disabled={isSubmitting}
//         >
//           📦 My Orders
//         </button>

//       </div>

//       {/* =================================================
//           SUMMARY
//       ================================================= */}

//       <div className="cart-summary">

//         <span>
//           Total Items: {totalItems}
//         </span>

//         <span>
//           Total:{" "}
//           {totalPrice.toFixed(2)} EGP
//         </span>

//       </div>

//       {/* =================================================
//           CART ITEMS
//       ================================================= */}

//       {cart.length === 0 ? (
//         <p>
//           Cart is empty
//         </p>
//       ) : (
//         cart.map((item) => {

//           const isOffer =
//             item.itemType === "offer" ||
//             item.isOffer === true ||
//             Boolean(item.offerId);

//           return (
//             <div
//               className="cart-item"
//               key={
//                 item.key ||
//                 item._id
//               }
//             >

//               {/* =========================================
//                   ITEM INFO
//               ========================================= */}

//               <div>

//                 <h4>
//                   {item.title}
//                 </h4>

//                 {/* =======================================
//                     OFFER
//                 ======================================= */}

//                 {isOffer && (
//                   <p className="variant">
//                     🏷️ Special Offer
//                   </p>
//                 )}

//                 {/* =======================================
//                     VARIANT
//                 ======================================= */}

//                 {!isOffer && (
//                   <p className="variant">
//                     {getVariantName(item)}
//                   </p>
//                 )}

//                 {/* =======================================
//                     PRICE
//                 ======================================= */}

//                 <p>
//                   {Number(
//                     item.price || 0
//                   ).toFixed(2)}{" "}
//                   EGP ×{" "}
//                   {Number(
//                     item.quantity || 0
//                   )}
//                 </p>

//               </div>

//               {/* =========================================
//                   ACTIONS
//               ========================================= */}

//               <div className="actions">

//                 {/* MINUS */}

//                 <button
//                   onClick={() =>
//                     decreaseQty(
//                       item.key
//                     )
//                   }
//                   disabled={
//                     isSubmitting
//                   }
//                 >
//                   <FaMinus />
//                 </button>

//                 {/* PLUS */}

//                 <button
//                   onClick={() =>
//                     increaseQty(
//                       item.key
//                     )
//                   }
//                   disabled={
//                     isSubmitting
//                   }
//                 >
//                   <FaPlus />
//                 </button>

//                 {/* DELETE */}

//                 <button
//                   onClick={() =>
//                     removeFromCart(
//                       item.key
//                     )
//                   }
//                   disabled={
//                     isSubmitting
//                   }
//                 >
//                   <FaTrash />
//                 </button>

//               </div>

//             </div>
//           );
//         })
//       )}

//       {/* =================================================
//           ADDRESS + CONFIRM
//       ================================================= */}

//       {cart.length > 0 && (
//         <>

//           <div className="address">

//             {/* STREET */}

//             <input
//               type="text"
//               placeholder="Street"
//               value={
//                 address.street
//               }
//               onChange={(e) =>
//                 setAddress({
//                   ...address,

//                   street:
//                     e.target.value,
//                 })
//               }
//               disabled={
//                 isSubmitting
//               }
//             />

//             {/* CITY */}

//             <input
//               type="text"
//               placeholder="City"
//               value={
//                 address.city
//               }
//               onChange={(e) =>
//                 setAddress({
//                   ...address,

//                   city:
//                     e.target.value,
//                 })
//               }
//               disabled={
//                 isSubmitting
//               }
//             />

//             {/* NOTES */}

//             <input
//               type="text"
//               placeholder="Notes"
//               value={
//                 address.notes
//               }
//               onChange={(e) =>
//                 setAddress({
//                   ...address,

//                   notes:
//                     e.target.value,
//                 })
//               }
//               disabled={
//                 isSubmitting
//               }
//             />

//           </div>

//           {/* =============================================
//               CONFIRM ORDER
//           ============================================= */}

//           <button
//             className="confirm-btn"
//             onClick={
//               createOrder
//             }
//             disabled={
//               isSubmitting
//             }
//           >
//             {isSubmitting
//               ? "Placing Order..."
//               : "Confirm Order"}
//           </button>

//         </>
//       )}

//     </div>
//   );
// };

// export default Cart;

// import React, {
//   useEffect,
//   useRef,
//   useState,
// } from "react";

// import {
//   useCart,
// } from "../../component/CartContext/CartContext";

// import {
//   FaTrash,
//   FaPlus,
//   FaMinus,
// } from "react-icons/fa";

// import {
//   useNavigate,
//   useLocation,
// } from "react-router-dom";

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

//   const [isSubmitting, setIsSubmitting] =
//     useState(false);

//   const [address, setAddress] = useState({
//     street: "",
//     city: "",
//     notes: "",
//   });

//   // =====================================================
//   // LOYALTY STATE
//   // =====================================================

//   const [loyaltyPoints, setLoyaltyPoints] =
//     useState(0);

//   const [pointsToRedeem, setPointsToRedeem] =
//     useState(0);

//   const [loadingLoyalty, setLoadingLoyalty] =
//     useState(false);

//   // =====================================================
//   // REORDER
//   // =====================================================

//   useEffect(() => {
//     if (
//       location.state?.reorderItems &&
//       !didReorder.current
//     ) {
//       didReorder.current = true;

//       location.state.reorderItems.forEach(
//         (item) => {
//           const isOffer =
//             item.itemType === "offer" ||
//             item.isOffer === true ||
//             Boolean(item.offerId);

//           addToCart({
//             _id: item._id,

//             title: item.title,

//             price: Number(item.price),

//             selectedVariant:
//               item.variant ||
//               item.selectedVariant ||
//               null,

//             restaurantId:
//               item.restaurantId,

//             itemType: isOffer
//               ? "offer"
//               : "product",

//             isOffer,

//             offerId:
//               item.offerId || null,

//             productId:
//               item.productId ||
//               (!isOffer
//                 ? item._id
//                 : null),

//             discount:
//               Number(item.discount || 0),

//             image:
//               item.image ||
//               item.CoverImage ||
//               "",
//           });
//         }
//       );

//       window.history.replaceState(
//         {},
//         document.title
//       );
//     }
//   }, [
//     location.state,
//     addToCart,
//   ]);

//   // =====================================================
//   // TOTAL ITEMS
//   // =====================================================

//   const totalItems = cart.reduce(
//     (sum, item) =>
//       sum + Number(item.quantity || 0),
//     0
//   );

//   // =====================================================
//   // TOTAL PRICE
//   // =====================================================

//   const totalPrice = cart.reduce(
//     (sum, item) =>
//       sum +
//       Number(item.price || 0) *
//         Number(item.quantity || 0),
//     0
//   );

//   // =====================================================
//   // RESTAURANT ID
//   // =====================================================

//   const restaurantId =
//     cart.length > 0
//       ? cart[0]?.restaurantId
//       : null;

//   // =====================================================
//   // MAX POINTS THAT CAN BE USED
//   //
//   // 10 POINTS = 1 EGP
//   //
//   // Example:
//   // Order = 250 EGP
//   // Maximum redeem = 2500 points
//   // =====================================================

//   const maxPointsForOrder =
//     Math.floor(totalPrice * 10);

//   const maxRedeemablePoints = Math.min(
//     Number(loyaltyPoints || 0),
//     maxPointsForOrder
//   );

//   // =====================================================
//   // LOYALTY DISCOUNT
//   //
//   // 10 POINTS = 1 EGP
//   // =====================================================

//   const loyaltyDiscount =
//     Number(pointsToRedeem || 0) / 10;

//   // =====================================================
//   // FINAL TOTAL
//   // =====================================================

//   const finalTotal = Math.max(
//     0,
//     totalPrice - loyaltyDiscount
//   );

//   // =====================================================
//   // FETCH RESTAURANT LOYALTY WALLET
//   // =====================================================

//   useEffect(() => {
//     const fetchLoyaltyWallet = async () => {
//       const token =
//         localStorage.getItem("token");

//       if (
//         !token ||
//         !restaurantId
//       ) {
//         setLoyaltyPoints(0);
//         setPointsToRedeem(0);
//         return;
//       }

//       try {
//         setLoadingLoyalty(true);

//         const res = await api.get(
//           `/api/v1/loyalty/${restaurantId}`,
//           {
//             headers: {
//               Authorization:
//                 `Bearer ${token}`,
//             },
//           }
//         );

//         const availablePoints =
//           Number(
//             res.data?.points || 0
//           );

//         setLoyaltyPoints(
//           availablePoints
//         );

//         setPointsToRedeem(0);
//       } catch (error) {
//         console.error(
//           "FETCH LOYALTY WALLET ERROR:",
//           error
//         );

//         setLoyaltyPoints(0);
//         setPointsToRedeem(0);
//       } finally {
//         setLoadingLoyalty(false);
//       }
//     };

//     fetchLoyaltyWallet();
//   }, [restaurantId]);

//   // =====================================================
//   // KEEP REDEEMED POINTS VALID
//   // IF CART TOTAL CHANGES
//   // =====================================================

//   useEffect(() => {
//     setPointsToRedeem((current) => {
//       const safeCurrent =
//         Number(current || 0);

//       const max =
//         Math.min(
//           Number(loyaltyPoints || 0),
//           Math.floor(
//             Number(totalPrice || 0) * 10
//           )
//         );

//       return Math.min(
//         Math.max(
//           safeCurrent,
//           0
//         ),
//         max
//       );
//     });
//   }, [
//     totalPrice,
//     loyaltyPoints,
//   ]);

//   // =====================================================
//   // CHANGE POINTS
//   // =====================================================

//   const handlePointsChange = (value) => {
//     let points =
//       Number(value);

//     if (
//       !Number.isFinite(points) ||
//       points < 0
//     ) {
//       points = 0;
//     }

//     // Points must be whole numbers
//     points = Math.floor(points);

//     // Never exceed available wallet
//     // Never exceed order value
//     points = Math.min(
//       points,
//       maxRedeemablePoints
//     );

//     setPointsToRedeem(points);
//   };

//   // =====================================================
//   // USE ALL POINTS
//   // =====================================================

//   const useAllPoints = () => {
//     setPointsToRedeem(
//       maxRedeemablePoints
//     );
//   };

//   // =====================================================
//   // VARIANT DISPLAY
//   // =====================================================

//   const getVariantName = (item) => {
//     const variant =
//       item.selectedVariant ||
//       item.variant;

//     if (!variant) {
//       return "Standard";
//     }

//     if (typeof variant === "string") {
//       return variant;
//     }

//     return (
//       variant.name ||
//       variant.size ||
//       "Standard"
//     );
//   };

//   // =====================================================
//   // CREATE ORDER
//   // =====================================================

//   const createOrder = async () => {
//     // ===================================================
//     // PREVENT DOUBLE CLICK
//     // ===================================================

//     if (isSubmitting) {
//       return;
//     }

//     // ===================================================
//     // TOKEN
//     // ===================================================

//     const token =
//       localStorage.getItem("token");

//     if (!token) {
//       alert(
//         "You must login first"
//       );

//       go("/login");

//       return;
//     }

//     // ===================================================
//     // ADDRESS
//     // ===================================================

//     if (
//       !address.street.trim() ||
//       !address.city.trim()
//     ) {
//       alert(
//         "Please enter full address"
//       );

//       return;
//     }

//     // ===================================================
//     // CART
//     // ===================================================

//     if (cart.length === 0) {
//       alert("Cart is empty");

//       return;
//     }

//     // ===================================================
//     // LOCK BUTTON
//     // ===================================================

//     setIsSubmitting(true);

//     try {
//       // =================================================
//       // BUILD ORDER ITEMS
//       // =================================================

//       const items = cart.map((item) => {
//         // ===============================================
//         // DETECT OFFER
//         // ===============================================

//         const isOffer =
//           item.itemType === "offer" ||
//           item.isOffer === true ||
//           Boolean(item.offerId);

//         // ===============================================
//         // OFFER
//         // ===============================================

//         if (isOffer) {
//           const offerId =
//             item.offerId ||
//             item._id;

//           if (!offerId) {
//             throw new Error(
//               `Offer ID is missing for ${item.title}`
//             );
//           }

//           return {
//             itemType: "offer",

//             offerId:
//               String(offerId),

//             productId: null,

//             title:
//               item.title || "",

//             quantity:
//               Number(item.quantity) || 1,

//             price:
//               Number(item.price) || 0,

//             discount:
//               Number(item.discount || 0),

//             image:
//               item.image ||
//               item.CoverImage ||
//               "",

//             variant: null,
//           };
//         }

//         // ===============================================
//         // NORMAL PRODUCT
//         // ===============================================

//         const productId =
//           item.productId ||
//           item._id;

//         if (!productId) {
//           throw new Error(
//             `Product ID is missing for ${item.title}`
//           );
//         }

//         return {
//           itemType: "product",

//           productId:
//             String(productId),

//           offerId: null,

//           title:
//             item.title || "",

//           quantity:
//             Number(item.quantity) || 1,

//           price:
//             Number(item.price) || 0,

//           variant:
//             item.selectedVariant ||
//             item.variant ||
//             null,

//           image:
//             item.image ||
//             item.CoverImage ||
//             "",
//         };
//       });

//       // =================================================
//       // FINAL POINTS VALUE
//       //
//       // Backend is the final source of truth.
//       // Frontend only sends the requested points.
//       // =================================================

//       const safePointsToRedeem =
//         Math.min(
//           Math.max(
//             Math.floor(
//               Number(
//                 pointsToRedeem || 0
//               )
//             ),
//             0
//           ),
//           maxRedeemablePoints
//         );

//       // =================================================
//       // CREATE ORDER
//       // =================================================

//       await api.post(
//         "/api/v1/orders/create",
//         {
//           items,

//           address: {
//             street:
//               address.street.trim(),

//             city:
//               address.city.trim(),

//             notes:
//               address.notes.trim(),
//           },

//           paymentMethod: "cash",

//           // =================================================
//           // LOYALTY
//           //
//           // 10 POINTS = 1 EGP
//           // =================================================

//           pointsToRedeem:
//             safePointsToRedeem,
//         },
//         {
//           headers: {
//             Authorization:
//               `Bearer ${token}`,
//           },
//         }
//       );

//       // =================================================
//       // SUCCESS
//       // =================================================

//       clearCart();

//       go("/myorders");

//     } catch (error) {
//       console.error(
//         "CREATE ORDER ERROR:",
//         error
//       );

//       console.error(
//         "BACKEND RESPONSE:",
//         error?.response?.data
//       );

//       alert(
//         error?.response?.data?.message ||
//           error?.message ||
//           "Error creating order"
//       );

//       // =================================================
//       // UNLOCK ONLY IF FAILED
//       // =================================================

//       setIsSubmitting(false);
//     }
//   };

//   // =====================================================
//   // UI
//   // =====================================================

//   return (
//     <div className="cart-container">

//       {/* =================================================
//           HEADER
//       ================================================= */}

//       <div className="cart-header">

//         <h2>
//           🛒 Your Cart
//         </h2>

//         <button
//           onClick={() =>
//             go("/myorders")
//           }
//           disabled={isSubmitting}
//         >
//           📦 My Orders
//         </button>

//       </div>

//       {/* =================================================
//           SUMMARY
//       ================================================= */}

//       <div className="cart-summary">

//         <span>
//           Total Items: {totalItems}
//         </span>

//         <span>
//           Total:{" "}
//           {totalPrice.toFixed(2)} EGP
//         </span>

//       </div>

//       {/* =================================================
//           CART ITEMS
//       ================================================= */}

//       {cart.length === 0 ? (
//         <p>
//           Cart is empty
//         </p>
//       ) : (
//         cart.map((item) => {

//           const isOffer =
//             item.itemType === "offer" ||
//             item.isOffer === true ||
//             Boolean(item.offerId);

//           return (
//             <div
//               className="cart-item"
//               key={
//                 item.key ||
//                 item._id
//               }
//             >

//               {/* =========================================
//                   ITEM INFO
//               ========================================= */}

//               <div>

//                 <h4>
//                   {item.title}
//                 </h4>

//                 {/* =======================================
//                     OFFER
//                 ======================================= */}

//                 {isOffer && (
//                   <p className="variant">
//                     🏷️ Special Offer
//                   </p>
//                 )}

//                 {/* =======================================
//                     VARIANT
//                 ======================================= */}

//                 {!isOffer && (
//                   <p className="variant">
//                     {getVariantName(item)}
//                   </p>
//                 )}

//                 {/* =======================================
//                     PRICE
//                 ======================================= */}

//                 <p>
//                   {Number(
//                     item.price || 0
//                   ).toFixed(2)}{" "}
//                   EGP ×{" "}
//                   {Number(
//                     item.quantity || 0
//                   )}
//                 </p>

//               </div>

//               {/* =========================================
//                   ACTIONS
//               ========================================= */}

//               <div className="actions">

//                 {/* MINUS */}

//                 <button
//                   onClick={() =>
//                     decreaseQty(
//                       item.key
//                     )
//                   }
//                   disabled={
//                     isSubmitting
//                   }
//                 >
//                   <FaMinus />
//                 </button>

//                 {/* PLUS */}

//                 <button
//                   onClick={() =>
//                     increaseQty(
//                       item.key
//                     )
//                   }
//                   disabled={
//                     isSubmitting
//                   }
//                 >
//                   <FaPlus />
//                 </button>

//                 {/* DELETE */}

//                 <button
//                   onClick={() =>
//                     removeFromCart(
//                       item.key
//                     )
//                   }
//                   disabled={
//                     isSubmitting
//                   }
//                 >
//                   <FaTrash />
//                 </button>

//               </div>

//             </div>
//           );
//         })
//       )}

//       {/* =================================================
//           LOYALTY POINTS
//       ================================================= */}

//       {cart.length > 0 && (
//         <div className="cart-loyalty">

//           <div className="cart-loyalty-header">
//             <div>
//               <h3>
//                 ⭐ Use Your Points
//               </h3>

//               <p>
//                 10 Points = 1 EGP discount
//               </p>
//             </div>

//             <div className="cart-loyalty-balance">
//               {loadingLoyalty
//                 ? "Loading..."
//                 : `${loyaltyPoints} Points`}
//             </div>
//           </div>

//           {!loadingLoyalty &&
//             loyaltyPoints > 0 && (
//               <>
//                 <div className="cart-loyalty-info">
//                   <span>
//                     Available:
//                     {" "}
//                     <strong>
//                       {loyaltyPoints}
//                     </strong>
//                     {" "}
//                     Points
//                   </span>

//                   <span>
//                     Max for this order:
//                     {" "}
//                     <strong>
//                       {maxRedeemablePoints}
//                     </strong>
//                   </span>
//                 </div>

//                 <div className="cart-loyalty-control">

//                   <input
//                     type="number"
//                     min="0"
//                     max={
//                       maxRedeemablePoints
//                     }
//                     step="1"
//                     value={
//                       pointsToRedeem
//                     }
//                     onChange={(e) =>
//                       handlePointsChange(
//                         e.target.value
//                       )
//                     }
//                     disabled={
//                       isSubmitting ||
//                       maxRedeemablePoints ===
//                         0
//                     }
//                     placeholder="Points"
//                   />

//                   <button
//                     type="button"
//                     onClick={
//                       useAllPoints
//                     }
//                     disabled={
//                       isSubmitting ||
//                       maxRedeemablePoints ===
//                         0
//                     }
//                   >
//                     Use All
//                   </button>

//                 </div>

//                 {pointsToRedeem > 0 && (
//                   <div className="cart-loyalty-discount">
//                     <span>
//                       ⭐ Points Used
//                     </span>

//                     <strong>
//                       {pointsToRedeem}
//                     </strong>
//                   </div>
//                 )}

//                 {pointsToRedeem > 0 && (
//                   <div className="cart-loyalty-discount">
//                     <span>
//                       💰 Loyalty Discount
//                     </span>

//                     <strong>
//                       -{loyaltyDiscount.toFixed(2)} EGP
//                     </strong>
//                   </div>
//                 )}

//               </>
//             )}

//           {!loadingLoyalty &&
//             loyaltyPoints === 0 && (
//               <div className="cart-no-points">
//                 <span>
//                   ⭐
//                 </span>

//                 <p>
//                   You don't have points for
//                   this restaurant yet.
//                 </p>
//               </div>
//             )}

//         </div>
//       )}

//       {/* =================================================
//           FINAL TOTAL
//       ================================================= */}

//       {cart.length > 0 && (
//         <div className="cart-final-total">

//           <div>
//             <span>
//               Subtotal
//             </span>

//             <strong>
//               {totalPrice.toFixed(2)} EGP
//             </strong>
//           </div>

//           {pointsToRedeem > 0 && (
//             <div>
//               <span>
//                 Loyalty Discount
//               </span>

//               <strong>
//                 -{loyaltyDiscount.toFixed(2)} EGP
//               </strong>
//             </div>
//           )}

//           <div className="cart-total-final-row">
//             <span>
//               Total
//             </span>

//             <strong>
//               {finalTotal.toFixed(2)} EGP
//             </strong>
//           </div>

//         </div>
//       )}

//       {/* =================================================
//           ADDRESS + CONFIRM
//       ================================================= */}

//       {cart.length > 0 && (
//         <>

//           <div className="address">

//             {/* STREET */}

//             <input
//               type="text"
//               placeholder="Street"
//               value={
//                 address.street
//               }
//               onChange={(e) =>
//                 setAddress({
//                   ...address,

//                   street:
//                     e.target.value,
//                 })
//               }
//               disabled={
//                 isSubmitting
//               }
//             />

//             {/* CITY */}

//             <input
//               type="text"
//               placeholder="City"
//               value={
//                 address.city
//               }
//               onChange={(e) =>
//                 setAddress({
//                   ...address,

//                   city:
//                     e.target.value,
//                 })
//               }
//               disabled={
//                 isSubmitting
//               }
//             />

//             {/* NOTES */}

//             <input
//               type="text"
//               placeholder="Notes"
//               value={
//                 address.notes
//               }
//               onChange={(e) =>
//                 setAddress({
//                   ...address,

//                   notes:
//                     e.target.value,
//                 })
//               }
//               disabled={
//                 isSubmitting
//               }
//             />

//           </div>

//           {/* =============================================
//               CONFIRM ORDER
//           ============================================= */}

//           <button
//             className="confirm-btn"
//             onClick={
//               createOrder
//             }
//             disabled={
//               isSubmitting
//             }
//           >
//             {isSubmitting
//               ? "Placing Order..."
//               : "Confirm Order"}
//           </button>

//         </>
//       )}

//     </div>
//   );
// };

// export default Cart;

import React, {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  useCart,
} from "../../component/CartContext/CartContext";

import {
  FaTrash,
  FaPlus,
  FaMinus,
} from "react-icons/fa";

import {
  useNavigate,
  useLocation,
} from "react-router-dom";

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

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const [address, setAddress] = useState({
    street: "",
    city: "",
    notes: "",
  });

  // =====================================================
  // LOYALTY STATE
  // =====================================================

  const [loyaltyPoints, setLoyaltyPoints] =
    useState(0);

  const [pointsToRedeem, setPointsToRedeem] =
    useState(0);

  const [loadingLoyalty, setLoadingLoyalty] =
    useState(false);

  // =====================================================
  // REORDER
  // =====================================================

  useEffect(() => {
    if (
      location.state?.reorderItems &&
      !didReorder.current
    ) {
      didReorder.current = true;

      location.state.reorderItems.forEach(
        (item) => {
          const isOffer =
            item.itemType === "offer" ||
            item.isOffer === true ||
            Boolean(item.offerId);

          addToCart({
            _id: item._id,

            title: item.title,

            price: Number(item.price),

            selectedVariant:
              item.variant ||
              item.selectedVariant ||
              null,

            restaurantId:
              item.restaurantId,

            itemType: isOffer
              ? "offer"
              : "product",

            isOffer,

            offerId:
              item.offerId || null,

            productId:
              item.productId ||
              (!isOffer
                ? item._id
                : null),

            discount:
              Number(item.discount || 0),

            image:
              item.image ||
              item.CoverImage ||
              "",
          });
        }
      );

      window.history.replaceState(
        {},
        document.title
      );
    }
  }, [
    location.state,
    addToCart,
  ]);

  // =====================================================
  // TOTAL ITEMS
  // =====================================================

  const totalItems = cart.reduce(
    (sum, item) =>
      sum + Number(item.quantity || 0),
    0
  );

  // =====================================================
  // TOTAL PRICE
  // =====================================================

  const totalPrice = cart.reduce(
    (sum, item) =>
      sum +
      Number(item.price || 0) *
        Number(item.quantity || 0),
    0
  );

  // =====================================================
  // RESTAURANT ID
  // =====================================================

  const restaurantId =
    cart.length > 0
      ? cart[0]?.restaurantId
      : null;

  // =====================================================
  // MAX POINTS THAT CAN BE USED
  //
  // NEW RULE:
  //
  // 1 POINT = 1 EGP DISCOUNT
  //
  // Example:
  //
  // Order = 250 EGP
  // Wallet = 500 Points
  // Maximum redeem = 250 Points
  //
  // Order = 250 EGP
  // Wallet = 120 Points
  // Maximum redeem = 120 Points
  // =====================================================

  const maxPointsForOrder =
    Math.floor(totalPrice);

  const maxRedeemablePoints = Math.min(
    Number(loyaltyPoints || 0),
    maxPointsForOrder
  );

  // =====================================================
  // LOYALTY DISCOUNT
  //
  // NEW RULE:
  //
  // 1 POINT = 1 EGP
  // =====================================================

  const loyaltyDiscount =
    Number(pointsToRedeem || 0);

  // =====================================================
  // FINAL TOTAL
  // =====================================================

  const finalTotal = Math.max(
    0,
    totalPrice - loyaltyDiscount
  );

  // =====================================================
  // FETCH RESTAURANT LOYALTY WALLET
  // =====================================================

  useEffect(() => {
    const fetchLoyaltyWallet = async () => {
      const token =
        localStorage.getItem("token");

      if (
        !token ||
        !restaurantId
      ) {
        setLoyaltyPoints(0);
        setPointsToRedeem(0);
        return;
      }

      try {
        setLoadingLoyalty(true);

        const res = await api.get(
          `/api/v1/loyalty/${restaurantId}`,
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

        const availablePoints =
          Number(
            res.data?.points || 0
          );

        setLoyaltyPoints(
          availablePoints
        );

        setPointsToRedeem(0);
      } catch (error) {
        console.error(
          "FETCH LOYALTY WALLET ERROR:",
          error
        );

        setLoyaltyPoints(0);
        setPointsToRedeem(0);
      } finally {
        setLoadingLoyalty(false);
      }
    };

    fetchLoyaltyWallet();
  }, [restaurantId]);

  // =====================================================
  // KEEP REDEEMED POINTS VALID
  // IF CART TOTAL CHANGES
  //
  // 1 POINT = 1 EGP
  // =====================================================

  useEffect(() => {
    setPointsToRedeem((current) => {
      const safeCurrent =
        Number(current || 0);

      const max =
        Math.min(
          Number(loyaltyPoints || 0),
          Math.floor(
            Number(totalPrice || 0)
          )
        );

      return Math.min(
        Math.max(
          safeCurrent,
          0
        ),
        max
      );
    });
  }, [
    totalPrice,
    loyaltyPoints,
  ]);

  // =====================================================
  // CHANGE POINTS
  // =====================================================

  const handlePointsChange = (value) => {
    let points =
      Number(value);

    if (
      !Number.isFinite(points) ||
      points < 0
    ) {
      points = 0;
    }

    // Points must be whole numbers
    points = Math.floor(points);

    // Never exceed available wallet
    // Never exceed order value
    points = Math.min(
      points,
      maxRedeemablePoints
    );

    setPointsToRedeem(points);
  };

  // =====================================================
  // USE ALL POINTS
  // =====================================================

  const useAllPoints = () => {
    setPointsToRedeem(
      maxRedeemablePoints
    );
  };

  // =====================================================
  // VARIANT DISPLAY
  // =====================================================

  const getVariantName = (item) => {
    const variant =
      item.selectedVariant ||
      item.variant;

    if (!variant) {
      return "Standard";
    }

    if (typeof variant === "string") {
      return variant;
    }

    return (
      variant.name ||
      variant.size ||
      "Standard"
    );
  };

  // =====================================================
  // CREATE ORDER
  // =====================================================

  const createOrder = async () => {
    // ===================================================
    // PREVENT DOUBLE CLICK
    // ===================================================

    if (isSubmitting) {
      return;
    }

    // ===================================================
    // TOKEN
    // ===================================================

    const token =
      localStorage.getItem("token");

    if (!token) {
      alert(
        "You must login first"
      );

      go("/login");

      return;
    }

    // ===================================================
    // ADDRESS
    // ===================================================

    if (
      !address.street.trim() ||
      !address.city.trim()
    ) {
      alert(
        "Please enter full address"
      );

      return;
    }

    // ===================================================
    // CART
    // ===================================================

    if (cart.length === 0) {
      alert("Cart is empty");

      return;
    }

    // ===================================================
    // LOCK BUTTON
    // ===================================================

    setIsSubmitting(true);

    try {
      // =================================================
      // BUILD ORDER ITEMS
      // =================================================

      const items = cart.map((item) => {
        // ===============================================
        // DETECT OFFER
        // ===============================================

        const isOffer =
          item.itemType === "offer" ||
          item.isOffer === true ||
          Boolean(item.offerId);

        // ===============================================
        // OFFER
        // ===============================================

        if (isOffer) {
          const offerId =
            item.offerId ||
            item._id;

          if (!offerId) {
            throw new Error(
              `Offer ID is missing for ${item.title}`
            );
          }

          return {
            itemType: "offer",

            offerId:
              String(offerId),

            productId: null,

            title:
              item.title || "",

            quantity:
              Number(item.quantity) || 1,

            price:
              Number(item.price) || 0,

            discount:
              Number(item.discount || 0),

            image:
              item.image ||
              item.CoverImage ||
              "",

            variant: null,
          };
        }

        // ===============================================
        // NORMAL PRODUCT
        // ===============================================

        const productId =
          item.productId ||
          item._id;

        if (!productId) {
          throw new Error(
            `Product ID is missing for ${item.title}`
          );
        }

        return {
          itemType: "product",

          productId:
            String(productId),

          offerId: null,

          title:
            item.title || "",

          quantity:
            Number(item.quantity) || 1,

          price:
            Number(item.price) || 0,

          variant:
            item.selectedVariant ||
            item.variant ||
            null,

          image:
            item.image ||
            item.CoverImage ||
            "",
        };
      });

      // =================================================
      // FINAL POINTS VALUE
      //
      // 1 POINT = 1 EGP DISCOUNT
      //
      // Backend is the final source of truth.
      // Frontend only sends the requested points.
      // =================================================

      const safePointsToRedeem =
        Math.min(
          Math.max(
            Math.floor(
              Number(
                pointsToRedeem || 0
              )
            ),
            0
          ),
          maxRedeemablePoints
        );

      // =================================================
      // CREATE ORDER
      // =================================================

      await api.post(
        "/api/v1/orders/create",
        {
          items,

          address: {
            street:
              address.street.trim(),

            city:
              address.city.trim(),

            notes:
              address.notes.trim(),
          },

          paymentMethod: "cash",

          // =================================================
          // LOYALTY
          //
          // 1 POINT = 1 EGP DISCOUNT
          // =================================================

          pointsToRedeem:
            safePointsToRedeem,
        },
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

      // =================================================
      // SUCCESS
      // =================================================

      clearCart();

      go("/myorders");

    } catch (error) {
      console.error(
        "CREATE ORDER ERROR:",
        error
      );

      console.error(
        "BACKEND RESPONSE:",
        error?.response?.data
      );

      alert(
        error?.response?.data?.message ||
          error?.message ||
          "Error creating order"
      );

      // =================================================
      // UNLOCK ONLY IF FAILED
      // =================================================

      setIsSubmitting(false);
    }
  };

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="cart-container">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="cart-header">

        <h2>
          🛒 Your Cart
        </h2>

        <button
          onClick={() =>
            go("/myorders")
          }
          disabled={isSubmitting}
        >
          📦 My Orders
        </button>

      </div>

      {/* =================================================
          SUMMARY
      ================================================= */}

      <div className="cart-summary">

        <span>
          Total Items: {totalItems}
        </span>

        <span>
          Total:{" "}
          {totalPrice.toFixed(2)} EGP
        </span>

      </div>

      {/* =================================================
          CART ITEMS
      ================================================= */}

      {cart.length === 0 ? (
        <p>
          Cart is empty
        </p>
      ) : (
        cart.map((item) => {

          const isOffer =
            item.itemType === "offer" ||
            item.isOffer === true ||
            Boolean(item.offerId);

          return (
            <div
              className="cart-item"
              key={
                item.key ||
                item._id
              }
            >

              {/* =========================================
                  ITEM INFO
              ========================================= */}

              <div>

                <h4>
                  {item.title}
                </h4>

                {/* =======================================
                    OFFER
                ======================================= */}

                {isOffer && (
                  <p className="variant">
                    🏷️ Special Offer
                  </p>
                )}

                {/* =======================================
                    VARIANT
                ======================================= */}

                {!isOffer && (
                  <p className="variant">
                    {getVariantName(item)}
                  </p>
                )}

                {/* =======================================
                    PRICE
                ======================================= */}

                <p>
                  {Number(
                    item.price || 0
                  ).toFixed(2)}{" "}
                  EGP ×{" "}
                  {Number(
                    item.quantity || 0
                  )}
                </p>

              </div>

              {/* =========================================
                  ACTIONS
              ========================================= */}

              <div className="actions">

                {/* MINUS */}

                <button
                  onClick={() =>
                    decreaseQty(
                      item.key
                    )
                  }
                  disabled={
                    isSubmitting
                  }
                >
                  <FaMinus />
                </button>

                {/* PLUS */}

                <button
                  onClick={() =>
                    increaseQty(
                      item.key
                    )
                  }
                  disabled={
                    isSubmitting
                  }
                >
                  <FaPlus />
                </button>

                {/* DELETE */}

                <button
                  onClick={() =>
                    removeFromCart(
                      item.key
                    )
                  }
                  disabled={
                    isSubmitting
                  }
                >
                  <FaTrash />
                </button>

              </div>

            </div>
          );
        })
      )}

      {/* =================================================
          LOYALTY POINTS
      ================================================= */}

      {cart.length > 0 && (
        <div className="cart-loyalty">

          <div className="cart-loyalty-header">

            <div>
              <h3>
                ⭐ Use Your Points
              </h3>

              <p>
                1 Point = 1 EGP discount
              </p>
            </div>

            <div className="cart-loyalty-balance">
              {loadingLoyalty
                ? "Loading..."
                : `${loyaltyPoints} Points`}
            </div>

          </div>

          {!loadingLoyalty &&
            loyaltyPoints > 0 && (
              <>

                <div className="cart-loyalty-info">

                  <span>
                    Available:
                    {" "}
                    <strong>
                      {loyaltyPoints}
                    </strong>
                    {" "}
                    Points
                  </span>

                  <span>
                    Max for this order:
                    {" "}
                    <strong>
                      {maxRedeemablePoints}
                    </strong>
                  </span>

                </div>

                <div className="cart-loyalty-control">

                  <input
                    type="number"
                    min="0"
                    max={
                      maxRedeemablePoints
                    }
                    step="1"
                    value={
                      pointsToRedeem
                    }
                    onChange={(e) =>
                      handlePointsChange(
                        e.target.value
                      )
                    }
                    disabled={
                      isSubmitting ||
                      maxRedeemablePoints ===
                        0
                    }
                    placeholder="Points"
                  />

                  <button
                    type="button"
                    onClick={
                      useAllPoints
                    }
                    disabled={
                      isSubmitting ||
                      maxRedeemablePoints ===
                        0
                    }
                  >
                    Use All
                  </button>

                </div>

                {pointsToRedeem > 0 && (
                  <div className="cart-loyalty-discount">

                    <span>
                      ⭐ Points Used
                    </span>

                    <strong>
                      {pointsToRedeem}
                    </strong>

                  </div>
                )}

                {pointsToRedeem > 0 && (
                  <div className="cart-loyalty-discount">

                    <span>
                      💰 Loyalty Discount
                    </span>

                    <strong>
                      -
                      {loyaltyDiscount.toFixed(
                        2
                      )}{" "}
                      EGP
                    </strong>

                  </div>
                )}

              </>
            )}

          {!loadingLoyalty &&
            loyaltyPoints === 0 && (
              <div className="cart-no-points">

                <span>
                  ⭐
                </span>

                <p>
                  You don't have points for
                  this restaurant yet.
                </p>

              </div>
            )}

        </div>
      )}

      {/* =================================================
          FINAL TOTAL
      ================================================= */}

      {cart.length > 0 && (
        <div className="cart-final-total">

          <div>

            <span>
              Subtotal
            </span>

            <strong>
              {totalPrice.toFixed(2)} EGP
            </strong>

          </div>

          {pointsToRedeem > 0 && (
            <div>

              <span>
                Loyalty Discount
              </span>

              <strong>
                -
                {loyaltyDiscount.toFixed(
                  2
                )}{" "}
                EGP
              </strong>

            </div>
          )}

          <div className="cart-total-final-row">

            <span>
              Total
            </span>

            <strong>
              {finalTotal.toFixed(2)} EGP
            </strong>

          </div>

        </div>
      )}

      {/* =================================================
          ADDRESS + CONFIRM
      ================================================= */}

      {cart.length > 0 && (
        <>

          <div className="address">

            {/* STREET */}

            <input
              type="text"
              placeholder="Street"
              value={
                address.street
              }
              onChange={(e) =>
                setAddress({
                  ...address,

                  street:
                    e.target.value,
                })
              }
              disabled={
                isSubmitting
              }
            />

            {/* CITY */}

            <input
              type="text"
              placeholder="City"
              value={
                address.city
              }
              onChange={(e) =>
                setAddress({
                  ...address,

                  city:
                    e.target.value,
                })
              }
              disabled={
                isSubmitting
              }
            />

            {/* NOTES */}

            <input
              type="text"
              placeholder="Notes"
              value={
                address.notes
              }
              onChange={(e) =>
                setAddress({
                  ...address,

                  notes:
                    e.target.value,
                })
              }
              disabled={
                isSubmitting
              }
            />

          </div>

          {/* =============================================
              CONFIRM ORDER
          ============================================= */}

          <button
            className="confirm-btn"
            onClick={
              createOrder
            }
            disabled={
              isSubmitting
            }
          >
            {isSubmitting
              ? "Placing Order..."
              : "Confirm Order"}
          </button>

        </>
      )}

    </div>
  );
};

export default Cart;