export function ler<T>(chave: string, padrao: T): T {
  try {
    const valor = localStorage.getItem(chave)
    return valor ? (JSON.parse(valor) as T) : padrao
  } catch {
    return padrao
  }
}

export function gravar(chave: string, valor: unknown) {
  try {
    localStorage.setItem(chave, JSON.stringify(valor))
  } catch {
    // Private mode or full quota: state keeps working in memory.
  }
}
