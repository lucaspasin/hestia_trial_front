import { useState } from "react";
import { login } from "../services/AuthService";

export const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (email, password) => {
    setLoading(true);
    setError("");

    const result = await login(email, password);

    if (!result.success) {
      setError(result.message);
    }

    setLoading(false);
    return result.success;
  };

  return { handleLogin, loading, error };
};