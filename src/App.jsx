import { useState, useEffect } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router";
import { supabase } from "./lib/supabaseClient";
import Home from "./pages/Home";
import Overview from "./pages/Overview";
import { useModal } from "./custom-components/modals";
import { useAriaActionStatusAnnouncer } from "./hooks/useAriaActionStatusAnnouncer";


export default function App()
{
    const [session, setSession] = useState(null);
    const { confirm, alert } = useModal();
    const { ariaMessage, announce } = useAriaActionStatusAnnouncer();
    const location = useLocation();
    
    const deleteUrl = import.meta.env.VITE_SUPABASE_DELETE_ACCOUNT_URL;


    async function loadUserSession()
    {
        try
        {
            const response = await supabase.auth.getSession();

            if (response.error !== null)
            {
                setSession(null);
                return;
            }

            const userSession = response.data.session;
            setSession(userSession);
        }
        catch
        {
            setSession(null);
        }
    }


    useEffect(() =>
    {
        loadUserSession();
        
        const listener = supabase.auth.onAuthStateChange(
            (_event, session) =>
        {
            setSession(session);
        });

        return(() =>
        {
            listener.data.subscription.unsubscribe();
        });
    
    }, []);
    
    
    useEffect(() =>
    {
        if (location.pathname === "/")
        {
            document.title = "TrackBalance - Home";
        }
        else
        {
            document.title = "TrackBalance - Visão Geral";
        }
        
    }, [location.pathname]);
    
    
    async function handleRemoveAccount()
    {
        try
        {
            const { data: { session } } = await supabase.auth.getSession();
            
            if (session === null)
            {
                throw new Error("Nenhuma sessão ativa");
            }
            
            const response = await fetch(deleteUrl, {
                method: "POST",
                headers: {
                    'Authorization': `Bearer ${session.access_token}`,
                    'Content-Type': 'application/json',
                },
            });
            
            const result = await response.json();
            
            if (result.ok === false)
            {
                throw new Error(result.error || "Falha ao deletar conta")
            }
            
            await alert(
                "Sua conta e todos os dados foram excluidos com sucesso." +
                " Em seguida irá sair da aplicação e retornar" +
                " á página inicial."
            );
            
            await supabase.auth.signOut();
            await announce("Você está agora na página incial, Home");
        }
        catch (error)
        {
            await alert("Erro ao deletar conta: " + error);
        }
    }
    
    
    async function handleLogout()
    {
        const wantsToExit = await confirm(
            "Tem a certeza que deseja sair da aplicação?",
            null,
            async () => await announce("Cancelado")
        );

        if (wantsToExit === false)
        {
            return;
        }

        await supabase.auth.signOut();
        setSession(null);
        
        await announce("Você está agora na página incial, Home");
    }


    return(
        <>
        
        <Routes>
            <Route
                path="/"
                element={
                    session === null
                    ? <Home/>
                    : <Navigate to="/overview" replace/>
                }
            />
            
            <Route 
                path="/overview" 
                element={
                    session !== null
                    ? <Overview onExit={handleLogout} onDeleteAccount={handleRemoveAccount}/> 
                    : <Navigate to="/" replace />
                } 
            />
            
            <Route 
                path="*"
                element={
                    session !== null
                    ? <Navigate to="/overview" replace/>
                    : <Navigate to="/" replace/>
                }
            />
        </Routes>
        
        <div
            className="visually-hidden"
            aria-live="polite"
            aria-atomic="true"
        >
            {ariaMessage}
        </div>
        
        </>
    );
}
