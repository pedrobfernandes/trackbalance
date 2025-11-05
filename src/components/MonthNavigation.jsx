import { useState } from "react";
import { NumberInput } from "../custom-components/inputs";
import { CustomSelect } from "../custom-components/inputs";


export default function MonthNavigation(props)
{
    const { onSubmitSuccess, onValueChange, onCancel } = props;
    
    const monthsMap =
    {
        "Janeiro": 0, "Fevereiro": 1, "Março": 2,
        "Abril": 3, "Maio": 4, "Junho": 5, "Julho": 6,
        "Agosto": 7, "Setembro": 8, "Outubro": 9,
        "Novembro": 10, "Dezembro": 11
    };
    
    const monthNames = Object.keys(monthsMap);
    const today = new Date();
    const [month, setMonth] = useState(monthNames[today.getMonth()]);
    const [year, setYear] = useState(today.getFullYear());
    
    
    async function handleSubmit(event)
    {
        event.preventDefault();
        
        try
        {
            const canNavigate = await onValueChange({
                year: year,
                month: monthsMap[month] + 1
            });
            
            if (canNavigate === true)
            {
                onSubmitSuccess();
            }
        }
        catch (error)
        {
            console.error("Erro ao navegar:", error);
        }
        
    }
    
    
    
    return(
        <form onSubmit={handleSubmit}>
            <CustomSelect
                label="Escolha o Mês"
                value={month}
                options={monthNames}
                onChange={(newMonth) => setMonth(newMonth)}
            />
            
            <label htmlFor="year-input">Digite o ano</label>
            <NumberInput
                id="year-input"
                value={year}
                min={1900}
                max={2100}
                step={1}
                onChange={(event) => setYear(event.target.value)}
            />
            <button type="submit">Ir</button>
            <button type="button" onClick={onCancel}>Cancelar</button>
            
        </form>
    );
}
