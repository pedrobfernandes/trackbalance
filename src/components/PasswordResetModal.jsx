import { useState } from "react";
import Modal from "react-modal";
import { supabase } from "../lib/supabaseClient";


export default function PasswordResetModal(props)
{
    const { isOpen, onClose } = props;
    
    const [newPassword, setNewPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);


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
        <Modal
            isOpen={isOpen}
            onRequestClose={onClose}
            contentLabel="Redefinir senha"
            shouldCloseOnOverlayClick={false}
            aria={{
                modal: true,
                labelledby: "password-reset-modal-title",
            }}
        >
            <h2 id="password-reset-modal-title">Redefinir senha</h2>
            <form onSubmit={handlePasswordReset}>
                <label htmlFor="new-password">Nova senha:</label>
                <input
                    id="new-password"
                    type="password"
                    placeholder="Digite a nova senha"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                />
                <br />
                <button type="submit" disabled={loading}>
                    {loading ? "Salvando..." : "Redefinir senha"}
                </button>
            </form>
            {error && <p style={{ color: "red" }}>{error}</p>}
        </Modal>
    );
}
