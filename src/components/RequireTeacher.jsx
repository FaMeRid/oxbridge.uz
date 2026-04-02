import { useEffect } from "react";

export default function RequireTeacher({ children }) {
  useEffect(() => {
    const role = sessionStorage.getItem("role");

    if (role !== "teacher") {
      alert("Access denied 🚫");
      window.location.href = "/";
    }
  }, []);

  return children;
}