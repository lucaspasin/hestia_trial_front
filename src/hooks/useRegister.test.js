import { renderHook, act } from "@testing-library/react";
import useRegister from "../hooks/useRegister";
import { registerUser } from "../services/AuthService";

// Mock da função registerUser
jest.mock("../services/AuthService");

describe("useRegister", () => {
  it("deve inicializar com o estado correto", () => {
    const { result } = renderHook(() => useRegister());

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toEqual([]);
    expect(result.current.message).toBe("");
  });

  it("deve exibir erro quando as senhas não coincidirem", async () => {
    const { result } = renderHook(() => useRegister());

    act(() => {
      result.current.register("user@example.com", "password123", "password124");
    });

    expect(result.current.error).toEqual(["As senhas não coincidem!"]);
  });

  it("deve registrar com sucesso quando a resposta do servidor for bem-sucedida", async () => {
    const mockResponse = { success: true, message: "Cadastro realizado com sucesso!" };
    registerUser.mockResolvedValue(mockResponse);

    const { result } = renderHook(() => useRegister());

    act(() => {
      result.current.register("user@example.com", "password123", "password123");
    });

    expect(result.current.loading).toBe(true);
    expect(result.current.error).toEqual([]);
    await act(() => Promise.resolve()); // Espera a resolução da promessa

    expect(result.current.message).toBe("Cadastro realizado com sucesso!");
    expect(result.current.loading).toBe(false);
  });

  it("deve exibir erros ao registrar quando a resposta do servidor falhar", async () => {
    const mockResponse = { success: false, errors: [{ description: "Email já cadastrado" }] };
    registerUser.mockResolvedValue(mockResponse);

    const { result } = renderHook(() => useRegister());

    act(() => {
      result.current.register("user@example.com", "password123", "password123");
    });

    expect(result.current.loading).toBe(true);
    expect(result.current.error).toEqual([]);
    await act(() => Promise.resolve()); // Espera a resolução da promessa

    expect(result.current.error).toEqual(["Email já cadastrado"]);
    expect(result.current.loading).toBe(false);
  });

  it("deve exibir erro genérico em caso de falha na comunicação com o servidor", async () => {
    registerUser.mockRejectedValue(new Error("Falha na rede"));

    const { result } = renderHook(() => useRegister());

    act(() => {
      result.current.register("user@example.com", "password123", "password123");
    });

    expect(result.current.loading).toBe(true);
    expect(result.current.error).toEqual([]);
    await act(() => Promise.resolve()); // Espera a resolução da promessa

    expect(result.current.error).toEqual(["Erro ao se comunicar com o servidor."]);
    expect(result.current.loading).toBe(false);
  });
});
