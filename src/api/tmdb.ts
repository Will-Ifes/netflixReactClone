import type { Detalhes, Fileira, TipoMidia, Titulo } from '../types'

// Public key that shipped with the original course; override with VITE_TMDB_KEY.
const CHAVE = import.meta.env.VITE_TMDB_KEY ?? '0bcc49e19e18f892f0c1751eb31a7f72'
const BASE = 'https://api.themoviedb.org/3'
const IMAGEM = 'https://image.tmdb.org/t/p'

export const imagem = (caminho: string | null, tamanho: 'w185' | 'w342' | 'w780' | 'w1280' | 'original') =>
  caminho ? `${IMAGEM}/${tamanho}${caminho}` : null

async function buscar<T>(caminho: string, params: Record<string, string> = {}): Promise<T> {
  const url = new URL(BASE + caminho)
  url.search = new URLSearchParams({ language: 'pt-BR', include_adult: 'false', ...params, api_key: CHAVE }).toString()
  const resposta = await fetch(url)
  if (!resposta.ok) throw new Error(`TMDB respondeu ${resposta.status} em ${caminho}`)
  return resposta.json() as Promise<T>
}

interface ItemBruto {
  id: number
  media_type?: string
  title?: string
  name?: string
  overview?: string
  poster_path?: string | null
  backdrop_path?: string | null
  vote_average?: number
  release_date?: string
  first_air_date?: string
}

export function paraTitulo(item: ItemBruto, tipoPadrao: TipoMidia): Titulo {
  const tipo: TipoMidia = item.media_type === 'tv' || item.media_type === 'movie' ? item.media_type : tipoPadrao
  return {
    id: item.id,
    tipo,
    nome: item.title ?? item.name ?? 'Sem título',
    sinopse: item.overview ?? '',
    poster: item.poster_path ?? null,
    fundo: item.backdrop_path ?? null,
    nota: Math.round((item.vote_average ?? 0) * 10) / 10,
    ano: (item.release_date ?? item.first_air_date ?? '').slice(0, 4),
  }
}

interface DefinicaoFileira {
  id: string
  titulo: string
  caminho: string
  tipo: TipoMidia
  params?: Record<string, string>
}

const FILEIRAS: DefinicaoFileira[] = [
  { id: 'originais', titulo: 'Originais Netflix', caminho: '/discover/tv', tipo: 'tv', params: { with_networks: '213' } },
  { id: 'em-alta', titulo: 'Em alta esta semana', caminho: '/trending/all/week', tipo: 'movie' },
  { id: 'aclamados', titulo: 'Aclamados pela crítica', caminho: '/movie/top_rated', tipo: 'movie' },
  { id: 'acao', titulo: 'Ação', caminho: '/discover/movie', tipo: 'movie', params: { with_genres: '28' } },
  { id: 'comedia', titulo: 'Comédia', caminho: '/discover/movie', tipo: 'movie', params: { with_genres: '35' } },
  { id: 'terror', titulo: 'Terror', caminho: '/discover/movie', tipo: 'movie', params: { with_genres: '27' } },
  { id: 'romance', titulo: 'Romance', caminho: '/discover/movie', tipo: 'movie', params: { with_genres: '10749' } },
  { id: 'documentarios', titulo: 'Documentários', caminho: '/discover/movie', tipo: 'movie', params: { with_genres: '99' } },
]

const FILEIRAS_INFANTIS: DefinicaoFileira[] = [
  { id: 'animacao', titulo: 'Animação', caminho: '/discover/movie', tipo: 'movie', params: { with_genres: '16', certification_country: 'BR', 'certification.lte': 'L' } },
  { id: 'familia', titulo: 'Para a família', caminho: '/discover/movie', tipo: 'movie', params: { with_genres: '10751' } },
  { id: 'desenhos', titulo: 'Desenhos', caminho: '/discover/tv', tipo: 'tv', params: { with_genres: '16', with_original_language: 'en' } },
  { id: 'kids', titulo: 'Séries infantis', caminho: '/discover/tv', tipo: 'tv', params: { with_genres: '10762' } },
]

