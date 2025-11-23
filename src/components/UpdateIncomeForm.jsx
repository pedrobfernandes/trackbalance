import { useState } from "react";
import { NumberInput }  from "../custom-components/inputs";
import { useFormFieldValidation } from "../hooks/useFormFieldValidation";
import FormFieldErrorMessage from "./FormFieldErrorMessage";


export default function UpdateIncomeForm(props)
{
    const { onSubmitSuccess, onValueChange, onCancel } = props;
    const [updatedIncome, setUpdatedIncome] = useState(0);
    
    const
    {
        error, validateNumber,
        focusField, clearError
    
    } = useFormFieldValidation();
    
    
    function handleSubmit(event)
    {
        event.preventDefault();
        clearError();
        
        if (validateNumber(updatedIncome, "receita") === false)
        {
            focusField("new-income-input");
            return;
        }
        
        onValueChange("updateIncome", updatedIncome);
        setUpdatedIncome(0);
        onSubmitSuccess();
    }
    
    
    return(
        <form onSubmit={handleSubmit} noValidate>
            <label htmlFor="new-income-input">Insira a nova receita:</label>
            <NumberInput
                id="new-income-input"
                value={updatedIncome}
                onChange={(event) => setUpdatedIncome(parseFloat(event.target.value))}
                step={0.01}
                min={1}
            />
            <button type="submit">Enviar</button>
            <button type="button" onClick={onCancel}>Cancelar</button>
            
            <FormFieldErrorMessage error={error}/>
            
        </form>
    );
}
