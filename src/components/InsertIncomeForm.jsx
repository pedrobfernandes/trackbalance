import { useState, useRef } from "react";
import { NumberInput } from "../custom-components/inputs";
import { useFormFieldValidation } from "../hooks/useFormFieldValidation";
import FormFieldStatusMessage from "./FormFieldStatusMessage";


export default function InsertIncomeForm(props)
{
    const { onSubmitSuccess, onValueChange, onCancel } = props;
    const [income, setIncome] = useState(0);
    
    const
    {
        error, validateNumber,
        focusField, clearError
    
    } = useFormFieldValidation();
    
    
    function handleSubmit(event)
    {
        event.preventDefault();
        clearError();
        
        if (validateNumber(income, "receita") === false)
        {
            focusField("income-input");
            return;
        }
        
        onValueChange("insertIncome", income);
        setIncome(0);
        onSubmitSuccess();
    }
    
    
    return(
        <form onSubmit={handleSubmit} noValidate>
            <label htmlFor="income-input">Digite o valor total da receita:</label>
            <NumberInput
                id="income-input"
                value={income}
                onChange={(event) => setIncome(parseFloat(event.target.value))}
                step={0.01}
                min={1}
            />
            <button type="submit">Enviar</button>
            <button type="button" onClick={onCancel}>Cancelar</button>
            
            <FormFieldStatusMessage status={error}/>
        
        </form>
    );
}
