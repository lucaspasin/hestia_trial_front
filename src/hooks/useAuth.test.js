import { renderHook, act } from "@testing-library/react";
import { useAuth } from "../hooks/useAuth";
import { login } from "../services/AuthService";

// Mock do login para evitar chamadas reais à API
jest.mock("../services/AuthService", () => ({
  login: jest.fn(),
}));

describe("useAuth Hook", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("Deve iniciar sem erro e sem estar carregando", () => {
    const { result } = renderHook(() => useAuth());

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe("");
  });

  test("Deve fazer login com sucesso", async () => {
    login.mockResolvedValue({ success: true });

    const { result } = renderHook(() => useAuth());

    await act(async () => {
      const success = await result.current.handleLogin("email@test.com", "123456");
      expect(success).toBe(true);
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe("");
  });

  test("Deve exibir erro ao falhar no login", async () => {
    login.mockResolvedValue({ success: false, message: "Credenciais inválidas" });

    const { result } = renderHook(() => useAuth());

    await act(async () => {
      const success = await result.current.handleLogin("email@test.com", "wrongpass");
      expect(success).toBe(false);
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe("Credenciais inválidas");
  });

  test("Deve exibir erro se o login lançar uma exceção", async () => {
    login.mockRejectedValue(new Error("Erro inesperado"));

    const { result } = renderHook(() => useAuth());

    await act(async () => {
      const success = await result.current.handleLogin("email@test.com", "123456");
      expect(success).toBe(false);
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe("Erro inesperado");
  });
});
