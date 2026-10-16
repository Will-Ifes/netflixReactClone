import { useEffect, useState } from 'react'

/** Valor que só muda depois de um tempo sem alterações (debounce da busca). */
export function useAtrasado<T>(valor: T, ms = 350): T {
  const [atrasado, setAtrasado] = useState(valor)
  useEffect(() => {
    const id = window.setTimeout(() => setAtrasado(valor), ms)
    return () => window.clearTimeout(id)
  }, [valor, ms])
  return atrasado
}
