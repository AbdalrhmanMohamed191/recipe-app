// import React, { useEffect, useState } from "react";
// import socket from "../../socket/socket";
// import "./MyOrder.css";
// import { useNavigate } from "react-router-dom";
// import api from "../../api/api";

// const MyOrders = () => {
//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const navigate = useNavigate();

//   // ================= FETCH ORDERS =================

//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     const user = JSON.parse(localStorage.getItem("user"));

//     if (!token || !user) {
//       navigate("/");
//       return;
//     }

//     const fetchOrders = async () => {
//       try {
//         const res = await api.get(
//           "/api/v1/orders/myorders",
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//             },
//           }
//         );

//         setOrders(res.data || []);
//       } catch (error) {
//         console.log("Fetch Orders Error:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchOrders();
//   }, [navigate]);

//   // ================= SOCKET =================

//   useEffect(() => {
//     const user = JSON.parse(localStorage.getItem("user"));

//     if (!user) return;

//     // منع تكرار listeners
//     socket.off("orderCreated");
//     socket.off("orderUpdated");

//     if (!socket.connected) {
//       socket.connect();
//     }

//     socket.emit("joinUser", user._id);

//     // ================= ORDER CREATED =================

//     const handleOrderCreated = (order) => {
//       const orderUserId =
//         typeof order.userId === "object"
//           ? order.userId?._id
//           : order.userId;

//       if (
//         orderUserId?.toString() ===
//         user._id?.toString()
//       ) {
//         setOrders((prev) => {
//           const exists = prev.some(
//             (o) => o._id === order._id
//           );

//           if (exists) return prev;

//           return [order, ...prev];
//         });
//       }
//     };

//     // ================= ORDER UPDATED =================

//     const handleOrderUpdated = (updatedOrder) => {
//       setOrders((prev) =>
//         prev.map((order) =>
//           order._id === updatedOrder._id
//             ? updatedOrder
//             : order
//         )
//       );
//     };

//     socket.on(
//       "orderCreated",
//       handleOrderCreated
//     );

//     socket.on(
//       "orderUpdated",
//       handleOrderUpdated
//     );

//     // ================= CLEANUP =================

//     return () => {
//       socket.off(
//         "orderCreated",
//         handleOrderCreated
//       );

//       socket.off(
//         "orderUpdated",
//         handleOrderUpdated
//       );
//     };
//   }, []);

//   // ================= STATUS CLASS =================

//   const getStatusClass = (status) => {
//     switch (status) {
//       case "pending":
//         return "pending";

//       case "preparing":
//         return "preparing";

//       case "delivered":
//         return "delivered";

//       case "cancelled":
//         return "cancelled";

//       default:
//         return "";
//     }
//   };

//   // ================= STATUS TEXT =================

//   const getStatusText = (status) => {
//     switch (status) {
//       case "pending":
//         return "⏳ Pending";

//       case "preparing":
//         return "👨‍🍳 Preparing";

//       case "delivered":
//         return "✅ Delivered";

//       case "cancelled":
//         return "❌ Cancelled";

//       default:
//         return status || "Unknown";
//     }
//   };

//   // ================= VARIANT =================

//   const getVariantName = (item) => {
//     const variant =
//       item.variant ||
//       item.selectedVariant;

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

//   // ================= REORDER =================

//   const handleReorder = (order) => {
//     if (!order.items || order.items.length === 0) {
//       return;
//     }

//     const reorderItems = order.items.map(
//       (item) => ({
//         _id: item.productId || item._id,

//         title: item.title,

//         price: Number(item.price || 0),

//         variant:
//           item.variant ||
//           item.selectedVariant ||
//           null,

//         restaurantId:
//           order.restaurantId ||
//           item.restaurantId ||
//           null,
//       })
//     );

//     navigate("/cart", {
//       state: {
//         reorderItems,
//       },
//     });
//   };

//   // ================= LOADING =================

//   if (loading) {
//     return (
//       <div className="orders-container">
//         <h2 className="title">
//           My Orders
//         </h2>

//         <p className="empty">
//           Loading... ⏳
//         </p>
//       </div>
//     );
//   }

//   // ================= UI =================

//   return (
//     <div className="orders-container">

//       <h2 className="title">
//         My Orders
//       </h2>

//       {/* EMPTY */}

//       {orders.length === 0 ? (
//         <div className="empty-box">

//           <p>
//             No orders yet 😢
//           </p>

