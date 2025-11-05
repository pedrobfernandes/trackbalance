import { useState, useEffect, useRef, useId } from "react";
import "./CustomSelect.css";


export default function CustomSelect(props)
{
    const
    {
        label, value,
        onChange, options,
        className = ""
    
    } = props;
    
    const [open, setOpen] = useState(false);
    const [highlightedIndex, setHighlightedIndex] = useState(-1);
    
    const labelId = useId();
    const listboxId = useId();
    
    const triggerRef = useRef(null);
    const listRef = useRef(null);
    
    /*
        Estes são para ter buffer de escrita, para o usuário
        puder ir digitando e o "select" selecionar
    */
    const typeAheadBuffer = useRef("");
    const typeAheadTimeout = useRef(null);
    
    
    function handleClickOutside(event)
    {
        if
        (
            triggerRef.current !== null &&
            triggerRef.current.contains(event.target) === false
            && listRef.current !== null &&
            listRef.current.contains(event.target) === false
        )
        {
            setOpen(false);
            setHighlightedIndex(-1);
        }
    }
    
    
    function scrollToItem()
    {
        if (highlightedIndex >= 0 && listRef.current !== null)
        {
            const itemToScroll = listRef.current.children[highlightedIndex];
            itemToScroll.scrollIntoView({ block: "nearest" });
        }
    }
    
    
    // Fecha o dropdown se clicar fora
    useEffect(() =>
    {
        document.addEventListener("mousedown", handleClickOutside);
        return(() => document.removeEventListener("mousedown", handleClickOutside));
    
    }, []);
    
    
    // Scroll para o item destacado
    useEffect(() =>
    {
        scrollToItem();
    
    }, [highlightedIndex]);
    
    
    useEffect(() =>
    {
        if (open === true)
        {
            listRef.current?.focus();
        }
    
    }, [open]);
    
    
    function toggleOpen()
    {
        setOpen((previous) =>
        {
            const willBeOpen = previous === false
                ? true
                : false;
            
            if (willBeOpen === true)
            {
                const selectedIndex = value !== null
                    ? options.indexOf(value)
                    : 0;
                
                setHighlightedIndex(selectedIndex);
            }
            
            return(willBeOpen);
        });
    }
    
    
    function handleSelect(value)
    {
        onChange(value);
        setOpen(false);
        triggerRef.current.focus();
    }
    
    
    function handleTypeAhead(char)
    {
        clearTimeout(typeAheadTimeout.current);
        typeAheadBuffer.current += char.toLowerCase();
        
        const nextIndex = options.findIndex(option =>
        {
            return(
                option.toLowerCase()
                .startsWith(typeAheadBuffer.current)
            );
        });
        
        if (nextIndex !== -1)
        {
            setHighlightedIndex(nextIndex);
        }
        
        typeAheadTimeout.current = setTimeout(() =>
        {
            typeAheadBuffer.current = "";
        
        }, 500);
    }
    
    
    function handleBlur(event)
    {
        if
        (
            triggerRef.current.contains(event.relatedTarget) === false &&
            listRef.current?.contains(event.relatedTarget) === false
        )
        {
            setOpen(false);
            setHighlightedIndex(-1);
        }
    }
    
    
    function handleKeyDown(event)
    {
        const key = event.key;

        if (open === false)
        {
            if (["ArrowDown", "Enter", " "].includes(key))
            {
                event.preventDefault();
                setOpen(true);
                const selectedIndex = value !== null
                    ? options.indexOf(value) : 0;
                
                setHighlightedIndex(selectedIndex);
            }
            
            return;
        }

        // Mapa de handlers por tecla
        const keyDownHandlers =
        {
            ArrowDown: () =>
            {
                event.preventDefault();
                setHighlightedIndex(previous =>
                    (previous + 1) % options.length
                );
            },
            
            ArrowUp: () =>
            {
                event.preventDefault();
                setHighlightedIndex(previous =>
                    previous === 0 ? options.length - 1 : previous - 1
                );
            },
            
            Enter: () =>
            {
                event.preventDefault();
                if (highlightedIndex >= 0)
                {
                    handleSelect(options[highlightedIndex]);
                }
            },
            
            " ": () =>
            {
                event.preventDefault();
                if (highlightedIndex >= 0)
                {
                    handleSelect(options[highlightedIndex]);
                }
            },
            
            Home: () => setHighlightedIndex(0),
            End: () => setHighlightedIndex(options.length - 1),
            
            Escape: () => {
                event.preventDefault();
                setOpen(false);
                setHighlightedIndex(-1);
                triggerRef.current.focus();
            }
        };

        // Executa o handler se existir
        if (keyDownHandlers[key])
        {
            keyDownHandlers[key]();
        }
        // Type-ahead para caracteres
        else if (key.length === 1 && key.match(/\S/))
        {
            handleTypeAhead(key);
        }
    }

    
    
    function renderSelectListOptions()
    {
        const listOptions = options.map((option, index) =>
        {
            const isHighlighted = index === highlightedIndex
                ? "highlighted" : "";
            const optionId = `${listboxId}-option-${index}`;
                
            return(
                <li
                    key={option}
                    id={optionId}
                    role="option"
                    aria-selected={value === option}
                    aria-posinset={index + 1}
                    aria-setsize={options.length}
                    className={`custom-select-item ${isHighlighted}`}
                    onMouseEnter={() => setHighlightedIndex(index)}
                    onClick={() => handleSelect(option)}
                >
                    {option}
                </li>
            );
        });
        
        return(listOptions)
    }
    
    
    function renderListOptions()
    {
        if (open === true)
        {
            return(
                <ul
                    ref={listRef}
                    className="custom-select-list"
                    id={listboxId}
                    aria-labelledby={labelId}
                    role="listbox"
                    tabIndex={0}
                    aria-activedescendant={
                        highlightedIndex >= 0 ? `${listboxId}-option-${highlightedIndex}` : undefined
                    }
                    onKeyDown={handleKeyDown}
                    onBlur={handleBlur}
                    
                >
                    {renderSelectListOptions()}
                </ul>
            );
        }
    }
    
    
    function getDropdownStatus()
    {
        const selected = value !== null
            ? `Selecionado: ${value}.`
            : "Nenhum valor selecionado."; 
        
        if (open === true)
        {
            return(`${options.length} opções disponíveis. ${selected}`);
        }
        
        return(`Dropdown fechado. ${selected}`);
    }
    
    
    return(
        <div className={`custom-select-wrapper ${className}`}>
            <span id={labelId} className="custom-select-label">
                {label} 
            </span>
            <button
                type="button"
                ref={triggerRef}
                className="custom-select-trigger"
                aria-haspopup="listbox"
                aria-expanded={open}
                aria-controls={listboxId}
                aria-labelledby={labelId}
                onClick={toggleOpen}
                onKeyDown={handleKeyDown}
            >
                {value || "Selecione..."}
                <span className="custom-select-icon">&#8595;</span>
            </button>
            {renderListOptions()}
            <span className="visually-hidden" aria-live="polite" role="status">
                {getDropdownStatus()}
            </span>
        </div>
    );
    
}
