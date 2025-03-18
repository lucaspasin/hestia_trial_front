import { render, screen, waitFor } from "@testing-library/react";
import { useCep } from "../hooks/useCep";
import { fetchCep } from "../services/cepService";
import { useEffect } from "react";

jest.mock("../services/cepService");

// Componente de teste que usa o hook
const TestComponent = ({ cep }) => {
  const { cepData, searchCep, error } = useCep();

  useEffect(() => {
    searchCep(cep);
  }, [cep]);

  return (
    <div>
      {cepData && <div data-testid="cepData">{cepData.localidade}, {cepData.uf}</div>}
      {error && <div data-testid="error">{error}</div>}
    </div>
  );
};

describe("useCep Hook", () => {

  afterEach(() => {
    localStorage.clear(); // Limpa o localStorage após cada teste
  });

  it("Deve buscar CEP corretamente", async () => {
    localStorage.setItem("authToken", "fake-token");

    fetchCep.mockResolvedValueOnce({
      success: true,
      data: { localidade: "São Pedro de Alcântara", uf: "SC" },
    });

    render(<TestComponent cep="88125000" />);

    await waitFor(() => {
      expect(screen.getByTestId("cepData")).toHaveTextContent("São Pedro de Alcântara, SC");
    });
  });

  it("Deve lidar com erro da API", async () => {
    localStorage.setItem("authToken", "fake-token");

    fetchCep.mockResolvedValueOnce({
      success: false,
      message: "CEP inválido",
    });

    render(<TestComponent cep="00000000" />);

    await waitFor(() => {
      expect(screen.getByTestId("error")).toHaveTextContent("CEP inválido");
    });
  });

  it("Deve exibir erro se o usuário não estiver autenticado", async () => {
    localStorage.removeItem("authToken"); // Remove o token antes do teste
  
    render(<TestComponent cep="88125000" />);
  
    await waitFor(() => {
      expect(screen.getByTestId("error")).toHaveTextContent("Usuário não autenticado");
    });
  });
});
