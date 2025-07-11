import GrouppedButtons from "../components/GrouppedButtons";

export default function Overview(props)
{
    const { onExit } = props;
    
    
    function handleInsertIncome()
    {
        console.log("Inserindo receita");
    }
    
    function handleUpdateIncome()
    {
        console.log("Atualizando receita");
    }
    
    function handleDeleteIncome()
    {
        console.log("Deletando receita");
    }
    
    
    function handleInsertExpenses()
    {
        console.log("Inserindo despesas");
    }
    
    function handleUpdateExpenses()
    {
        console.log("Atualizando despesas");
    }
    
    function handleDeleteExpenses()
    {
        console.log("Deletando despesas");
    }
    
    function exportToCsv()
    {
        console.log("Exportando para CSV");
    }
    
    function exportToPdf()
    {
        console.log("Exportando para PDF");
    }
    
    return(
        <main>
            
            
            <section className="options-section">
                
                <div className="options-container">
                    <h2>Opções</h2>
                    
                    <div className="options-income-container">
                        <h3>Receita</h3>
                        <GrouppedButtons
                            type="receita"
                            onInsert={handleInsertIncome}
                            onUpdate={handleUpdateIncome}
                            onDelete={handleDeleteIncome}
                        />
                    </div>
                    
                    <div className="options-expenses-container">
                        <h3>Despesas</h3>
                        <GrouppedButtons
                            type="despesa"
                            onInsert={handleInsertExpenses}
                            onUpdate={handleUpdateExpenses}
                            onDelete={handleDeleteExpenses}
                        />
                    </div>
                    
                    <div className="options-export-container">
                        <h3>Exportar</h3>
                        <GrouppedButtons
                            type="exportar"
                            onExportToCsv={exportToCsv}
                            onExportToPdf={exportToPdf}
                        />
                    </div>
                    
                </div>
                
            </section>
            
            
            <section className="summary-section">
                
                <div className="summary-container">
                    <h2>Sumário</h2>
                    
                    <div className="income-summary-container">
                        <h3>Receita</h3>
                        <p>R$ 5000.00</p>
                    </div>
                    
                    <div className="expenses-summary-container">
                        <h3>Despesas</h3>
                        <p>R$ 3000.00</p>
                    </div>
                    
                    <div className="remaining-summary-container">
                        <h3>Restante</h3>
                        <p>R$ 2000.00</p>
                    </div>
                    
                </div>
                
            </section>
            
            
            <section className="details-section">
                
                <div className="details-container">
                    <h2>Detalhes</h2>
                    
                    <div className="table-container">
                        <h3>Tabela</h3>
                    </div>
                    
                    <div className="donnut-container">
                        <h3>Gráfico Donnut</h3>
                    </div>
                    
                </div>
                
            </section>
            
            
            <button
                type="button"
                onClick={onExit}
            >
                Sair
            </button>
        </main>
    );
}
