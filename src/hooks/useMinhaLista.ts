import { useEffect, useState } from 'react'
import type { Titulo } from '../types'
import { gravar, ler } from './armazenamento'

const chave = (perfilId: string) => `streaming:lista:${perfilId}`

/** Minha Lista separada por perfil, salva no navegador. */
export function useMinhaLista(perfilId: string) {
  const [estado, setEstado] = useState(() => ({ perfilId, itens: ler<Titulo[]>(chave(perfilId), []) }))

  // Ao trocar de perfil, carrega a lista do novo perfil durante a renderização
  let itens = estado.itens
  if (estado.perfilId !== perfilId) {
    itens = ler<Titulo[]>(chave(perfilId), [])
    setEstado({ perfilId, itens })
  }

  useEffect(() => gravar(chave(estado.perfilId), estado.itens), [estado])

  const contem = (t: Pick<Titulo, 'id' | 'tipo'>) => itens.some((i) => i.id === t.id && i.tipo === t.tipo)

  function alternar(titulo: Titulo) {
    setEstado((atual) => ({
      ...atual,
      itens: atual.itens.some((i) => i.id === titulo.id && i.tipo === titulo.tipo)
        ? atual.itens.filter((i) => !(i.id === titulo.id && i.tipo === titulo.tipo))
        : [titulo, ...atual.itens],
    }))
  }

  return { itens, contem, alternar }
}
