import { useState, useEffect } from "react";
import Modal from "react-modal";
import Auth from "./components/Auth";
import Header from "./components/Header";
import Overview from "./pages/Overview";
import { supabase } from "./lib/supabaseClient";


Modal.setAppElement("#root")


export default function App()
{
    const [session, setSession] = useState(null);
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    
    
    async function getUserSession()
    {
        const userSession = await supabase.auth.getSession();
        return(userSession);
    }
    
    async function loadUserSession()
    {
        try
        {
            const response = await getUserSession();
            
            if (response.error !== null)
            {
                console.error("Erro ao obter sessão do usuário");
                setIsAuthModalOpen(true);
                return;
            }
            
            const userSession = response.data.session;
            setSession(userSession);
            
            if (userSession === null)
            {
                setIsAuthModalOpen(true);
            }
            else
            {
                setIsAuthModalOpen(false);
            }
        }
        catch (error)
        {
            console.error("Erro de conexão ao obter sessão");
            setIsAuthModalOpen(true);
        }
    }
    
    
    useEffect(() =>
    {
        loadUserSession();
        
        const response = supabase.auth.onAuthStateChange(
            (_event, session) =>
            {
                setSession(session);
                
                if (session === null)
                {
                    setIsAuthModalOpen(true);
                }
                else
                {
                    setIsAuthModalOpen(false);
                }
            }
        );
        
        const listener = response.data;
        
        return(() =>
        {
            listener.subscription.unsubscribe();
        })
        
    }, []);
    
    
    function handleLogout()
    {
        supabase.auth.signOut();
    }
    
    return(
        <>
            <Modal
                isOpen={isAuthModalOpen}
                onRequestClose={() => {}}
                contentLabel="Autenticação"
                shouldCloseOnOverlayClick={false}
                style={{
                    content: {
                        maxWidth: "50rem",
                        margin: "auto",
                        padding: "2rem",
                        inset: "auto",
                    },
                }}
            >
                <Auth/>
            </Modal>
            
            {
                session ?
                (
                    <>
                        <Header/>
                        <Overview onExit={handleLogout}/>
                    </>
                
                ) : null
            }
        </>
    );
}
