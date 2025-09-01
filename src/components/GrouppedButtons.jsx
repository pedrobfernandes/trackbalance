import OptionsButton from "./OptionsButton";

export default function GrouppedButtons(props)
{
    const
    {
        type, onInsert, onUpdate,
        onDelete, onExportToCsv,
        onExportToPdf, onNavigateToNext,
        onNavigateToPrevious, disabledButtons = {}
        
    } = props;
    
    
    const mappedButtons =
    {
        receita:
        [
            {
                text: "Inserir", action: onInsert,
                disabled: disabledButtons["Inserir"]
            },
            
            {
                text: "Atualizar", action: onUpdate,
                disabled: disabledButtons["Atualizar"]
            },
            
            {
                text: "Deletar", action: onDelete,
                disabled: disabledButtons["Deletar"]
            },
        ],
        
        despesa:
        [
            {
                text: "Inserir", action: onInsert,
                disabled: disabledButtons["Inserir"]
            },
            
            {
                text: "Atualizar", action: onUpdate,
                disabled: disabledButtons["Atualizar"]
            },
            
            {
                text: "Deletar", action: onDelete,
                disabled: disabledButtons["Deletar"]
            },
        ],
        
        exportar:
        [
            { text: "CSV", action: onExportToCsv },
            { text: "PDF", action: onExportToPdf },
        ],
        
        navegar:
        [
            { text: "Anterior", action: onNavigateToPrevious },
            { text: "Próximo", action: onNavigateToNext }
        ]
    };
    
    
    function renderButton(item, index)
    {
        return(
            <OptionsButton
                key={index}
                text={item.text}
                action={item.action}
                disabled={item.disabled || false}
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
