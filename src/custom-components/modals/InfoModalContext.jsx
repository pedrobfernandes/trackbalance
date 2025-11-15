import
{
    createContext, useContext, useState,
    useRef, useEffect

} from "react";


import { createPortal } from "react-dom";
import { registerInfoModalFunctions } from "./InfoModalService";

import "./InfoModalContext.css"


const InfoModalContext = createContext(null);


// Serve para "substituir" o alert() e confirm() nativos
export function InfoModalProvider({ children })
{
    const [modal, setModal] = useState(null);
    const modalRef = useRef(null);
    const previousElement = useRef(null);
    const overlayRef = useRef(null);
    
    
    function alert(message, onCloseCallback)
    {
        return(
            new Promise((resolve) =>
            {
                setModal({
                    type: "alert",
                    message,
                    onClose: () =>
                    {
                        setModal(null);
                        resolve();
                        if (onCloseCallback) onCloseCallback();
                    }
                });
            })
        );
    }
    
    
    function confirm(message, onConfirmCallback, onCancelCallback)
    {
        return(
            new Promise((resolve) =>
            {
                setModal({
                    type: "confirm",
                    message,
                    onConfirm: () =>
                    {
                        setModal(null);
                        resolve(true);
                        if (onConfirmCallback) onConfirmCallback();
                    },
                    onCancel: () =>
                    {
                        setModal(null);
                        resolve(false);
                        if (onCancelCallback) onCancelCallback();
                    }
                });
            })
        );
    }
    
    
    useEffect(() =>
    {
        // Isto permite-me usar em js puro (fora de componente)
        registerInfoModalFunctions({ alert, confirm });
    
    }, []);
    
    
    // Bloqueio do scroll e guarda/restaura o foco ao elemento
    // focavel antes de mostrar o modal.
    useEffect(() =>
    {
        if (modal !== null)
        {
            previousElement.current = document.activeElement;
            document.body.style.overflow = "hidden";
        }
        else
        {
            document.body.style.overflow = "";
            
            if (previousElement.current !== null)
            {
                previousElement.current.focus();
            }
        }
    
    }, [modal]);
    
    
    useEffect(() =>
    {
        if (modal === null)
        {
            return;
        }
        
        const modalElement = modalRef.current;
        const primaryButton = modalElement.querySelector("button");
        
        /*
            Aqui, serve para o leitor de tela lêr a mensagem.
            Mas se não passar o foco depois para o botão o
            usuario tem que dar tab. Não gosto. Então mudo
            o foco ao fim de 150 ms.
        */
        modalElement.focus();
        const timer = setTimeout(() =>
        {
            if (primaryButton !== null)
            {
                primaryButton.focus();
            }
        
        }, 150);
        
        return(() => clearTimeout(timer));
    
    }, [modal]);
    
    
    // Esc para fechar
    useEffect(() =>
    {
        if (modal === null)
        {
            return;
        }
        
        function onKeyDown(event)
        {
            if (event.key === "Escape")
            {
                event.preventDefault();
                
                if (modal.type === "confirm")
                {
                    modal.onCancel();
                }
                else
                {
                    modal.onClose();
                }
            }
        }
        
        
        document.addEventListener("keydown", onKeyDown);
        return(() => document.removeEventListener("keydown", onKeyDown))
    
    }, [modal]);
    
    
    // Cuida do clique no overlay. Se em vez do ref
    // usasse o evento onClick no backdrop, a ferramenta de acessibilidade
    // do firefox dá um aviso: "Elementos clicaveis devem poder receber foco
    // e ter semanticas interativas
    useEffect(() =>
    {
        if (modal === null)
        {
            return;
        }
        
        
        function handleClickOnOverlay(event)
        {
            if
            (
                overlayRef.current !== null &&
                overlayRef.current.contains(event.target) === true
            )
            {
                
                if (modal.type === "confirm")
                {
                    modal.onCancel();
                }
                else
                {
                    modal.onClose();
                }
            }
        }
        
        document.addEventListener("mousedown", handleClickOnOverlay);
        return(() => document.removeEventListener("mousedown", handleClickOnOverlay));
        
    
    }, [modal]);
    
    
    // Cuida de prender o foco no modal.
    useEffect(() =>
    {
        if (modal === null)
        {
            return;
        }

        const modalElement = modalRef.current;
        
        // Acho meio que exagero esta. Eu criei este codigo apenas para
        // substituir o alert() e confirm() nativo, mas emfim....
        const focusableElements = modalElement.querySelectorAll(
            "button, [href], input, select, textarea, [tabindex]:not([tabindex='-1'])"
        );
    
        const first = focusableElements[0];
        const last = focusableElements[focusableElements.length - 1];

        function handleTab(event)
        {
            if (event.key !== "Tab")
            {
                return;
            }

            if (event.shiftKey === true)
            {
                if (document.activeElement === first)
                {
                    event.preventDefault();
                    last.focus();
                }
            }
            else
            {
                if (document.activeElement === last)
                {
                    event.preventDefault();
                    first.focus();
                }
            }
        }

        modalElement.addEventListener("keydown", handleTab);
        return(() => modalElement.removeEventListener("keydown", handleTab));
  
    }, [modal]);
    
    
    function renderModalButtons()
    {
        if (modal.type === "alert")
        {
            return(
                <button
                    type="button"
                    onClick={modal.onClose}
                >
                    OK
                </button>
            );
        }
        else
        {
            return(
                <>
                    <button
                        type="button"
                        onClick={modal.onConfirm}
                    >
                        Sim
                    </button>
                    <button
                        type="button"
                        onClick={modal.onCancel}
                    >
                        Não
                    </button>
                </>
            );
        }
    }
    
    
    function renderModal()
    {
        if (modal !== null)
        {
            return(createPortal(
                <div className="infoModal-wrapper">
                    <div className="infoModal-backdrop" ref={overlayRef}></div>
                    <div
                        role="dialog"
                        ref={modalRef}
                        className="infoModal"
                        aria-modal="true"
                        aria-labelledby="title"
                        tabIndex={-1}
                        >
                        <div className="infoModal-content-container">
                            <p className="infoModal-message" id="title">
                                {modal.message}
                            </p>
                            
                            
                            <div className="infoModal-buttons-container">
                                {renderModalButtons()}
                            </div>
                        </div>
                    </div>
                </div>,
                document.body
            ));
        }
    }
    
    
    return(
        <InfoModalContext.Provider value={{ alert, confirm }}>
            {children}
            {renderModal()}
        </InfoModalContext.Provider>
    );
}


// Assim posso chamar useModal (como hook) em componente
export function useModal()
{
    return(useContext(InfoModalContext));
}
