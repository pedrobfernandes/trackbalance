import { useState, useCallback } from "react";


export function useAriaActionStatusAnnouncer(inicialDelay= 150, clearDelay = 100)
{
    const [ariaMessage, setAriaMessage] = useState("");
    
    const announce = useCallback(async (message) =>
    {
        // Espera o DOM estabilizar (ex: depois de fechar o modal)
        await new Promise((resolve) => setTimeout(resolve, inicialDelay));
        
        // Limpa para forçar o leitor a tratar a próxima mensagem como "nova"
        setAriaMessage("");
        
        // Dá tempo de o React aplicar o clear antes de anunciar de novo
        setTimeout(() =>
        {
            setAriaMessage(message);
        
        }, clearDelay);
    
    }, [inicialDelay, clearDelay]);
    
    return({ ariaMessage, announce });
}
