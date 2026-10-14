<p align="center">
  <img src="./.github/readme-cover.svg" alt="Movie Shelf: Catálogo por categorias e título em destaque." width="100%" />
</p>

# Catálogo de filmes · React

Interface inspirada na Netflix que apresenta filmes e séries obtidos do TMDB.

Estudo de componentes e consumo de API em React 18 e Vite. Sem afiliação às marcas.

## Explore o diferencial

| Ponto de entrada | O que observar |
| --- | --- |
| [Composição de catálogo](src/App.jsx) | A página combina destaque e fileiras de títulos em componentes distintos. |
| [Navegação em fileiras](src/components/MovieRow/index.jsx) | O componente de lista concentra a apresentação dos títulos por categoria. |

## Destaques

- Listas por categorias e gêneros.
- Destaque de um título.
- Dados em português obtidos pela API.

<details>
<summary><strong>Organização e código</strong></summary>

### Por dentro do código

| Código | O que observar |
| --- | --- |
| [`src/App.jsx`](src/App.jsx) | Composição da página. |
| [`src/Tmdb.jsx`](src/Tmdb.jsx) | Categorias e consultas. |
| [`src/components/MovieRow/index.jsx`](src/components/MovieRow/index.jsx) | Fileira de títulos. |
| [`src/components/FeaturedMovie/index.jsx`](src/components/FeaturedMovie/index.jsx) | Conteúdo em destaque. |

</details>

<details>
<summary><strong>Executar e consultar</strong></summary>

### Executar localmente

Requer Node.js e npm compatíveis com as dependências versionadas.

```bash
git clone https://github.com/Will-Ifes/netflixReactClone.git
cd netflixReactClone
npm install
npm run dev
```

Abra o endereço informado pelo servidor no terminal.

O cliente ainda usa uma chave no arquivo `src/Tmdb.jsx`. Utilize sua própria configuração de API; externalizar esse valor é uma melhoria pendente.

### Comandos disponíveis

| Comando | Script versionado |
| --- | --- |
| `npm run dev` | `vite` |
| `npm run build` | `vite build` |
| `npm run preview` | `vite preview` |

</details>

<details>
<summary>Escopo e referências</summary>

Sem streaming, assinatura ou autenticação. Estados de erro e carregamento precisam ser evoluídos.

</details>

---

Mantido por **Will Oliveira** · [Perfil](https://github.com/Will-Ifes) · [LinkedIn](https://www.linkedin.com/in/wildemberg-de-jesus-oliveira/)
