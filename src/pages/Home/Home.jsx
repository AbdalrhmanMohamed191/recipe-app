import React, { useRef } from "react";
import "../../App.css";
import "./Home.css";
import heroImg from "../../assets/Floating-burger.png";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useNavigate } from "react-router-dom";

function Home() {
  const container = useRef();
  const go = useNavigate();

  useGSAP(() => {
    gsap.from(".hero-left", {
      x: -40,
      opacity: 0,
      duration: 0.8,
      ease: "power3.out",
    });

    gsap.from(".hero-right", {
      x: 40,
      opacity: 0,
      duration: 0.8,
      ease: "power3.out",
    });
  }, { scope: container });

  return (
    <div ref={container} className="home-container">

      {/* HERO */}
      <section className="hero">

        {/* LEFT */}
        <div className="hero-left">

          <span className="badge">🔥 Fast • Fresh • Delicious</span>

          <h1>
            Delicious Food <br />
            <span>Delivered Fast</span>
          </h1>

          <p>
            Order your favorite meals from top restaurants and get them delivered in minutes.
          </p>

          <div className="hero-buttons">

            <button className="btn primary" onClick={() => go("/menue")}>
              🍽 Explore Menu
            </button>

            <button className="btn outline" onClick={() => go("/booktable")}>
              📅 Book Table
            </button>

            <button className="btn offers" onClick={() => go("/offers")}>
              🔥 Offers
            </button>

          </div>

          <div className="stats">
            <div>
              <h3>10K+</h3>
              <p>Orders</p>
            </div>
            <div>
              <h3>5K+</h3>
              <p>Customers</p>
            </div>
            <div>
              <h3>4.9⭐</h3>
              <p>Rating</p>
            </div>
          </div>

        </div>

        {/* RIGHT */}
        <div className="hero-right">
          <div className="img-box">
            <img src={heroImg} alt="food" />
          </div>
        </div>

      </section>

      {/* CONTACT */}
      <section className="contact-section">

        <h2>📞 Get in Touch</h2>
        <p>We’re available 24/7 for support and orders</p>

        <div className="contact-grid">

          <div className="contact-card">
            <h3>☎ Hotline</h3>
            <p>+20 100 000 0000</p>
          </div>

          <div className="contact-card">
            <h3>💬 Support</h3>
            <p>support@restaurant.com</p>
          </div>

          <div className="contact-card">
            <h3>🌐 Social</h3>
            <p>Facebook • Instagram • Twitter</p>
          </div>

        </div>

      </section>

    </div>
  );
}

export default Home;