export default function ExpensesTablePagination(props)
{
    const { pagination, setPagination, totalPages, totalExpenses} = props;    
    const pageIndex = pagination.pageIndex;
    
    
    function canGoToPrevious()
    {
        if (pageIndex === 0)
        {
            return(false);
        }
        
        return(true);
    }
    
    
    function canGoToNext()
    {
        if (pageIndex === totalPages - 1
            || totalExpenses === 0)
        {
            return(false);
        }
        
        return(true);
    }
    
    
    function handleGoToPrevious()
    {
        setPagination(previousPagination => ({
            pageIndex: previousPagination.pageIndex - 1,
            pageSize: previousPagination.pageSize
        }));
    }
    
    
    function handleGoToNext()
    {
        setPagination(previousPagination => ({
            pageIndex: previousPagination.pageIndex + 1,
            pageSize: previousPagination.pageSize
        }));
    }
    
    
    function getCurrentPageOfTotal()
    {
        if (totalExpenses === 0)
        {
            return("0 Páginas");
        }
        
        return(
            <>
            Página{" "}
            <strong>
                {pageIndex + 1} de {totalPages}
            </strong>
            </>
        );
    }
    
    

    return(
        <div className="table-pagination-container">
            <button
                type="button"
                onClick={handleGoToPrevious}
                disabled={canGoToPrevious() === false}
                aria-label="Página anterior"
            >
                Anterior
            </button>
            
            <span>
                {getCurrentPageOfTotal()}
            </span>
            
            <button
                type="button"
                onClick={handleGoToNext}
                disabled={canGoToNext() === false}
                aria-label="Página seguinte"
            >
                Próxima
            </button>
            
        </div>
    );
}
