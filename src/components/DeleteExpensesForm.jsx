import { useState } from "react";
import { CustomSelect } from "../custom-components/inputs";


export default function DeleteExpensesForm(props)
{
    const
    {
        onSubmitSuccess, expensesData,
        onValueChange, onCancel
    
    } = props;
    
    const initialToDelete = expensesData[0].category;
    const [toDelete, setToDelete] = useState(initialToDelete);
    
    
    const categories = expensesData.map(expense =>
    {
        return(expense.category)
    });


    function handleSubmit(event)
    {
        event.preventDefault();
        onValueChange("deleteExpenses", toDelete);
        onSubmitSuccess();
    }
    
    
    return(
        <form onSubmit={handleSubmit}>
            
            <CustomSelect
                value={toDelete}
                onChange={setToDelete}
                options={categories}
                label="Escolha a despesa para deletar"
            />
            
            <button type="submit">Enviar</button>
            <button type="button" onClick={onCancel}>Cancelar</button>
        </form>
    );
}
