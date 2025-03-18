import { useState } from "react";
import { login } from "../services/AuthService"

export const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (email, password) => {
    setLoading(true);
    setError("");

    try {
      const result = await login(email, password);
      if (!result.success) {
        setError(result.message);
      }
      return result.success;
    } catch (err) {
      setError(err.message || "Erro desconhecido");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { handleLogin, loading, error };
};