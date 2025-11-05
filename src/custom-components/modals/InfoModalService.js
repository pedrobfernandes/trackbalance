let alertFunction = null;
let confirmFunction = null;


// Permite usar em arquivo js (não componente) no mesmo projeto
export function registerInfoModalFunctions({ alert, confirm })
{
    alertFunction = alert;
    confirmFunction = confirm;
}


export function showAlert(message)
{
    if (alertFunction === null)
    {
        console.error("Modal service não foi inicializado ainda");
        return(Promise.resolve());
    }
    
    return(alertFunction(message));
}


export function showConfirm(message)
{
    if (confirmFunction === null)
    {
        console.error("Modal service não foi inicializado ainda");
        return(Promise.resolve(false));
    }
    
    return(confirmFunction(message));
}
