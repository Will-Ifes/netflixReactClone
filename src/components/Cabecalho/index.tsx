import { MagnifyingGlass, X } from '@phosphor-icons/react'
import { useEffect, useRef, useState } from 'react'
import type { Perfil } from '../../types'
import { Marca } from '../Marca'
import { AvatarPerfil } from '../Perfis'
import './styles.css'

export type Aba = 'inicio' | 'lista'

interface CabecalhoProps {
  perfil: Perfil
  aba: Aba
  termo: string
  onAba: (aba: Aba) => void
  onTermo: (termo: string) => void
  onTrocarPerfil: () => void
}

export function Cabecalho({ perfil, aba, termo, onAba, onTermo, onTrocarPerfil }: CabecalhoProps) {
  const [solido, setSolido] = useState(false)
  const [buscaAberta, setBuscaAberta] = useState(Boolean(termo))
  const campo = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const aoRolar = () => setSolido(window.scrollY > 10)
    aoRolar()
    window.addEventListener('scroll', aoRolar, { passive: true })
    return () => window.removeEventListener('scroll', aoRolar)
  }, [])

  function abrirBusca() {
    setBuscaAberta(true)
    requestAnimationFrame(() => campo.current?.focus())
  }

  function fecharBusca() {
    onTermo('')
    setBuscaAberta(false)
  }

  return (
    <header className="cabecalho" data-solido={solido || undefined}>
      <a href="#conteudo" className="cabecalho__pular">
        Pular para o conteúdo
      </a>
      <button type="button" className="cabecalho__marca" onClick={() => { fecharBusca(); onAba('inicio') }} aria-label="Início">
        <Marca />
      </button>

      <nav aria-label="Principal">
        <ul className="cabecalho__abas">
          {(['inicio', 'lista'] as const).map((a) => (
            <li key={a}>
              <button
                type="button"
                aria-current={aba === a && !termo ? 'page' : undefined}
                onClick={() => {
                  fecharBusca()
                  onAba(a)
                }}
              >
                {a === 'inicio' ? 'Início' : 'Minha lista'}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <div className="cabecalho__direita">
        <div role="search" className="cabecalho__busca" data-aberta={buscaAberta || undefined}>
          {buscaAberta ? (
            <>
              <MagnifyingGlass size={20} aria-hidden="true" />
              <label htmlFor="busca" className="sr-only">
                Buscar títulos, pessoas e gêneros
              </label>
              <input
                ref={campo}
                id="busca"
                type="search"
                placeholder="Títulos, gêneros"
                value={termo}
                onChange={(e) => onTermo(e.target.value)}
                onKeyDown={(e) => e.key === 'Escape' && fecharBusca()}
              />
              <button type="button" className="cabecalho__icone" onClick={fecharBusca} aria-label="Fechar busca">
                <X size={18} aria-hidden="true" />
              </button>
            </>
          ) : (
            <button type="button" className="cabecalho__icone" onClick={abrirBusca} aria-label="Buscar">
              <MagnifyingGlass size={22} aria-hidden="true" />
            </button>
          )}
        </div>

        <button type="button" className="cabecalho__perfil" onClick={onTrocarPerfil} aria-label={`Perfil ${perfil.nome}. Trocar perfil`}>
          <AvatarPerfil cor={perfil.cor} tamanho="p" />
          <span className="cabecalho__perfil-nome" aria-hidden="true">
            {perfil.nome}
          </span>
        </button>
      </div>
    </header>
  )
}
