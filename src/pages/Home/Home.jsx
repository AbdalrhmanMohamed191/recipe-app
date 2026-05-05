// import React, { useRef } from "react";
// import "../../App.css";
// import "./Home.css";
// import heroImg from "../../assets/Floating-burger.png";
// import gsap from "gsap";
// import { useGSAP } from "@gsap/react";
// import { useNavigate } from "react-router-dom";
// import { useSelector } from "react-redux";

// function Home() {
//   const container = useRef();
//   const go = useNavigate();
//   const {isLoggedIn} = useSelector((state) => state.user);

//   useGSAP(() => {
//     gsap.from(".hero-left", {
//       x: -40,
//       opacity: 0,
//       duration: 0.8,
//       ease: "power3.out",
//     });

//     gsap.from(".hero-right", {
//       x: 40,
//       opacity: 0,
//       duration: 0.8,
//       ease: "power3.out",
//     });
//   }, { scope: container });

//   return (
//     <div ref={container} className="home-container">

//       {/* HERO */}
//       <section className="hero">

//         {/* LEFT */}
//         <div className="hero-left">

//           <span className="badge">🔥 Fast • Fresh • Delicious</span>

//           <h1>
//             Delicious Food <br />
//             <span>Delivered Fast</span>
//           </h1>

//           <p>
//             Order your favorite meals from top restaurants and get them delivered in minutes.
//           </p>

//           <div className="hero-buttons">

//           {isLoggedIn ? (
//               <button className="btn menu" onClick={() => go("/menue")}>
//                  🍽 Explore Menu
//               </button>
//             ) : (
//               <button className="btn menu" onClick={() => go("/")}>
//                  🍽 Explore Menu
//               </button>
//             )}

//             <button className="btn outline" onClick={() => go("/booktable")}>
//               📅 Book Table
//             </button>

//             <button className="btn offers" onClick={() => go("/offers")}>
//               🔥 Offers
//             </button>

//           </div>

//           <div className="stats">
//             <div>
//               <h3>10K+</h3>
//               <p>Orders</p>
//             </div>
//             <div>
//               <h3>5K+</h3>
//               <p>Customers</p>
//             </div>
//             <div>
//               <h3>4.9⭐</h3>
//               <p>Rating</p>
//             </div>
//           </div>

//         </div>

//         {/* RIGHT */}
//         <div className="hero-right">
//           <div className="img-box">
//             <img src={heroImg} alt="food" />
//           </div>
//         </div>

//       </section>

//       {/* CONTACT */}
//       <section className="contact-section">

//         <h2>📞 Get in Touch</h2>
//         <p>We’re available 24/7 for support and orders</p>

//         <div className="contact-grid">

//           <div className="contact-card">
//             <h3>☎ Hotline</h3>
//             <p>+20 100 000 0000</p>
//           </div>

//           <div className="contact-card">
//             <h3>💬 Support</h3>
//             <p>support@restaurant.com</p>
//           </div>

//           <div className="contact-card">
//             <h3>🌐 Social</h3>
//             <p>Facebook • Instagram • Twitter</p>
//           </div>

//         </div>

//       </section>

//     </div>
//   );
// }

// export default Home;

// import React, { useRef, useState } from "react";
// import "../../App.css";
// import "./Home.css";
// import heroImg from "../../assets/Floating-burger.png";
// import gsap from "gsap";
// import { useGSAP } from "@gsap/react";
// import { useNavigate } from "react-router-dom";
// import { useSelector } from "react-redux";

// // 🔥 نفس المودال بتاع الناف
// import Modal from "../../component/Modal/Modal";
// import InputForm from "../../component/InputForm/InputForm";

// function Home() {
//   const container = useRef();
//   const go = useNavigate();

//   // 🔐 auth
//   const user = useSelector((state) => state.user.user);
//   const isLoggedIn = !!user;

//   // 🎯 modal state
//   const [modalOpen, setModalOpen] = useState(false);

//   // 🎬 animation
//   useGSAP(() => {
//     gsap.from(".hero-left", {
//       x: -40,
//       opacity: 0,
//       duration: 0.8,
//       ease: "power3.out",
//     });

//     gsap.from(".hero-right", {
//       x: 40,
//       opacity: 0,
//       duration: 0.8,
//       ease: "power3.out",
//     });
//   }, { scope: container });

  
//   const handleExplore = () => {
//     if (!isLoggedIn) {
//       setModalOpen(true);
//     } else {
//       go("/menue");
//     }
//   };

//   return (
//     <div ref={container} className="home-container">

//       {/* HERO */}
//       <section className="hero">

//         {/* LEFT */}
//         <div className="hero-left">

//           <span className="badge">🔥 Fast • Fresh • Delicious</span>

//           <h1>
//             Delicious Food <br />
//             <span>Delivered Fast</span>
//           </h1>

//           <p>
//             Order your favorite meals from top restaurants and get them delivered in minutes.
//           </p>

//           <div className="hero-buttons">

//             {/* 🔥 UPDATED */}
//             <button className="btn primary" onClick={handleExplore}>
//               🍽 Explore Menu
//             </button>

