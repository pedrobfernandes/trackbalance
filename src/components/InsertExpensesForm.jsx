import { useState } from "react";
import { NumberInput } from "../custom-components/inputs";
import { useFormFieldValidation } from "../hooks/useFormFieldValidation";
import FormFieldErrorMessage from "./FormFieldErrorMessage";


export default function InsertExpensesForm(props)
{
    const { onSubmitSuccess, expensesData, onValueChange, onCancel } = props;
    const [expense, setExpense] = useState({ category: "", amount: 0 });
    const [expenseError, setExpenseError] = useState(null);
    
    const
    {
        error, validateNumber,
        validateText, focusField,
        clearError
    
    } = useFormFieldValidation();
    
    
    function handleCategoryInput(event)
    {
        setExpense((previous) => ({
            category: event.target.value.toLowerCase(),
            amount: previous.amount,
        }));
    }
    
    
    function handleAmountInput(event)
    {
        setExpense((previous) => ({
            category: previous.category,
            amount: parseFloat(event.target.value),
        }));
    }
    
    
    function handleSubmit(event)
    {
        event.preventDefault();
        clearError();
        
        const hasAlready = expensesData.some(expenseData =>
            expenseData.category === expense.category
        );
        
        if (hasAlready === true)
        {
            setExpenseError(
            `A despesa ${expense.category} ja foi registrada.` +
            " Não é permitido categorias repetidas no mesmo mês"
            );
            
            focusField("expense-category-input");
            return;
        }
        
        
        if (validateText(expense.category, "categoria") === false)
        {
            focusField("expense-category-input");
            return;
        }
        
        if (validateNumber(expense.amount, "valor") === false)
        {
            focusField("expense-amount-input");
            return;
        }
        
        
        onValueChange("insertExpenses", expense);
        setExpense({ category: "", amount: 0 });        
        onSubmitSuccess();
    }
    
    
    return(
        <form onSubmit={handleSubmit} noValidate>
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
            
            <FormFieldErrorMessage error={error || expenseError}/>
            
        </form>
    );
}
