import React, { useState, useEffect } from "react";
import { useCep } from "../hooks/useCep";
import { useNavigate } from "react-router-dom";
import { logout } from "../services/AuthService";

const Menu = () => {
  const [cep, setCep] = useState("");
  const { cepData, searchCep, loading, error } = useCep();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      navigate("/"); // Se não tiver token, redireciona para login
    }
  }, [navigate]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (cep.length === 8) {
      searchCep(cep);
    } else {
      alert("Digite um CEP válido (8 dígitos)");
    }
  };

  const handleLogout = () => {
    logout(); // Remove o token
    navigate("/"); // Redireciona para a tela de login
  };

  return (
    <div>
      <h2>Menu</h2>
      <button className="logout-button" onClick={handleLogout}>Logout</button>
      <form onSubmit={handleSearch}>
        <label htmlFor="cep">Digite o CEP:</label>
        <input
          type="text"
          id="cep"
          value={cep}
          onChange={(e) => setCep(e.target.value)}
          maxLength="8"
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? "Buscando..." : "Buscar"}
        </button>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {cepData && (
        <div>
          <h3>Resultado:</h3>
          <p><strong>Logradouro:</strong> {cepData.logradouro}</p>
          <p><strong>Complemento:</strong> {cepData.complemento}</p>
          <p><strong>Bairro:</strong> {cepData.bairro}</p>
          <p><strong>Localidade:</strong> {cepData.localidade}</p>
          <p><strong>Estado:</strong> {cepData.estado}</p>
          <p><strong>Região:</strong> {cepData.regiao}</p>
          <p><strong>DDD:</strong> {cepData.ddd}</p>
        </div>
      )}
    </div>
  );
};

export default Menu;