// import React, { useState } from "react";
// import api from "../../api/api";
// import "./contact.css";

// const Contact = () => {
//   const [message, setMessage] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [success, setSuccess] = useState(false);
//   const [error, setError] = useState("");

//   const sendMessage = async (e) => {
//     e.preventDefault();

//     if (!message.trim()) {
//       setError("Message cannot be empty");
//       return;
//     }

//     try {
//       setLoading(true);
//       setError("");
//       setSuccess(false);

//       await api.post(
//         "/api/v1/contact",
//         { message },
//         {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("token")}`,
//           },
//         }
//       );

//       setMessage("");
//       setSuccess(true);

//       setTimeout(() => setSuccess(false), 3000);

//     } catch (err) {
//       console.log(err);
//       setError("Failed to send message");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="contact-page">

//       <div className="contact-card">

//         <h2>📞 Contact Us</h2>
//         <p>We’re here to help you anytime</p>

//         <form onSubmit={sendMessage}>

//           <textarea
//             placeholder="Write your message here..."
//             value={message}
//             onChange={(e) => setMessage(e.target.value)}
//           />

//           {error && <div className="error">{error}</div>}

//           {success && (
//             <div className="success">
//               Message sent successfully ✔
//             </div>
//           )}

//           <button disabled={loading}>
//             {loading ? "Sending..." : "Send Message"}
//           </button>

//         </form>

//       </div>

//     </div>
//   );
// };

// export default Contact;


import React, { useState } from "react";
import api from "../../api/api";
import "./contact.css";

import {
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaPaperPlane,
  FaCheckCircle,
} from "react-icons/fa";

const Contact = () => {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const sendMessage = async (e) => {
    e.preventDefault();

    if (!message.trim()) {
      setError("Please write a message first.");
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

      setTimeout(() => {
        setSuccess(false);
      }, 3000);

    } catch (err) {
      console.log(err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="contact-page">

      {/* ================= HEADER ================= */}

      <section className="contact-header">

        <span className="contact-label">
          GET IN TOUCH
        </span>

        <h1>
          We'd Love To
          <span> Hear From You.</span>
        </h1>

        <p>
          Have a question, suggestion, or need some help?
          Send us a message and we'll get back to you.
        </p>

      </section>


      {/* ================= CONTENT ================= */}

      <section className="contact-content">

        {/* ================= INFO ================= */}

        <div className="contact-info">

          <h2>
            Let's talk.
          </h2>

          <p className="contact-info-text">
            Whether you're a food lover, restaurant owner,
            or just have a question about FAMY, we're here
            to help.
          </p>


          <div className="contact-info-list">

            <div className="contact-info-item">

              <div className="contact-icon">
                <FaEnvelope />
              </div>

              <div>
                <span>Email</span>
                <strong>support@famy.com</strong>
              </div>

            </div>


            <div className="contact-info-item">

              <div className="contact-icon">
                <FaPhone />
              </div>

              <div>
                <span>Phone</span>
                <strong>+20 1207424257 </strong>
              </div>

            </div>


            <div className="contact-info-item">

              <div className="contact-icon">
                <FaMapMarkerAlt />
              </div>

              <div>
                <span>Location</span>
                <strong>Egypt</strong>
              </div>

            </div>

          </div>


          <div className="contact-decoration">
            <span>🍔</span>
            <span>🥞</span>
            <span>🍕</span>
          </div>

        </div>


        {/* ================= FORM ================= */}

        <div className="contact-card">

          <div className="form-heading">

            <div className="form-icon">
              <FaEnvelope />
            </div>

            <div>
              <h2>
                Send us a message
              </h2>

              <p>
                We'll be happy to hear from you.
              </p>
            </div>

          </div>


          <form onSubmit={sendMessage}>

            <label htmlFor="message">
              Your Message
            </label>

            <textarea
              id="message"
              placeholder="Tell us what's on your mind..."
              value={message}
              onChange={(e) => {
                setMessage(e.target.value);
                setError("");
              }}
            />

            <div className="message-count">
              {message.length} characters
            </div>


            {error && (
              <div className="contact-error">
                {error}
              </div>
            )}


            {success && (
              <div className="contact-success">
                <FaCheckCircle />
                Message sent successfully!
              </div>
            )}


            <button
              type="submit"
              disabled={loading}
            >
              {loading ? (
                "Sending..."
              ) : (
                <>
                  Send Message
                  <FaPaperPlane />
                </>
              )}
            </button>

          </form>

        </div>

      </section>

    </main>
  );
};

export default Contact;