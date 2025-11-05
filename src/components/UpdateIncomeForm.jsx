import { useState } from "react";
import { NumberInput }  from "../custom-components/inputs";


export default function UpdateIncomeForm(props)
{
    const { onSubmitSuccess, onValueChange, onCancel } = props;
    const [updatedIncome, setUpdatedIncome] = useState(0);
    
    
    function handleSubmit(event)
    {
        event.preventDefault();
        onValueChange("updateIncome", parseFloat(updatedIncome).toFixed(2));
        setUpdatedIncome(0);
        onSubmitSuccess();
    }
    
    
    return(
        <form onSubmit={handleSubmit}>
            <label htmlFor="new-income-input">Insira a nova receita:</label>
            <NumberInput
                id="new-income-input"
                value={updatedIncome}
                onChange={(event) => setUpdatedIncome(event.target.value)}
                step={0.01}
                min={1}
            />
            <button type="submit">Enviar</button>
            <button type="button" onClick={onCancel}>Cancelar</button>
        </form>
    );
}
