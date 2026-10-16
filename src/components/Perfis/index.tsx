import { Smiley } from '@phosphor-icons/react'
import { PERFIS } from '../../hooks/usePerfil'
import { Aviso } from '../Aviso'
import { Marca } from '../Marca'
import './styles.css'

export function AvatarPerfil({ cor, tamanho = 'g' }: { cor: string; tamanho?: 'p' | 'g' }) {
  return (
    <span className="avatar-perfil" data-tamanho={tamanho} style={{ background: cor }} aria-hidden="true">
      <Smiley weight="fill" />
    </span>
  )
}

export function Perfis({ onEscolher }: { onEscolher: (id: string) => void }) {
  return (
    <>
      <Aviso />
      <div className="perfis">
        <header className="perfis__topo">
          <Marca />
        </header>
        <main className="perfis__conteudo">
          <h1>Quem está assistindo?</h1>
          <ul className="perfis__lista">
            {PERFIS.map((p) => (
              <li key={p.id}>
                <button type="button" className="perfis__perfil" onClick={() => onEscolher(p.id)}>
                  <AvatarPerfil cor={p.cor} />
                  <span>{p.nome}</span>
                </button>
              </li>
            ))}
          </ul>
          <p className="perfis__nota">Perfis fictícios. Cada um tem a sua própria Minha Lista; o Infantil mostra animações e títulos para a família.</p>
        </main>
      </div>
    </>
  )
}
