export const fetchCep = async (cep, token) => {
    try {
      const response = await fetch(`http://localhost:5079/Cep?cep=${cep}`, {
        method: "GET",
        headers: {
          accept: "*/*",
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (!response.ok) {
        throw new Error("Erro ao buscar o CEP");
      }
  
      return await response.json();
    } catch (error) {
      return { error: error.message };
    }
  };