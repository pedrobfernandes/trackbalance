import { useState, useEffect} from "react";
import { Routes, Route, Navigate } from "react-router";
import { supabase } from "./lib/supabaseClient";
import Home from "./pages/Home";
import Auth from "./pages/Auth";
import Overview from "./pages/Overview";
import { useModal } from "./custom-components/modals";


export default function App()
{
    const [session, setSession] = useState(null);
    const { confirm } = useModal();


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
    
    
    async function handleLogout()
    {
        const wantsToExit = await confirm(
            "Tem a certeza que deseja sair da aplicação?"
        );

        if (wantsToExit === false)
        {
            return;
        }

        await supabase.auth.signOut();
        setSession(null);
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
                path="/auth" 
                element={
                    session === null 
                    ? <Auth /> 
                    : <Navigate to="/overview" replace />
                } 
            />
            
            <Route 
                path="/overview" 
                element={
                    session !== null
                    ? <Overview onExit={handleLogout}/> 
                    : <Navigate to="/auth" replace />
                } 
            />
            
            <Route 
                path="*"
                element={
                    session !== null
                    ? <Navigate to="/overview" replace/>
                    : <Navigate to="/auth" replace/>
                }
            />
        </Routes>
        
        </>
    );
}
