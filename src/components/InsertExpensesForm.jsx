import { useState } from "react";

export default function InsertExpensesForm(props)
{
    const { onSubmitSuccess, onCancel } = props;
    
    const [expense, setExpense] = useState({ category: "", amount: 0 });
    
    function handleCategoryInput(event)
    {
        const newCategory = event.target.value;
        
        setExpense((previous) => ({
            category: newCategory,
            amount: previous.amount,
        }));
    }
    
    function handleAmountInput(event)
    {
        const newAmount = parseFloat(event.target.value);
        
        setExpense((previous) => ({
            category: previous.category,
            amount: newAmount,
        }));
    }
    
    function handleSumbit(event)
    {
        event.preventDefault();
        console.log("Categoria: ", expense.category);
        console.log("Valor: R$ ", expense.amount);
        
        setExpense({ category: "", amount: 0 });        
        onSubmitSuccess();
    }
    
    return(
        <form onSubmit={handleSumbit}>
            <label htmlFor="expense-category-input">Categoria (ex: Aluguel):</label>
            <input
                id="expense-category-input"
                type="text"
                value={expense.category}
                onChange={handleCategoryInput}
                required
            />
            <label htmlFor="expense-amount-input">Valor:</label>
            <input
                id="expense-amount-input"
                type="number"
                step={0.01}
                min={1}
                value={expense.amount}
                onChange={handleAmountInput}
                required
            />
            <button type="submit">Enviar</button>
            <button type="button" onClick={onCancel}>Cancelar</button>
        </form>
    );
}
