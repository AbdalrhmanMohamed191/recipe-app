import React, { useEffect, useState } from "react";
import api from "../../api/api";
import socket from "../../socket/socket";

const AdminContacts = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);

  // =====================
  // FETCH CONTACTS
  // =====================
  const fetchContacts = async () => {
    try {
      const res = await api.get("/api/v1/admin/contacts", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setContacts(res.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  // =====================
  // DELETE CONTACT
  // =====================
  const deleteContact = async (id) => {
    try {
      await api.delete(`/api/v1/admin/contacts/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      // remove instantly (optimistic UI)
      setContacts((prev) => prev.filter((c) => c._id !== id));
    } catch (err) {
      console.log(err);
    }
  };

  // =====================
  // SOCKET REALTIME
  // =====================
  useEffect(() => {
    fetchContacts();

    socket.connect();

    // new contact arrives
    socket.on("newContact", (contact) => {
      setContacts((prev) => [contact, ...prev]);
    });

    // contact deleted
    socket.on("contactDeleted", (id) => {
      setContacts((prev) => prev.filter((c) => c._id !== id));
    });

    return () => {
      socket.off("newContact");
      socket.off("contactDeleted");
      socket.disconnect();
    };
  }, []);

  // =====================
  // LOADING
  // =====================
  if (loading) {
    return (
      <h4 className="text-center mt-5 text-light">
        Loading contacts...
      </h4>
    );
  }

  return (
    <div className="container py-5 mt-5">

      <h2 className="mb-4 text-light">📩 Contacts Inbox</h2>

      {contacts.length === 0 ? (
        <div className="alert alert-info">No messages yet</div>
      ) : (
        <div className="row g-3">

          {contacts.map((c) => (
            <div key={c._id} className="col-md-6">

              <div className="card bg-dark text-white p-3 shadow">

                {/* HEADER */}
                <div className="d-flex justify-content-between align-items-center mb-2">

                  <h5 className="mb-0">{c.name}</h5>

                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => deleteContact(c._id)}
                  >
                    Delete
                  </button>

                </div>

                {/* PHONE */}
                <p className="mb-1">
                  📞 {c.phone || "No phone"}
                </p>

                {/* MESSAGE */}
                <p className="text-light">
                  💬 {c.message}
                </p>

                {/* DATE */}
                <small className="text-secondary">
                  {new Date(c.createdAt).toLocaleString()}
                </small>

              </div>

            </div>
          ))}

        </div>
      )}

    </div>
  );
};

export default AdminContacts;