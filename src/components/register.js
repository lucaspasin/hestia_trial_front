import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useRegister from "../hooks/useRegister"; // Usando o hook de registro

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { register, loading, error, message } = useRegister();
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();

    await register(email, password, confirmPassword);

    if (!error && message) {
      alert(message); // Exibe a mensagem de sucesso
      navigate("/"); // Redireciona para a tela de login
    }
  };

  return (
    <div>
      <h2>Registro</h2>
      <form onSubmit={onSubmit}>
        <div>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Senha</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="confirmPassword">Confirmar Senha</label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? "Registrando..." : "Registrar"}
        </button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default Register;