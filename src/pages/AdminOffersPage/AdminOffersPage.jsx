// import React, { useEffect, useState } from "react";
// import api from "../../api/api";
// import socket from "../../socket/socket";
// import { baseUrlHandler } from "../../utils/baseUrlHandler";

// const AdminOffersPage = () => {
//   const [offers, setOffers] = useState([]);
//   const [loading, setLoading] = useState(false);

//   const [form, setForm] = useState({
//     title: "",
//     description: "",
//     price: "",
//     discount: "",
//     expiresAt: "",
//   });

//   const [imageFile, setImageFile] = useState(null);
//   const [preview, setPreview] = useState(null);
//   const [editId, setEditId] = useState(null);

//   const baseURL = baseUrlHandler();

//   // ================= FETCH =================
//   const fetchOffers = async () => {
//     try {
//       setLoading(true);
//       const res = await api.get("/api/v1/offers");
//       setOffers(res.data || []);
//     } catch (err) {
//       console.log("FETCH ERROR:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchOffers();
//   }, []);

//   // ================= SOCKET =================
//   useEffect(() => {
//     socket.connect();

//     socket.on("offerCreated", (data) => {
//       setOffers((prev) => [data, ...prev]);
//     });

//     socket.on("offerUpdated", (data) => {
//       setOffers((prev) =>
//         prev.map((o) => (o._id === data._id ? data : o))
//       );
//     });

//     socket.on("offerDeleted", (id) => {
//       setOffers((prev) => prev.filter((o) => o._id !== id));
//     });

//     return () => socket.disconnect();
//   }, []);

//   // ================= INPUT =================
//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   // ================= IMAGE =================
//   const handleImage = (e) => {
//     const file = e.target.files[0];
//     setImageFile(file);

//     if (file) {
//       setPreview(URL.createObjectURL(file));
//     }
//   };

//   // ================= SUBMIT =================
//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       const formData = new FormData();

//       Object.keys(form).forEach((key) => {
//         formData.append(key, form[key]);
//       });

//       if (imageFile) {
//         formData.append("image", imageFile);
//       }

//       if (editId) {
//         await api.put(`/api/v1/offers/${editId}`, formData);
//       } else {
//         await api.post("/api/v1/offers", formData);
//       }

//       setForm({
//         title: "",
//         description: "",
//         price: "",
//         discount: "",
//         expiresAt: "",
//       });

//       setImageFile(null);
//       setPreview(null);
//       setEditId(null);

//       fetchOffers();
//     } catch (err) {
//       console.log("SUBMIT ERROR:", err);
//     }
//   };

//   // ================= DELETE =================
//   const handleDelete = async (id) => {
//     try {
//       await api.delete(`/api/v1/offers/${id}`);
//     } catch (err) {
//       console.log(err);
//     }
//   };

//   // ================= TOGGLE =================
//   const handleToggle = async (id) => {
//     try {
//       await api.patch(`/api/v1/offers/${id}/toggle`);
//     } catch (err) {
//       console.log(err);
//     }
//   };

//   // ================= EDIT =================
//   const handleEdit = (o) => {
//     setForm({
//       title: o.title,
//       description: o.description,
//       price: o.price,
//       discount: o.discount,
//       expiresAt: o.expiresAt?.slice(0, 10) || "",
//     });

//     setPreview(o.image ? `${baseURL}${o.image}` : null);
//     setEditId(o._id);
//   };

//   return (
//     <div className="container py-4">

//       <h2 className="mb-4 fw-bold">🛠 Admin Offers</h2>

//       {/* ================= FORM ================= */}
//       <form onSubmit={handleSubmit} className="p-4 border rounded-4 shadow-sm bg-light">

//         <div className="row g-2">

//           <div className="col-md-6">
//             <input
//               name="title"
//               placeholder="Title"
//               value={form.title}
//               onChange={handleChange}
//               className="form-control"
//             />
//           </div>

//           <div className="col-md-6">
//             <input
//               name="price"
//               placeholder="Price"
//               value={form.price}
//               onChange={handleChange}
//               className="form-control"
//             />
//           </div>

//           <div className="col-12">
//             <input
//               name="description"
//               placeholder="Description"
//               value={form.description}
//               onChange={handleChange}
//               className="form-control"
//             />
//           </div>

//           <div className="col-md-6">
//             <input
//               name="discount"
//               type="number"
//               placeholder="Discount %"
//               value={form.discount}
//               onChange={handleChange}
//               className="form-control"
//             />
//           </div>

