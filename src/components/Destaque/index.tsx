import { Check, Info, Play, Plus } from '@phosphor-icons/react'
import { imagem } from '../../api/tmdb'
import type { Titulo } from '../../types'
import './styles.css'

interface DestaqueProps {
  titulo: Titulo
  naLista: boolean
  onTrailer: () => void
  onDetalhes: () => void
  onAlternarLista: () => void
}

const resumir = (texto: string, limite = 220) => (texto.length > limite ? texto.slice(0, texto.lastIndexOf(' ', limite)) + '…' : texto)

export function Destaque({ titulo, naLista, onTrailer, onDetalhes, onAlternarLista }: DestaqueProps) {
  return (
    <section className="destaque" aria-labelledby="destaque-nome" style={{ backgroundImage: `url(${imagem(titulo.fundo, 'original')})` }}>
      <div className="destaque__sombra">
        <div className="destaque__conteudo">
          <p className="destaque__tipo">{titulo.tipo === 'tv' ? 'Série' : 'Filme'} em destaque</p>
          <h1 id="destaque-nome">{titulo.nome}</h1>
          <p className="destaque__meta">
            <span className="destaque__nota">{titulo.nota.toFixed(1)} pontos</span>
            {titulo.ano && <span>{titulo.ano}</span>}
          </p>
          <p className="destaque__sinopse">{resumir(titulo.sinopse)}</p>
          <div className="destaque__acoes">
            <button type="button" className="botao botao--branco" onClick={onTrailer}>
              <Play size={22} weight="fill" aria-hidden="true" /> Assistir trailer
            </button>
            <button type="button" className="botao botao--cinza" onClick={onDetalhes}>
              <Info size={22} aria-hidden="true" /> Mais informações
            </button>
            <button
              type="button"
              className="botao botao--icone"
              aria-pressed={naLista}
              onClick={onAlternarLista}
              aria-label={naLista ? `Tirar ${titulo.nome} da Minha Lista` : `Adicionar ${titulo.nome} à Minha Lista`}
            >
              {naLista ? <Check size={20} aria-hidden="true" /> : <Plus size={20} aria-hidden="true" />}
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
