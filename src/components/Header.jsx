export default function Header(props)
{
    const { onExit } = props;
    
    return(
        <header>
            <h1>TrackBalance</h1>
            <button
                type="button"
                onClick={onExit}
            >
                Sair
            </button>
        </header>
    );
}
