const API_KEY = '0bcc49e19e18f892f0c1751eb31a7f72'
const API_BASE = 'https://api.themoviedb.org/3'
/*
    Lista de consumo da API

    - originais da netflix
    - recomendados (trending)
    - em alta (top rated)
    - ação
    - comédia
    - terror
    - romance
    - documentários


    pegar dados da netflix pelo TMDB <-- items: await basicFetch(`/discover/tv?with_network=213`)

    Colocar no idioma PT-BR <-- &language=pt-BR

    usar chave de acesso a api <-- &api_key=${API_KEY}
*/

const basicFetch = async (endpoint) => {
    const request = await fetch(`${API_BASE}${endpoint}`)
    const get_json = await request.json()

    return get_json
}

export default {
    getHomeList: async () => {
        return [
            {
                slug: 'originals',
                title: 'Originais do Netflix',
                items: await basicFetch(`/discover/tv?with_network=213&language=pt-BR&api_key=${API_KEY}`)
            },
            {
                slug: 'trending',
                title: 'Recomendados para Você',
                items: await basicFetch(`/trending/all/week?language=pt-BR&api_key=${API_KEY}`),
            },
            {
                slug: 'toprated',
                title: 'Em Alta',
                items: await basicFetch(`/movie/top_rated?language=pt-BR&api_key=${API_KEY}`),
            },
            {
                slug: 'action',
                title: 'Em Alta',
                items: await basicFetch(`/discover/movie?with_genres=28&language=pt-BR&api_key=${API_KEY}`),
            },            
            {
                slug: 'comedy',
                title: 'Comédia',
                items: await basicFetch(`/discover/movie?with_genres=35&language=pt-BR&api_key=${API_KEY}`),
            },            
            {
                slug: 'horror',
                title: 'Terror',
                items: await basicFetch(`/discover/movie?with_genres=27&language=pt-BR&api_key=${API_KEY}`),
            },
            {
                slug: 'romance',
                title: 'Romance',
                items: await basicFetch(`/discover/movie?with_genres=10749&language=pt-BR&api_key=${API_KEY}`),
            },            
            {
                slug: 'documentary',
                title: 'Documentários',
                items: await basicFetch(`/discover/movie?with_genres=99&language=pt-BR&api_key=${API_KEY}`),
            }
        ]
    },

    getMovieInfo: async (movieId, type) => {
        let info = {}

        if (movieId) {
            switch (type) {
                case 'movie':
                    info = await basicFetch(`/movie/${movieId}?language=pt-BR&api_key=${API_KEY}`)
                break

                case 'tv':
                    info = await basicFetch(`/tv/${movieId}?language=pt-BR&api_key=${API_KEY}`)
                break

                default: 
                    info = null
                break
            }
        }

        return info
    }
}