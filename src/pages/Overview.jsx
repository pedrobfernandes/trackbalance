import { useState } from "react";
import GrouppedButtons from "../components/GrouppedButtons";
import FormModal from "../components/FormModal";
import ExpensesTable from "../components/ExpensesTable";

export default function Overview(props)
{
    const { onExit } = props;
    
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [formType, setFormType] = useState("");
    
     const [income, setIncome] = useState(0);
     const [expenses, setExpenses] = useState([]);
    
    
    const totalExpenses = expenses.reduce(
        (accumulator, expense) =>
            accumulator + expense.amount, 0).toFixed(2);

    
    const remaining = parseFloat(income - totalExpenses).toFixed(2);
    
    
    // TODO: Criar um objeto com formType e uma string;
    // Ex talvez algo como: { "receita": [ "inserir", "atualizar", "deletar" ], "despesas" [ "inserir", "atualizar", "deletar" ], }
    // Apos talvez fazer apenas uma função mais generica (handleClick por exemplo) e passar o inserir atualizar ou deletar para setFormType..
    // Ao invez de ter estas funções todas handleInsertIncome handleUpdateIncome etc..
    //??? Que tal?? Será???
    
    function handleInsertIncome()
    {
        console.log("Inserindo receita");
        setFormType("insertIncome");
        setIsFormModalOpen(true);
    }
    
    function handleUpdateIncome()
    {
        console.log("Atualizando receita");
        setFormType("updateIncome");
        setIsFormModalOpen(true);
    }
    
    function handleDeleteIncome()
    {
        const confirmed = window.confirm("Tem certeza que deseja deletar a receita?");
        
        if (confirmed === true)
        {
            console.log("Deletando receita");
        }
    }
    
    
    function handleInsertExpenses()
    {
        console.log("Inserindo despesas");
        setFormType("insertExpenses");
        setIsFormModalOpen(true);
    }
    
    function handleUpdateExpenses()
    {
        console.log("Atualizando despesas");
        setFormType("updateExpenses");
        setIsFormModalOpen(true);
    }
    
    function handleDeleteExpenses()
    {
        console.log("Deletando despesas");
        setFormType("deleteExpenses");
        setIsFormModalOpen(true);
    }
    
    function exportToCsv()
    {
        console.log("Exportando para CSV");
    }
    
    function exportToPdf()
    {
        console.log("Exportando para PDF");
    }
    
    
    function handleCloseModal()
    {
        setIsFormModalOpen(false);
    }
    
    function handleSetNewExpense(newExpense)
    {
        const category = newExpense.category;
        const amount = newExpense.amount;
        
        setExpenses(previousExpenses => [...previousExpenses, {category, amount}]);
    }
    
    
    function handleValueChange(formType, value)
    {
        if (formType === "insertIncome" || formType === "updateIncome")
        {
            setIncome(value);
        }
        else if (formType === "insertExpense")
        {
            handleSetNewExpense(value);
        }
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
                        <p>R$ {income}</p>
                    </div>
                    
                    <div className="expenses-summary-container">
                        <h3>Despesas</h3>
                        <p>R$ {totalExpenses}</p>
                    </div>
                    
                    <div className="remaining-summary-container">
                        <h3>Restante</h3>
                        <p>R$ {remaining}</p>
                    </div>
                    
                </div>
                
            </section>
            
            
            <section className="details-section">
                
                <div className="details-container">
                    <h2>Detalhes</h2>
                    
                    <div className="table-container">
                        <h3>Tabela</h3>
                        <ExpensesTable expensesData={expenses}/>
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
            
            {
                isFormModalOpen ?
                (
                    <FormModal
                        formType={formType}
                        isFormModalOpen={isFormModalOpen}
                        onRequestClose={() => {}}
                        shouldCloseOnOverlayClick={false}
                        onSubmitSuccess={handleCloseModal}
                        onValueChange={handleValueChange}
                        onCancel={handleCloseModal}
                    />
                ) : null
            }
            
        </main>
    );
}
