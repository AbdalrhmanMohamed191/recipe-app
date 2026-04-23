import React, { useState } from "react";
import api from "../../api/api";
import "./contact.css";

const Contact = () => {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const sendMessage = async (e) => {
    e.preventDefault();

    if (!message.trim()) {
      setError("Message cannot be empty");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setSuccess(false);

      await api.post(
        "/api/v1/contact",
        { message },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setMessage("");
      setSuccess(true);

      setTimeout(() => setSuccess(false), 3000);

    } catch (err) {
      console.log(err);
      setError("Failed to send message");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="contact-page">

      <div className="contact-card">

        <h2>📞 Contact Us</h2>
        <p>We’re here to help you anytime</p>

        <form onSubmit={sendMessage}>

          <textarea
            placeholder="Write your message here..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />

          {error && <div className="error">{error}</div>}

          {success && (
            <div className="success">
              Message sent successfully ✔
            </div>
          )}

          <button disabled={loading}>
            {loading ? "Sending..." : "Send Message"}
          </button>

        </form>

      </div>

    </div>
  );
};

export default Contact;