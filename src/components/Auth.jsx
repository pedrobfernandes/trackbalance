import { useState, useEffect, useRef } from "react";
import { supabase } from "../lib/supabaseClient";


export default function Auth(props)
{
    const { isOpen } = props;
    
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isSignUp, setIsSignUp] = useState(false);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [isForgotPassword, setIsForgotPassword] = useState(false);
    
    const emailInputRef = useRef(null);
    const resetEmailInputRef = useRef(null);


    useEffect(() =>
    {
        if (
            isOpen === true &&
            isForgotPassword === false &&
            emailInputRef.current !== null
        )
        {
            emailInputRef.current.focus();
        }
    
    }, [isOpen, isForgotPassword]);
    
    
    useEffect(() =>
    {
        if (isForgotPassword === true &&
            resetEmailInputRef.current !== null)
        {
            resetEmailInputRef.current.focus();
        }
    
    }, [isForgotPassword]);


    useEffect(() =>
    {
        setEmail("");
        setPassword("");
        setError(null);
        setIsForgotPassword(false);
    
    }, [isOpen]);


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
        //~ setIsSignUp((previous) => !previous);
        setIsSignUp((previous) =>
        {
            if (previous === true)
            {
                return(false);
            }
            
            return(true);
        });
    }
    
    
    function renderAuthScreen()
    {
        const heading2Text = isSignUp ? "Criar conta" : "Entrar";
        //~ const submitText = loading ? "Carregando" :
            //~ isSignUp ? "Criar conta" : "Entrar";
        
        let submitText;
        
        if (loading === true)
        {
            submitText = "Carregando";
        }
        else if (isSignUp === true)
        {
            submitText = "Criar Conta";
        }
        else
        {
            submitText = "Entrar";
        }
        
        return(
            <>
                <h1 className="visually-hidden">Autenticação</h1>
                <form onSubmit={handleAuth}>
                    <h2>{heading2Text}</h2>
                    <label htmlFor="email-input">Insira seu email:</label>
                    <input
                        ref={emailInputRef}
                        id="email-input"
                        type="email"
                        placeholder="Seu email"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        required
                    />
                    
                    <label htmlFor="password-input">Insira a senha:</label>
                    <input
                        id="password-input"
                        type="password"
                        placeholder="Sua senha"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        required
                    />
                    
                    <button type="submit" disabled={loading}>
                        {submitText}
                    </button>
                    
                    <button type="button" onClick={toggleAuthMode}>
                        {isSignUp ? "Entrar" : "Criar conta"}
                    </button>
                
                    <button
                        type="button"
                        onClick={() => setIsForgotPassword(true)}
                    >
                        Esqueceu a senha?
                    </button>

                    {error && <p style={{ color: "red" }}>{error}</p>}
                </form>
            </>
        );
    }
    
    
    function renderPasswordRecoveryScreen()
    {
        return(
            <>
                <h1 className="visually-hidden">Troca de Senha</h1>
                <form onSubmit={handleForgotPassword}>
                    <h2>Recuperar senha</h2>
                    <label htmlFor="reset-email-input">Insira seu email:</label>
                    <input
                        ref={resetEmailInputRef}
                        id="reset-email-input"
                        type="email"
                        placeholder="Seu email"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        required
                    />
                    <button type="submit" disabled={loading}>
                        {loading ? "Enviando..." : "Enviar link de recuperação"}
                    </button>
                    <button
                        type="button"
                        onClick={() => setIsForgotPassword(false)}
                    >
                        Voltar
                    </button>
                    {error && <p style={{ color: "red" }}>{error}</p>}
                </form>
            </>
        );
    }
    
    
    function getScreenToRender()
    {
        if (isForgotPassword === false)
        {
            return(renderAuthScreen());
        }
        
        return(renderPasswordRecoveryScreen());
    }
    

    return (
        <div className="auth-container">
            {getScreenToRender()}
       </div>
    );
}
