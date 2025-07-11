export default function OptionsButton(props)
{
    const { text, action } = props;
    
    return(
        <button
            type="button"
            onClick={action}
        >
            {text}
        </button>
    );
}
