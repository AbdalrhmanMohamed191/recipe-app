// import React, { useEffect, useState } from "react";
// import socket from "../../socket/socket";
// import api from "../../api/api";

// const OrdersAdmin = () => {
//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const [selectedDate, setSelectedDate] = useState("");
//   const [showAll, setShowAll] = useState(false);

//   // =====================
//   // FETCH
//   // =====================
//   const fetchOrders = async () => {
//     try {
//       setLoading(true);

//       const res = await api.get("/api/v1/orders/all", {
//         params: {
//           date: selectedDate || undefined,
//           all: showAll,
//         },
//       });

//       setOrders(res.data);
//     } catch (err) {
//       console.log(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchOrders();
//   }, [selectedDate, showAll]);

//   // =====================
//   // SOCKET
//   // =====================
//   useEffect(() => {
//     if (!socket.connected) socket.connect();

//     socket.emit("joinAdmin");

//     socket.on("orderCreated", (order) => {
//       setOrders((prev) => [order, ...prev]);
//     });

//     socket.on("orderUpdated", (updated) => {
//       setOrders((prev) =>
//         prev.map((o) => (o._id === updated._id ? updated : o))
//       );
//     });

//     return () => {
//       socket.off("orderCreated");
//       socket.off("orderUpdated");
//     };
//   }, []);

//   const updateStatus = async (id, status) => {
//     try {
//       await api.put(`/api/v1/orders/${id}/status`, { status });
//     } catch (err) {
//       console.log(err);
//     }
//   };

//   // =====================
//   // TIME FORMAT
//   // =====================
//   const formatTime = (date) => {
//     return new Date(date).toLocaleString("en-EG", {
//       weekday: "short",
//       hour: "2-digit",
//       minute: "2-digit",
//       day: "2-digit",
//       month: "short",
//     });
//   };

//   // =====================
//   // STATS
//   // =====================
//   const total = orders.length;
//   const delivered = orders.filter((o) => o.status === "delivered").length;
//   const pending = orders.filter((o) => o.status === "pending").length;

//   if (loading) {
//     return <h4 className="text-center mt-5">Loading orders...</h4>;
//   }

//   return (
//     <div className="container py-5 mt-3">

//       <h2 className="mb-4">📦 Orders Dashboard</h2>

//       {/* ===================== STATS ===================== */}
//       <div className="row g-3 mb-4">
//         <div className="col-12 col-md-4">
//           <div className="card text-bg-dark p-3 text-center">
//             <h6>Total Orders</h6>
//             <h3>{total}</h3>
//           </div>
//         </div>

//         <div className="col-12 col-md-4">
//           <div className="card text-bg-success p-3 text-center">
//             <h6>Delivered</h6>
//             <h3>{delivered}</h3>
//           </div>
//         </div>

//         <div className="col-12 col-md-4">
//           <div className="card text-bg-warning p-3 text-center">
//             <h6>Pending</h6>
//             <h3>{pending}</h3>
//           </div>
//         </div>
//       </div>

//       {/* ===================== FILTERS ===================== */}
//       <div className="d-flex flex-wrap gap-2 mb-4">

//         <button
//           className="btn btn-primary btn-sm"
//           onClick={() => {
//             setSelectedDate("");
//             setShowAll(false);
//           }}
//         >
//           Today
//         </button>

//         <button
//           className="btn btn-secondary btn-sm"
//           onClick={() => {
//             setShowAll(true);
//             setSelectedDate("");
//           }}
//         >
//           All
//         </button>

//         <input
//           type="date"
//           className="form-control form-control-sm"
//           style={{ maxWidth: "200px" }}
//           value={selectedDate}
//           onChange={(e) => {
//             setSelectedDate(e.target.value);
//             setShowAll(false);
//           }}
//         />
//       </div>

//       {/* ===================== EMPTY ===================== */}
//       {orders.length === 0 ? (
//         <div className="alert alert-info">No orders found</div>
//       ) : (
//         <>
//           {/* ===================== TABLE ===================== */}
//           <div className="table-responsive d-none d-md-block">
//             <table className="table table-dark table-hover align-middle">

