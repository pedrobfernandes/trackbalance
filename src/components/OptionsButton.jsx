export default function OptionsButton(props)
{
    const { text, action, label, disabled = false } = props;
    
    
    return(
        <button
            type="button"
            onClick={action}
            disabled={disabled}
            aria-label={label}
        >
            {text}
        </button>
    );
}
