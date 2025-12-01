import "./FormFieldStatusMessage.css";

export default function FormFieldStatusMessage(props)
{
    const { status, className = "" } = props;
    
    return(
        <p
            className={`form-field-status-message ${className}`}
            aria-live="assertive"
            aria-atomic="true"
        >
            {status || ""}
        </p>
    );
}
