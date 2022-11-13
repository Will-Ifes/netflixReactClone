import React from "react";
import './Header.css'

export function Header({black}) {
    return (
        <header className={black ? 'black' : ''}>
            <div className="header-logo">
                <a href="/">
                    <img src="https://logospng.org/download/netflix/logo-netflix-4096.png" alt="Logo Netflix" />
                </a>
            </div>
            <div className="header-user">
                <a href="/">
                    <img src="https://lh3.googleusercontent.com/-chiYibzOiSU/AAAAAAAAAAI/AAAAAAAAAB8/CzmmvSHKy38/photo.jpg" alt="Imagem de Perfil fda Netflix" />
                </a>
            </div>
        </header>
    )
}