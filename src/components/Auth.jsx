import { useState } from "react";
import { supabase } from "../lib/supabaseClient";


export default function Auth()
{
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isSignUp, setIsSignUp] = useState(false);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    
    
    async function handleAuth(event)
    {
        event.preventDefault();
        setLoading(true);
        setError(null);
        
        try
        {
            let response;
            
            if (isSignUp)
            {
                response = await supabase.auth.signUp({
                    email,
                    password,
                });
            }
            else
            {
                response = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });
            }
            
            if (response.error)
            {
                setError(response.error.message);
            }
        }
        catch (err)
        {
            setError("Algo deu errado.");
        }
        finally
        {
            setLoading(false);
        }
    }
    
    function toggleAuthMode()
    {
        setIsSignUp(!isSignUp);
    }
    
    
    return(
        <div style={{ padding: "2rem", maxWidth: "40rem", margin: "0 auto" }}>
            <h2>{isSignUp ? "Criar conta" : "Entrar"}</h2>
            <form onSubmit={handleAuth}>
                <label htmlFor="email-input">Insira o seu email:</label>
                <input
                    id="email-input"
                    type="email"
                    placeholder="Seu email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    required
                />
                <br/>
                <label htmlFor="password-input">Insira uma senha:</label>
                <input
                    id="password-input"
                    type="password"
                    placeholder="Sua senha"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    required
                />
                <br/>
                <button type="submit" disabled={loading}>
                    {loading ? "Carregando..." : isSignUp ? "Criar conta" : "Entrar"}
                </button>
            </form>
            
            <p>
                {isSignUp ? "Já tem uma conta?" : "Não tem uma conta?"} {" "}
                <button type="button" onClick={toggleAuthMode}>
                    {isSignUp ? "Entrar" : "Criar conta"}
                </button>
            </p>
            
            {error && <p style={{ color: "red" }}>{error}</p>}
        </div>
    );
}
