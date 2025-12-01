import { useState } from "react";
import { NumberInput } from "../custom-components/inputs";
import { CustomSelect } from "../custom-components/inputs";
import { useFormFieldValidation } from "../hooks/useFormFieldValidation";
import FormFieldStatusMessage from "./FormFieldStatusMessage";


export default function UpdateExpensesForm(props)
{
    const
    {
        onSubmitSuccess, expensesData,
        onValueChange, onCancel
    
    } = props;
    
    const initialCategory = expensesData[0].category;
    const [newExpense, setNewExpense] = useState({ category: initialCategory, amount: 0 });
    
    const
    {
        error, validateNumber,
        focusField, clearError
    
    } = useFormFieldValidation();
    
    
    const categories = expensesData.map(expense =>
    {
        return(expense.category)
    });
    
    
    function handleCategoryChange(category)
    {
        setNewExpense((previous) => ({
            category: category,
            amount: previous.amount,
        }));
    }
    
    
    function handleAmountChange(event)
    {
        setNewExpense((previous) => ({
            category: previous.category,
            amount: parseFloat(event.target.value)
        }));
    }
    
    
    function handleSubmit(event)
    {
        event.preventDefault();
        clearError();
        
        if (validateNumber(newExpense.amount, "nova despesa") === false)
        {
            focusField("new-value-input");
            return;
        }
        
        onValueChange("updateExpenses", newExpense);
        setNewExpense({ category: "", amount: 0 });        
        onSubmitSuccess();
    }


    return(
        <form onSubmit={handleSubmit} noValidate>

            <CustomSelect
                value={newExpense.category}
                onChange={handleCategoryChange}
                options={categories}
                label="Escolha a categoria para atualizar o valor"
            />
            
            <label htmlFor="new-value-input">Digite o novo valor:</label>
            <NumberInput
                id="new-value-input"
                value={newExpense.amount}
                onChange={handleAmountChange}
                step={0.01}
                min={1}
            />
            
            <button type="submit">Enviar</button>
            <button type="button" onClick={onCancel}>Cancelar</button>
            
            <FormFieldStatusMessage status={error}/>
            
        </form>
    );
}