//               <thead>
//                 <tr>
//                   <th>User</th>
//                   <th>Phone</th>
//                   <th>Address</th>
//                   <th>Items</th>
//                   <th>Total</th>
//                   <th>Status</th>
//                   <th>Time</th>
//                   <th>Actions</th>
//                 </tr>
//               </thead>

//               <tbody>
//                 {orders.map((order) => (
//                   <tr key={order._id}>
//                     <td>{order.userId?.name}</td>
//                     <td>{order.userId?.phone}</td>

//                     {/* ADDRESS FIXED */}
//                     <td>
//                       <div>
//                         <div><strong>Street:</strong> {order.address?.street}</div>
//                         <div><strong>City:</strong> {order.address?.city}</div>

//                         {order.address?.notes && (
//                           <div><strong>Notes:</strong> {order.address?.notes}</div>
//                         )}
//                       </div>
//                     </td>

//                     <td>
//                       {order.items?.map((i) => i.title).join(", ")}
//                     </td>

//                     <td>{order.totalPrice} EGP</td>

//                     <td>
//                       <span
//                         className={`badge ${
//                           order.status === "delivered"
//                             ? "bg-success"
//                             : order.status === "preparing"
//                             ? "bg-warning text-dark"
//                             : order.status === "cancelled"
//                             ? "bg-danger"
//                             : "bg-secondary"
//                         }`}
//                       >
//                         {order.status || "pending"}
//                       </span>
//                     </td>

//                     <td>
//                       <small>{formatTime(order.createdAt)}</small>
//                     </td>

//                     <td>
//                       <div className="d-flex gap-1 flex-wrap">
//                         <button
//                           className="btn btn-sm btn-warning"
//                           onClick={() => updateStatus(order._id, "preparing")}
//                         >
//                           Prep
//                         </button>

//                         <button
//                           className="btn btn-sm btn-success"
//                           onClick={() => updateStatus(order._id, "delivered")}
//                         >
//                           Done
//                         </button>

//                         <button
//                           className="btn btn-sm btn-danger"
//                           onClick={() => updateStatus(order._id, "cancelled")}
//                         >
//                           X
//                         </button>
//                       </div>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>

//             </table>
//           </div>

//           {/* ===================== MOBILE ===================== */}
//           <div className="d-md-none">
//             {orders.map((order) => (
//               <div key={order._id} className="card bg-dark text-white mb-3 p-3">

//                 <div className="d-flex justify-content-between">
//                   <strong>{order.userId?.name}</strong>
//                   <span className="badge bg-secondary">
//                     {order.status || "pending"}
//                   </span>
//                 </div>

//                 <small>{order.userId?.phone}</small>

//                 <div className="mt-2">
//                   {order.items?.map((i) => i.title).join(", ")}
//                 </div>

//                 <div className="mt-1">
//                   <strong>Total:</strong> {order.totalPrice} EGP
//                 </div>

//                 {/* ADDRESS MOBILE */}
//                 <div className="mt-2">
//                   <div><strong>Street:</strong> {order.address?.street}</div>
//                   <div><strong>City:</strong> {order.address?.city}</div>
//                 </div>

//                 <small className="text-muted d-block mt-1">
//                   {formatTime(order.createdAt)}
//                 </small>

//                 <div className="d-flex gap-2 mt-3">
//                   <button
//                     className="btn btn-sm btn-warning"
//                     onClick={() => updateStatus(order._id, "preparing")}
//                   >
//                     Prep
//                   </button>

//                   <button
//                     className="btn btn-sm btn-success"
//                     onClick={() => updateStatus(order._id, "delivered")}
//                   >
//                     Done
//                   </button>

//                   <button
//                     className="btn btn-sm btn-danger"
//                     onClick={() => updateStatus(order._id, "cancelled")}
//                   >
//                     Cancel
//                   </button>
//                 </div>

//               </div>
//             ))}
//           </div>

