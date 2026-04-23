import React, { useEffect, useState } from "react";
import api from "../../api/api";
import socket from "../../socket/socket";
import OfferCard from "../../component/Offer Card/OfferCard";
import "./Offers.css";

const OffersPage = () => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(false);

  // ================= FETCH =================
  const fetchOffers = async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/v1/offers");
      setOffers(res.data || []);
    } catch (err) {
      console.log("OFFERS ERROR:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOffers();

    if (!socket.connected) socket.connect();

    // ================= REALTIME =================
    const handleCreated = (data) => {
      setOffers((prev) => [data, ...prev]);
    };

    const handleUpdated = (data) => {
      setOffers((prev) =>
        prev.map((o) =>
          o._id === data._id ? { ...o, ...data } : o
        )
      );
    };

    const handleDeleted = (id) => {
      setOffers((prev) => prev.filter((o) => o._id !== id));
    };

    socket.on("offerCreated", handleCreated);
    socket.on("offerUpdated", handleUpdated);
    socket.on("offerDeleted", handleDeleted);

    return () => {
      socket.off("offerCreated", handleCreated);
      socket.off("offerUpdated", handleUpdated);
      socket.off("offerDeleted", handleDeleted);
    };
  }, []);

  return (
    <div className="offers-page">

      <div className="offers-header" style={{
        marginTop : 80,
        padding : 10
      }}>
        <h2>🔥 All Offers</h2>
        <p className="deals-text">Best deals updated in real time</p>
      </div>

      {loading ? (
        <div className="loading">Loading offers...</div>
      ) : offers.length === 0 ? (
        <div className="empty">No offers available 😢</div>
      ) : (
        <div className="offers-grid">
          {offers.map((o) => (
            <OfferCard key={o._id} offer={o} />
          ))}
        </div>
      )}

    </div>
  );
};

export default OffersPage;