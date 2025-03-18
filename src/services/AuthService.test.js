import { login, logout, registerUser  } from "./AuthService";

beforeEach(() => {
  localStorage.clear(); // Limpa o localStorage antes de cada teste
  fetch.resetMocks(); // Reseta os mocks das requisições
});

describe("AuthService", () => {
  it("Deve fazer login com sucesso e armazenar o token", async () => {
    const mockToken = "fake-jwt-token";

    fetch.mockResponseOnce(JSON.stringify({ token: mockToken }), { status: 200 });

    const result = await login("email@test.com", "123456");

    expect(result.success).toBe(true);
    expect(result.token).toBe(mockToken);
    expect(localStorage.getItem("authToken")).toBe(mockToken);
  });

  it("Deve falhar no login se as credenciais forem inválidas", async () => {
    fetch.mockResponseOnce("Credenciais inválidas", { status: 401 });

    const result = await login("email@test.com", "wrongpassword");

    expect(result.success).toBe(false);
    expect(result.message).toBe("Credenciais inválidas");
    expect(localStorage.getItem("authToken")).toBeNull();
  });

  it("Deve falhar no login se houver erro na API", async () => {
    fetch.mockReject(new Error("Erro na requisição"));

    const result = await login("email@test.com", "123456");

    expect(result.success).toBe(false);
    expect(result.message).toBe("Erro na requisição");
    expect(localStorage.getItem("authToken")).toBeNull();
  });

  it("Deve fazer logout e remover o token do localStorage", () => {
    localStorage.setItem("authToken", "fake-jwt-token");

    logout();

    expect(localStorage.getItem("authToken")).toBeNull();
  });

  it('deve retornar sucesso quando a resposta for bem-sucedida', async () => {
    const mockResponse = {
      success: true,
      message: 'Cadastro realizado com sucesso!',
    };
    
    // Mock da resposta do fetch
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    const result = await registerUser('user@example.com', 'password123');

    expect(result.success).toBe(true);
    expect(result.message).toBe('Cadastro realizado com sucesso!');
    expect(fetch).toHaveBeenCalledWith(
      'http://localhost:5079/Auth/register',
      expect.objectContaining({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'user@example.com', password: 'password123' }),
      })
    );
  });

  it('deve retornar erro quando a resposta for um erro de validação', async () => {
    const mockErrors = [
      { description: 'Email já cadastrado' },
      { description: 'Senha muito curta' },
    ];

    fetch.mockResolvedValueOnce({
      ok: false,
      json: async () => mockErrors,
    });

    const result = await registerUser('user@example.com', 'password123');

    expect(result.success).toBe(false);
    expect(result.errors).toEqual(mockErrors);
    expect(fetch).toHaveBeenCalledWith(
      'http://localhost:5079/Auth/register',
      expect.objectContaining({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'user@example.com', password: 'password123' }),
      })
    );
  });

  it('deve retornar erro de comunicação quando falhar a requisição', async () => {
    fetch.mockRejectedValueOnce(new Error('Falha na rede'));

    const result = await registerUser('user@example.com', 'password123');

    expect(result.success).toBe(false);
    expect(result.message).toBe('Erro ao se comunicar com o servidor.');
    expect(fetch).toHaveBeenCalledWith(
      'http://localhost:5079/Auth/register',
      expect.objectContaining({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'user@example.com', password: 'password123' }),
      })
    );
  });
});
