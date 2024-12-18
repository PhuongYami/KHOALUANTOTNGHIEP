import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate,useParams } from "react-router-dom";
import {  setAccessToken } from "../features/auth/authSlice"; // Hành động Redux để lưu token

const GoogleCallbackHandler = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token } = useParams();

  useEffect(() => {
    if (token) {
      // Lưu token vào Redux hoặc LocalStorage
      dispatch( setAccessToken({ token })); // Lưu vào Redux

      // Chuyển hướng người dùng
      navigate("/dashboard");
    } else {
      alert("Đăng nhập thất bại. Token không tồn tại.");
      navigate("/login");
    }
  }, [dispatch, token, navigate]);

  return <div>Đang xử lý đăng nhập...</div>;
};

export default GoogleCallbackHandler;
