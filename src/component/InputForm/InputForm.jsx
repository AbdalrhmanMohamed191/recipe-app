import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUser } from "../../../store/userSlice/userSlice";
import socket from "../../socket/socket";
import api from "../../api/api";

const InputForm = ({ closeModal }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [onSignUp, setOnSignUp] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const validatePhone = (phone) => {
    const phoneRegex = /^(010|011|012|015)\d{8}$/;
    if (!phone) return "Phone is required";
    if (phone.length !== 11) return "Phone must be exactly 11 digits";
    if (!phoneRegex.test(phone)) return "Invalid Egyptian phone number";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      // التأكد من أن الـ endpoint مطابق تماماً لما يتوقعه الـ Backend
      const endpoint = onSignUp ? "register" : "signin";

      if (onSignUp) {
        const phoneError = validatePhone(phone);
        if (phoneError) {
          setError(phoneError);
          setLoading(false);
          return;
        }
      }

      const payload = onSignUp
        ? { name, email, password, phone }
        : { email, password };

      // تأكد أن الرابط يبدأ بـ /users/ كما هو مبرمج في الراوتر بالخلفية
      const res = await api.post(`/api/v1/users/${endpoint}`, payload);

      const { token, user } = res.data;

      // تخزين البيانات
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      // تحديث الحالة في Redux
      dispatch(setUser(user));

      // ربط الـ Socket
      if (socket) {
        socket.connect();
        socket.emit("join", {
          userId: user._id,
          role: user.role,
        });
      }

      setSuccess("Success! Redirecting...");
      
      // تأخير بسيط لإظهار رسالة النجاح ثم الإغلاق
      setTimeout(() => {
        if (closeModal) closeModal();
        navigate("/");
      }, 1000);

    } catch (err) {
      // إظهار رسالة الخطأ القادمة من السيرفر بشكل أوضح
      const msg = err.response?.data?.message || "Invalid Email or Password";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ width: "100%", display: "flex", flexDirection: "column", gap: "12px" }}>
      <h4 className="text-center fw-bold mb-2">
        {onSignUp ? "Create Account 🚀" : "Welcome Back 👋"}
      </h4>

      {onSignUp && (
        <>
          <input className="form-control" placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} required />
          <input 
             className="form-control" 
             placeholder="Phone (11 digits)" 
             value={phone} 
             maxLength={11} 
             onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))} 
             required 
          />
        </>
      )}

      <input className="form-control" type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />

      <div style={{ position: "relative" }}>
        <input
          className="form-control"
          type={showPassword ? "text" : "password"}
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <span
          onClick={() => setShowPassword(!showPassword)}
          style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", cursor: "pointer", color: "#666" }}
        >
          {showPassword ? <FaEyeSlash /> : <FaEye />}
        </span>
      </div>

      {error && <div className="alert alert-danger p-2 text-center" style={{ fontSize: "14px" }}>{error}</div>}
      {success && <div className="alert alert-success p-2 text-center" style={{ fontSize: "14px" }}>{success}</div>}

      <button className="btn btn-primary w-100 fw-bold" disabled={loading} style={{ padding: "10px" }}>
        {loading ? <span className="spinner-border spinner-border-sm"></span> : (onSignUp ? "Sign Up" : "Sign In")}
      </button>

      <p
        onClick={() => { setOnSignUp(!onSignUp); setError(""); setSuccess(""); }}
        style={{ textAlign: "center", cursor: "pointer", color: "#0d6efd", fontSize: "14px" }}
      >
        {onSignUp ? "Already have an account? Login" : "Don't have an account? Create one"}
      </p>
    </form>
  );
};

export default InputForm;