//           <button
//             onClick={() =>
//               navigate("/restaurants")
//             }
//             className="btn-outline"
//           >
//             Order Now 🍔
//           </button>

//         </div>
//       ) : (

//         <div className="orders-grid">

//           {orders.map((order) => (

//             <div
//               className="order-card"
//               key={order._id}
//             >

//               {/* ================= HEADER ================= */}

//               <div className="order-header">

//                 <span className="order-id">
//                   #
//                   {order._id
//                     ?.slice(-6)
//                     .toUpperCase()}
//                 </span>

//                 <span
//                   className={`status ${getStatusClass(
//                     order.status
//                   )}`}
//                 >
//                   {getStatusText(
//                     order.status
//                   )}
//                 </span>

//               </div>

//               {/* ================= BODY ================= */}

//               <div className="order-body">

//                 {/* DATE */}

//                 <p>
//                   <b>Date:</b>{" "}
//                   {order.createdAt
//                     ? new Date(
//                         order.createdAt
//                       ).toLocaleDateString()
//                     : "-"}
//                 </p>

//                 {/* ITEMS */}

//                 <div className="order-items">

//                   <b>Items:</b>

//                   {order.items?.map(
//                     (item, index) => (

//                       <div
//                         className="order-item"
//                         key={
//                           item._id ||
//                           `${item.productId}-${index}`
//                         }
//                       >

//                         <span>
//                           {item.title}
//                         </span>

//                         <span>
//                           ×{" "}
//                           {item.quantity}
//                         </span>

//                         <span>
//                           {getVariantName(
//                             item
//                           )}
//                         </span>

//                             <p className="restaurant-name">
//                                   🍽️ <b>Restaurant:</b> {order.restaurantId?.name || "Unknown Restaurant"}
//                                 </p>
//                         <span>
//                           {Number(
//                             item.price || 0
//                           ).toFixed(2)}{" "}
//                           EGP
//                         </span>

//                       </div>

//                     )
//                   )}

//                 </div>

//                 {/* DELIVERY */}

//                 <p>
//                   <b>Delivery:</b>{" "}
//                   {order.deliveryFee ||
//                     0}{" "}
//                   EGP
//                 </p>

//                 {/* DISCOUNT */}

//                 <p>
//                   <b>Discount:</b>{" "}
//                   {order.discount ||
//                     0}{" "}
//                   EGP
//                 </p>

//                 {/* TOTAL */}

//                 <p className="total">
//                   Total:{" "}
//                   {Number(
//                     order.totalPrice || 0
//                   ).toFixed(2)}{" "}
//                   EGP
//                 </p>

//                 {/* ADDRESS */}

//                 <p className="address">
//                   📍{" "}
//                   {order.address?.street ||
//                     "-"}
//                   ,{" "}
//                   {order.address?.city ||
//                     "-"}
//                 </p>

//                 {order.address?.notes && (
//                   <p className="notes">
//                     📝{" "}
//                     {order.address.notes}
//                   </p>
//                 )}

//               </div>

//               {/* ================= ACTIONS ================= */}

//               <div className="order-actions">

              

//                 {order.status !==
//                   "cancelled" && (
//                   <button
//                     className="btn-outline"
//                     onClick={() =>
//                       handleReorder(
//                         order
//                       )
//                     }
//                   >
//                     🔄 Re-order
//                   </button>
//                 )}

//               </div>

//               {/* ================= PROGRESS ================= */}

//               <div className="progress-bar">

//                 <div
//                   className={`progress ${getStatusClass(
//                     order.status
//                   )}`}
//                 />

//               </div>

//             </div>

//           ))}

//         </div>

//       )}

//     </div>
//   );
// };

// export default MyOrders;


