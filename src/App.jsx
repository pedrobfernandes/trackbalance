import { useState, useEffect, useRef } from "react";
import Auth from "./components/Auth";
import PasswordResetModal from "./components/PasswordResetModal";
import Header from "./components/Header";
import Overview from "./pages/Overview";
import { supabase } from "./lib/supabaseClient";


export default function App()
{
    const [session, setSession] = useState(null);
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [isPasswordResetModalOpen, setIsPasswordResetModalOpen] =
        useState(false);
    
    
    const authDialogRef = useRef(null);
    const passwordDialogRef = useRef(null);


    useEffect(() =>
    {
        if (authDialogRef.current !== null)
        {
            if (isAuthModalOpen === true)
            {
                authDialogRef.current.showModal();
            }
            else
            {
                authDialogRef.current.close();
            }
        }
    
    }, [isAuthModalOpen]);
    
    
    useEffect(() =>
    {
        if (passwordDialogRef.current !== null)
        {
            if (isPasswordResetModalOpen === true)
            {
                passwordDialogRef.current.showModal();
            }
            else
            {
                passwordDialogRef.current.close();
            }
        }
    
    }, [isPasswordResetModalOpen]);


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
        const wantsToExit = window.confirm(
            "Tem a certeza que deseja sair da aplicação?"
        );
        
        if (wantsToExit === false)
        {
            return;
        }
        
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
            <dialog
                ref={authDialogRef}
                tabIndex={-1}
                className="modal-content"
                aria-label="Modal de autenticação / criação de conta"
                aria-modal="true"
            >
                <Auth isOpen={isAuthModalOpen}/>
            </dialog>
            
            <PasswordResetModal
                isOpen={isPasswordResetModalOpen}
                dialogRef={passwordDialogRef}
                onClose={() => setIsPasswordResetModalOpen(false)}
            />
    
            <main>
                {renderApp()}
            </main>
        </>
    );
}
