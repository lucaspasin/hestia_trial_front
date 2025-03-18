import { login, logout } from "./AuthService";

beforeEach(() => {
  localStorage.clear(); // Limpa o localStorage antes de cada teste
  fetch.resetMocks(); // Reseta os mocks das requisições
});

describe("AuthService", () => {
  test("Deve fazer login com sucesso e armazenar o token", async () => {
    const mockToken = "fake-jwt-token";

    fetch.mockResponseOnce(JSON.stringify({ token: mockToken }), { status: 200 });

    const result = await login("email@test.com", "123456");

    expect(result.success).toBe(true);
    expect(result.token).toBe(mockToken);
    expect(localStorage.getItem("authToken")).toBe(mockToken);
  });

  test("Deve falhar no login se as credenciais forem inválidas", async () => {
    fetch.mockResponseOnce("Credenciais inválidas", { status: 401 });

    const result = await login("email@test.com", "wrongpassword");

    expect(result.success).toBe(false);
    expect(result.message).toBe("Credenciais inválidas");
    expect(localStorage.getItem("authToken")).toBeNull();
  });

  test("Deve falhar no login se houver erro na API", async () => {
    fetch.mockReject(new Error("Erro na requisição"));

    const result = await login("email@test.com", "123456");

    expect(result.success).toBe(false);
    expect(result.message).toBe("Erro na requisição");
    expect(localStorage.getItem("authToken")).toBeNull();
  });

  test("Deve fazer logout e remover o token do localStorage", () => {
    localStorage.setItem("authToken", "fake-jwt-token");

    logout();

    expect(localStorage.getItem("authToken")).toBeNull();
  });
});
