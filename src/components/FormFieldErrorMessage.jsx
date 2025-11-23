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
            style={{ color: "red", fontWeight: "700", minBlockSize: "1rem" }}
            aria-live="assertive"
            aria-atomic="true"
        >
            {error || ""}
        </p>
    );
}
