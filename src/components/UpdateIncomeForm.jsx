import { useState } from "react";

export default function UpdateIncomeForm(props)
{
    const { onSubmitSuccess, onCancel } = props;
    
    const [newIncome, setNewIncome] = useState(3000);
    const [oldIncome, setOldincome] = useState(newIncome);
    
    function handleSubmit(event)
    {
        event.preventDefault();
        console.log("Nova receita: ", newIncome);
        setOldincome(newIncome);
        setNewIncome(0);
        
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
                value={newIncome}
                onChange={(event) => setNewIncome(event.target.value)}
                required
            />
            <button type="submit">Enviar</button>
            <button type="button" onClick={onCancel}>Cancelar</button>
        </form>
    );
}
