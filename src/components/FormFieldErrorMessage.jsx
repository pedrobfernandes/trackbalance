import "./FormFieldErrorMessage.css";

export default function FormFieldErrorMessage(props)
{
    const { error, className = "" } = props;
    
    //~ if (error === null)
    //~ {
        //~ return(null);
    //~ }
    
    
    return(
        <p
            className={`form-field-error-message ${className}`}
            aria-live="assertive"
            aria-atomic="true"
        >
            {error || ""}
        </p>
    );
}
