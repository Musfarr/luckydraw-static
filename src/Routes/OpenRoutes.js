import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const OpenRoutes = ({ children }) => {
  const navigate = useNavigate();

  useEffect(() => {
    // Get token from localStorage
    const token = localStorage.getItem("token");

    if (token) {
      // Redirect to the default dashboard route if the user is logged in
      navigate(`/home`, { replace: true });
    }
  }, [navigate]);

  // Render children if not redirected
  return children;
};

export default OpenRoutes;
