import './styles.css'

export function Rodape() {
  return (
    <footer className="rodape" id="sobre">
      <h2>Sobre este projeto</h2>
      <ul>
        <li>
          <strong>Clone de estudo não oficial</strong>, sem vínculo, patrocínio ou autorização da Netflix. Netflix é marca
          registrada da Netflix, Inc.
        </li>
        <li>
          <strong>Sem fins lucrativos.</strong> Não há assinatura, cobrança nem reprodução de filmes. Os trailers são vídeos
          públicos do YouTube.
        </li>
        <li>
          Dados e imagens do <a href="https://www.themoviedb.org/" target="_blank" rel="noopener noreferrer">TMDB</a>. Este
          produto usa a API do TMDB, mas não é endossado nem certificado por ele.
        </li>
        <li>Perfis e Minha Lista ficam só neste navegador. Nenhum dado pessoal é coletado.</li>
      </ul>
      <p>
        Feito por <a href="https://github.com/Will-Ifes" target="_blank" rel="noopener noreferrer">Will Oliveira</a> a partir
        de um curso da B7Web e revisado em 2026.
      </p>
    </footer>
  )
}
