export default function OptionsButton(props)
{
    const { text, action, disabled = false } = props;
    
    return(
        <button
            type="button"
            onClick={action}
            disabled={disabled}
        >
            {text}
        </button>
    );
}
