import { useEffect } from "react";
import Modal from "react-modal";
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
        onRequestClose,
        shouldCloseOnOverlayClick,
        expensesData,
        onSubmitSuccess,
        onValueChange,
        onCancel,
        
    } = props;
    
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
    
    
    useEffect(() =>
    {
        if (isFormModalOpen)
        {
            document.body.style.overflow = "hidden";
        }
        else
        {
            document.body.style.overflow = "auto";
        }
        
        return(() =>
        {
            document.body.style.overflow = "auto";
        })
    
    }, [isFormModalOpen]);

    
    return(
        <Modal
            overlayClassName="ReactModal__Overlay"
            className="ReactModal__Content"
            isOpen={isFormModalOpen}
            onRequestClose={onRequestClose}
            shouldCloseOnOverlayClick={shouldCloseOnOverlayClick}
        >
            {formsToShow[formType]}
        </Modal>
    );
}
