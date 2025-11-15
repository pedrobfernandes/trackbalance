import { useState, useRef } from "react";
import { supabase } from "../lib/supabaseClient";
import { useModal } from "../custom-components/modals";
import { FormModal } from "../custom-components/modals";


export default function AuthModal(props)
{
    const { isOpen, onCancel, onSucess} = props;
    
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [step, setStep] = useState("email");
    const [resendCooldown, setResendCooldown] = useState(0);
    
    const otpInputRef = useRef(null);
    const { alert } = useModal();
    
    
    function startResendCooldown()
    {
        setResendCooldown(30);
        
        const interval = setInterval(() =>
        {
            setResendCooldown(previous =>
            {
                if (previous <= 1)
                {
                    clearInterval(interval);
                    return(0);
                }
                
                return(previous - 1);
            });
        
        }, 1000);
    }


    async function handleResendOtp()
    {
        setLoading(true);
        setError(null);
        
        try
        {
            const { error } = await supabase.auth.signInWithOtp({ email });
            
            if (error !== null)
            {
                setError("Erro ao reenviar código: " + error.message);
            }
            else
            {
                await alert(
                    "Código reenviado. Verifique seu e-mail e digite o código.",
                );
                startResendCooldown();
                
                if (otpInputRef.current !== null)
                {
                    otpInputRef.current.focus();
                }
            }
        }
        catch
        {
            setError("Algo deu errado ao reenviar o codigo.");
        }
        finally
        {
            setLoading(false);
        }
    }


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
                await alert(
                    "Código enviado. Verifique seu e-mail e digite o código para entrar na aplicação.",
                    () => setStep("otp")
                );
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
                resetModal();
                onSucess();
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
    
    
    function resetModal()
    {
        setStep("email");
        setEmail("");
        setOtp("");
        setError(null);
    }
    
    
    function renderEmailOrOtpForm()
    {
        if (step === "email")
        {
            return(
                <form
                    className="signup-form"
                    onSubmit={handleSendOtp}
                >
                    
                    <label htmlFor="email-input">Endereço de e-mail</label>
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
                    
                    <button
                        type="button"
                        onClick={() => { resetModal(); onCancel(); }}
                        aria-label="Cancelar login e fechar modal"
                    >
                        Cancelar
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
                >
                    
                    <label htmlFor="otp-input">Código de 6 dígitos</label>
                    <input
                        id="otp-input"
                        ref={otpInputRef}
                        type="text"
                        value={otp}
                        onChange={(event) => setOtp(event.target.value)}
                        aria-describedby="otp-form-input-desc"
                    />
                    
                    <p id="otp-form-input-desc" className="visually-hidden">
                        Insira o código de 6 digitos enviado para seu e-mail.
                    </p>
                    
                    <button
                        type="submit"
                        disabled={loading}
                        aria-label="Verificar código para entrar na aplicação"
                    >
                        {loading ? "Verificando..." : "Verificar código"}
                    </button>
                    
                    <button
                        type="button"
                        onClick={handleResendOtp}
                        disabled={loading || resendCooldown > 0}
                        aria-label="Reenviar código de verificação para o e-mail"
                    >
                        {resendCooldown > 0 ? `Reenviar em ${resendCooldown}s` : "Reenviar código"}
                    </button>
                    
                    <button
                        type="button"
                        onClick={resetModal}
                        aria-label="Voltar atrás para etapa de e-mail e envio de código"
                    >
                        Voltar
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
        <FormModal
            key={step}
            label="Modal de login e autenticação"
            isFormModalOpen={isOpen}
            onCancel={onCancel}
        >
            {renderEmailOrOtpForm()}
        </FormModal>
    );
}
