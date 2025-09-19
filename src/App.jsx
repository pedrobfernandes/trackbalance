import { useState, useEffect } from "react";
import Modal from "react-modal";
import Auth from "./components/Auth";
import Header from "./components/Header";
import PasswordResetModal from "./components/PasswordResetModal";
import Overview from "./pages/Overview";
import { supabase } from "./lib/supabaseClient";

Modal.setAppElement("#root");


export default function App()
{
    const [session, setSession] = useState(null);
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [isPasswordResetModalOpen, setIsPasswordResetModalOpen] =
        useState(false);


    async function getUserSession()
    {
        const userSession = await supabase.auth.getSession();
        return userSession;
    }


    async function loadUserSession()
    {
        try
        {
            const response = await getUserSession();

            if (response.error !== null)
            {
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
            setIsAuthModalOpen(true);
        }
    }


    useEffect(() =>
    {
        loadUserSession();

        const response = supabase.auth.onAuthStateChange(
            (event, session) =>
        {
            setSession(session);

            if (event === "PASSWORD_RECOVERY")
            {
                setIsPasswordResetModalOpen(true);
            }

            if (session === null)
            {
                setIsAuthModalOpen(true);
            }
            else
            {
                setIsAuthModalOpen(false);
            }
        });

        const listener = response.data;

        return(() =>
        {
            listener.subscription.unsubscribe();
        });
    
    }, []);


    function handleLogout()
    {
        supabase.auth.signOut();
    }
    
    
    function renderApp()
    {
        if (session !== null &&
            isPasswordResetModalOpen === false)
        {
            return(
                <>
                    <Header/>
                    <Overview onExit={handleLogout}/>
                </>
            );
        }
    }


    return(
        <>
                <Modal
                    overlayClassName="ReactModal__Overvaly"
                    className="ReactModal__Content"
                    isOpen={isAuthModalOpen}
                    onRequestClose={() => {}}
                    contentLabel="Autenticação"
                    shouldCloseOnOverlayClick={false}
                    aria={{
                        modal: true,
                        labelledby: "auth-modal-title",
                    }}
                    
                >
                    <h2 id="auth-modal-title" className="visually-hidden">Autenticação</h2>
                    <Auth />
                </Modal>

                <PasswordResetModal
                    isOpen={isPasswordResetModalOpen}
                    onClose={() => setIsPasswordResetModalOpen(false)}
                />
        
                <main>
                    {renderApp()}
                </main>
        </>
    );
}
