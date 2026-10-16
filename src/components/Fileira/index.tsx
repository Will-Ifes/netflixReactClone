import { Check, CaretLeft, CaretRight } from '@phosphor-icons/react'
import { useRef } from 'react'
import { imagem } from '../../api/tmdb'
import type { Titulo } from '../../types'
import './styles.css'

interface CardProps {
  titulo: Titulo
  naLista: boolean
  onAbrir: () => void
}

export function Card({ titulo, naLista, onAbrir }: CardProps) {
  return (
    <button type="button" className="card" onClick={onAbrir} aria-label={`${titulo.nome}${titulo.ano ? `, ${titulo.ano}` : ''}${naLista ? ', na Minha Lista' : ''}`}>
      <img src={imagem(titulo.poster, 'w342') ?? ''} alt="" loading="lazy" width={342} height={513} />
      {naLista && (
        <span className="card__selo" aria-hidden="true">
          <Check size={14} weight="bold" />
        </span>
      )}
    </button>
  )
}

interface FileiraProps {
  id: string
  titulo: string
  itens: Titulo[]
  naLista: (t: Titulo) => boolean
  onAbrir: (t: Titulo) => void
}

/** Rolagem nativa (toque, trackpad e teclado) com setas que andam uma página por vez. */
export function Fileira({ id, titulo, itens, naLista, onAbrir }: FileiraProps) {
  const trilho = useRef<HTMLUListElement>(null)
  const rolar = (sentido: 1 | -1) => trilho.current?.scrollBy({ left: sentido * trilho.current.clientWidth * 0.85, behavior: 'smooth' })

  return (
    <section className="fileira" aria-labelledby={`fileira-${id}`}>
      <h2 id={`fileira-${id}`}>{titulo}</h2>
      <div className="fileira__area">
        <button type="button" className="fileira__seta fileira__seta--esquerda" onClick={() => rolar(-1)} aria-label={`Voltar em ${titulo}`}>
          <CaretLeft size={36} aria-hidden="true" />
        </button>
        <ul ref={trilho} className="fileira__trilho">
          {itens.map((t) => (
            <li key={`${t.tipo}-${t.id}`}>
              <Card titulo={t} naLista={naLista(t)} onAbrir={() => onAbrir(t)} />
            </li>
          ))}
        </ul>
        <button type="button" className="fileira__seta fileira__seta--direita" onClick={() => rolar(1)} aria-label={`Avançar em ${titulo}`}>
          <CaretRight size={36} aria-hidden="true" />
        </button>
      </div>
    </section>
  )
}

export function Grade({ itens, naLista, onAbrir }: Omit<FileiraProps, 'id' | 'titulo'>) {
  return (
    <ul className="grade">
      {itens.map((t) => (
        <li key={`${t.tipo}-${t.id}`}>
          <Card titulo={t} naLista={naLista(t)} onAbrir={() => onAbrir(t)} />
        </li>
      ))}
    </ul>
  )
}
