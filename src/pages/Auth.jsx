import { useState, useEffect, useRef } from "react";
import { supabase } from "../lib/supabaseClient";
import { useModal } from "../custom-components/modals";

import "./Auth.css";


export default function Auth()
{
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [step, setStep] = useState("email");

    const formSignupRef = useRef(null);
    const formOtpRef = useRef(null);
    const { alert } = useModal();
    
    
    useEffect(() =>
    {
        const message = "Página de Login";
        document.title = "TrackBalance - Login"
        
        const announcer = document.getElementById("auth-page-announcer");
        
        if (announcer !== null)
        {
            announcer.textContent = message;
        }
    
    }, []);
    
    
    useEffect(() =>
    {
        if (step === "email" && formSignupRef.current !== null)
        {
            formSignupRef.current.focus();
        }
        
        if (step === "otp" && formOtpRef.current !== null)
        {
            formOtpRef.current.focus();
        }
    
    }, [step]);


    async function handleSendOtp(event)
    {
        event.preventDefault();
        setLoading(true);
        setError(null);

        try
        {
            if (email.trim() === "")
            {
                setError("Por favor, insira seu e-mail.");
                setLoading(false);
                return;
            }

            const { error } = await supabase.auth.signInWithOtp({
                email,
            });

            if (error !== null)
            {
                setError("Erro ao enviar código: " + error.message);
            }
            else
            {
                setStep("otp");
                await alert("Código enviado. Verifique seu e-mail e digite o código abaixo.");
            }
        }
        catch
        {
            setError("Algo deu errado ao enviar o código.");
        }
        finally
        {
            setLoading(false);
        }
    }


    
    async function handleVerifyOtp(event)
    {
        event.preventDefault();
        setLoading(true);
        setError(null);
        
        if (otp.trim() === "")
        {
            setError("Por favor, insira o código de 6 digitos.");
            setLoading(false);
            return;
        }
        
        try
        {
            const { error } = await supabase.auth.verifyOtp({
                email,
                token: otp,
                type: "email",
            });
            
            if (error !== null)
            {
                setError("Código inválido ou expirado.");
            }
            else
            {
                setStep("email");
                setEmail("");
                setOtp("");
            }
        }
        catch
        {
            setError("Erro ao verificar o código.");
        }
        finally
        {
            setLoading(false);
        }
    }
    
    
    function renderEmailOrOtpForm()
    {
        if (step === "email")
        {
            return(
                <form
                    className="signup-form"
                    onSubmit={handleSendOtp}
                    ref={formSignupRef}
                    tabIndex={-1}
                    aria-describedby="signup-form-desc"
                >
                    
                    <p id="signup-form-desc" className="visually-hidden">
                        Formulário de login e criação de conta.
                    </p>
                    
                    <label htmlFor="email-input">Endereço de email</label>
                    <input
                        id="email-input"
                        type="email"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                    />
                    <button
                        type="submit"
                        disabled={loading}
                        aria-label="Enviar código de validação para o e-mail"
                    >
                        {loading ? "Enviando" : "Enviar código"}
                    </button>
                    
                    <p
                        id="signup-error-message"
                        style={{  color: "red", minBlockSize: "1rem"}}
                        aria-live="assertive"
                        aria-atomic="true"
                    >
                        {error || ""}
                    </p>
                    
                </form>
            );
        }
        else
        {
            return(
                <form
                    className="otp-form"
                    onSubmit={handleVerifyOtp}
                    ref={formOtpRef}
                    tabIndex={-1}
                    aria-describedby="otp-form-desc"
                >
                    
                    <p id="otp-form-desc" className="visually-hidden">
                        Formuário de validação e entrada.
                    </p>
                    
                    <label htmlFor="otp-input">Código de 6 dígitos</label>
                    <input
                        id="otp-input"
                        type="text"
                        value={otp}
                        onChange={(event) => setOtp(event.target.value)}
                        aria-describedby="otp-form-input-desc"
                    />
                    
                    <p id="otp-form-input-desc" className="visually-hidden">
                        Insira o código de 6 digitos para validar e entrar na aplicação.
                    </p>
                    
                    <button type="submit" disabled={loading}>
                        {loading ? "Verificando..." : "Verificar código"}
                    </button>
                    
                    <p
                        id="otp-error-message"
                        style={{  color: "red", minBlockSize: "1rem"}}
                        aria-live="assertive"
                        aria-atomic="true"
                    >
                        {error || ""}
                    </p>
                    
                </form>
            );
        }
    }


    return(
        <div className="auth-container">
            
            <main className="auth-main">
            
                <div
                    className="visually-hidden"
                    id="auth-page-announcer"
                    aria-live="polite"
                ></div>
            
                <h1>TrackBalance - Login</h1>
                
                {renderEmailOrOtpForm()}
                
            </main>

        </div>
    );
}