//           <div className="col-md-6">
//             <input
//               name="expiresAt"
//               type="date"
//               value={form.expiresAt}
//               onChange={handleChange}
//               className="form-control"
//             />
//           </div>

//           <div className="col-12">
//             <input type="file" onChange={handleImage} className="form-control" />
//           </div>

//         </div>

//         {preview && (
//           <img
//             src={preview}
//             alt="preview"
//             className="mt-3 rounded-3"
//             style={{ width: "100%", height: 220, objectFit: "cover" }}
//           />
//         )}

//         <button className="btn btn-primary w-100 mt-3">
//           {editId ? "Update Offer" : "Create Offer"}
//         </button>

//       </form>

//       {/* ================= LIST ================= */}
//       <div className="row mt-4">

//         {offers.map((o) => (
//           <div key={o._id} className="col-md-4 mb-3">

//             <div className="card h-100 shadow-sm border-0 rounded-4 overflow-hidden">

//               {/* IMAGE */}
//               <div style={{ height: 200 }}>
//                 <img
//                   src={
//                     o.image
//                       ? `${baseURL}${o.image}`
//                       : "https://via.placeholder.com/300"
//                   }
//                   alt={o.title}
//                   style={{ width: "100%", height: "100%", objectFit: "cover" }}
//                 />
//               </div>

//               {/* BODY */}
//               <div className="card-body">

//                 <h5 className="fw-bold">{o.title}</h5>

//                 <p className="text-muted small">{o.description}</p>

//                 {o.discount > 0 ? (
//                   <>
//                     <div className="text-decoration-line-through text-muted small">
//                       {o.price} EGP
//                     </div>

//                     <div className="fw-bold text-success">
//                       {(o.price - (o.price * o.discount) / 100).toFixed(2)} EGP
//                     </div>
//                   </>
//                 ) : (
//                   <div className="fw-bold">{o.price} EGP</div>
//                 )}

//                 <span className={`badge mt-2 ${o.isActive ? "bg-success" : "bg-danger"}`}>
//                   {o.isActive ? "Active" : "Disabled"}
//                 </span>

//               </div>

//               {/* BUTTONS FIXED */}
//               <div className="card-footer bg-white border-0">
//                 <div className="d-grid gap-2">

//                   <button
//                     className="btn btn-warning btn-sm"
//                     onClick={() => handleEdit(o)}
//                   >
//                     Edit
//                   </button>

//                   <button
//                     className="btn btn-outline-secondary btn-sm"
//                     onClick={() => handleToggle(o._id)}
//                   >
//                     Toggle
//                   </button>

//                   <button
//                     className="btn btn-danger btn-sm"
//                     onClick={() => handleDelete(o._id)}
//                   >
//                     Delete
//                   </button>

//                 </div>
//               </div>

//             </div>

//           </div>
//         ))}

//       </div>

//     </div>
//   );
// };

// export default AdminOffersPage;

import React, { useEffect, useState } from "react";
import api from "../../api/api";
import socket from "../../socket/socket";
import { baseUrlHandler } from "../../utils/baseUrlHandler";

