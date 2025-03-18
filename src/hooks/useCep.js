import { useState } from "react";
import { fetchCep } from "../services/cepService";

export const useCep = () => {
  const [cepData, setCepData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const searchCep = async (cep) => {
    setLoading(true);
    setError("");

    const token = localStorage.getItem("authToken"); // Pega o token salvo no login
    if (!token) {
      setError("Usuário não autenticado");
      setLoading(false);
      return;
    }

    const result = await fetchCep(cep, token);

    if (!result.success) {
      setError(result.message);
      setCepData(null);
    } else {
      setCepData(result.data);
    }

    setLoading(false);
  };

  return { cepData, searchCep, loading, error };
};