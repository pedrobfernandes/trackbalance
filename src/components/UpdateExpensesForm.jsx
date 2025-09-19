import { useState } from "react";


export default function UpdateExpensesForm(props)
{
    const
    {
        onSubmitSuccess, expensesData,
        onValueChange, onCancel
    
    } = props;
    
    const initialCategory = expensesData[0].category;
    const [newExpense, setNewExpense] = useState({ category: initialCategory, amount: 0 });
    
    
    const categories = expensesData.map(expense =>
    {
        return(expense.category)
    });
    
    
    function handleCategoryChange(event)
    {
        const category = event.target.value;
        
        setNewExpense((previous) => ({
            category: category,
            amount: previous.amount,
        }));
    }
    
    
    function handleAmountChange(event)
    {
        const expense =  parseFloat(event.target.value);
        
        setNewExpense((previous) => ({
            category: previous.category,
            amount: expense,
        }));
    }
    
    
    function handleSubmit(event)
    {
        event.preventDefault();
        onValueChange("updateExpenses", newExpense);
        setNewExpense({ category: "", amount: 0 });        
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
                value={newExpense.category}
                onChange={handleCategoryChange}
            >
                {selectOptions}
            </select>
        );
    }
    
    const expensesSelect = renderExpenseSelect();


    return(
        <form onSubmit={handleSubmit}>
            <label htmlFor="expenses-select">Escolha a despesa:</label>
            {expensesSelect}
            
            <label htmlFor="new-value-input">Digite o novo valor:</label>
            <input
                id="new-value-input"
                type="number"
                value={newExpense.amount}
                onChange={handleAmountChange}
                step={0.01}
                min={1}
            />
            <button type="submit">Enviar</button>
            <button type="button" onClick={onCancel}>Cancelar</button>
        </form>
    );
}
