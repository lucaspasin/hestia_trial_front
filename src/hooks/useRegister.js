import { useState } from "react";
import { registerUser } from "../services/AuthService";

const useRegister = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState([]);
  const [message, setMessage] = useState("");

  const register = async (email, password, confirmPassword) => {
    if (password !== confirmPassword) {
      setError(["As senhas não coincidem!"]);
      return;
    }

    setLoading(true);
    setError([]);
    setMessage("");

    try {
      const response = await registerUser(email, password);

      if (response.success) {
        setMessage(response.message);
      } else {
        // Extraímos as mensagens de erro do array de erros do backend
        const errorMessages = response.errors.map((err) => err.description);
        setError(errorMessages);
      }
    } catch (err) {
      setError(["Erro ao se comunicar com o servidor."]);
    } finally {
      setLoading(false);
    }
  };

  return { register, loading, error, message };
};

export default useRegister;