import { useEffect, useRef } from "react";
import InsertIncomeForm from "./InsertIncomeForm";
import UpdateIncomeForm from "./UpdateIncomeForm";
import InsertExpensesForm from "./InsertExpensesForm";
import UpdateExpensesForm from "./UpdateExpensesForm";
import DeleteExpensesForm from "./DeleteExpensesForm";


export default function FormModal(props)
{
    const
    {
        formType,
        isFormModalOpen,
        expensesData,
        onSubmitSuccess,
        onValueChange,
        onCancel,
        menuButtonRef
        
    } = props;
    
    const formDialogRef = useRef(null);
    
    const formsToShow =
    {
        "insertIncome": <InsertIncomeForm
            onSubmitSuccess={onSubmitSuccess}
            onValueChange={onValueChange}
            onCancel={onCancel}
        />,
        
        "updateIncome": <UpdateIncomeForm
            onSubmitSuccess={onSubmitSuccess}
            onValueChange={onValueChange}
            onCancel={onCancel}
        />,
        
        "insertExpenses": <InsertExpensesForm
            onSubmitSuccess={onSubmitSuccess}
            onValueChange={onValueChange}
            onCancel={onCancel}
        />,
        
        "updateExpenses": <UpdateExpensesForm
            onSubmitSuccess={onSubmitSuccess}
            expensesData={expensesData}
            onValueChange={onValueChange}
            onCancel={onCancel}
        />,
        
        "deleteExpenses": <DeleteExpensesForm
            onSubmitSuccess={onSubmitSuccess}
            expensesData={expensesData}
            onValueChange={onValueChange}
            onCancel={onCancel}
        />,
    };
    
    
    function handleDialogEscape(event)
    {
        event.preventDefault();
        onCancel();
    }
    
    
    useEffect(() =>
    {
        if (isFormModalOpen === true &&
            formDialogRef.current !== null)
        {
            formDialogRef.current.showModal();
            const firstFocusable = formDialogRef.current.querySelector("input, select");
            firstFocusable.focus();
        }
        else if (isFormModalOpen === false &&
            formDialogRef.current.open === true)
        {
            formDialogRef.current.close();
        }
        
        return(() => menuButtonRef.current.focus());
    
    }, [isFormModalOpen]);

    
    return(
        <dialog
            tabIndex={-1}
            className="modal-content"
            ref={formDialogRef}
            onCancel={handleDialogEscape}
            aria-label="Modal de receita / despesas"
            aria-modal="true"
        >
            {formsToShow[formType]}
        </dialog>
    );
}
