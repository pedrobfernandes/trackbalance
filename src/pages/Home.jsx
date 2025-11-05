import { useEffect } from "react";
import { useNavigate } from "react-router";

import "./Home.css";

export default function Home()
{
    const navigate = useNavigate();
    
    
    function goToLogin()
    {
        navigate("/auth");
    }
    
    useEffect(() =>
    {
        document.title = "TrackBalance - Home";
    
    }, []);
    
    
    return(
        <div className="home-container">
        
            <main className="home-main">
            
                <h1>TrackBalance - Home</h1>
                <p>
                    Uma aplicação simples para controlar receitas e despesas.
                    Projeto de aprendizado e portfólio.
                </p>
                <button
                    type="button"
                    onClick={goToLogin}
                    aria-label="Ir para a página de login e criação de conta"
                >
                    Login
                </button>
            </main>
            
            <footer className="home-footer" >
                <p className="author-link">
                    <span className="copyright">&copy; 2025</span>
                    <a
                        href="https://github.com/pedrobfernandes"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Pedro Fernandes
                        (abre em nova aba)
                    </a>
                </p>
            </footer>
            
        </div>
    );
}
