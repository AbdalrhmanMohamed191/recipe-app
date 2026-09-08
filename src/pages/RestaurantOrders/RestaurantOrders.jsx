// import React, { useEffect, useState } from "react";
// import api from "../../api/api";

// const RestaurantOrders = () => {
//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [refreshing, setRefreshing] = useState(false);
//   const [updating, setUpdating] = useState(null);
//   const [selectedOrder, setSelectedOrder] = useState(null);

//   // =====================================================
//   // TOKEN
//   // =====================================================

//   const getToken = () => {
//     return localStorage.getItem("token");
//   };

//   // =====================================================
//   // GET ORDERS
//   // =====================================================

//   const fetchOrders = async (showRefreshLoading = false) => {
//     try {
//       if (showRefreshLoading) {
//         setRefreshing(true);
//       } else {
//         setLoading(true);
//       }

//       const token = getToken();

//       if (!token) {
//         alert("You are not logged in");
//         return;
//       }

//       const res = await api.get(
//         "/api/v1/orders/restaurant-orders",
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       setOrders(
//         Array.isArray(res.data)
//           ? res.data
//           : []
//       );
//     } catch (err) {
//       console.log(
//         "GET RESTAURANT ORDERS ERROR:",
//         err
//       );

//       alert(
//         err?.response?.data?.message ||
//           "Failed to load orders"
//       );
//     } finally {
//       setLoading(false);
//       setRefreshing(false);
//     }
//   };

//   // =====================================================
//   // LOAD
//   // =====================================================

//   useEffect(() => {
//     fetchOrders();
//   }, []);

//   // =====================================================
//   // UPDATE STATUS
//   // =====================================================

//   const updateStatus = async (id, status) => {
//     try {
//       setUpdating(id);

//       const token = getToken();

//       if (!token) {
//         alert("You are not logged in");
//         return;
//       }

//       const res = await api.put(
//         `/api/v1/orders/${id}/status`,
//         {
//           status,
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       const updatedOrder = res.data;

//       setOrders((prev) =>
//         prev.map((order) =>
//           order._id === id
//             ? updatedOrder
//             : order
//         )
//       );

//       if (
//         selectedOrder &&
//         selectedOrder._id === id
//       ) {
//         setSelectedOrder(updatedOrder);
//       }
//     } catch (err) {
//       console.log(
//         "UPDATE ORDER STATUS ERROR:",
//         err
//       );

//       alert(
//         err?.response?.data?.message ||
//           "Failed to update order"
//       );
//     } finally {
//       setUpdating(null);
//     }
//   };

//   // =====================================================
//   // NEXT STATUS
//   // =====================================================

//   const getNextStatus = (status) => {
//     if (status === "pending") {
//       return "preparing";
//     }

//     if (status === "preparing") {
//       return "delivered";
//     }

//     return null;
//   };

//   // =====================================================
//   // STATUS TEXT
//   // =====================================================

//   const getStatusText = (status) => {
//     switch (status) {
//       case "pending":
//         return "Pending";

//       case "preparing":
//         return "Preparing";

//       case "delivered":
//         return "Delivered";

//       case "cancelled":
//         return "Cancelled";

//       default:
//         return status || "Unknown";
//     }
//   };

//   // =====================================================
//   // DATE
//   // =====================================================

//   const formatDate = (date) => {
//     if (!date) {
//       return "Unknown date";
//     }

//     const parsedDate = new Date(date);

//     if (Number.isNaN(parsedDate.getTime())) {
//       return "Unknown date";
//     }

//     return parsedDate.toLocaleString(
//       "en-EG",
//       {
//         dateStyle: "medium",
//         timeStyle: "short",
//       }
//     );
//   };

//   // =====================================================
//   // TOTAL ITEMS
//   // =====================================================

//   const getItemsCount = (order) => {
//     if (!order.items?.length) {
//       return 0;
//     }

//     return order.items.reduce(
//       (total, item) =>
//         total + (Number(item.quantity) || 0),
//       0
//     );
//   };

//   // =====================================================
//   // CLOSE MODAL
//   // =====================================================

//   const closeModal = () => {
//     setSelectedOrder(null);
//   };

//   // =====================================================
//   // LOADING
//   // =====================================================

//   if (loading) {
//     return (
//       <div className="restaurant-orders-page">

//         <div className="orders-loading">

//           <div className="loading-spinner"></div>

//           <p>
//             Loading orders...
//           </p>

//         </div>

//         <style>{`

//           .restaurant-orders-page {
//             min-height: 100vh;
//             color: white;
//           }

//           .orders-loading {
//             min-height: 60vh;

//             display: flex;
//             flex-direction: column;

//             justify-content: center;
//             align-items: center;

//             color: #888;
//           }

//           .loading-spinner {
//             width: 40px;
//             height: 40px;

//             border: 4px solid #292929;
//             border-top-color: #ffcc00;

//             border-radius: 50%;

//             animation:
//               ordersSpin
//               0.8s
//               linear
//               infinite;

//             margin-bottom: 15px;
//           }

//           @keyframes ordersSpin {
//             to {
//               transform: rotate(360deg);
//             }
//           }

//         `}</style>

//       </div>
//     );
//   }

//   // =====================================================
//   // STATS
//   // =====================================================

//   const pendingOrders = orders.filter(
//     (order) =>
//       order.status === "pending"
//   ).length;

//   const preparingOrders = orders.filter(
//     (order) =>
//       order.status === "preparing"
//   ).length;

//   const deliveredOrders = orders.filter(
//     (order) =>
//       order.status === "delivered"
//   ).length;

//   const cancelledOrders = orders.filter(
//     (order) =>
//       order.status === "cancelled"
//   ).length;

//   // =====================================================
//   // UI
//   // =====================================================

//   return (
//     <div className="restaurant-orders-page">

//       {/* =================================================
//           HEADER
//       ================================================= */}

//       <div className="orders-page-header">

//         <div>

//           <h1>
//             Orders 🧾
//           </h1>

//           <p>
//             Manage orders from your customers
//           </p>

//         </div>

//         <button
//           className="refresh-btn"
//           onClick={() => fetchOrders(true)}
//           disabled={refreshing}
//         >
//           {refreshing ? (
//             <>
//               <span className="refresh-spinner"></span>
//               Refreshing...
//             </>
//           ) : (
//             <>
//               🔄 Refresh
//             </>
//           )}
//         </button>

//       </div>

//       {/* =================================================
//           STATS
//       ================================================= */}

//       <div className="orders-stats">

//         <div className="order-stat">

//           <span>
//             All Orders
//           </span>

//           <strong>
//             {orders.length}
//           </strong>

//         </div>

//         <div className="order-stat pending-stat">

//           <span>
//             Pending
//           </span>

//           <strong>
//             {pendingOrders}
//           </strong>

//         </div>

//         <div className="order-stat preparing-stat">

//           <span>
//             Preparing
//           </span>

//           <strong>
//             {preparingOrders}
//           </strong>

//         </div>

//         <div className="order-stat delivered-stat">

//           <span>
//             Delivered
//           </span>

//           <strong>
//             {deliveredOrders}
//           </strong>

//         </div>

//       </div>

//       {/* =================================================
//           EMPTY
//       ================================================= */}

//       {orders.length === 0 ? (

//         <div className="empty-orders">

//           <div className="empty-icon">
//             🧾
//           </div>

//           <h2>
//             No Orders Yet
//           </h2>

//           <p>
//             When customers order from your
//             restaurant, their orders will
//             appear here.
//           </p>

//           <button
//             className="empty-refresh-btn"
//             onClick={() =>
//               fetchOrders(true)
//             }
//           >
//             🔄 Check Again
//           </button>

//         </div>

//       ) : (

//         /* =================================================
//            ORDERS
//         ================================================= */

//         <div className="orders-grid">

//           {orders.map((order) => {

//             const nextStatus =
//               getNextStatus(
//                 order.status
//               );

//             return (

//               <div
//                 className="restaurant-order-card"
//                 key={order._id}
//               >

//                 {/* ================= HEADER ================= */}

//                 <div className="order-card-header">

//                   <div>

//                     <span className="order-label">
//                       Order
//                     </span>

//                     <strong>
//                       #
//                       {order._id
//                         ?.slice(-6)
//                         .toUpperCase()}
//                     </strong>

//                   </div>

//                   <span
//                     className={
//                       `order-status ${order.status}`
//                     }
//                   >
//                     {getStatusText(
//                       order.status
//                     )}
//                   </span>

//                 </div>

//                 {/* ================= CUSTOMER ================= */}

//                 <div className="customer-box">

//                   <div className="customer-avatar">
//                     👤
//                   </div>

//                   <div>

//                     <strong>
//                       {order.name ||
//                         "Customer"}
//                     </strong>

//                     <small>
//                       {order.phone ||
//                         "No phone"}
//                     </small>

//                   </div>

//                 </div>

//                 {/* ================= ITEMS ================= */}

//                 <div className="items-section">

//                   <div className="items-title-row">

//                     <h4>
//                       🍔 Items
//                     </h4>

//                     <span>
//                       {getItemsCount(order)}{" "}
//                       item
//                       {getItemsCount(order) !== 1
//                         ? "s"
//                         : ""}
//                     </span>

//                   </div>

//                   {order.items?.map(
//                     (item, index) => (

//                       <div
//                         className="order-item"
//                         key={index}
//                       >

//                         <div>

//                           <strong>
//                             {item.title ||
//                               "Unknown Item"}
//                           </strong>

//                           {item.variant?.name && (
//                             <small>
//                               {item.variant.name}
//                             </small>
//                           )}

//                         </div>

//                         <div className="item-price">

//                           <span>
//                             ×{" "}
//                             {item.quantity ||
//                               0}
//                           </span>

//                           <strong>
//                             {
//                               (
//                                 Number(
//                                   item.price
//                                 ) || 0
//                               ) *
//                                 (
//                                   Number(
//                                     item.quantity
//                                   ) || 0
//                                 )
//                             }{" "}
//                             EGP
//                           </strong>

//                         </div>

//                       </div>

//                     )
//                   )}

//                 </div>

//                 {/* ================= DELIVERY ================= */}

//                 <div className="order-total">

//                   <span>
//                     Delivery
//                   </span>

//                   <span>
//                     {Number(
//                       order.deliveryFee
//                     ) || 0}{" "}
//                     EGP
//                   </span>

//                 </div>

//                 {/* ================= TOTAL ================= */}

//                 <div className="total-row">

//                   <strong>
//                     Total
//                   </strong>

//                   <strong>
//                     {Number(
//                       order.totalPrice
//                     ) || 0}{" "}
//                     EGP
//                   </strong>

//                 </div>

//                 {/* ================= PAYMENT ================= */}

//                 <div className="payment-row">

//                   <span>
//                     💳 Payment
//                   </span>

//                   <span
//                     className={
//                       order.isPaid
//                         ? "paid"
//                         : "not-paid"
//                     }
//                   >
//                     {order.isPaid
//                       ? "Paid"
//                       : "Cash on Delivery"}
//                   </span>

//                 </div>

//                 {/* ================= DATE ================= */}

//                 <div className="order-date">
//                   📅{" "}
//                   {formatDate(
//                     order.createdAt
//                   )}
//                 </div>

//                 {/* ================= ACTIONS ================= */}

//                 <div className="order-actions">

//                   <button
//                     type="button"
//                     className="details-btn"
//                     onClick={() =>
//                       setSelectedOrder(order)
//                     }
//                   >
//                     👁️ Details
//                   </button>

//                   {nextStatus && (

//                     <button
//                       type="button"
//                       className="status-btn"
//                       disabled={
//                         updating ===
//                         order._id
//                       }
//                       onClick={() =>
//                         updateStatus(
//                           order._id,
//                           nextStatus
//                         )
//                       }
//                     >

//                       {updating ===
//                       order._id ? (

//                         <>
//                           <span className="button-spinner"></span>
//                           Updating...
//                         </>

//                       ) : (

//                         nextStatus ===
//                         "preparing"
//                           ? "👨‍🍳 Start Preparing"
//                           : "✅ Mark Delivered"

//                       )}

//                     </button>

//                   )}

//                   {order.status ===
//                     "pending" && (

//                     <button
//                       type="button"
//                       className="cancel-btn"
//                       disabled={
//                         updating ===
//                         order._id
//                       }
//                       onClick={() =>
//                         updateStatus(
//                           order._id,
//                           "cancelled"
//                         )
//                       }
//                     >
//                       ❌ Cancel
//                     </button>

//                   )}

//                 </div>

//               </div>
//             );
//           })}

//         </div>

//       )}

//       {/* =================================================
//           DETAILS MODAL
//       ================================================= */}

//       {selectedOrder && (

//         <div
//           className="modal-overlay"
//           onClick={closeModal}
//         >

//           <div
//             className="order-modal"
//             onClick={(e) =>
//               e.stopPropagation()
//             }
//           >

//             {/* ================= MODAL HEADER ================= */}

//             <div className="modal-header">

//               <div>

//                 <span>
//                   Order Details
//                 </span>

//                 <h2>
//                   #
//                   {selectedOrder._id
//                     ?.slice(-6)
//                     .toUpperCase()}
//                 </h2>

//               </div>

//               <button
//                 type="button"
//                 onClick={closeModal}
//                 aria-label="Close"
//               >
//                 ✕
//               </button>

//             </div>

//             {/* ================= STATUS ================= */}

//             <div className="modal-status-wrapper">

//               <span
//                 className={
//                   `order-status ${selectedOrder.status}`
//                 }
//               >
//                 {getStatusText(
//                   selectedOrder.status
//                 )}
//               </span>

//             </div>

//             {/* ================= CUSTOMER ================= */}

//             <div className="modal-section">

//               <h3>
//                 👤 Customer
//               </h3>

//               <p>
//                 <strong>
//                   Name:
//                 </strong>{" "}
//                 {selectedOrder.name ||
//                   "Customer"}
//               </p>

//               <p>
//                 <strong>
//                   Phone:
//                 </strong>{" "}
//                 {selectedOrder.phone ||
//                   "No phone"}
//               </p>

//             </div>

//             {/* ================= ADDRESS ================= */}

//             <div className="modal-section">

//               <h3>
//                 📍 Delivery Address
//               </h3>

//               {selectedOrder.address ? (

//                 <>
//                   {selectedOrder.address
//                     .street && (
//                     <p>
//                       <strong>
//                         Street:
//                       </strong>{" "}
//                       {
//                         selectedOrder
//                           .address.street
//                       }
//                     </p>
//                   )}

//                   {selectedOrder.address
//                     .city && (
//                     <p>
//                       <strong>
//                         City:
//                       </strong>{" "}
//                       {
//                         selectedOrder
//                           .address.city
//                       }
//                     </p>
//                   )}

//                   {selectedOrder.address
//                     .notes && (
//                     <p>
//                       📝{" "}
//                       {
//                         selectedOrder
//                           .address.notes
//                       }
//                     </p>
//                   )}
//                 </>

//               ) : (

//                 <p>
//                   No delivery address
//                 </p>

//               )}

//             </div>

//             {/* ================= ITEMS ================= */}

//             <div className="modal-section">

//               <h3>
//                 🍔 Order Items
//               </h3>

//               {selectedOrder.items?.length ? (

//                 selectedOrder.items.map(
//                   (item, index) => (

//                     <div
//                       className="modal-item"
//                       key={index}
//                     >

//                       <div>

//                         <strong>
//                           {item.title ||
//                             "Unknown Item"}
//                         </strong>

//                         {item.variant?.name && (
//                           <small>
//                             {
//                               item.variant
//                                 .name
//                             }
//                           </small>
//                         )}

//                       </div>

//                       <span>
//                         {item.quantity || 0}
//                         {" × "}
//                         {Number(
//                           item.price
//                         ) || 0}{" "}
//                         EGP
//                       </span>

//                     </div>

//                   )

//                 )

//               ) : (

//                 <p>
//                   No items found
//                 </p>

//               )}

//             </div>

//             {/* ================= PAYMENT ================= */}

//             <div className="modal-section">

//               <h3>
//                 💳 Payment
//               </h3>

//               <p
//                 className={
//                   selectedOrder.isPaid
//                     ? "paid"
//                     : "not-paid"
//                 }
//               >
//                 {selectedOrder.isPaid
//                   ? "Paid"
//                   : "Cash on Delivery"}
//               </p>

//             </div>

//             {/* ================= DATE ================= */}

//             <div className="modal-section">

//               <h3>
//                 📅 Order Date
//               </h3>

//               <p>
//                 {formatDate(
//                   selectedOrder.createdAt
//                 )}
//               </p>

//             </div>

//             {/* ================= TOTAL ================= */}

//             <div className="modal-total">

//               <span>
//                 Total
//               </span>

//               <strong>
//                 {Number(
//                   selectedOrder.totalPrice
//                 ) || 0}{" "}
//                 EGP
//               </strong>

//             </div>

//             {/* ================= MODAL ACTION ================= */}

//             <div className="modal-actions">

//               {getNextStatus(
//                 selectedOrder.status
//               ) && (

//                 <button
//                   type="button"
//                   className="modal-status-btn"
//                   disabled={
//                     updating ===
//                     selectedOrder._id
//                   }
//                   onClick={() =>
//                     updateStatus(
//                       selectedOrder._id,
//                       getNextStatus(
//                         selectedOrder.status
//                       )
//                     )
//                   }
//                 >
//                   {updating ===
//                   selectedOrder._id
//                     ? "Updating..."
//                     : getNextStatus(
//                         selectedOrder.status
//                       ) === "preparing"
//                     ? "👨‍🍳 Start Preparing"
//                     : "✅ Mark Delivered"}
//                 </button>

//               )}

//               <button
//                 type="button"
//                 className="close-modal-btn"
//                 onClick={closeModal}
//               >
//                 Close
//               </button>

//             </div>

//           </div>

//         </div>

//       )}

//       {/* =================================================
//           CSS
//       ================================================= */}

//       <style>{`

//         * {
//           box-sizing: border-box;
//         }

//         .restaurant-orders-page {
//           min-height: 100vh;
//           color: white;
//         }

//         /* ================= HEADER ================= */

//         .orders-page-header {
//           display: flex;
//           justify-content: space-between;
//           align-items: center;

//           margin-bottom: 25px;
//         }

//         .orders-page-header h1 {
//           margin: 0;

//           font-size: 30px;
//           color: white;
//         }

//         .orders-page-header p {
//           color: #888;

//           margin: 7px 0 0;
//         }

//         .refresh-btn {
//           display: flex;
//           align-items: center;
//           justify-content: center;

//           gap: 8px;

//           background: #ffcc00;

//           border: none;

//           padding: 11px 18px;

//           border-radius: 9px;

//           cursor: pointer;

//           font-weight: 700;

//           color: #111;

//           transition: 0.2s;
//         }

//         .refresh-btn:hover {
//           transform: translateY(-2px);
//           background: #ffd633;
//         }

//         .refresh-btn:disabled {
//           opacity: 0.6;
//           cursor: not-allowed;
//           transform: none;
//         }

//         .refresh-spinner {
//           width: 15px;
//           height: 15px;

//           border: 2px solid
//             rgba(0, 0, 0, 0.25);

//           border-top-color: #111;

//           border-radius: 50%;

//           animation:
//             ordersSpin
//             0.7s
//             linear
//             infinite;
//         }

//         /* ================= STATS ================= */

//         .orders-stats {
//           display: grid;

//           grid-template-columns:
//             repeat(4, 1fr);

//           gap: 15px;

//           margin-bottom: 25px;
//         }

//         .order-stat {
//           background: #151515;

//           border: 1px solid #292929;

//           padding: 18px;

//           border-radius: 13px;

//           transition: 0.2s;
//         }

//         .order-stat:hover {
//           border-color: #3a3a3a;
//         }

//         .order-stat span {
//           display: block;

//           color: #888;

//           font-size: 13px;

//           margin-bottom: 7px;
//         }

//         .order-stat strong {
//           font-size: 25px;
//         }

//         .pending-stat strong {
//           color: orange;
//         }

//         .preparing-stat strong {
//           color: #3498db;
//         }

//         .delivered-stat strong {
//           color: #2ecc71;
//         }

//         /* ================= GRID ================= */

//         .orders-grid {
//           display: grid;

//           grid-template-columns:
//             repeat(2, minmax(0, 1fr));

//           gap: 20px;
//         }

//         /* ================= CARD ================= */

//         .restaurant-order-card {
//           background: #151515;

//           border: 1px solid #292929;

//           border-radius: 16px;

//           padding: 20px;

//           transition: 0.25s;
//         }

//         .restaurant-order-card:hover {
//           border-color: #444;

//           transform: translateY(-3px);
//         }

//         /* ================= CARD HEADER ================= */

//         .order-card-header {
//           display: flex;

//           justify-content: space-between;
//           align-items: center;

//           gap: 15px;

//           padding-bottom: 15px;

//           border-bottom: 1px solid #292929;
//         }

//         .order-label {
//           display: block;

//           color: #777;

//           font-size: 11px;

//           margin-bottom: 2px;
//         }

//         .order-card-header strong {
//           font-size: 16px;
//         }

//         /* ================= STATUS ================= */

//         .order-status {
//           display: inline-flex;

//           align-items: center;
//           justify-content: center;

//           padding: 6px 11px;

//           border-radius: 20px;

//           font-size: 11px;

//           font-weight: 700;

//           text-transform: capitalize;

//           white-space: nowrap;
//         }

//         .order-status.pending {
//           background:
//             rgba(255, 165, 0, 0.15);

//           color: orange;
//         }

//         .order-status.preparing {
//           background:
//             rgba(52, 152, 219, 0.15);

//           color: #3498db;
//         }

//         .order-status.delivered {
//           background:
//             rgba(46, 204, 113, 0.15);

//           color: #2ecc71;
//         }

//         .order-status.cancelled {
//           background:
//             rgba(231, 76, 60, 0.15);

//           color: #e74c3c;
//         }

//         /* ================= CUSTOMER ================= */

//         .customer-box {
//           display: flex;

//           align-items: center;

//           gap: 12px;

//           padding: 15px 0;
//         }

//         .customer-avatar {
//           width: 42px;
//           height: 42px;

//           flex-shrink: 0;

//           border-radius: 50%;

//           background: #222;

//           display: flex;

//           align-items: center;
//           justify-content: center;

//           font-size: 20px;
//         }

//         .customer-box strong {
//           display: block;
//         }

//         .customer-box small {
//           display: block;

//           color: #777;

//           margin-top: 4px;
//         }

//         /* ================= ITEMS ================= */

//         .items-section {
//           margin-top: 5px;
//         }

//         .items-title-row {
//           display: flex;

//           align-items: center;

//           justify-content: space-between;

//           gap: 10px;

//           margin-bottom: 10px;
//         }

//         .items-section h4 {
//           margin: 0;

//           color: #aaa;

//           font-size: 13px;
//         }

//         .items-title-row > span {
//           color: #666;

//           font-size: 11px;
//         }

//         .order-item {
//           display: flex;

//           justify-content: space-between;

//           gap: 10px;

//           padding: 10px 0;

//           border-bottom: 1px solid #222;
//         }

//         .order-item strong {
//           display: block;

//           font-size: 14px;
//         }

//         .order-item small {
//           display: block;

//           color: #777;

//           margin-top: 3px;
//         }

//         .item-price {
//           text-align: right;

//           flex-shrink: 0;
//         }

//         .item-price span {
//           color: #777;

//           margin-right: 8px;
//         }

//         /* ================= TOTAL ================= */

//         .order-total,
//         .total-row,
//         .payment-row {
//           display: flex;

//           justify-content: space-between;

//           align-items: center;

//           gap: 15px;
//         }

//         .order-total {
//           margin-top: 15px;

//           color: #888;

//           font-size: 13px;
//         }

//         .total-row {
//           margin-top: 8px;

//           font-size: 18px;
//         }

//         .total-row strong:last-child {
//           color: #ffcc00;
//         }

//         /* ================= PAYMENT ================= */

//         .payment-row {
//           margin-top: 13px;

//           padding-top: 13px;

//           border-top: 1px solid #292929;

//           color: #888;

//           font-size: 13px;
//         }

//         .paid {
//           color: #2ecc71 !important;

//           font-weight: 700;
//         }

//         .not-paid {
//           color: orange !important;

//           font-weight: 600;
//         }

//         /* ================= DATE ================= */

//         .order-date {
//           color: #666;

//           font-size: 11px;

//           margin-top: 12px;
//         }

//         /* ================= ACTIONS ================= */

//         .order-actions {
//           display: flex;

//           gap: 8px;

//           margin-top: 18px;
//         }

//         .order-actions button {
//           border: none;

//           border-radius: 8px;

//           padding: 9px 10px;

//           cursor: pointer;

//           font-size: 12px;

//           font-weight: 600;

//           transition: 0.2s;
//         }

//         .details-btn {
//           background: #292929;

//           color: white;
//         }

//         .status-btn {
//           background: #ffcc00;

//           color: #111;
//         }

//         .cancel-btn {
//           background: #3a1919;

//           color: #e74c3c;
//         }

//         .order-actions button:hover {
//           transform: translateY(-2px);
//         }

//         .order-actions button:disabled {
//           opacity: 0.5;

//           cursor: not-allowed;

//           transform: none;
//         }

//         .button-spinner {
//           display: inline-block;

//           width: 13px;
//           height: 13px;

//           border: 2px solid
//             rgba(0, 0, 0, 0.25);

//           border-top-color: #111;

//           border-radius: 50%;

//           animation:
//             ordersSpin
//             0.7s
//             linear
//             infinite;

//           vertical-align: middle;

//           margin-right: 5px;
//         }

//         /* ================= EMPTY ================= */

//         .empty-orders {
//           text-align: center;

//           padding: 80px 20px;

//           background: #151515;

//           border: 1px solid #292929;

//           border-radius: 16px;
//         }

//         .empty-icon {
//           font-size: 55px;
//         }

//         .empty-orders h2 {
//           margin: 12px 0 5px;
//         }

//         .empty-orders p {
//           color: #777;

//           max-width: 450px;

//           margin: 0 auto 20px;

//           line-height: 1.6;
//         }

//         .empty-refresh-btn {
//           border: none;

//           background: #ffcc00;

//           color: #111;

//           padding: 10px 18px;

//           border-radius: 9px;

//           font-weight: 700;

//           cursor: pointer;
//         }

//         /* ================= MODAL ================= */

//         .modal-overlay {
//           position: fixed;

//           inset: 0;

//           background:
//             rgba(0, 0, 0, 0.75);

//           backdrop-filter:
//             blur(5px);

//           display: flex;

//           align-items: center;
//           justify-content: center;

//           z-index: 5000;

//           padding: 20px;

//           overflow-y: auto;
//         }

//         .order-modal {
//           width: 100%;

//           max-width: 550px;

//           max-height: 90vh;

//           overflow-y: auto;

//           background: #151515;

//           border: 1px solid #333;

//           border-radius: 16px;

//           padding: 22px;

//           box-shadow:
//             0 20px 70px
//             rgba(0, 0, 0, 0.5);
//         }

//         .modal-header {
//           display: flex;

//           justify-content: space-between;

//           align-items: flex-start;

//           gap: 20px;

//           border-bottom: 1px solid #292929;

//           padding-bottom: 15px;
//         }

//         .modal-header span {
//           color: #777;

//           font-size: 12px;
//         }

//         .modal-header h2 {
//           margin: 5px 0 0;

//           font-size: 23px;
//         }

//         .modal-header button {
//           border: none;

//           background: #292929;

//           color: white;

//           width: 35px;
//           height: 35px;

//           border-radius: 50%;

//           cursor: pointer;

//           flex-shrink: 0;
//         }

//         .modal-status-wrapper {
//           padding-top: 15px;
//         }

//         .modal-section {
//           padding: 18px 0;

//           border-bottom: 1px solid #292929;
//         }

//         .modal-section h3 {
//           font-size: 15px;

//           margin:
//             0 0 12px;

//           color: #ffcc00;
//         }

//         .modal-section p {
//           color: #aaa;

//           margin: 8px 0;

//           line-height: 1.5;
//         }

//         .modal-item {
//           display: flex;

//           justify-content: space-between;

//           gap: 20px;

//           padding: 10px 0;

//           border-bottom: 1px solid #222;
//         }

//         .modal-item:last-child {
//           border-bottom: none;
//         }

//         .modal-item strong {
//           display: block;
//         }

//         .modal-item small {
//           display: block;

//           color: #777;

//           margin-top: 3px;
//         }

//         .modal-item span {
//           color: #aaa;

//           white-space: nowrap;
//         }

//         .modal-total {
//           display: flex;

//           justify-content: space-between;

//           gap: 20px;

//           padding: 18px 0;

//           font-size: 20px;
//         }

//         .modal-total strong {
//           color: #ffcc00;
//         }

//         .modal-actions {
//           display: flex;

//           gap: 10px;
//         }

//         .modal-status-btn,
//         .close-modal-btn {
//           flex: 1;

//           border: none;

//           padding: 12px;

//           border-radius: 9px;

//           cursor: pointer;

//           font-weight: 700;
//         }

//         .modal-status-btn {
//           background: #ffcc00;

//           color: #111;
//         }

//         .close-modal-btn {
//           background: #292929;

//           color: white;
//         }

//         .modal-status-btn:disabled {
//           opacity: 0.5;

//           cursor: not-allowed;
//         }

//         /* ================= RESPONSIVE ================= */

//         @media (max-width: 1000px) {

//           .orders-grid {
//             grid-template-columns: 1fr;
//           }

//         }

//         @media (max-width: 900px) {

//           .orders-stats {
//             grid-template-columns:
//               repeat(2, 1fr);
//           }

//         }

//         @media (max-width: 600px) {

//           .restaurant-orders-page {
//             padding: 0;
//           }

//           .orders-page-header {
//             align-items: flex-start;

//             flex-direction: column;

//             gap: 15px;
//           }

//           .orders-page-header h1 {
//             font-size: 25px;
//           }

//           .orders-page-header p {
//             font-size: 14px;
//           }

//           .refresh-btn {
//             width: 100%;
//           }

//           .orders-stats {
//             grid-template-columns:
//               repeat(2, 1fr);

//             gap: 10px;
//           }

//           .order-stat {
//             padding: 15px;
//           }

//           .order-stat strong {
//             font-size: 22px;
//           }

//           .restaurant-order-card {
//             padding: 15px;
//           }

//           .order-card-header {
//             align-items: flex-start;
//           }

//           .order-actions {
//             flex-wrap: wrap;
//           }

//           .order-actions button {
//             flex: 1 1 100%;
//           }

//           .modal-overlay {
//             padding: 10px;
//           }

//           .order-modal {
//             max-height: 95vh;

//             padding: 18px;

//             border-radius: 14px;
//           }

//           .modal-item {
//             align-items: flex-start;

//             flex-direction: column;

//             gap: 5px;
//           }

//           .modal-item span {
//             white-space: normal;
//           }

//           .modal-actions {
//             flex-direction: column;
//           }

//         }

//       `}</style>

//     </div>
//   );
// };

// export default RestaurantOrders;


import React, { useEffect, useState } from "react";
import api from "../../api/api";
import "./RestaurantOrders.css";

const RestaurantOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [updating, setUpdating] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);

  // =====================================================
  // TOKEN
  // =====================================================

  const getToken = () => {
    return localStorage.getItem("token");
  };

  // =====================================================
  // GET ORDERS
  // =====================================================

  const fetchOrders = async (showRefreshLoading = false) => {
    try {
      if (showRefreshLoading) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const token = getToken();

      if (!token) {
        alert("You are not logged in");
        return;
      }

      const res = await api.get(
        "/api/v1/orders/restaurant-orders",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = Array.isArray(res.data)
        ? res.data
        : [];

      setOrders(data);

      // Update selected order if modal is open
      setSelectedOrder((current) => {
        if (!current) return null;

        const updated = data.find(
          (order) => order._id === current._id
        );

        return updated || null;
      });
    } catch (err) {
      console.error(
        "GET RESTAURANT ORDERS ERROR:",
        err
      );

      alert(
        err?.response?.data?.message ||
          "Failed to load orders"
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // =====================================================
  // LOAD
  // =====================================================

  useEffect(() => {
    fetchOrders();
  }, []);

  // =====================================================
  // UPDATE STATUS
  // =====================================================

  const updateStatus = async (id, status) => {
    try {
      setUpdating(id);

      const token = getToken();

      if (!token) {
        alert("You are not logged in");
        return;
      }

      const res = await api.put(
        `/api/v1/orders/${id}/status`,
        {
          status,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const updatedOrder = res.data;

      setOrders((prev) =>
        prev.map((order) =>
          order._id === id
            ? updatedOrder
            : order
        )
      );

      setSelectedOrder((current) => {
        if (!current || current._id !== id) {
          return current;
        }

        return updatedOrder;
      });
    } catch (err) {
      console.error(
        "UPDATE ORDER STATUS ERROR:",
        err
      );

      alert(
        err?.response?.data?.message ||
          "Failed to update order"
      );
    } finally {
      setUpdating(null);
    }
  };

  // =====================================================
  // NEXT STATUS
  // =====================================================

  const getNextStatus = (status) => {
    switch (status) {
      case "pending":
        return "preparing";

      case "preparing":
        return "delivered";

      default:
        return null;
    }
  };

  // =====================================================
  // STATUS TEXT
  // =====================================================

  const getStatusText = (status) => {
    switch (status) {
      case "pending":
        return "Pending";

      case "preparing":
        return "Preparing";

      case "delivered":
        return "Delivered";

      case "cancelled":
        return "Cancelled";

      default:
        return status || "Unknown";
    }
  };

  // =====================================================
  // DATE
  // =====================================================

  const formatDate = (date) => {
    if (!date) {
      return "Unknown date";
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "Unknown date";
    }

    return parsedDate.toLocaleString("en-EG", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  // =====================================================
  // ITEMS COUNT
  // =====================================================

  const getItemsCount = (order) => {
    if (!order?.items?.length) {
      return 0;
    }

    return order.items.reduce(
      (total, item) =>
        total + (Number(item.quantity) || 0),
      0
    );
  };

  // =====================================================
  // CONFIRM STATUS
  // =====================================================

  const handleStatusChange = (
    id,
    status
  ) => {
    if (status === "cancelled") {
      const confirmed = window.confirm(
        "Are you sure you want to cancel this order?"
      );

      if (!confirmed) {
        return;
      }
    }

    updateStatus(id, status);
  };

  // =====================================================
  // CLOSE MODAL
  // =====================================================

  const closeModal = () => {
    setSelectedOrder(null);
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="restaurant-orders-page">
        <div className="orders-loading">
          <div className="loading-spinner"></div>

          <p>Loading orders...</p>
        </div>
      </div>
    );
  }

  // =====================================================
  // STATS
  // =====================================================

  const pendingOrders = orders.filter(
    (order) => order.status === "pending"
  ).length;

  const preparingOrders = orders.filter(
    (order) => order.status === "preparing"
  ).length;

  const deliveredOrders = orders.filter(
    (order) => order.status === "delivered"
  ).length;

  const cancelledOrders = orders.filter(
    (order) => order.status === "cancelled"
  ).length;

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="restaurant-orders-page">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="orders-page-header">

        <div>
          <h1>Orders 🧾</h1>

          <p>
            Manage orders from your customers
          </p>
        </div>

        <button
          type="button"
          className="refresh-btn"
          onClick={() => fetchOrders(true)}
          disabled={refreshing}
        >
          {refreshing ? (
            <>
              <span className="refresh-spinner"></span>
              Refreshing...
            </>
          ) : (
            <>
              🔄 Refresh
            </>
          )}
        </button>
      </div>

      {/* =================================================
          STATS
      ================================================= */}

      <div className="orders-stats">

        <div className="order-stat">
          <span>All Orders</span>
          <strong>{orders.length}</strong>
        </div>

        <div className="order-stat pending-stat">
          <span>Pending</span>
          <strong>{pendingOrders}</strong>
        </div>

        <div className="order-stat preparing-stat">
          <span>Preparing</span>
          <strong>{preparingOrders}</strong>
        </div>

        <div className="order-stat delivered-stat">
          <span>Delivered</span>
          <strong>{deliveredOrders}</strong>
        </div>

        <div className="order-stat cancelled-stat">
          <span>Cancelled</span>
          <strong>{cancelledOrders}</strong>
        </div>

      </div>

      {/* =================================================
          EMPTY
      ================================================= */}

      {orders.length === 0 ? (
        <div className="empty-orders">

          <div className="empty-icon">
            🧾
          </div>

          <h2>No Orders Yet</h2>

          <p>
            When customers order from your
            restaurant, their orders will
            appear here.
          </p>

          <button
            type="button"
            className="empty-refresh-btn"
            onClick={() =>
              fetchOrders(true)
            }
          >
            🔄 Check Again
          </button>

        </div>
      ) : (

        /* =================================================
           ORDERS
        ================================================= */

        <div className="orders-grid">

          {orders.map((order) => {
            const nextStatus =
              getNextStatus(order.status);

            const itemsCount =
              getItemsCount(order);

            return (
              <div
                className="restaurant-order-card"
                key={order._id}
              >

                {/* ================= HEADER ================= */}

                <div className="order-card-header">

                  <div>
                    <span className="order-label">
                      Order
                    </span>

                    <strong>
                      #
                      {order._id
                        ?.slice(-6)
                        .toUpperCase()}
                    </strong>
                  </div>

                  <span
                    className={`order-status ${order.status}`}
                  >
                    {getStatusText(
                      order.status
                    )}
                  </span>

                </div>

                {/* ================= CUSTOMER ================= */}

                <div className="customer-box">

                  <div className="customer-avatar">
                    👤
                  </div>

                  <div>
                    <strong>
                      {order.name || "Customer"}
                    </strong>

                    <small>
                      {order.phone || "No phone"}
                    </small>
                  </div>

                </div>

                {/* ================= ITEMS ================= */}

                <div className="items-section">

                  <div className="items-title-row">

                    <h4>🍔 Items</h4>

                    <span>
                      {itemsCount} item
                      {itemsCount !== 1
                        ? "s"
                        : ""}
                    </span>

                  </div>

                  {order.items?.length ? (
                    order.items.map(
                      (item, index) => (
                        <div
                          className="order-item"
                          key={`${item._id || index}`}
                        >

                          <div>
                            <strong>
                              {item.title ||
                                "Unknown Item"}
                            </strong>

                            {item.variant?.name && (
                              <small>
                                {
                                  item.variant
                                    .name
                                }
                              </small>
                            )}
                          </div>

                          <div className="item-price">

                            <span>
                              ×{" "}
                              {Number(
                                item.quantity
                              ) || 0}
                            </span>

                            <strong>
                              {(
                                (Number(
                                  item.price
                                ) || 0) *
                                (Number(
                                  item.quantity
                                ) || 0)
                              ).toLocaleString()}{" "}
                              EGP
                            </strong>

                          </div>

                        </div>
                      )
                    )
                  ) : (
                    <p className="no-items">
                      No items found
                    </p>
                  )}

                </div>

                {/* ================= DELIVERY ================= */}

                <div className="order-total">

                  <span>
                    Delivery
                  </span>

                  <span>
                    {(
                      Number(
                        order.deliveryFee
                      ) || 0
                    ).toLocaleString()}{" "}
                    EGP
                  </span>

                </div>

                {/* ================= TOTAL ================= */}

                <div className="total-row">

                  <strong>Total</strong>

                  <strong>
                    {(
                      Number(
                        order.totalPrice
                      ) || 0
                    ).toLocaleString()}{" "}
                    EGP
                  </strong>

                </div>

                {/* ================= PAYMENT ================= */}

                <div className="payment-row">

                  <span>
                    💳 Payment
                  </span>

                  <span
                    className={
                      order.isPaid
                        ? "paid"
                        : "not-paid"
                    }
                  >
                    {order.isPaid
                      ? "Paid"
                      : "Cash on Delivery"}
                  </span>

                </div>

                {/* ================= DATE ================= */}

                <div className="order-date">
                  📅{" "}
                  {formatDate(
                    order.createdAt
                  )}
                </div>

                {/* ================= ACTIONS ================= */}

                <div className="order-actions">

                  <button
                    type="button"
                    className="details-btn"
                    onClick={() =>
                      setSelectedOrder(order)
                    }
                  >
                    👁️ Details
                  </button>

                  {nextStatus && (
                    <button
                      type="button"
                      className="status-btn"
                      disabled={
                        updating === order._id
                      }
                      onClick={() =>
                        updateStatus(
                          order._id,
                          nextStatus
                        )
                      }
                    >
                      {updating ===
                      order._id ? (
                        <>
                          <span className="button-spinner"></span>
                          Updating...
                        </>
                      ) : nextStatus ===
                        "preparing" ? (
                        "👨‍🍳 Start Preparing"
                      ) : (
                        "✅ Mark Delivered"
                      )}
                    </button>
                  )}

                  {order.status ===
                    "pending" && (
                    <button
                      type="button"
                      className="cancel-btn"
                      disabled={
                        updating === order._id
                      }
                      onClick={() =>
                        handleStatusChange(
                          order._id,
                          "cancelled"
                        )
                      }
                    >
                      ❌ Cancel
                    </button>
                  )}

                </div>

              </div>
            );
          })}

        </div>
      )}

      {/* =================================================
          DETAILS MODAL
      ================================================= */}

      {selectedOrder && (
        <div
          className="modal-overlay"
          onClick={closeModal}
        >

          <div
            className="order-modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            {/* ================= MODAL HEADER ================= */}

            <div className="modal-header">

              <div>
                <span>Order Details</span>

                <h2>
                  #
                  {selectedOrder._id
                    ?.slice(-6)
                    .toUpperCase()}
                </h2>
              </div>

              <button
                type="button"
                className="modal-close-btn"
                onClick={closeModal}
                aria-label="Close"
              >
                ✕
              </button>

            </div>

            {/* ================= STATUS ================= */}

            <div className="modal-status-wrapper">

              <span
                className={`order-status ${selectedOrder.status}`}
              >
                {getStatusText(
                  selectedOrder.status
                )}
              </span>

            </div>

            {/* ================= CUSTOMER ================= */}

            <div className="modal-section">

              <h3>👤 Customer</h3>

              <p>
                <strong>Name:</strong>{" "}
                {selectedOrder.name ||
                  "Customer"}
              </p>

              <p>
                <strong>Phone:</strong>{" "}
                {selectedOrder.phone ||
                  "No phone"}
              </p>

            </div>

            {/* ================= ADDRESS ================= */}

            <div className="modal-section">

              <h3>📍 Delivery Address</h3>

              {selectedOrder.address ? (
                <>
                  {selectedOrder.address.street && (
                    <p>
                      <strong>
                        Street:
                      </strong>{" "}
                      {
                        selectedOrder.address
                          .street
                      }
                    </p>
                  )}

                  {selectedOrder.address.city && (
                    <p>
                      <strong>
                        City:
                      </strong>{" "}
                      {
                        selectedOrder.address
                          .city
                      }
                    </p>
                  )}

                  {selectedOrder.address.notes && (
                    <p>
                      <strong>
                        Notes:
                      </strong>{" "}
                      {
                        selectedOrder.address
                          .notes
                      }
                    </p>
                  )}
                </>
              ) : (
                <p>
                  No delivery address
                </p>
              )}

            </div>

            {/* ================= ITEMS ================= */}

            <div className="modal-section">

              <h3>🍔 Order Items</h3>

              {selectedOrder.items?.length ? (
                selectedOrder.items.map(
                  (item, index) => (
                    <div
                      className="modal-item"
                      key={`${item._id || index}`}
                    >

                      <div>
                        <strong>
                          {item.title ||
                            "Unknown Item"}
                        </strong>

                        {item.variant?.name && (
                          <small>
                            {
                              item.variant
                                .name
                            }
                          </small>
                        )}
                      </div>

                      <span>
                        {Number(
                          item.quantity
                        ) || 0}
                        {" × "}
                        {(
                          Number(
                            item.price
                          ) || 0
                        ).toLocaleString()}{" "}
                        EGP
                      </span>

                    </div>
                  )
                )
              ) : (
                <p>No items found</p>
              )}

            </div>

            {/* ================= PAYMENT ================= */}

            <div className="modal-section">

              <h3>💳 Payment</h3>

              <p
                className={
                  selectedOrder.isPaid
                    ? "paid"
                    : "not-paid"
                }
              >
                {selectedOrder.isPaid
                  ? "Paid"
                  : "Cash on Delivery"}
              </p>

            </div>

            {/* ================= DATE ================= */}

            <div className="modal-section">

              <h3>📅 Order Date</h3>

              <p>
                {formatDate(
                  selectedOrder.createdAt
                )}
              </p>

            </div>

            {/* ================= TOTAL ================= */}

            <div className="modal-total">

              <span>Total</span>

              <strong>
                {(
                  Number(
                    selectedOrder.totalPrice
                  ) || 0
                ).toLocaleString()}{" "}
                EGP
              </strong>

            </div>

            {/* ================= MODAL ACTIONS ================= */}

            <div className="modal-actions">

              {getNextStatus(
                selectedOrder.status
              ) && (
                <button
                  type="button"
                  className="modal-status-btn"
                  disabled={
                    updating ===
                    selectedOrder._id
                  }
                  onClick={() =>
                    updateStatus(
                      selectedOrder._id,
                      getNextStatus(
                        selectedOrder.status
                      )
                    )
                  }
                >
                  {updating ===
                  selectedOrder._id
                    ? "Updating..."
                    : getNextStatus(
                        selectedOrder.status
                      ) === "preparing"
                    ? "👨‍🍳 Start Preparing"
                    : "✅ Mark Delivered"}
                </button>
              )}

              {selectedOrder.status ===
                "pending" && (
                <button
                  type="button"
                  className="modal-cancel-btn"
                  disabled={
                    updating ===
                    selectedOrder._id
                  }
                  onClick={() =>
                    handleStatusChange(
                      selectedOrder._id,
                      "cancelled"
                    )
                  }
                >
                  ❌ Cancel Order
                </button>
              )}

              <button
                type="button"
                className="close-modal-btn"
                onClick={closeModal}
              >
                Close
              </button>

            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default RestaurantOrders;