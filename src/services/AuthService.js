export const login = async (email, password) => {
    try {
      const response = await fetch("http://localhost:5079/Auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          accept: "*/*",
        },
        body: JSON.stringify({ email, password }),
      });
  
      if (!response.ok) {
        throw new Error(await response.text());
      }
  
      const data = await response.json();
      localStorage.setItem("authToken", data.token);
      return { success: true, token: data.token };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

export const logout = () => {
    localStorage.removeItem("authToken"); // Remove o token do armazenamento
  };

  export const registerUser = async (email, password) => {
    try {
      const response = await fetch("http://localhost:5079/Auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        return { success: true, message: data.message }; // Sucesso
      } else {
        // Caso de erro, retornamos a lista de mensagens
        return { success: false, errors: data };
      }
    } catch (error) {
      return { success: false, message: "Erro ao se comunicar com o servidor." };
    }
  };