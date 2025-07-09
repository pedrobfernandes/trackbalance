import { useState, useEffect } from "react";
import Modal from "react-modal";
import Auth from "./components/Auth";
import { supabase } from "./lib/supabaseClient";


Modal.setAppElement("#root")


export default function App()
{
    const [session, setSession] = useState(null);
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    
    
    function getUserSession()
    {
        const userSession = supabase.auth.getSession();
        return(userSession);
    }
    
    async function loadUserSession()
    {
        const response = await getUserSession();
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
        <div>
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
                    <div>
                        <h1>Bem vindo ao TrackBalance!</h1>
                        <button
                            type="button"
                            onClick={handleLogout}
                        >
                            Sair
                        </button>
                    </div>
                
                ) : null
            }
        </div>
    );
}
