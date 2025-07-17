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
            onCancel={onCancel}
        />,
        
        "insertExpenses": <InsertExpensesForm
            onSubmitSuccess={onSubmitSuccess}
            onValueChange={onValueChange}
            onCancel={onCancel}
        />,
        
        "updateExpenses": <UpdateExpensesForm
            onSubmitSuccess={onSubmitSuccess}
            onCancel={onCancel}
        />,
        
        "deleteExpenses": <DeleteExpensesForm
            onSubmitSuccess={onSubmitSuccess}
            onCancel={onCancel}
        />,
    };

    
    return(
        <Modal
            isOpen={isFormModalOpen}
            onRequestClose={onRequestClose}
            shouldCloseOnOverlayClick={shouldCloseOnOverlayClick}
        >
            {formsToShow[formType]}
        </Modal>
    );
}
