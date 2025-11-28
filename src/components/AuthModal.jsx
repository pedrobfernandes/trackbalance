import { useState, useRef } from "react";
import { supabase } from "../lib/supabaseClient";
import { useModal } from "../custom-components/modals";
import { FormModal } from "../custom-components/modals";
import { useFormFieldValidation } from "../hooks/useFormFieldValidation";
import FormFieldErrorMessage from "./FormFieldErrorMessage";


export default function AuthModal(props)
{
    const { isOpen, onCancel, onSucess } = props;
    
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [loading, setLoading] = useState(false);
    const [supabaseError, setSupabaseError] = useState(null);
    const [step, setStep] = useState("email");
    const [resendCooldown, setResendCooldown] = useState(0);
    
    const otpInputRef = useRef(null);
    const { alert } = useModal();
    
    const
    {
        error, validateEmail,
        validateInputTextNumeric,
        focusField, clearError
    
    } = useFormFieldValidation();
    
    
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
        setSupabaseError(null);
        
        try
        {
            const { error: resendRequestError } = await supabase.auth.signInWithOtp({ email });
            
            if (resendRequestError !== null)
            {
                setSupabaseError("Erro ao reenviar código: " + resendRequestError.message);
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
            setSupabaseError("Algo deu errado ao reenviar o codigo.");
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
        setSupabaseError(null);
        clearError();
        
        if (validateEmail(email, "o e-mail") === false)
        {
            focusField("email-input");
            setLoading(false);
            return;
        }

        try
        {

            const { error: sendRequestError } = await supabase.auth.signInWithOtp({
                email,
            });

            if (sendRequestError !== null)
            {
                setSupabaseError(
                    "Erro ao enviar código de" +
                    " verificação para o e-mail: " + sendRequestError.message
                );
            }
            else
            {
                await alert(
                    "Um código de verificação foi enviado" +
                    " para seu e-mail.\nPor favor verifique o e-mail" +
                    " e digite o código para entrar na aplicação.",
                    () => setStep("otp")
                );
            }
        }
        catch
        {
            setSupabaseError(
                "Algo deu errado ao enviar" +
                " o código de verificação para o e-mail."
            );
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
        setSupabaseError(null);
        clearError();
        
        if (validateInputTextNumeric(otp, "código", {exactLength: 6}) === false)
        {
            focusField("otp-input");
            setLoading(false);
            return;
        }
        
        try
        {
            const { error: otpVerifyError } = await supabase.auth.verifyOtp({
                email,
                token: otp,
                type: "email",
            });
            
            if (otpVerifyError !== null)
            {
                setSupabaseError("Código inválido ou expirado.");
            }
            else
            {
                resetModal();
                onSucess();
            }
        }
        catch
        {
            setSupabaseError("Erro ao verificar o código.");
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
        setSupabaseError(null);
        clearError();
    }
    
    
    function renderEmailOrOtpForm()
    {
        if (step === "email")
        {
            return(
                <form
                    className="signup-form"
                    onSubmit={handleSendOtp}
                    noValidate
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
                    >
                        {loading ? "Aguarde" : "Seguinte"}
                    </button>
                    
                    <button
                        type="button"
                        onClick={() => { resetModal(); onCancel(); }}
                        aria-label="Cancelar login e fechar modal"
                    >
                        Cancelar
                    </button>
                    
                    <FormFieldErrorMessage error={error || supabaseError}/>
                    
                    
                </form>
            );
        }
        else
        {
            return(
                <form
                    className="otp-form"
                    onSubmit={handleVerifyOtp}
                    noValidate
                >
                    
                    <label htmlFor="otp-input">Código de 6 dígitos</label>
                    <input
                        id="otp-input"
                        ref={otpInputRef}
                        type="text"
                        inputMode="numeric"
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
                        aria-label="Voltar atrás para etapa de e-mail"
                    >
                        Voltar
                    </button>
                    
                    <FormFieldErrorMessage error={error || supabaseError}/>
                    
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
