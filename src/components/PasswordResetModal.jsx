import { useState, useEffect, useRef } from "react";
import { supabase } from "../lib/supabaseClient";


export default function PasswordResetModal(props)
{
    const { isOpen, onClose, dialogRef } = props;
    
    const [newPassword, setNewPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    
    const newPasswordInputRef = useRef(null);
    
    useEffect(() =>
    {
        if (isOpen === true)
        {
            setNewPassword("");
        }
    
    }, [isOpen]);
   
   
    useEffect(() =>
    {
        if (isOpen === true &&
            newPasswordInputRef.current !== null)
        {
            newPasswordInputRef.current.focus();
        }
    
    }, [isOpen]);


    async function handlePasswordReset(event)
    {
        event.preventDefault();
        setLoading(true);
        setError(null);

        try
        {
            const { error } = await supabase.auth.updateUser({
                password: newPassword,
            });

            if (error !== null)
            {
                setError(error.message);
            }
            else
            {
                alert("Senha redefinida com sucesso! Faça login novamente.");
                await supabase.auth.signOut();
                onClose();
            }
        }
        catch (err)
        {
            setError("Erro ao redefinir senha.");
        }
        finally
        {
            setLoading(false);
        }
    }


    return(
        <dialog
            ref={dialogRef}
            tabIndex={-1}
            className="modal-content"
            aria-label="Modal de redefinição de senha"
            aria-modal="true"
        >
            <form onSubmit={handlePasswordReset}>
                <h2>Redefinir senha</h2>
                <label htmlFor="new-password">Nova senha:</label>
                <input
                    ref={newPasswordInputRef}
                    id="new-password"
                    type="password"
                    placeholder="Digite a nova senha"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                />
                <button type="submit" disabled={loading}>
                    {loading ? "Salvando..." : "Redefinir senha"}
                </button>
                 {error && <p style={{ color: "red" }}>{error}</p>}
            </form>
        </dialog>
    );
}