/** Carrega as fileiras em paralelo; uma fileira que falhar some, sem derrubar a página. */
export async function carregarFileiras(infantil: boolean): Promise<Fileira[]> {
  const definicoes = infantil ? FILEIRAS_INFANTIS : FILEIRAS
  const resultados = await Promise.allSettled(
    definicoes.map(async (d) => {
      const dados = await buscar<{ results: ItemBruto[] }>(d.caminho, d.params)
      const itens = dados.results.filter((i) => i.poster_path).map((i) => paraTitulo(i, d.tipo))
      return { id: d.id, titulo: d.titulo, itens }
    }),
  )
  const fileiras = resultados.flatMap((r) => (r.status === 'fulfilled' && r.value.itens.length ? [r.value] : []))
  if (fileiras.length === 0) throw new Error('Nenhuma fileira carregou')
  return fileiras
}

/** Sorteia um destaque que tenha imagem de fundo e sinopse (o original às vezes caía num item vazio). */
export function escolherDestaque(fileiras: Fileira[], sortear = Math.random): Titulo | null {
  const candidatos = fileiras.flatMap((f) => f.itens).filter((t) => t.fundo && t.sinopse.length > 40)
  if (candidatos.length === 0) return null
  return candidatos[Math.floor(sortear() * candidatos.length)] ?? null
}

interface VideoBruto {
  key: string
  name: string
  site: string
  type: string
  official: boolean
  iso_639_1: string
}

/** Prefere trailer oficial dublado/legendado em português, depois em inglês, depois teaser. */
export function escolherTrailer(videos: VideoBruto[]): Detalhes['trailer'] {
  const doYoutube = videos.filter((v) => v.site === 'YouTube')
  const pontuar = (v: VideoBruto) =>
    (v.type === 'Trailer' ? 4 : v.type === 'Teaser' ? 2 : 0) + (v.iso_639_1 === 'pt' ? 2 : 0) + (v.official ? 1 : 0)
  const melhor = [...doYoutube].sort((a, b) => pontuar(b) - pontuar(a))[0]
  return melhor && pontuar(melhor) >= 2 ? { chave: melhor.key, nome: melhor.name } : null
}

interface DetalhesBrutos extends ItemBruto {
  genres?: { name: string }[]
  runtime?: number | null
  number_of_seasons?: number
  videos?: { results: VideoBruto[] }
  credits?: { cast: { name: string; character: string; profile_path: string | null }[] }
  aggregate_credits?: { cast: { name: string; roles?: { character: string }[]; profile_path: string | null }[] }
}

function duracao(d: DetalhesBrutos, tipo: TipoMidia): string {
  if (tipo === 'tv') {
    const n = d.number_of_seasons ?? 0
    return n ? `${n} ${n === 1 ? 'temporada' : 'temporadas'}` : ''
  }
  const minutos = d.runtime ?? 0
  if (!minutos) return ''
  const h = Math.floor(minutos / 60)
  return h ? `${h}h ${minutos % 60}min` : `${minutos}min`
}

export async function carregarDetalhes(id: number, tipo: TipoMidia): Promise<Detalhes> {
  const d = await buscar<DetalhesBrutos>(`/${tipo}/${id}`, {
    append_to_response: tipo === 'tv' ? 'videos,aggregate_credits' : 'videos,credits',
    include_video_language: 'pt,en,null',
  })
  const elencoBruto =
    tipo === 'tv'
      ? (d.aggregate_credits?.cast ?? []).map((c) => ({ name: c.name, character: c.roles?.[0]?.character ?? '', profile_path: c.profile_path }))
      : (d.credits?.cast ?? [])

  return {
    ...paraTitulo(d, tipo),
    tipo,
    generos: (d.genres ?? []).map((g) => g.name),
    duracao: duracao(d, tipo),
    elenco: elencoBruto.slice(0, 8).map((c) => ({ nome: c.name, personagem: c.character, foto: c.profile_path })),
    trailer: escolherTrailer(d.videos?.results ?? []),
  }
}

export async function pesquisar(termo: string, infantil: boolean): Promise<Titulo[]> {
  const dados = await buscar<{ results: ItemBruto[] }>('/search/multi', { query: termo })
  const titulos = dados.results
    .filter((i) => (i.media_type === 'movie' || i.media_type === 'tv') && i.poster_path)
    .map((i) => paraTitulo(i, 'movie'))
  // Search has no age rating; the kids profile only sees well-rated results here.
  return infantil ? titulos.filter((t) => t.nota >= 6) : titulos
}
