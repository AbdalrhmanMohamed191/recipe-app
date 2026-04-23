// import React, { useEffect, useState } from "react";
// import api from "../../api/api";

// import socket from "../../socket/socket";

// const MyBookings = () => {
//   const [bookings, setBookings] = useState([]);

//   const fetchBookings = async () => {
//     const res = await api.get("/api/v1/book/all");
//     setBookings(res.data);
//   };

//   useEffect(() => {
//     fetchBookings();

//     // 🔥 listen live updates
//     socket.on("bookingUpdated", (updatedBooking) => {
//       setBookings((prev) =>
//         prev.map((b) =>
//           b._id === updatedBooking._id ? updatedBooking : b
//         )
//       );
//     });

//     return () => socket.off("bookingUpdated");
//   }, []);

//   return (
//     <div style={styles.page}>
//       <h2 style={{ marginBottom: "30px" , marginTop: "80px" }}>🍽️ My Bookings</h2>

//       {bookings.map((b) => (
//         <div key={b._id} style={styles.card}>
//           <h4>{b.name}</h4>
//           <p>{b.date} - {b.time}</p>

//           <span
//             style={{
//               ...styles.status,
//               background:
//                 b.status === "accepted"
//                   ? "#22c55e"
//                   : b.status === "rejected"
//                   ? "#ef4444"
//                   : "#f59e0b",
//             }}
//           >
//             {b.status}
//           </span>
//         </div>
//       ))}
//     </div>
//   );
// };

// const styles = {
//   page: {
//     padding: "30px",
//     color: "#fff",
//     background: "#0f0f0f",
//     minHeight: "100vh",
//   },

//   card: {
//     background: "#1a1a1a",
//     padding: "15px",
//     borderRadius: "10px",
//     marginBottom: "10px",
//   },

//   status: {
//     padding: "5px 10px",
//     borderRadius: "8px",
//     color: "#000",
//     fontWeight: "bold",
//     display: "inline-block",
//   },
// };

// export default MyBookings;

import React, { useEffect, useState } from "react";
import api from "../../api/api";
import socket from "../../socket/socket";

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);

  const fetchBookings = async () => {
    const res = await api.get("/api/v1/book/all");
    setBookings(res.data);
  };

  useEffect(() => {
    fetchBookings();

    socket.on("bookingUpdated", (updatedBooking) => {
      setBookings((prev) =>
        prev.map((b) =>
          b._id === updatedBooking._id ? updatedBooking : b
        )
      );
    });

    return () => socket.off("bookingUpdated");
  }, []);

  const formatDateTime = (date, time) => {
    return `${date} • ${time}`;
  };

  return (
    <div style={styles.page}>
      <h2 style={styles.title}>🍽️ My Bookings</h2>

      <div style={styles.container}>
        {bookings.map((b) => (
          <div key={b._id} style={styles.card}>
            
            <div style={styles.left}>
              <h4 style={styles.name}>{b.name}</h4>
              <p style={styles.time}>
                {formatDateTime(b.date, b.time)}
              </p>
            </div>

            <div
              style={{
                ...styles.status,
                background:
                  b.status === "accepted"
                    ? "#22c55e"
                    : b.status === "rejected"
                    ? "#ef4444"
                    : "#f59e0b",
              }}
            >
              {b.status}
            </div>

          </div>
        ))}
      </div>
    </div>
  );
};

const styles = {
  page: {
    padding: "30px",
    color: "#fff",
    background: "#0f0f0f",
    minHeight: "100vh",
  },

  title: {
    marginBottom: "30px",
    marginTop: "80px",
    fontSize: "28px",
  },

  container: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },

  card: {
    background: "#1a1a1a",
    padding: "15px",
    borderRadius: "12px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "10px",
  },

  left: {
    display: "flex",
    flexDirection: "column",
    gap: "5px",
    minWidth: "200px",
  },

  name: {
    margin: 0,
    fontSize: "18px",
  },

  time: {
    margin: 0,
    fontSize: "14px",
    color: "#aaa",
  },

  status: {
    padding: "6px 12px",
    borderRadius: "10px",
    color: "#000",
    fontWeight: "bold",
    textTransform: "capitalize",
    fontSize: "13px",
    minWidth: "80px",
    textAlign: "center",
  },
};

export default MyBookings;