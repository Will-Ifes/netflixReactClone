import { useMemo, useState } from 'react'
import { carregarFileiras, escolherDestaque, pesquisar } from './api/tmdb'
import { Aviso } from './components/Aviso'
import { Cabecalho, type Aba } from './components/Cabecalho'
import { Destaque } from './components/Destaque'
import { Detalhes } from './components/Detalhes'
import { Fileira, Grade } from './components/Fileira'
import { Perfis } from './components/Perfis'
import { Rodape } from './components/Rodape'
import { useAssincrono } from './hooks/useAssincrono'
import { useAtrasado } from './hooks/useAtrasado'
import { useMinhaLista } from './hooks/useMinhaLista'
import { usePerfil } from './hooks/usePerfil'
import type { Perfil, Titulo } from './types'
import './App.css'

export function App() {
  const { perfil, escolher, sair } = usePerfil()
  if (!perfil) return <Perfis onEscolher={escolher} />
  // A chave remonta o catálogo ao trocar de perfil, zerando busca, aba e fileiras
  return <Catalogo key={perfil.id} perfil={perfil} onTrocarPerfil={sair} />
}

function Catalogo({ perfil, onTrocarPerfil }: { perfil: Perfil; onTrocarPerfil: () => void }) {
  const [aba, setAba] = useState<Aba>('inicio')
  const [termo, setTermo] = useState('')
  const [aberto, setAberto] = useState<{ titulo: Titulo; tocar: boolean } | null>(null)
  const lista = useMinhaLista(perfil.id)

  const fileiras = useAssincrono(() => carregarFileiras(perfil.infantil), [perfil.infantil])
  const destaque = useMemo(() => (fileiras?.status === 'ok' ? escolherDestaque(fileiras.dados) : null), [fileiras])

  const termoAtrasado = useAtrasado(termo.trim())
  const busca = useAssincrono(termoAtrasado.length >= 2 ? () => pesquisar(termoAtrasado, perfil.infantil) : null, [termoAtrasado, perfil.infantil])
  const buscando = termo.trim().length > 0

  const abrir = (titulo: Titulo, tocar = false) => setAberto({ titulo, tocar })

  return (
    <>
      <Aviso />
      <Cabecalho perfil={perfil} aba={aba} termo={termo} onAba={setAba} onTermo={setTermo} onTrocarPerfil={onTrocarPerfil} />

      <main id="conteudo" className="catalogo" tabIndex={-1}>
        {buscando ? (
          <section className="pagina-lista" aria-labelledby="busca-titulo">
            <h1 id="busca-titulo">Resultados para “{termo.trim()}”</h1>
            <div role="status" aria-live="polite">
              {termoAtrasado.length < 2 && <p className="pagina-lista__vazio">Digite pelo menos duas letras.</p>}
              {busca?.status === 'carregando' && <p className="pagina-lista__vazio">Buscando…</p>}
              {busca?.status === 'erro' && <p className="pagina-lista__vazio">A busca falhou. Tente de novo em instantes.</p>}
              {busca?.status === 'ok' && busca.dados.length === 0 && (
                <p className="pagina-lista__vazio">Nada encontrado. Tente outro nome ou gênero.</p>
              )}
            </div>
            {busca?.status === 'ok' && <Grade itens={busca.dados} naLista={lista.contem} onAbrir={(t) => abrir(t)} />}
          </section>
        ) : aba === 'lista' ? (
          <section className="pagina-lista" aria-labelledby="lista-titulo">
            <h1 id="lista-titulo">Minha lista</h1>
            {lista.itens.length === 0 ? (
              <p className="pagina-lista__vazio">
                Sua lista está vazia. Use o botão <strong>+</strong> no destaque ou nos detalhes de um título para guardar o que quer ver.
              </p>
            ) : (
              <Grade itens={lista.itens} naLista={lista.contem} onAbrir={(t) => abrir(t)} />
            )}
          </section>
        ) : (
          <>
            {destaque ? (
              <Destaque
                titulo={destaque}
                naLista={lista.contem(destaque)}
                onTrailer={() => abrir(destaque, true)}
                onDetalhes={() => abrir(destaque)}
                onAlternarLista={() => lista.alternar(destaque)}
              />
            ) : (
              <div className="destaque destaque--esqueleto" aria-hidden="true" />
            )}

            <div className="fileiras">
              {fileiras?.status === 'erro' && (
                <p className="pagina-lista__vazio" role="alert">
                  Não foi possível falar com o TMDB.{' '}
                  <button type="button" className="botao botao--cinza" onClick={fileiras.tentarDeNovo}>
                    Tentar de novo
                  </button>
                </p>
              )}
              {fileiras?.status === 'carregando' && <p className="sr-only" role="status">Carregando catálogo…</p>}
              {lista.itens.length > 0 && (
                <Fileira id="minha-lista" titulo="Minha lista" itens={lista.itens} naLista={lista.contem} onAbrir={(t) => abrir(t)} />
              )}
              {fileiras?.status === 'ok' &&
                fileiras.dados.map((f) => <Fileira key={f.id} id={f.id} titulo={f.titulo} itens={f.itens} naLista={lista.contem} onAbrir={(t) => abrir(t)} />)}
            </div>
          </>
        )}
      </main>

      <Rodape />

      {aberto && (
        <Detalhes
          key={`${aberto.titulo.tipo}-${aberto.titulo.id}`}
          titulo={aberto.titulo}
          tocarAoAbrir={aberto.tocar}
          naLista={lista.contem(aberto.titulo)}
          onAlternarLista={lista.alternar}
          onFechar={() => setAberto(null)}
        />
      )}
    </>
  )
}
