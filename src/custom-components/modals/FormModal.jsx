import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

import "./FormModal.css";


export default function FormModal(props)
{
    const
    {
        children,
        menuButtonRef,
        onCancel,
        isFormModalOpen,
        label,
        focusableClasses = {},
        className = ""
    
    } = props;


    const modalRef = useRef(null);
    const firstFocusableRef = useRef(null);
    const lastFocusableRef = useRef(null);
    const backdropRef = useRef(null);


    /*
        Cuida de juntar os seletores "padrão" e qualquer outros
        que sejam passados para o componente, para depois
        os focos serem tratados
    */
    function getFocusableElements()
    {
        let selectors = [];
        
        const baseFocusableSelector =
            "input, button, select, textarea, [tabindex]:not([tabindex='-1'])";
        
        const extraClasses = Object.values(focusableClasses);
        
        selectors.push(baseFocusableSelector);
        
        if (extraClasses.length > 0)
        {
            selectors.push(extraClasses.join(", "));
        }
        
        return(modalRef.current.querySelectorAll(selectors.join(", ")));
    }
    
    
    // Cuida de prender o foco no modal
    function handleKeyDown(event)
    {
        if (event.key === "Escape")
        {
            event.preventDefault();
            onCancel();
        }
        else if (event.key === "Tab")
        {
            if (event.shiftKey === true)
            {
                if (document.activeElement === firstFocusableRef.current)
                {
                    event.preventDefault();
                    lastFocusableRef.current.focus();
                }
            }
            else
            {
                if (document.activeElement === lastFocusableRef.current)
                {
                    event.preventDefault();
                    firstFocusableRef.current.focus();
                }
            }
        }
    }
    
    
    // Cuida de travar a rolagem
    function toggleOverflow()
    {
        if (isFormModalOpen === true)
        {
            document.body.style.overflow = "hidden";
        }
        else
        {
            document.body.style.overflow = "";
        }
    }


    // Cuida do clique no backdrop (overlay). Se em vez do ref
    // usasse o evento onClick no backdrop, a ferramenta de acessibilidade
    // do firefox dá um aviso: "Elementos clicaveis devem poder receber foco
    // e ter semanticas interativas" 
    useEffect(() =>
    {
        if (isFormModalOpen === false)
        {
            return;
        }

        function handleClickOnBackdrop(event)
        {
            if
            (
                backdropRef.current !== null &&
                backdropRef.current.contains(event.target) === true
            )
            {
                onCancel();
            }
        }
        
        document.addEventListener("mousedown", handleClickOnBackdrop);
        return(() => document.removeEventListener("mousedown", handleClickOnBackdrop))
    
    }, [isFormModalOpen]);


    useEffect(() =>
    {
        if (isFormModalOpen === false ||
            modalRef.current === null)
        {
            return;
        }

        const focusableElements = getFocusableElements();
        
        if (focusableElements.length === 0)
        {
            return;
        }

       
        firstFocusableRef.current = focusableElements[0];
        lastFocusableRef.current = focusableElements[focusableElements.length - 1];
        
        setTimeout(() =>
        {
            firstFocusableRef.current.focus();
        
        }, 200);
        

        modalRef.current.addEventListener("keydown", handleKeyDown);

        return(() =>
        {
            modalRef.current?.removeEventListener("keydown", handleKeyDown);
            menuButtonRef?.current?.focus();
        });
        
    }, [isFormModalOpen]);
    
  
  
    useEffect(() =>
    {
        toggleOverflow();
        
        return(() =>
        {
            document.body.style.overflow = "";
        });
    
    }, [isFormModalOpen]);

  

    if (isFormModalOpen === false)
    {
        return null;
    }


    return(createPortal(
        <div className={`formModal-wrapper ${className}`}>

            <div className="formModal-backdrop" ref={backdropRef}></div>

            <div
                className="formModal"
                role="dialog"
                aria-modal="true"
                aria-label={label}
                ref={modalRef}
                tabIndex={-1}
            >

                <div className="formModal-content-container">
                    {children}
                </div>
            </div>
        </div>,
        document.body
    ));
}
