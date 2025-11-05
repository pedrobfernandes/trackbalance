import { useState } from "react";
import { NumberInput } from "../custom-components/inputs";


export default function InsertIncomeForm(props)
{
    const { onSubmitSuccess, onValueChange, onCancel } = props;
    const [income, setIncome] = useState(0);
    
    
    function handleSubmit(event)
    {
        event.preventDefault();
        onValueChange("insertIncome", parseFloat(income).toFixed(2));
        setIncome(0);
        onSubmitSuccess();
    }
    
    
    return(
        <form onSubmit={handleSubmit}>
            <label htmlFor="income-input">Digite o valor total da receita:</label>
            <NumberInput
                id="income-input"
                value={income}
                onChange={(event) => setIncome(event.target.value)}
                step={0.01}
                min={1}
            />
            <button type="submit">Enviar</button>
            <button type="button" onClick={onCancel}>Cancelar</button>
        </form>
    );
}
