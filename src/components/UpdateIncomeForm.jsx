import { useState } from "react";

export default function UpdateIncomeForm(props)
{
    const { onSubmitSuccess, onCancel } = props;
    
    const [updatedIncome, setUpdatedIncome] = useState(3000);
    const [oldIncome, setOldIncome] = useState(updatedIncome);
    
    function handleSubmit(event)
    {
        event.preventDefault();
        console.log("Nova receita: ", updatedIncome);
        setOldIncome(updatedIncome);
        setUpdatedIncome(0);
        
        onSubmitSuccess();
    }
    
    
    return(
        <form onSubmit={handleSubmit}>
            <p>Sua antiga receita: R$ {oldIncome}</p>
            <label htmlFor="new-income-input">Insira a nova receita:</label>
            <input
                id="new-income-input"
                type="number"
                step={0.01}
                min={1}
                value={updatedIncome}
                onChange={(event) => setUpdatedIncome(event.target.value)}
                required
            />
            <button type="submit">Enviar</button>
            <button type="button" onClick={onCancel}>Cancelar</button>
        </form>
    );
}
