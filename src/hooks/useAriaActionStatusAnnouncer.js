import { useState, useCallback } from "react";


/*
    Este hook cuida de fazer com que a mensagem da live region para
    as ações do painel lateral (inserir atualizar receita/despesas etc.)
    seja sempre lida. Notei inconsistencias, onde as vezes o leitor lia
    e outras vezes não..
 */
export function useAriaActionStatusAnnouncer(inicialDelay= 150, clearDelay = 100)
{
    const [ariaMessage, setAriaMessage] = useState("");
    
    const announce = useCallback(async (message) =>
    {
        // Esera o DOM estabilizar (ex: depois de fechar o modal)
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
