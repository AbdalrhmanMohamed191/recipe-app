// import React, { useEffect, useState } from 'react'
// import { MdOutlineFavoriteBorder, MdFavorite } from "react-icons/md";
// import axios from 'axios'
// import { FaCartPlus } from "react-icons/fa";
// import { useCart } from '../../component/CartContext/CartContext'; // 👈 مهم
// import './AllRecipes.css'

// const AllRecipes = () => {
//   const [recipes, setRecipes] = useState([])
//   const [favorites, setFavorites] = useState([])
//   const { addToCart } = useCart();

  
//   useEffect(() => {
//     const storedFavs = JSON.parse(localStorage.getItem("favorites")) || []
//     setFavorites(storedFavs)
//   }, [])

//   useEffect(() => {
//     const fetchRecipes = async () => {
//       try {
//         const response = await axios.get('http://localhost:5000/api/v1/recipes')
//         setRecipes(response.data)
//       } catch (error) {
//         console.error('Error fetching recipes:', error)
//       }
//     }

//     fetchRecipes()
//   }, [])

//   const getImageUrl = (img) => {
//   if (!img) return "";

//   // لو لينك خارجي
//   if (img.startsWith("http")) return img;

//   // لو من السيرفر بتاعك
//   return `http://localhost:5000${img}`;
// };
 
//   const toggleFavorite = (id) => {
//     setFavorites((prev) => {
//       const updated = prev.includes(id)
//         ? prev.filter((fav) => fav !== id)
//         : [...prev, id]

//       localStorage.setItem("favorites", JSON.stringify(updated))
//       return updated
//     })
//   }

//   return (
//     <div className="recipes-container">
//       <h2 className='menue-list'>Our Menue</h2>

//       <div className="recipes-list">
//         {recipes?.map((recipe) => {
//           const isFav = favorites.includes(recipe._id)

//           return (
//             <div
//   key={recipe._id}
//   className="recipe-card"
  
// >
//              <img
//   src={getImageUrl(recipe.CoverImage)}
//   alt={recipe.title}
//   style={{
//     width: "100%",
//     height: "200px",
//     objectFit: "cover",
//     objectPosition: "center",
//     borderRadius: "12px 12px 0 0",
//     display: "block"
//   }}
// />
//               <h4>{recipe.title}</h4>
//               <p>{recipe.ingredients?.join(", ") }</p>
//               <small>{recipe.instructions}</small>
//               <h3 style={{ margin: 0, color: "#333" , marginTop: "10px" }}>${recipe.price}</h3>
              
              

//              <button
//   onClick={() => addToCart(recipe)}
//   style={{
//     marginTop: "10px",
//     marginLeft: "10px",
//     border: "none",
//     background: "linear-gradient(135deg, #ff6a3d, #ff3d77)",
//     color: "white",
//     padding: "10px 14px",
//     borderRadius: "10px",
//     cursor: "pointer",
//     display: "flex",
//     alignItems: "center",
//     gap: "5px",
//     fontWeight: "bold",
//     fontSize: "14px",
//     boxShadow: "0 4px 12px rgba(115, 115, 115, 0.3)",
//     transition: "all 0.2s ease-in-out"
//   }}
//   onMouseOver={(e) => {
//     e.target.style.transform = "scale(1.05)"
//     e.target.style.boxShadow = "0 6px 16px rgba(255, 61, 119, 0.4)"
//   }}
//   onMouseOut={(e) => {
//     e.target.style.transform = "scale(1)"
//     e.target.style.boxShadow = "0 4px 12px rgba(255, 61, 119, 0.3)"
//   }}
// >
//   <FaCartPlus size={16} />
//   Add to Cart
// </button>

//               <div className="icons">
//                 <span onClick={() => toggleFavorite(recipe._id)} className="fav-icon">
//                   {isFav ? (
//                     <MdFavorite size={26} color="red" />
//                   ) : (
//                     <MdOutlineFavoriteBorder size={26} />
//                   )}
//                 </span>
//               </div>
//             </div>
//           )
//         })}
//       </div>
//     </div>
//   )
// }

// export default AllRecipes

