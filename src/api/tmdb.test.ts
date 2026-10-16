import { describe, expect, it } from 'vitest'
import { escolherDestaque, escolherTrailer, paraTitulo } from './tmdb'

const video = (extra: Partial<Parameters<typeof escolherTrailer>[0][number]>) => ({
  key: 'k',
  name: 'v',
  site: 'YouTube',
  type: 'Clip',
  official: false,
  iso_639_1: 'en',
  ...extra,
})

describe('tmdb', () => {
  it('normaliza filme e série no mesmo formato', () => {
    expect(paraTitulo({ id: 1, title: 'Filme', release_date: '2020-05-01', vote_average: 7.456 }, 'movie')).toMatchObject({
      tipo: 'movie',
      nome: 'Filme',
      ano: '2020',
      nota: 7.5,
    })
    expect(paraTitulo({ id: 2, name: 'Série', first_air_date: '2019-01-01', media_type: 'tv' }, 'movie').tipo).toBe('tv')
  })

  it('prefere trailer oficial em português', () => {
    const escolhido = escolherTrailer([
      video({ key: 'clip', type: 'Clip' }),
      video({ key: 'en', type: 'Trailer', official: true }),
      video({ key: 'pt', type: 'Trailer', iso_639_1: 'pt' }),
    ])
    expect(escolhido?.chave).toBe('pt')
  })

  it('ignora vídeos fora do YouTube e clipes soltos', () => {
    expect(escolherTrailer([video({ site: 'Vimeo', type: 'Trailer' }), video({ type: 'Featurette' })])).toBeNull()
  })

  it('só sorteia destaque com imagem de fundo e sinopse', () => {
    const base = { tipo: 'movie' as const, poster: '/p.jpg', nota: 7, ano: '2020' }
    const fileiras = [
      {
        id: 'a',
        titulo: 'A',
        itens: [
          { ...base, id: 1, nome: 'Sem fundo', fundo: null, sinopse: 'x'.repeat(80) },
          { ...base, id: 2, nome: 'Sem sinopse', fundo: '/f.jpg', sinopse: '' },
          { ...base, id: 3, nome: 'Completo', fundo: '/f.jpg', sinopse: 'x'.repeat(80) },
        ],
      },
    ]
    expect(escolherDestaque(fileiras, () => 0.99)?.nome).toBe('Completo')
    expect(escolherDestaque([], () => 0)).toBeNull()
  })
})
