import './styles.css'

/** Faixa sempre visível: deixa claro que é um clone de estudo, não o serviço real. */
export function Aviso() {
  return (
    <aside className="aviso" aria-label="Aviso sobre o projeto">
      <p>
        <strong>Clone de estudo não oficial, sem fins lucrativos.</strong> Não tem vínculo com a Netflix e não reproduz
        filmes; os trailers vêm do YouTube.{' '}
        <a href="#sobre">Saiba mais</a>
      </p>
    </aside>
  )
}
