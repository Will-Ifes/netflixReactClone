import './styles.css'

/** Logotipo em texto, sem usar a imagem oficial da marca. */
export function Marca({ tamanho = 'm' }: { tamanho?: 'm' | 'g' }) {
  return (
    <span className="marca" data-tamanho={tamanho}>
      Netflix<span className="marca__selo">estudo</span>
    </span>
  )
}
