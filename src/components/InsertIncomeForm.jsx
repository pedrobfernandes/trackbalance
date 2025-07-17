import { useState } from "react";

export default function InsertIncomeForm(props)
{
    const { onSubmitSuccess, onValueChange, onCancel } = props;
    
    const [income, setIncome] = useState("");
    
    
    function handleSubmit(event)
    {
        event.preventDefault();
        console.log("Receita inserida: ", income);
        
        onValueChange("insertIncome", parseFloat(income));
        
        setIncome("");
        onSubmitSuccess();
    }
    
    return(
        <form onSubmit={handleSubmit}>
            <label htmlFor="income-input">Digite a receita total:</label>
            <input
                id="income-input"
                type="number"
                step={0.01}
                min={1}
                value={income}
                onChange={(event) => setIncome(event.target.value)}
                required
            />
            <button type="submit">Enviar</button>
            <button type="button" onClick={onCancel}>Cancelar</button>
        </form>
    );
}
