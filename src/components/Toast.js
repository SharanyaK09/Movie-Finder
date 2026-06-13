import React, { useEffect } from "react";
import "../styles/Toast.css";

const Toast = ({ message, show, onDone }) => {
  useEffect(() => {
    if (show) {
      const t = setTimeout(onDone, 2200);
      return () => clearTimeout(t);
    }
  }, [show, onDone]);

  if (!show) return null;

  return <div className="toast">{message}</div>;
};

export default Toast;
