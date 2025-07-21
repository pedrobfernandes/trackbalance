import { useState } from "react";

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
    
    function renderSelectOption(option, index)
    {
        return(
            <option key={index} value={option}>{option}</option>
        );
    }

    function renderExpenseSelect()
    {
        const selectOptions = categories.map((category, index) =>
        {
            return(renderSelectOption(category, index))
        });
        
        return(
            <select
                name="expenses"
                id="expenses-select"
                value={toDelete}
                onChange={(event) => setToDelete(event.target.value)}
            >
                {selectOptions}
            </select>
        );
    }
    
    const expensesSelect = renderExpenseSelect();
    
    return(
        <form onSubmit={handleSubmit}>
            <label htmlFor="expense-select">Escolha a despesa para deletar:</label>
            {expensesSelect}
            <button type="submit">Enviar</button>
            <button type="button" onClick={onCancel}>Cancelar</button>
        </form>
    );
}
