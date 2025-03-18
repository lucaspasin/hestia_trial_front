import { fetchCep } from "../services/cepService";
import "jest-fetch-mock";

beforeEach(() => {
  fetch.resetMocks();
});

describe("fetchCep Service", () => {
  it("Deve retornar os dados do CEP quando a requisição for bem-sucedida", async () => {
    const mockData = { localidade: "São Paulo", uf: "SP" };
    fetch.mockResponseOnce(JSON.stringify(mockData), { status: 200 });

    const result = await fetchCep("01001000", "fake-token");

    expect(result.success).toBe(true);
    expect(result.data).toEqual(mockData);
    expect(fetch).toHaveBeenCalledWith("http://localhost:5079/Cep?cep=01001000", {
      method: "GET",
      headers: {
        accept: "*/*",
        Authorization: "Bearer fake-token",
      },
    });
  });

  it("Deve retornar erro quando o token não for fornecido", async () => {
    fetch.mockResponseOnce(JSON.stringify({ message: "Erro ao buscar o CEP" }), { status: 401 });
  
    const result = await fetchCep("01001000", null);
  
    expect(result.success).toBe(false);
    expect(result.message).toBe("Erro ao buscar o CEP");
  });

  it("Deve retornar erro quando a API retornar status diferente de 200", async () => {
    fetch.mockResponseOnce(JSON.stringify({ message: "Erro interno" }), { status: 500 });
  
    const result = await fetchCep("01001000", "fake-token");
  
    expect(result.success).toBe(false);
    expect(result.message).toBe("Erro ao buscar o CEP");
  });

  it("Deve retornar erro quando ocorrer uma exceção na requisição", async () => {
    fetch.mockReject(new Error("Falha na rede"));

    const result = await fetchCep("01001000", "fake-token");

    expect(result.success).toBe(false);
    expect(result.message).toBe("Falha na rede");
  });
});
