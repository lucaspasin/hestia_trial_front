import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from './components/login'; 
import Menu from "./components/menu";

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <h1>Bem-vindo à aplicação</h1>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/menu" element={<Menu />} />
            {/* Redireciona para a página de login caso a rota não exista */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </header>
      </div>
    </Router>
  );
}

export default App;
