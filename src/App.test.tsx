import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'
import type { Detalhes, Fileira, Titulo } from './types'

const titulo = (id: number, nome: string, extra: Partial<Titulo> = {}): Titulo => ({
  id,
  tipo: 'movie',
  nome,
  sinopse: 'Uma sinopse longa o bastante para o destaque escolher este título sem problemas.',
  poster: `/p${id}.jpg`,
  fundo: `/f${id}.jpg`,
  nota: 7.5,
  ano: '2024',
  ...extra,
})

const FILEIRAS: Fileira[] = [
  { id: 'acao', titulo: 'Ação', itens: [titulo(1, 'Missão Teste'), titulo(2, 'Corrida Final')] },
  { id: 'comedia', titulo: 'Comédia', itens: [titulo(3, 'Riso Solto')] },
]

const api = vi.hoisted(() => ({
  carregarFileiras: vi.fn(),
  pesquisar: vi.fn(),
  carregarDetalhes: vi.fn(),
}))

vi.mock('./api/tmdb', async (original) => ({ ...(await original<typeof import('./api/tmdb')>()), ...api }))

const { App } = await import('./App')

beforeAll(() => {
  // jsdom não implementa <dialog>
  HTMLDialogElement.prototype.showModal = function () {
    this.setAttribute('open', '')
  }
  HTMLDialogElement.prototype.close = function () {
    this.removeAttribute('open')
    this.dispatchEvent(new Event('close'))
  }
})

beforeEach(() => {
  api.carregarFileiras.mockResolvedValue(FILEIRAS)
  api.pesquisar.mockResolvedValue([titulo(9, 'Resultado da Busca')])
  api.carregarDetalhes.mockImplementation(async (id: number) => ({
    ...FILEIRAS.flatMap((f) => f.itens).find((t) => t.id === id)!,
    generos: ['Ação', 'Aventura'],
    duracao: '2h 5min',
    elenco: [{ nome: 'Ana Atriz', personagem: 'Heroína', foto: null }],
    trailer: id === 1 ? { chave: 'abc123', nome: 'Trailer oficial' } : null,
  }) satisfies Detalhes)
})

async function entrarComo(nome: string) {
  const user = userEvent.setup()
  render(<App />)
  await user.click(screen.getByRole('button', { name: nome }))
  await screen.findByRole('heading', { name: 'Ação' })
  return user
}

describe('Clone de streaming', () => {
  it('começa pela escolha de perfil e mostra o aviso de estudo', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: 'Quem está assistindo?' })).toBeInTheDocument()
    expect(screen.getByRole('complementary', { name: 'Aviso sobre o projeto' })).toHaveTextContent('Clone de estudo não oficial')
  })

  it('carrega as fileiras e um destaque com imagem e sinopse', async () => {
    await entrarComo('Will')
    expect(api.carregarFileiras).toHaveBeenCalledWith(false)
    expect(screen.getByRole('heading', { name: 'Comédia' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Assistir trailer' })).toBeInTheDocument()
  })

  it('o perfil Infantil pede as fileiras infantis', async () => {
    await entrarComo('Infantil')
    expect(api.carregarFileiras).toHaveBeenCalledWith(true)
  })

  it('abre os detalhes, toca o trailer do YouTube sem cookies e fecha com o botão', async () => {
    const user = await entrarComo('Will')
    await user.click(screen.getByRole('button', { name: 'Missão Teste, 2024' }))

    const dialogo = await screen.findByRole('dialog', { name: 'Missão Teste' })
    expect(await within(dialogo).findByText('2h 5min')).toBeInTheDocument()
    const elenco = within(dialogo).getByRole('region', { name: 'Elenco principal' })
    expect(within(elenco).getByText('Ana Atriz')).toBeInTheDocument()

    await user.click(within(dialogo).getByRole('button', { name: 'Assistir trailer' }))
    expect(within(dialogo).getByTitle('Trailer: Trailer oficial')).toHaveAttribute(
      'src',
      expect.stringContaining('youtube-nocookie.com/embed/abc123'),
    )

    await user.click(within(dialogo).getByRole('button', { name: 'Fechar detalhes' }))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('avisa quando o título não tem trailer', async () => {
    const user = await entrarComo('Will')
    await user.click(screen.getByRole('button', { name: 'Riso Solto, 2024' }))
    const dialogo = await screen.findByRole('dialog', { name: 'Riso Solto' })
    expect(await within(dialogo).findByRole('button', { name: /Trailer indisponível/ })).toBeDisabled()
  })

  it('adiciona à Minha Lista, mostra na aba e guarda por perfil', async () => {
    const user = await entrarComo('Will')
    await user.click(screen.getByRole('button', { name: 'Corrida Final, 2024' }))
    const dialogo = await screen.findByRole('dialog')
    await user.click(within(dialogo).getByRole('button', { name: 'Adicionar à Minha Lista' }))
    await user.click(within(dialogo).getByRole('button', { name: 'Fechar detalhes' }))

    expect(screen.getByRole('heading', { name: 'Minha lista' })).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Minha lista' }))
    expect(screen.getByRole('button', { name: 'Corrida Final, 2024, na Minha Lista' })).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /Trocar perfil/ }))
    await user.click(screen.getByRole('button', { name: 'Convidado' }))
    await user.click(await screen.findByRole('button', { name: 'Minha lista' }))
    expect(screen.getByText(/Sua lista está vazia/)).toBeInTheDocument()
  })

  it('busca títulos a partir de duas letras', async () => {
    const user = await entrarComo('Will')
    await user.click(screen.getByRole('button', { name: 'Buscar' }))
    await user.type(screen.getByLabelText('Buscar títulos, pessoas e gêneros'), 'r')
    expect(screen.getByText('Digite pelo menos duas letras.')).toBeInTheDocument()

    await user.type(screen.getByLabelText('Buscar títulos, pessoas e gêneros'), 'esultado')
    expect(await screen.findByRole('button', { name: 'Resultado da Busca, 2024' })).toBeInTheDocument()
    expect(api.pesquisar).toHaveBeenLastCalledWith('resultado', false)
  })

  it('mostra erro com nova tentativa quando o TMDB falha', async () => {
    vi.spyOn(console, 'warn').mockImplementation(() => {})
    api.carregarFileiras.mockRejectedValueOnce(new Error('offline'))
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByRole('button', { name: 'Will' }))

    const alerta = await screen.findByRole('alert')
    expect(alerta).toHaveTextContent('Não foi possível falar com o TMDB')
    await user.click(within(alerta).getByRole('button', { name: 'Tentar de novo' }))
    await waitFor(() => expect(screen.getByRole('heading', { name: 'Ação' })).toBeInTheDocument())
  })
})
