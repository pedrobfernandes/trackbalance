import OptionsButton from "./OptionsButton";


export default function GrouppedButtons(props)
{
    const
    {
        type, onInsert, onUpdate,
        onDelete, onExportToCsv,
        onExportToPdf, disabledButtons = {}
        
    } = props;
    
    
    const mappedButtons =
    {
        receita:
        [
            {
                text: "Inserir", action: onInsert,
                disabled: disabledButtons["Inserir"],
                label: "Inserir a receita"
            },
            
            {
                text: "Atualizar", action: onUpdate,
                disabled: disabledButtons["Atualizar"],
                label: "Atualizar o valor da receita"
            },
            
            {
                text: "Deletar", action: onDelete,
                disabled: disabledButtons["Deletar"],
                label: "Deletar a receita"
            },
        ],
        
        despesa:
        [
            {
                text: "Inserir", action: onInsert,
                disabled: disabledButtons["Inserir"],
                label: "Inserir uma despesa"
            },
            
            {
                text: "Atualizar", action: onUpdate,
                disabled: disabledButtons["Atualizar"],
                label: "Atualizar o valor de uma despesa"
            },
            
            {
                text: "Deletar", action: onDelete,
                disabled: disabledButtons["Deletar"],
                label: "Deletar uma despesa"
            },
        ],
        
        exportar:
        [
            {
                text: "CSV", action: onExportToCsv,
                disabled: disabledButtons["CSV"],
                label: "Exportar os dados para CSV"
            },
            
            {
                text: "PDF", action: onExportToPdf,
                disabled: disabledButtons["PDF"],
                label: "Exportar os dados para PDF"
            },
        ],
    };
    
    
    function renderButton(item, index)
    {
        return(
            <OptionsButton
                key={index}
                text={item.text}
                action={item.action}
                disabled={item.disabled || false}
                label={item.label}
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
