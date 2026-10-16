import { useEffect, useState } from 'react'
import type { Perfil } from '../types'
import { gravar, ler } from './armazenamento'

export const PERFIS: Perfil[] = [
  { id: 'will', nome: 'Will', cor: '#e50914', infantil: false },
  { id: 'convidado', nome: 'Convidado', cor: '#2f6fe4', infantil: false },
  { id: 'familia', nome: 'Família', cor: '#e5a50a', infantil: false },
  { id: 'infantil', nome: 'Infantil', cor: '#21a366', infantil: true },
]

const CHAVE = 'streaming:perfil'

export function usePerfil() {
  const [perfilId, setPerfilId] = useState<string | null>(() => ler<string | null>(CHAVE, null))
  const perfil = PERFIS.find((p) => p.id === perfilId) ?? null

  useEffect(() => gravar(CHAVE, perfilId), [perfilId])

  return { perfil, escolher: (id: string) => setPerfilId(id), sair: () => setPerfilId(null) }
}
