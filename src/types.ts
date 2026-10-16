export type TipoMidia = 'movie' | 'tv'

export interface Titulo {
  id: number
  tipo: TipoMidia
  nome: string
  sinopse: string
  poster: string | null
  fundo: string | null
  nota: number
  ano: string
}

export interface Detalhes extends Titulo {
  generos: string[]
  /** "2h 15min" para filmes, "3 temporadas" para séries */
  duracao: string
  elenco: { nome: string; personagem: string; foto: string | null }[]
  trailer: { chave: string; nome: string } | null
}

export interface Fileira {
  id: string
  titulo: string
  itens: Titulo[]
}

export interface Perfil {
  id: string
  nome: string
  cor: string
  infantil: boolean
}
