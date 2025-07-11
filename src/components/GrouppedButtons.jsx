import OptionsButton from "./OptionsButton";

export default function GrouppedButtons(props)
{
    const
    {
        type, onInsert, onUpdate,
        onDelete, onExportToCsv,
        onExportToPdf
        
    } = props;
    
    
    const mappedButtons =
    {
        receita:
        [
            { text: "Inserir", action: onInsert },
            { text: "Atualizar", action: onUpdate },
            { text: "Deletar", action: onDelete },
        ],
        
        despesa:
        [
            { text: "Inserir", action: onInsert },
            { text: "Atualizar", action: onUpdate },
            { text: "Deletar", action: onDelete },
        ],
        
        exportar:
        [
            { text: "CSV", action: onExportToCsv },
            { text: "PDF", action: onExportToPdf },
        ],
    };
    
    
    function renderButton(item, index)
    {
        return(
            <OptionsButton
                key={index}
                text={item.text}
                action={item.action}
            />
        );
    }
    
    function getButtonGroups()
    {
        const group = mappedButtons[type];
        
        return(
            group.map(
                (item, index) =>
                    renderButton(item, index)
            )
        );
    }
    
    const buttonGroup = getButtonGroups();
    
    return(
        buttonGroup
    );
}
