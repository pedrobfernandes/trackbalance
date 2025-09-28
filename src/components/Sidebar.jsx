import "./Sidebar.css";


export default function Sidebar(props)
{
    const { children, isOpen } = props;
    
    return(
        <>
            <aside
                className={`full-sidebar ${isOpen ? "open" : "closed"}`}
                aria-label="Menu lateral completo com opções detalhadas"
                aria-hidden={!isOpen}
            >
                {isOpen && children}
            </aside>
        </>
    );
}
