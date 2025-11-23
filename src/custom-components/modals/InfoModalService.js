let alertFunction = null;
let confirmFunction = null;


// Permite usar em arquivo js (não componente) no mesmo projeto
export function registerInfoModalFunctions({ alert, confirm })
{
    alertFunction = alert;
    confirmFunction = confirm;
}


export function showAlert(message, onCloseCallback)
{
    if (alertFunction === null)
    {
        console.error("Modal service não foi inicializado ainda");
        return(Promise.resolve());
    }
    
    return(alertFunction(message, onCloseCallback));
}


export function showConfirm(message, onConfirmCallback, onCancelCallback, focusButton = "primary")
{
    if (confirmFunction === null)
    {
        console.error("Modal service não foi inicializado ainda");
        return(Promise.resolve(false));
    }
    
    return(confirmFunction(message, onConfirmCallback, onCancelCallback, focusButton));
}