//         </>
//       )}
//     </div>
//   );
// };

// export default OrdersAdmin;



import React, { useEffect, useState } from "react";
import socket from "../../socket/socket";
import api from "../../api/api";

const OrdersAdmin = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedDate, setSelectedDate] = useState("");
  const [showAll, setShowAll] = useState(false);

  // ================= FETCH =================
  const fetchOrders = async () => {
    try {
      setLoading(true);

      const res = await api.get("/api/v1/orders/all", {
        params: {
          date: selectedDate || undefined,
          all: showAll,
        },
      });

      setOrders(res.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [selectedDate, showAll]);

  // ================= SOCKET =================
  useEffect(() => {
    if (!socket.connected) socket.connect();

    socket.emit("joinAdmin");

    socket.on("orderCreated", (order) => {
      setOrders((prev) => [order, ...prev]);
    });

    socket.on("orderUpdated", (updated) => {
      setOrders((prev) =>
        prev.map((o) => (o._id === updated._id ? updated : o))
      );
    });

    return () => {
      socket.off("orderCreated");
      socket.off("orderUpdated");
    };
  }, []);

  // ================= UPDATE STATUS =================
  const updateStatus = async (id, status) => {
    try {
      await api.put(`/api/v1/orders/${id}/status`, { status });
    } catch (err) {
      console.log(err);
    }
  };

  // ================= TIME =================
  const formatTime = (date) => {
    return new Date(date).toLocaleString("en-EG", {
      weekday: "short",
      hour: "2-digit",
      minute: "2-digit",
      day: "2-digit",
      month: "short",
    });
  };

  // ================= STATS =================
  const total = orders.length;
  const delivered = orders.filter((o) => o.status === "delivered").length;
  const pending = orders.filter((o) => o.status === "pending").length;

  // ================= FIX VARIANT =================
  const getVariantName = (item) => {
    if (!item) return "";

    if (typeof item.variant === "string") return item.variant;

    if (item.variant?.name) return item.variant.name;

    if (item.selectedVariant?.name) return item.selectedVariant.name;

    if (item.size) return item.size;

    return "";
  };

  // ================= ITEMS UI =================
  const renderItems = (items) => {
    return items?.map((i, index) => {
      const variantName = getVariantName(i);

      return (
        <div
          key={index}
          style={{
            background: "#1e1e1e",
            padding: "6px 10px",
            borderRadius: "8px",
            marginBottom: "5px",
            display: "inline-block",
            marginRight: "5px",
            fontSize: "13px",
          }}
        >
          <strong>{i.title}</strong>

          {variantName && (
            <span style={{ color: "#FFD700" }}>
              {" "}• {variantName}
            </span>
          )}

          {i.quantity && (
            <span style={{ color: "#aaa" }}>
              {" "}× {i.quantity}
            </span>
          )}
        </div>
      );
    });
  };

  if (loading) {
    return <h4 className="text-center mt-5">Loading orders...</h4>;
  }

  return (
    <div className="container py-5 mt-3">

      <h2 className="mb-4">📦 Orders Dashboard</h2>

      {/* ================= STATS ================= */}
      <div className="row g-3 mb-4">
        <div className="col-md-4">
          <div className="card text-bg-dark p-3 text-center">
            <h6>Total Orders</h6>
            <h3>{total}</h3>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card text-bg-success p-3 text-center">
            <h6>Delivered</h6>
            <h3>{delivered}</h3>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card text-bg-warning p-3 text-center">
            <h6>Pending</h6>
            <h3>{pending}</h3>
          </div>
        </div>
      </div>

      {/* ================= FILTERS ================= */}
      <div className="d-flex flex-wrap gap-2 mb-4">

        <button
          className="btn btn-primary btn-sm"
          onClick={() => {
            setSelectedDate("");
            setShowAll(false);
          }}
        >
          Today
        </button>

        <button
          className="btn btn-secondary btn-sm"
          onClick={() => {
            setShowAll(true);
            setSelectedDate("");
          }}
        >
          All
        </button>

        <input
          type="date"
          className="form-control form-control-sm"
          style={{ maxWidth: "200px" }}
          value={selectedDate}
          onChange={(e) => {
            setSelectedDate(e.target.value);
            setShowAll(false);
          }}
        />
      </div>

      {/* ================= EMPTY ================= */}
      {orders.length === 0 ? (
        <div className="alert alert-info">No orders found</div>
      ) : (
        <>
          {/* ================= DESKTOP ================= */}
          <div className="table-responsive d-none d-md-block">
            <table className="table table-dark table-hover align-middle">

              <thead>
                <tr>
                  <th>User</th>
                  <th>Phone</th>
                  <th>Address</th>
                  <th>Items</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Time</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {orders.map((order) => (
                  <tr key={order._id}>
                    <td>{order.userId?.name}</td>
                    <td>{order.userId?.phone}</td>

                    <td>
                      <div>
                        <div><strong>Street:</strong> {order.address?.street}</div>
                        <div><strong>City:</strong> {order.address?.city}</div>
                        {order.address?.notes && (
                          <div><strong>Notes:</strong> {order.address.notes}</div>
                        )}
                      </div>
                    </td>

                    <td>{renderItems(order.items)}</td>

                    <td>{order.totalPrice} EGP</td>

                    <td>
                      <span
                        className={`badge ${
                          order.status === "delivered"
                            ? "bg-success"
                            : order.status === "preparing"
                            ? "bg-warning text-dark"
                            : order.status === "cancelled"
                            ? "bg-danger"
                            : "bg-secondary"
                        }`}
                      >
                        {order.status || "pending"}
                      </span>
                    </td>

                    <td>
                      <small>{formatTime(order.createdAt)}</small>
                    </td>

                    <td>
                      <div className="d-flex gap-1 flex-wrap">
                        <button
                          className="btn btn-sm btn-warning"
                          onClick={() => updateStatus(order._id, "preparing")}
                        >
                          Prep
                        </button>

                        <button
                          className="btn btn-sm btn-success"
                          onClick={() => updateStatus(order._id, "delivered")}
                        >
                          Done
                        </button>

                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => updateStatus(order._id, "cancelled")}
                        >
                          X
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>

            </table>
          </div>

          {/* ================= MOBILE ================= */}
          <div className="d-md-none">
            {orders.map((order) => (
              <div key={order._id} className="card bg-dark text-white mb-3 p-3">

                <div className="d-flex justify-content-between">
                  <strong>{order.userId?.name}</strong>
                  <span className="badge bg-secondary">
                    {order.status || "pending"}
                  </span>
                </div>

                <small>{order.userId?.phone}</small>

                {order.items.map((item, index) => (
                          <div key={index} className="admin-order-card">

                            <h4>{item.title}</h4>

                            <p>Qty: {item.quantity}</p>

                            <p>Price: {item.price} EGP</p>

                            {item.variant ? (
                              <p>
                                Variant: <b>{item.variant.name}</b>
                              </p>
                            ) : (
                              <p>No variant</p>
                            )}

                          </div>
                        ))}
                        

                <div className="mt-1">
                  <strong>Total:</strong> {order.totalPrice} EGP
                </div>

                <div className="mt-2">
                  <div><strong>Street:</strong> {order.address?.street}</div>
                  <div><strong>City:</strong> {order.address?.city}</div>
                </div>

                <small className="text-muted d-block mt-1">
                  {formatTime(order.createdAt)}
                </small>

                <div className="d-flex gap-2 mt-3">
                  <button
                    className="btn btn-sm btn-warning"
                    onClick={() => updateStatus(order._id, "preparing")}
                  >
                    Prep
                  </button>

                  <button
                    className="btn btn-sm btn-success"
                    onClick={() => updateStatus(order._id, "delivered")}
                  >
                    Done
                  </button>

                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => updateStatus(order._id, "cancelled")}
                  >
                    Cancel
                  </button>
                </div>

              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default OrdersAdmin;