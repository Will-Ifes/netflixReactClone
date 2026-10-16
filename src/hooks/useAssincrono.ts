import { useEffect, useState } from 'react'

export type Estado<T> = { status: 'carregando' } | { status: 'ok'; dados: T } | { status: 'erro'; tentarDeNovo: () => void }

/**
 * Roda uma promessa sempre que as dependências mudam. O resultado guarda a chave da
 * requisição, então uma resposta antiga nunca sobrescreve a do pedido atual.
 */
export function useAssincrono<T>(carregar: (() => Promise<T>) | null, deps: readonly unknown[]): Estado<T> | null {
  const [tentativa, setTentativa] = useState(0)
  const [resultado, setResultado] = useState<{ chave: string; estado: Estado<T> } | null>(null)
  const chave = JSON.stringify([...deps, tentativa])
  const ativo = carregar !== null

  useEffect(() => {
    if (!carregar) return
    let atual = true
    carregar()
      .then((dados) => atual && setResultado({ chave, estado: { status: 'ok', dados } }))
      .catch((erro: unknown) => {
        if (!atual) return
        console.warn(erro)
        setResultado({ chave, estado: { status: 'erro', tentarDeNovo: () => setTentativa((n) => n + 1) } })
      })
    return () => {
      atual = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- the request key already encodes the caller's deps
  }, [chave, ativo])

  if (!ativo) return null
  return resultado?.chave === chave ? resultado.estado : { status: 'carregando' }
}
