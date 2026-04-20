import React, { useRef } from "react";
import "../../App.css";
import "./Home.css";
import heroImg from "../../assets/Floating-burger.png";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useNavigate } from "react-router-dom";
import { Button } from "bootstrap";

function Home() {
  const container = useRef();
  const go = useNavigate();

  useGSAP(() => {
    gsap.from(".hero-left", {
      x: -80,
      opacity: 0,
      duration: 1,
      ease: "power3.out",
    });

    gsap.from(".hero-right", {
      x: 80,
      opacity: 0,
      duration: 1,
      ease: "power3.out",
    });

    gsap.to(".floating", {
      y: 20,
      repeat: -1,
      yoyo: true,
      duration: 2,
      ease: "sine.inOut",
    });
  }, { scope: container });

    const goToMenue = () => {
        go("/menue");
    }
  return (
    <div ref={container} className="home-container">

      {/* HERO */}
      <section className="hero">
        <div className="hero-left">
          <h1>
            Delicious Food <br /> <span>Delivered Fast</span> 🍕
          </h1>

          <p>
            Discover top recipes, fresh meals and restaurant-quality food at your home.
          </p>

          <div className="hero-actions">
            <button className="btn-primary">Book a Table</button>
            <button  onClick={goToMenue} className="btn-outline">Explore Menu</button>
          </div>

          <div className="stats">
            <div>
              <h3>10K+</h3>
              <p>Meals</p>
            </div>
            <div>
              <h3>5K+</h3>
              <p>Users</p>
            </div>
            <div>
              <h3>7.9 ⭐</h3>
              <p>Rating</p>
            </div>
          </div>
        </div>

        <div className="hero-right">
          <img className="floating" src={heroImg} alt="" />
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="categories">
        <h2>🔥 Popular Categories</h2>

        <div className="grid">
          <div className="card">🍔 Burger</div>
          <div className="card">🍕 Pizza</div>
          <div className="card">🥗 Healthy</div>
          <div className="card">🍰 Dessert</div>
          <div className="card">🍜 Pasta</div>
          <div className="card">🥩 Steak</div>
        </div>
      </section>

      {/* FEATURED */}
      <section className="featured">
        <h2>⭐ Chef Specials</h2>

        <div className="featured-grid">

          <div className="food-card">
            <img src="https://images.unsplash.com/photo-1555939594-58d7cb561ad1" />
            <div>
              <h3>Grilled Chicken</h3>
              <p>High protein meal</p>
              <span>120 EGP</span>
               <button className="btn-primary" style={{
                marginTop: "10px",
                width: "100%",
                padding: "8px",
                borderRadius: "10px",
                border: "none",
                background: "#422ba6",
                color: "#fff",
                cursor: "pointer",
                fontSize: "16px",
                fontWeight: "bold",
                
              }}>Order Now</button>
            </div>
          </div>

          <div className="food-card">
            <img src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38" />
            <div>
              <h3>Cheese Pizza</h3>
              <p>Italian classic</p>
              <span>150 EGP</span>
               <button className="btn-primary" style={{
                marginTop: "10px",
                width: "100%",
                padding: "8px",
                borderRadius: "10px",
                border: "none",
                background: "#422ba6",
                color: "#fff",
                cursor: "pointer",
                fontSize: "16px",
                fontWeight: "bold",
                
              }}>Order Now</button>
            </div>
          </div>

          <div className="food-card">
            <img src="https://images.unsplash.com/photo-1550547660-d9450f859349" />
            <div>
              <h3>Beef Burger</h3>
              <p>Juicy & fresh</p>
              <span>110 EGP</span>
              <button className="btn-primary" style={{
                marginTop: "10px",
                width: "100%",
                padding: "8px",
                borderRadius: "10px",
                border: "none",
                background: "#422ba6",
                color: "#fff",
                cursor: "pointer",
                fontSize: "16px",
                fontWeight: "bold",
                
              }}>Order Now</button>
            </div>
          </div>
         

        </div>
      </section>

    </div>
  );
}

export default Home;