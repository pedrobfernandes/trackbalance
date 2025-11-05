import { useRef } from "react";

import "./NumberInput.css";


export default function NumberInput(props)
{
    const
    {
        id, value, onChange,
        step = 1, min = -Infinity,
        max = Infinity, className = ""
    
    } = props;
    
    const inputRef = useRef(null);
    
    
    function getDecimalPlaces(number)
    {
        const numberString = number.toString();
        
        if (numberString.includes("."))
        {
            const decimalPlaces = numberString.split(".")[1].length;
            return(decimalPlaces);
        }
        
        return(0);
    }
    
    
    function roundToStep(number)
    {
        const decimals = getDecimalPlaces(step);
        const rounded = Number(number.toFixed(decimals))
        return(rounded);
    }
    
    
    function handleDecrement()
    {
        const current = isNaN(parseFloat(value)) ? 1 : parseFloat(value);
        const maxRange = roundToStep(current - step);
        const newValue = Math.max(min, maxRange);
        triggerChange(newValue);
    }
    
    
    function handleIncrement()
    {
        const current = isNaN(parseFloat(value)) ? 1 : parseFloat(value);
        const maxRange = roundToStep(current + step);
        const newValue = Math.min(max, maxRange);
        triggerChange(newValue);
    }
    
    
    function handleInputChange(event)
    {
        const newValue = event.target.value === "" ?
            "" : parseFloat(event.target.value);
        triggerChange(newValue);
    }
    
    
    // Esta cuida de devolver o que é normalmente esperado (event.target.value)
    function triggerChange(newValue)
    {
        const fakeEvent =
        {
            target: { value: newValue },
        };
        
        onChange(fakeEvent);
    }
    
    
    function handleKeyDown(event)
    {
        if (event.key === "ArrowUp")
        {
            event.preventDefault();
            handleIncrement();
        }
        
        if (event.key === "ArrowDown")
        {
            event.preventDefault();
            handleDecrement();
        }
    }
    
    
    return(
        <div className={`custom-number-input ${className}`}>
            <input
                id={id}
                className="number-input"
                type="number"
                ref={inputRef}
                value={value}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                min={min}
                max={max}
                step={step}
                role="spinbutton"
            />
            
            <button
                type="button"
                className="button-decrement"
                aria-label="Diminuir valor"
                onClick={handleDecrement}
            >
                -
            </button>
            
            <button
                type="button"
                className="button-increment"
                aria-label="Aumentar valor"
                onClick={handleIncrement}
            >
                +
            </button>
        </div>
    );
}
