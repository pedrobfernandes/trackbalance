import { useRef, useEffect } from "react";

export default function ActionPanel(props)
{
    const
    {
        id, menuButtonRef, isOpen,
        setIsOpen, children
    
    } = props;
    
    const panelRef = useRef(null);
    
    
    function handleClickOutside(event)
    {
        if
        (
            panelRef.current !== null &&
            panelRef.current.contains(event.target) === false &&
            menuButtonRef.current !== null &&
            menuButtonRef.current.contains(event.target) === false
        )
        {
            setIsOpen(false);
        }
    }
    
    
    function handleKeyDown(event)
    {
        if (event.key === "Escape")
        {
            setIsOpen(false);
            menuButtonRef.current.focus();
        }
    }
    
    
    useEffect(() =>
    {
        if (isOpen === false)
        {
            return;
        }
        
        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("keydown", handleKeyDown);
        
        return(() =>
        {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("keydown", handleKeyDown);
        })
    
    }, [isOpen]);
    
    
    function renderActionPanel()
    {
         return(
            <div
                className="action-panel"
                ref={panelRef}
                aria-describedby="action-panel-title"
                hidden={!isOpen}
                id={id}
            >
                {children}
            </div>
        );
    }
    
    return(
        renderActionPanel()
    );
}
