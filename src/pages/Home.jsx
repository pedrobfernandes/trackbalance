import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import AuthModal from "../components/AuthModal";
import CalculatorIllustration from "../components/CalculatorIllustration";

import "./Home.css";


export default function Home()
{
    const [isAuthFormOpen, setIsAuthFormOpen] = useState(false);
    const navigate = useNavigate();
       
    
    function goToOverview()
    {
        setIsAuthFormOpen(false);
        navigate("/overview");
    }

    
    return(
        <div className="home-container">
            
            <header>
                <h1>
                    TrackBalance
                    <i
                        className="fa-solid fa-scale-balanced"
                        aria-hidden="true"
                    ></i>
                </h1>
            </header>
            
            <main className="home-main">
                <div className="home-main-container">

                    <CalculatorIllustration/>
                    <div className="home-main-content-container">
                        <p>
                            Uma aplicação simples para controlar receitas e despesas.
                            Projeto de aprendizado e portfólio.
                        </p>
                        <button
                            type="button"
                            onClick={() => setIsAuthFormOpen(true)}
                            aria-label="Abrir modal de login e autenticação"
                        >
                            Login
                        </button>
                    </div>
                </div>
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
            
            <AuthModal
                isOpen={isAuthFormOpen}
                onCancel={() => setIsAuthFormOpen(false)}
                onSucess={goToOverview}
            >
            </AuthModal>
            
        </div>
    );
}
