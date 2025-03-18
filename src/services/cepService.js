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

      const data = await response.json();
      return { success: true, data: data };
    } catch (error) {
      return { success: false, message: error.message  };
    }
  };