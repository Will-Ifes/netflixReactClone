import React, { useEffect, useState } from "react"
import Tmdb from "./Tmdb"
import {MovieRow} from './components/MovieRow'
import {Header} from './components/Header'
import {FeaturedMovie} from './components/FeaturedMovie'

import './App.css'
/*
  a Função - useEffect - executa o que está nela quando a tela for carregada.

  a Função - useState - serve para salvar a lista recebida.
*/

export function App() {
  const [movieList, setMovieList] = useState([])
  const [featuredData, setFeaturedData] = useState(null)
  const [blackHeader, setBlackHeader] = useState(false)

  useEffect(() => { 
    const loadAll = async () => {
      // Pegando a lista Total
      let listTmdb = await Tmdb.getHomeList()
      setMovieList(listTmdb)

      // Pegando o Featured
      let originals = listTmdb.filter(i => i.slug === 'originals')
      let randomChosen = Math.floor(Math.random() * ((originals[0].items.results.length) -1))
      
      // if(randomChosen == 18) {
      //   notNull()
      // }
      // function notNull() {      
      //   randomChosen = 2
      //   if(randomChosen == 18) {
      //     notNull()
      //   }
      // }

      let chosen = originals[0].items.results[randomChosen]
      let chosenInfo = await Tmdb.getMovieInfo(chosen.id, 'tv')
      setFeaturedData(chosenInfo)
    }

    loadAll()
      const scrollListener = () => {
        if(window.scrollY > 10) {
          setBlackHeader(true)
        } else {
          setBlackHeader(false)
        }
      }

      window.addEventListener('scroll', scrollListener)

      return () => {
        window.removeEventListener('scroll', scrollListener)
      }
  }, [])


  useEffect(() => {

  }, [])

  return (
    <div className="page">

      
      <Header black ={blackHeader}/>

      {featuredData &&
        <FeaturedMovie item={featuredData}/>
      }

      <section className="lists">
        {movieList.map((item, key) => (
          // todo - map - precisa de uma prop do tipo key por isso use - key = {key} -
          <MovieRow key = {key} title = {item.title} items = {item.items}/>
        ))}
        
      </section>

      <div className="background-footer"></div>
      <footer>
        
        Feito com <span role="img" aria-label="coração">❤️</span> pelo Wildemberg e instruido pela B7Web <br />
        Direitos de Imagem para Netflix <br />
        Dados pegos na API do site Themoviedb.org
      </footer>

      {movieList.length <= 0 &&
        <div className="loading">
          <img src="https://assets.wired.com/photos/w_600/wp-content/uploads/2016/01/Netflix_LoadTime.gif" />
        </div>
      }
      
    </div>
  )
}