import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import socket from "../../socket/socket";
import "./MyOrder.css";
import { useNavigate } from "react-router-dom";
import api from "../../api/api";

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // ================= FILTER STATES =================

  const [searchFilter, setSearchFilter] =
    useState("");

  const [statusFilter, setStatusFilter] =
    useState("all");

  const [restaurantFilter, setRestaurantFilter] =
    useState("all");

  const [dateFilter, setDateFilter] =
    useState("all");

  const [sortFilter, setSortFilter] =
    useState("newest");

  const navigate = useNavigate();

  // =========================================================
  // FETCH ORDERS
  // =========================================================

  useEffect(() => {
    const token =
      localStorage.getItem("token");

    const userString =
      localStorage.getItem("user");

    let user = null;

    try {
      user = userString
        ? JSON.parse(userString)
        : null;
    } catch (error) {
      console.log(
        "User Parse Error:",
        error
      );
    }

    if (!token || !user) {
      navigate("/");
      return;
    }

    const fetchOrders = async () => {
      try {
        const res = await api.get(
          "/api/v1/orders/myorders",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setOrders(
          Array.isArray(res.data)
            ? res.data
            : []
        );
      } catch (error) {
        console.log(
          "Fetch Orders Error:",
          error
        );

        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [navigate]);

  // =========================================================
  // SOCKET
  // =========================================================

  useEffect(() => {
    const userString =
      localStorage.getItem("user");

    let user = null;

    try {
      user = userString
        ? JSON.parse(userString)
        : null;
    } catch (error) {
      console.log(
        "Socket User Parse Error:",
        error
      );
    }

    if (!user?._id) return;

    // Remove old listeners
    socket.off("orderCreated");
    socket.off("orderUpdated");

    if (!socket.connected) {
      socket.connect();
    }

    socket.emit(
      "joinUser",
      user._id
    );

    // =====================================================
    // ORDER CREATED
    // =====================================================

    const handleOrderCreated = (
      order
    ) => {
      const orderUserId =
        typeof order.userId === "object"
          ? order.userId?._id
          : order.userId;

      if (
        orderUserId?.toString() ===
        user._id?.toString()
      ) {
        setOrders((prev) => {
          const exists =
            prev.some(
              (item) =>
                item._id === order._id
            );

          if (exists) {
            return prev;
          }

          return [
            order,
            ...prev,
          ];
        });
      }
    };

    // =====================================================
    // ORDER UPDATED
    // =====================================================

    const handleOrderUpdated = (
      updatedOrder
    ) => {
      setOrders((prev) =>
        prev.map((order) =>
          order._id ===
          updatedOrder._id
            ? {
                ...order,
                ...updatedOrder,
              }
            : order
        )
      );
    };

    socket.on(
      "orderCreated",
      handleOrderCreated
    );

    socket.on(
      "orderUpdated",
      handleOrderUpdated
    );

    // =====================================================
    // CLEANUP
    // =====================================================

    return () => {
      socket.off(
        "orderCreated",
        handleOrderCreated
      );

      socket.off(
        "orderUpdated",
        handleOrderUpdated
      );
    };
  }, []);

  // =========================================================
  // STATUS CLASS
  // =========================================================

  const getStatusClass = (
    status
  ) => {
    switch (status) {
      case "pending":
        return "pending";

      case "preparing":
        return "preparing";

      case "delivered":
        return "delivered";

      case "cancelled":
        return "cancelled";

      default:
        return "";
    }
  };

  // =========================================================
  // STATUS TEXT
  // =========================================================

  const getStatusText = (
    status
  ) => {
    switch (status) {
      case "pending":
        return "⏳ Pending";

      case "preparing":
        return "👨‍🍳 Preparing";

      case "delivered":
        return "✅ Delivered";

      case "cancelled":
        return "❌ Cancelled";

      default:
        return (
          status || "Unknown"
        );
    }
  };

  // =========================================================
  // VARIANT NAME
  // =========================================================

  const getVariantName = (
    item
  ) => {
    const variant =
      item?.variant ||
      item?.selectedVariant;

    if (!variant) {
      return "Standard";
    }

    if (
      typeof variant ===
      "string"
    ) {
      return variant;
    }

    return (
      variant.name ||
      variant.size ||
      "Standard"
    );
  };

  // =========================================================
  // RESTAURANT ID
  // =========================================================

  const getRestaurantId = (
    order
  ) => {
    const restaurant =
      order?.restaurantId;

    if (!restaurant) {
      return null;
    }

    if (
      typeof restaurant ===
      "object"
    ) {
      return (
        restaurant._id || null
      );
    }

    return restaurant;
  };

  // =========================================================
  // RESTAURANT NAME
  // =========================================================

  const getRestaurantName = (
    order
  ) => {
    const restaurant =
      order?.restaurantId;

    if (!restaurant) {
      return "Unknown Restaurant";
    }

    if (
      typeof restaurant ===
      "object"
    ) {
      return (
        restaurant.name ||
        "Unknown Restaurant"
      );
    }

    return "Restaurant";
  };

  // =========================================================
  // RESTAURANTS
  // =========================================================

  const restaurants = useMemo(() => {
    const map =
      new Map();

    orders.forEach(
      (order) => {
        const restaurant =
          order?.restaurantId;

        if (!restaurant) {
          return;
        }

        if (
          typeof restaurant ===
          "object"
        ) {
          if (
            restaurant._id
          ) {
            map.set(
              restaurant._id.toString(),
              {
                _id:
                  restaurant._id,

                name:
                  restaurant.name ||
                  "Unknown Restaurant",
              }
            );
          }
        } else {
          const id =
            restaurant.toString();

          if (
            !map.has(id)
          ) {
            map.set(
              id,
              {
                _id:
                  restaurant,

                name:
                  "Restaurant",
              }
            );
          }
        }
      }
    );

    return Array.from(
      map.values()
    );
  }, [orders]);

  // =========================================================
  // FILTER + SORT
  // =========================================================

  const filteredOrders =
    useMemo(() => {
      let result = [
        ...orders,
      ];

      // =====================================================
      // SEARCH
      // =====================================================

      const search =
        searchFilter
          .trim()
          .toLowerCase();

      if (search) {
        result =
          result.filter(
            (order) => {
              const orderId =
                order?._id
                  ?.toString()
                  .toLowerCase() ||
                "";

              const restaurantName =
                getRestaurantName(
                  order
                ).toLowerCase();

              const itemsText =
                order?.items
                  ?.map(
                    (item) =>
                      item?.title ||
                      ""
                  )
                  .join(" ")
                  .toLowerCase() ||
                "";

              return (
                orderId.includes(
                  search
                ) ||
                restaurantName.includes(
                  search
                ) ||
                itemsText.includes(
                  search
                )
              );
            }
          );
      }

      // =====================================================
      // STATUS
      // =====================================================

      if (
        statusFilter !==
        "all"
      ) {
        result =
          result.filter(
            (order) =>
              order.status ===
              statusFilter
          );
      }

      // =====================================================
      // RESTAURANT
      // =====================================================

      if (
        restaurantFilter !==
        "all"
      ) {
        result =
          result.filter(
            (order) => {
              const id =
                getRestaurantId(
                  order
                );

              return (
                id?.toString() ===
                restaurantFilter.toString()
              );
            }
          );
      }

      // =====================================================
      // DATE
      // =====================================================

      if (
        dateFilter !==
        "all"
      ) {
        const now =
          new Date();

        result =
          result.filter(
            (order) => {
              if (
                !order?.createdAt
              ) {
                return false;
              }

              const orderDate =
                new Date(
                  order.createdAt
                );

              // TODAY
              if (
                dateFilter ===
                "today"
              ) {
                return (
                  orderDate.toDateString() ===
                  now.toDateString()
                );
              }

              // LAST 7 DAYS
              if (
                dateFilter ===
                "week"
              ) {
                const weekAgo =
                  new Date();

                weekAgo.setDate(
                  now.getDate() -
                    7
                );

                return (
                  orderDate >=
                  weekAgo
                );
              }

              // LAST 30 DAYS
              if (
                dateFilter ===
                "month"
              ) {
                const monthAgo =
                  new Date();

                monthAgo.setDate(
                  now.getDate() -
                    30
                );

                return (
                  orderDate >=
                  monthAgo
                );
              }

              return true;
            }
          );
      }

      // =====================================================
      // SORT
      // =====================================================

      result.sort(
        (a, b) => {
          if (
            sortFilter ===
            "newest"
          ) {
            return (
              new Date(
                b.createdAt || 0
              ) -
              new Date(
                a.createdAt || 0
              )
            );
          }

          if (
            sortFilter ===
            "oldest"
          ) {
            return (
              new Date(
                a.createdAt || 0
              ) -
              new Date(
                b.createdAt || 0
              )
            );
          }

          if (
            sortFilter ===
            "highest"
          ) {
            return (
              Number(
                b.totalPrice ||
                  0
              ) -
              Number(
                a.totalPrice ||
                  0
              )
            );
          }

          if (
            sortFilter ===
            "lowest"
          ) {
            return (
              Number(
                a.totalPrice ||
                  0
              ) -
              Number(
                b.totalPrice ||
                  0
              )
            );
          }

          return 0;
        }
      );

      return result;
    }, [
      orders,
      searchFilter,
      statusFilter,
      restaurantFilter,
      dateFilter,
      sortFilter,
    ]);

  // =========================================================
  // CLEAR FILTERS
  // =========================================================

  const clearFilters =
    () => {
      setSearchFilter("");
      setStatusFilter(
        "all"
      );
      setRestaurantFilter(
        "all"
      );
      setDateFilter(
        "all"
      );
      setSortFilter(
        "newest"
      );
    };

  // =========================================================
  // REORDER
  // =========================================================

  const handleReorder = (
    order
  ) => {
    if (
      !order?.items ||
      order.items.length ===
        0
    ) {
      return;
    }

    const reorderItems =
      order.items.map(
        (item) => ({
          _id:
            item.productId ||
            item._id,

          title:
            item.title,

          price:
            Number(
              item.price || 0
            ),

          quantity:
            Number(
              item.quantity || 1
            ),

          variant:
            item.variant ||
            item.selectedVariant ||
            null,

          restaurantId:
            order.restaurantId ||
            item.restaurantId ||
            null,
        })
      );

    navigate(
      "/cart",
      {
        state: {
          reorderItems,
        },
      }
    );
  };

  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {
    return (
      <div className="orders-container">

        <h2 className="title">
          My Orders
        </h2>

        <p className="empty">
          Loading... ⏳
        </p>

      </div>
    );
  }

  // =========================================================
  // UI
  // =========================================================

  return (
    <div className="orders-container">

      {/* ===================================================
          TITLE
      =================================================== */}

      <h2 className="title">
        My Orders
      </h2>

      {/* ===================================================
          FILTERS
      =================================================== */}

      {orders.length > 0 && (
        <>
          <div className="orders-filters">

            {/* SEARCH */}

            <div className="filter-search">

              <span className="filter-icon">
                🔎
              </span>

              <input
                type="text"
                value={
                  searchFilter
                }
                onChange={(e) =>
                  setSearchFilter(
                    e.target.value
                  )
                }
                placeholder="Search orders, items or restaurants..."
              />

              {searchFilter && (
                <button
                  type="button"
                  className="search-clear"
                  onClick={() =>
                    setSearchFilter(
                      ""
                    )
                  }
                >
                  ×
                </button>
              )}

            </div>

            {/* STATUS */}

            <select
              value={
                statusFilter
              }
              onChange={(e) =>
                setStatusFilter(
                  e.target.value
                )
              }
            >
              <option value="all">
                All Statuses
              </option>

              <option value="pending">
                ⏳ Pending
              </option>

              <option value="preparing">
                👨‍🍳 Preparing
              </option>

              <option value="delivered">
                ✅ Delivered
              </option>

              <option value="cancelled">
                ❌ Cancelled
              </option>
            </select>

            {/* RESTAURANT */}

            <select
              value={
                restaurantFilter
              }
              onChange={(e) =>
                setRestaurantFilter(
                  e.target.value
                )
              }
            >
              <option value="all">
                🍽️ All Restaurants
              </option>

              {restaurants.map(
                (
                  restaurant
                ) => (
                  <option
                    key={
                      restaurant._id
                    }
                    value={
                      restaurant._id
                    }
                  >
                    {restaurant.name}
                  </option>
                )
              )}
            </select>

            {/* DATE */}

            <select
              value={
                dateFilter
              }
              onChange={(e) =>
                setDateFilter(
                  e.target.value
                )
              }
            >
              <option value="all">
                📅 All Dates
              </option>

              <option value="today">
                Today
              </option>

              <option value="week">
                Last 7 Days
              </option>

              <option value="month">
                Last 30 Days
              </option>
            </select>

            {/* SORT */}

            <select
              value={
                sortFilter
              }
              onChange={(e) =>
                setSortFilter(
                  e.target.value
                )
              }
            >
              <option value="newest">
                Newest First
              </option>

              <option value="oldest">
                Oldest First
              </option>

              <option value="highest">
                Highest Price
              </option>

              <option value="lowest">
                Lowest Price
              </option>
            </select>

            {/* CLEAR */}

            <button
              type="button"
              className="clear-filters"
              onClick={
                clearFilters
              }
            >
              ✕ Clear Filters
            </button>

          </div>

          {/* =================================================
              RESULTS COUNT
          ================================================= */}

          <div className="orders-results">

            Showing{" "}

            <strong>
              {
                filteredOrders.length
              }
            </strong>

            {" "}of{" "}

            <strong>
              {orders.length}
            </strong>

            {" "}orders

          </div>
        </>
      )}

      {/* ===================================================
          NO ORDERS
      =================================================== */}

      {orders.length === 0 ? (

        <div className="empty-box">

          <p>
            No orders yet 😢
          </p>

          <button
            onClick={() =>
              navigate(
                "/restaurants"
              )
            }
            className="btn-outline"
          >
            Order Now 🍔
          </button>

        </div>

      ) : filteredOrders.length ===
        0 ? (

        /* =================================================
           NO FILTER RESULTS
        ================================================= */

        <div className="empty-box">

          <p>
            No orders match
            your filters 🔎
          </p>

          <button
            type="button"
            onClick={
              clearFilters
            }
            className="btn-outline"
          >
            ✕ Clear Filters
          </button>

        </div>

      ) : (

        /* =================================================
           ORDERS GRID
        ================================================= */

        <div className="orders-grid">

          {filteredOrders.map(
            (order) => (

              <div
                className="order-card"
                key={
                  order._id
                }
              >

                {/* =========================================
                    HEADER
                ========================================= */}

                <div className="order-header">

                  <span className="order-id">

                    #
                    {order._id
                      ?.slice(-6)
                      .toUpperCase()}

                  </span>

                  <span
                    className={`status ${getStatusClass(
                      order.status
                    )}`}
                  >
                    {
                      getStatusText(
                        order.status
                      )
                    }
                  </span>

                </div>

                {/* =========================================
                    BODY
                ========================================= */}

                <div className="order-body">

                  {/* DATE */}

                  <p>
                    <b>
                      Date:
                    </b>{" "}

                    {order.createdAt
                      ? new Date(
                          order.createdAt
                        ).toLocaleDateString()
                      : "-"}
                  </p>

                  {/* RESTAURANT */}

                  <p className="restaurant-name">

                    🍽️{" "}

                    <b>
                      Restaurant:
                    </b>{" "}

                    {
                      getRestaurantName(
                        order
                      )
                    }

                  </p>

                  {/* ITEMS */}

                  <div className="order-items">

                    <b>
                      Items:
                    </b>

                    {order.items?.map(
                      (
                        item,
                        index
                      ) => (

                        <div
                          className="order-item"
                          key={
                            item._id ||
                            `${item.productId}-${index}`
                          }
                        >

                          <span>
                            {
                              item.title
                            }
                          </span>

                          <span>
                            ×{" "}
                            {
                              item.quantity
                            }
                          </span>

                          <span>
                            {
                              getVariantName(
                                item
                              )
                            }
                          </span>

                          <span>
                            {Number(
                              item.price ||
                                0
                            ).toFixed(
                              2
                            )}{" "}
                            EGP
                          </span>

                        </div>

                      )
                    )}

                  </div>

                  {/* DELIVERY */}

                  <p>
                    <b>
                      Delivery:
                    </b>{" "}

                    {Number(
                      order.deliveryFee ||
                        0
                    ).toFixed(
                      2
                    )}{" "}
                    EGP
                  </p>

                  {/* DISCOUNT */}

                  <p>
                    <b>
                      Discount:
                    </b>{" "}

                    {Number(
                      order.discount ||
                        0
                    ).toFixed(
                      2
                    )}{" "}
                    EGP
                  </p>

                  {/* TOTAL */}

                  <p className="total">

                    Total:{" "}

                    {Number(
                      order.totalPrice ||
                        0
                    ).toFixed(
                      2
                    )}{" "}
                    EGP

                  </p>

                  {/* ADDRESS */}

                  <p className="address">

                    📍{" "}

                    {
                      order.address
                        ?.street ||
                      "-"
                    }

                    ,{" "}

                    {
                      order.address
                        ?.city ||
                      "-"
                    }

                  </p>

                  {/* NOTES */}

                  {order.address
                    ?.notes && (
                    <p className="notes">

                      📝{" "}
                      {
                        order.address
                          .notes
                      }

                    </p>
                  )}

                </div>

                {/* =========================================
                    ACTIONS
                ========================================= */}

                <div className="order-actions">

                  {order.status !==
                    "cancelled" && (

                    <button
                      type="button"
                      className="btn-outline"
                      onClick={() =>
                        handleReorder(
                          order
                        )
                      }
                    >
                      🔄 Re-order
                    </button>

                  )}

                </div>

                {/* =========================================
                    PROGRESS
                ========================================= */}

                <div className="progress-bar">

                  <div
                    className={`progress ${getStatusClass(
                      order.status
                    )}`}
                  />

                </div>

              </div>

            )
          )}

        </div>

      )}

    </div>
  );
};

export default MyOrders;