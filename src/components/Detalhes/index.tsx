import { Check, Play, Plus, X } from '@phosphor-icons/react'
import { useEffect, useRef, useState } from 'react'
import { carregarDetalhes, imagem } from '../../api/tmdb'
import { useAssincrono } from '../../hooks/useAssincrono'
import type { Detalhes as DetalhesDados, Titulo } from '../../types'
import './styles.css'

interface DetalhesProps {
  titulo: Titulo
  tocarAoAbrir: boolean
  naLista: boolean
  onAlternarLista: (t: Titulo) => void
  onFechar: () => void
}

/** Ficha do título num <dialog> modal: o navegador cuida do foco e do Esc. */
export function Detalhes({ titulo, tocarAoAbrir, naLista, onAlternarLista, onFechar }: DetalhesProps) {
  const dialogo = useRef<HTMLDialogElement>(null)
  const estado = useAssincrono(() => carregarDetalhes(titulo.id, titulo.tipo), [titulo.id, titulo.tipo])
  const [tocando, setTocando] = useState(tocarAoAbrir)

  useEffect(() => {
    const el = dialogo.current
    if (el && !el.open) el.showModal()
  }, [])

  const dados: DetalhesDados | null = estado?.status === 'ok' ? estado.dados : null
  const trailer = dados?.trailer

  return (
    <dialog
      ref={dialogo}
      className="detalhes"
      aria-labelledby="detalhes-nome"
      onClose={onFechar}
      onClick={(e) => e.target === e.currentTarget && dialogo.current?.close()}
    >
      <div className="detalhes__midia">
        {tocando && trailer ? (
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${trailer.chave}?autoplay=1&rel=0&cc_lang_pref=pt&hl=pt-BR`}
            title={`Trailer: ${trailer.nome}`}
            allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
          />
        ) : (
          <>
            <img src={imagem(titulo.fundo ?? titulo.poster, 'w1280') ?? ''} alt="" />
            <div className="detalhes__sombra" />
          </>
        )}
        <button type="button" className="detalhes__fechar" onClick={() => dialogo.current?.close()} aria-label="Fechar detalhes">
          <X size={22} aria-hidden="true" />
        </button>
        {!tocando && (
          <div className="detalhes__chamada">
            <h2 id="detalhes-nome">{titulo.nome}</h2>
            <div className="detalhes__acoes">
              <button
                type="button"
                className="botao botao--branco"
                onClick={() => setTocando(true)}
                disabled={!trailer}
                aria-describedby={dados && !trailer ? 'sem-trailer' : undefined}
              >
                <Play size={22} weight="fill" aria-hidden="true" /> {trailer ? 'Assistir trailer' : estado?.status === 'carregando' ? 'Carregando…' : 'Trailer indisponível'}
              </button>
              <button
                type="button"
                className="botao botao--icone"
                aria-pressed={naLista}
                onClick={() => onAlternarLista(titulo)}
                aria-label={naLista ? 'Tirar da Minha Lista' : 'Adicionar à Minha Lista'}
              >
                {naLista ? <Check size={20} aria-hidden="true" /> : <Plus size={20} aria-hidden="true" />}
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="detalhes__corpo">
        {tocando && <h2 id="detalhes-nome" className="detalhes__titulo-tocando">{titulo.nome}</h2>}
        {estado?.status === 'carregando' && <p className="detalhes__estado">Carregando detalhes…</p>}
        {estado?.status === 'erro' && (
          <p className="detalhes__estado">
            Não foi possível carregar os detalhes.{' '}
            <button type="button" className="detalhes__tentar" onClick={estado.tentarDeNovo}>
              Tentar de novo
            </button>
          </p>
        )}
        {dados && (
          <>
            <p className="detalhes__meta">
              <span className="detalhes__nota">{dados.nota.toFixed(1)} pontos</span>
              {dados.ano && <span>{dados.ano}</span>}
              {dados.duracao && <span>{dados.duracao}</span>}
              <span className="detalhes__tipo">{dados.tipo === 'tv' ? 'Série' : 'Filme'}</span>
            </p>
            {dados && !trailer && (
              <p id="sem-trailer" className="detalhes__aviso">
                O TMDB não tem trailer em português ou inglês para este título.
              </p>
            )}
            <div className="detalhes__colunas">
              <p className="detalhes__sinopse">{dados.sinopse || 'Sinopse não disponível em português.'}</p>
              <dl className="detalhes__ficha">
                {dados.generos.length > 0 && (
                  <div>
                    <dt>Gêneros</dt>
                    <dd>{dados.generos.join(', ')}</dd>
                  </div>
                )}
                {dados.elenco.length > 0 && (
                  <div>
                    <dt>Elenco</dt>
                    <dd>{dados.elenco.slice(0, 4).map((p) => p.nome).join(', ')}</dd>
                  </div>
                )}
              </dl>
            </div>
            {dados.elenco.length > 0 && (
              <section aria-labelledby="elenco-titulo">
                <h3 id="elenco-titulo">Elenco principal</h3>
                <ul className="detalhes__elenco">
                  {dados.elenco.map((p) => (
                    <li key={p.nome + p.personagem}>
                      {p.foto ? (
                        <img src={imagem(p.foto, 'w185') ?? ''} alt="" loading="lazy" />
                      ) : (
                        <span className="detalhes__sem-foto" aria-hidden="true">
                          {p.nome[0]}
                        </span>
                      )}
                      <strong>{p.nome}</strong>
                      {p.personagem && <span>{p.personagem}</span>}
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </>
        )}
      </div>
    </dialog>
  )
}