const AdminOffersPage = () => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    discount: "",
    expiresAt: "",
  });

  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [editId, setEditId] = useState(null);

  const baseURL = baseUrlHandler();

  // ================= FETCH =================
  const fetchOffers = async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/v1/offers");
      setOffers(res.data || []);
    } catch (err) {
      console.log("FETCH ERROR:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOffers();
  }, []);

  // ================= SOCKET =================
  useEffect(() => {
    socket.connect();

    socket.on("offerCreated", (data) => {
      setOffers((prev) => [data, ...prev]);
    });

    socket.on("offerUpdated", (data) => {
      setOffers((prev) =>
        prev.map((o) => (o._id === data._id ? data : o))
      );
    });

    socket.on("offerDeleted", (id) => {
      setOffers((prev) => prev.filter((o) => o._id !== id));
    });

    return () => socket.disconnect();
  }, []);

  // ================= INPUT =================
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ================= IMAGE =================
  const handleImage = (e) => {
    const file = e.target.files[0];
    setImageFile(file);

    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  // ================= SUBMIT =================
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();

      Object.keys(form).forEach((key) => {
        formData.append(key, form[key]);
      });

      if (imageFile) {
        formData.append("image", imageFile);
      }

      if (editId) {
        await api.put(`/api/v1/offers/${editId}`, formData);
      } else {
        await api.post("/api/v1/offers", formData);
      }

      setForm({
        title: "",
        description: "",
        price: "",
        discount: "",
        expiresAt: "",
      });

      setImageFile(null);
      setPreview(null);
      setEditId(null);

      fetchOffers();
    } catch (err) {
      console.log("SUBMIT ERROR:", err);
    }
  };

  // ================= DELETE =================
  const handleDelete = async (id) => {
    try {
      await api.delete(`/api/v1/offers/${id}`);
      fetchOffers(); // مهم عشان تحديث مباشر
    } catch (err) {
      console.log(err);
    }
  };

  // ================= TOGGLE =================
  const handleToggle = async (id) => {
    try {
      await api.patch(`/api/v1/offers/${id}/toggle`);
      fetchOffers(); // مهم جدًا
    } catch (err) {
      console.log(err);
    }
  };

  // ================= EDIT =================
  const handleEdit = (o) => {
    setForm({
      title: o.title,
      description: o.description,
      price: o.price,
      discount: o.discount,
      expiresAt: o.expiresAt?.slice(0, 10) || "",
    });

    setPreview(o.image ? `${baseURL}${o.image}` : null);
    setEditId(o._id);
  };

  // ================= UI =================
  return (
    <div className="container py-4">

      <h2 className="mb-4 fw-bold">🛠 Admin Offers</h2>

      {/* FORM */}
      <form
        onSubmit={handleSubmit}
        className="p-4 border rounded-4 shadow-sm bg-light"
      >
        <div className="row g-2">

          <div className="col-md-6">
            <input
              name="title"
              placeholder="Title"
              value={form.title}
              onChange={handleChange}
              className="form-control"
            />
          </div>

          <div className="col-md-6">
            <input
              name="price"
              placeholder="Price (Original Price)"
              value={form.price}
              onChange={handleChange}
              className="form-control"
            />
          </div>

          <div className="col-12">
            <input
              name="description"
              placeholder="Description"
              value={form.description}
              onChange={handleChange}
              className="form-control"
            />
          </div>

          <div className="col-md-6">
            <input
              name="discount"
              type="number"
              placeholder="Discount %"
              value={form.discount}
              onChange={handleChange}
              className="form-control"
            />
          </div>

          <div className="col-md-6">
            <input
              name="expiresAt"
              type="date"
              value={form.expiresAt}
              onChange={handleChange}
              className="form-control"
            />
          </div>

          <div className="col-12">
            <input
              type="file"
              onChange={handleImage}
              className="form-control"
            />
          </div>

        </div>

        {preview && (
          <img
            src={preview}
            alt="preview"
            className="mt-3 rounded-3"
            style={{ width: "100%", height: 220, objectFit: "cover" }}
          />
        )}

        <button className="btn btn-primary w-100 mt-3">
          {editId ? "Update Offer" : "Create Offer"}
        </button>
      </form>

      {/* LIST */}
      <div className="row mt-4">

        {offers.map((o) => (
          <div key={o._id} className="col-md-4 mb-3">

            <div className="card h-100 shadow-sm border-0 rounded-4 overflow-hidden">

              <div style={{ height: 200 }}>
                <img
                  src={
                    o.image
                      ? `${baseURL}${o.image}`
                      : "https://via.placeholder.com/300"
                  }
                  alt={o.title}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </div>

              <div className="card-body">

                <h5 className="fw-bold">{o.title}</h5>

                <p className="text-muted small">{o.description}</p>

                {/* السعر الأصلي */}
                <div className="text-muted small">
                  Original: {o.price} EGP
                </div>

                {/* السعر بعد الخصم */}
                <div className="fw-bold text-success">
                  Final: {(o.price - (o.price * o.discount) / 100).toFixed(2)} EGP
                </div>

                <span className={`badge mt-2 ${o.isActive ? "bg-success" : "bg-danger"}`}>
                  {o.isActive ? "Active" : "Disabled"}
                </span>

              </div>

              <div className="card-footer bg-white border-0">
                <div className="d-grid gap-2">

                  <button
                    className="btn btn-warning btn-sm"
                    onClick={() => handleEdit(o)}
                  >
                    Edit
                  </button>

                  <button
                    className="btn btn-outline-secondary btn-sm"
                    onClick={() => handleToggle(o._id)}
                  >
                    Toggle
                  </button>

                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDelete(o._id)}
                  >
                    Delete
                  </button>

                </div>
              </div>

            </div>

          </div>
        ))}

      </div>

    </div>
  );
};

export default AdminOffersPage;