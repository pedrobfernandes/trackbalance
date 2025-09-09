import { useState } from "react";
import { supabase } from "../lib/supabaseClient";


export default function Auth()
{
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isSignUp, setIsSignUp] = useState(false);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [isForgotPassword, setIsForgotPassword] = useState(false);


    async function handleAuth(event)
    {
        event.preventDefault();
        setLoading(true);
        setError(null);

        try
        {
            let response;

            if (isSignUp === true)
            {
                response = await supabase.auth.signUp({ email, password });
            }
            else
            {
                response = await supabase.auth
                    .signInWithPassword({ email, password });
            }

            if (response.error !== null)
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


    async function handleForgotPassword(event)
    {
        event.preventDefault();
        setLoading(true);
        setError(null);

        try
        {
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: window.location.origin,
            });

            if (error !== null)
            {
                setError(error.message);
            }
            else
            {
                alert("Verifique seu e-mail para redefinir a senha.");
                setIsForgotPassword(false);
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
        setIsSignUp((prev) => !prev);
    }
    
    
    function renderAuthScreen()
    {
        const heading2Text = isSignUp ? "Criar conta" : "Entrar";
        const hasAccountText  = isSignUp ? "Já tem uma conta?" : "Não tem uma conta?";
        const submitText = loading ? "Carregando" :
            isSignUp ? "Criar conta" : "Entrar";
        
        return(
            <>
                <h2>{heading2Text}</h2>
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
                        {submitText}
                    </button>
                </form>
                
                <p>
                    {hasAccountText}
                    <button type="button" onClick={toggleAuthMode}>
                        {isSignUp ? "Entrar" : "Criar conta"}
                    </button>
                </p>
                
                <p>
                    <button
                        type="button"
                        onClick={() => setIsForgotPassword(true)}
                    >
                        Esqueceu a senha?
                    </button>
                </p>
                
                {error && <p style={{ color: "red" }}>{error}</p>}
            </>
        );
    }
    
    
    function renderPasswordRecoveryScreen()
    {
        return(
            <>
                <h2>Recuperar senha</h2>
                <form onSubmit={handleForgotPassword}>
                    <label htmlFor="reset-email-input">Digite seu email:</label>
                    <input
                        id="reset-email-input"
                        type="email"
                        placeholder="Seu email"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        required
                    />
                    <br />
                    <button type="submit" disabled={loading}>
                        {loading ? "Enviando..." : "Enviar link de recuperação"}
                    </button>
                </form>
                <p>
                    <button
                        type="button"
                        onClick={() => setIsForgotPassword(false)}
                    >
                        Voltar
                    </button>
                </p>
                {error && <p style={{ color: "red" }}>{error}</p>}
            </>
        );
    }
    
    
    function getScreenToRender()
    {
        if (isForgotPassword === false)
        {
            return(renderAuthScreen());
        }
        else
        {
            return(renderPasswordRecoveryScreen());
        }
    }
    

    return (
        <div style={{ padding: "2rem", maxWidth: "40rem", margin: "0 auto" }}>
           {getScreenToRender()}
        </div>
    );
}