//             <button className="btn outline" onClick={() => go("/booktable")}>
//               📅 Book Table
//             </button>

//             <button className="btn offers" onClick={() => go("/offers")}>
//               🔥 Offers
//             </button>

//           </div>

//           <div className="stats">
//             <div>
//               <h3>10K+</h3>
//               <p>Orders</p>
//             </div>
//             <div>
//               <h3>5K+</h3>
//               <p>Customers</p>
//             </div>
//             <div>
//               <h3>4.9⭐</h3>
//               <p>Rating</p>
//             </div>
//           </div>

//         </div>

//         {/* RIGHT */}
//         <div className="hero-right">
//           <div className="img-box">
//             <img src={heroImg} alt="food" />
//           </div>
//         </div>

//       </section>

//       {/* CONTACT */}
//       <section className="contact-section">

//         <h2>📞 Get in Touch</h2>
//         <p>We’re available 24/7 for support and orders</p>

//         <div className="contact-grid">

//           <div className="contact-card">
//             <h3>☎ Hotline</h3>
//             <p>+20 100 000 0000</p>
//           </div>

//           <div className="contact-card">
//             <h3>💬 Support</h3>
//             <p>support@restaurant.com</p>
//           </div>

//           <div className="contact-card">
//             <h3>🌐 Social</h3>
//             <p>Facebook • Instagram • Twitter</p>
//           </div>

//         </div>

//       </section>

//       {/* 🔥 LOGIN MODAL */}
//       {modalOpen && (
//         <Modal closeModal={() => setModalOpen(false)}>
//           <InputForm closeModal={() => setModalOpen(false)} />
//         </Modal>
//       )}

//     </div>
//   );
// }

// export default Home;


import React, { useRef, useState } from "react";
import "../../App.css";
import "./Home.css";
import heroImg from "../../assets/Floating-burger.png";
import crepe from "../../assets/crepe.png";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

import Modal from "../../component/Modal/Modal";
import InputForm from "../../component/InputForm/InputForm";

function Home() {
  const container = useRef();
  const go = useNavigate();

  const user = useSelector((state) => state.user.user);
  const isLoggedIn = !!user;

  const [modalOpen, setModalOpen] = useState(false);

  useGSAP(() => {
    gsap.from(".hero-left", { x: -60, opacity: 0, duration: 1 });
    gsap.from(".hero-right", { x: 60, opacity: 0, duration: 1 });
  }, { scope: container });

  const handleExplore = () => {
    if (!isLoggedIn) setModalOpen(true);
    else go("/menue");
  };

  return (
    <div ref={container} className="home-container">

      {/* HERO */}
      <section className="hero">

        <div className="hero-left">
          <span className="badge">🔥 Fast • Fresh • Premium Taste</span>

          <h1>
            Delicious Food <br />
            <span>Delivered Like Magic</span>
          </h1>

          <p>
            Order pizza, burgers, crepes and desserts from top restaurants
            and get them delivered instantly.
          </p>

          <div className="hero-buttons">
            <button className="btn primary" onClick={handleExplore}>
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
            <div><h3>10K+</h3><p>Orders</p></div>
            <div><h3>5K+</h3><p>Customers</p></div>
            <div><h3>4.9⭐</h3><p>Rating</p></div>
          </div>
        </div>

        <div className="hero-right">
          <div className="img-box">
            <img src={heroImg} alt="food" />
          </div>
        </div>

      </section>

      {/* CONTACT */}
      <section className="contact-section">
        <h2>📞 Get in Touch</h2>
        <p>24/7 Support for orders & reservations</p>

        <div className="contact-grid">
          <div className="contact-card">
            <h3>☎ Hotline</h3>
            <p>+20 100 000 0000</p>
          </div>

          <div className="contact-card">
            <h3>💬 Email</h3>
            <p>support@restaurant.com</p>
          </div>

          <div className="contact-card">
            <h3>🌐 Social</h3>
            <p>Facebook • Instagram • TikTok</p>
          </div>
        </div>
      </section>

      {/* 🍕 FOOD GALLERY */}
     <section className="food-gallery">

  <div className="gallery-item">
    <img src="https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=800&q=80" alt="pizza" />
  </div>

  <div className="gallery-item">
    <img src="https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=800&q=80" alt="burger" />
  </div>

  <div className="gallery-item">
    <img src={crepe} alt="crepe" />
  </div>

  <div className="gallery-item">
    <img src={heroImg} alt="fries" />
  </div>

  <div className="gallery-item">
    <img src="https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80" alt="dessert" />
  </div>

  <div className="gallery-item">
    <img src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80" alt="pizza slice" />
  </div>

  <div className="gallery-item">
    <img src="https://images.unsplash.com/photo-1600891964599-f61ba0e24092?auto=format&fit=crop&w=800&q=80" alt="fast food" />
  </div>

  <div className="gallery-item">
    <img src="https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80" alt="restaurant food" />
  </div>

</section>

      {/* MODAL */}
      {modalOpen && (
        <Modal closeModal={() => setModalOpen(false)}>
          <InputForm closeModal={() => setModalOpen(false)} />
        </Modal>
      )}

    </div>
  );
}

export default Home;