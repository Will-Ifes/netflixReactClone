import React, {useState} from "react";
import './MovieRow.css'
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';


// - title - e - items - são props que estão sendo passadas dentro do - app.jsx - 
export function  MovieRow ({title, items}) {

    const [scrollX, setScrollX] = useState(0)

    const handleLeftArrow = () => {
        let x = scrollX + Math.round(window.innerWidth/2)
        if (x > 0) {
            x = 0
        }
        setScrollX(x)
    }

    const handleRightArrow = () => {
        let x = scrollX - Math.round(window.innerWidth/2)
        let listW = items.results.length * 150
        if ((window.innerWidth - listW) > x) {
            x = (window.innerWidth - listW) - 60
        }
        setScrollX(x)
        
    }

    return (
        <div className="movieRow">
            <h2>{title}</h2>
            <div className="movieRow-left" onClick={handleLeftArrow}>
                <NavigateBeforeIcon styles={{fontSize: 50}} />
            </div>
            <div className="movieRow-right" onClick={handleRightArrow}>
                <NavigateNextIcon styles={{fontSize: 50}}/>
            </div>


            <div className="movieRow-listarea">
                <div className="movieRow-list" style={ {marginLeft: scrollX, width: items.results.length * 150}}>
                    {items.results.length > 0 && items.results.map((item, key) => (
                    // - poster_path - é o complemento do link da imagem vindo da API
                        <div key={key} className="movieRow-item">
                            { //Utilizção de três div para fazer efeito de rolagem lateral uma para a lista e outra para o item. 
                            }
                            <img src={`https://image.tmdb.org/t/p/w300${item.poster_path}`} alt={item.original_title}/>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}