import { useState } from "react";
import { NumberInput } from "../custom-components/inputs";


export default function InsertExpensesForm(props)
{
    const { onSubmitSuccess, onValueChange, onCancel } = props;
    const [expense, setExpense] = useState({ category: "", amount: 0 });
    
    
    function handleCategoryInput(event)
    {
        const newCategory = event.target.value
        
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
    
    
    function handleSubmit(event)
    {
        event.preventDefault();
        
        const normalizedCategory = expense.category
            .trim()
            .replace(/\s+/g,  ' ')
            .toLowerCase();
        
        const normalizedExpense =
        {
            category: normalizedCategory,
            amount: expense.amount
        }
        
        onValueChange("insertExpenses", normalizedExpense);
        setExpense({ category: "", amount: 0 });        
        onSubmitSuccess();
    }
    
    
    return(
        <form onSubmit={handleSubmit}>
            <label
                id="expenses-category-label"
                htmlFor="expense-category-input"
            >
                Digite a categoria da despesa (exemplo: Aluguel):
            </label>
            <input
                id="expense-category-input"
                type="text"
                value={expense.category}
                onChange={handleCategoryInput}
                required
            />

            <label htmlFor="expense-amount-input">Digite o valor da despesa:</label>
            <NumberInput
                id="expense-amount-input"
                value={expense.amount}
                onChange={handleAmountInput}
                step={0.01}
                min={1}
            />
            
            <button type="submit">Enviar</button>
            <button type="button" onClick={onCancel}>Cancelar</button>
        </form>
    );
}
