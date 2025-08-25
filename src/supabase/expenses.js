import { supabase } from "../lib/supabaseClient";


export async function fetchExpenses(monthId)
{
    try
    {
        const { data: fetchData, error: fetchError } = await supabase
            .from("expenses")
            .select("*")
            .eq("month_id", monthId);
        
        if (fetchError !== null && fetchError !== undefined)
        {
            return({
                data: null,
                error: "Erro ao buscar as despesas",
                status: "error"
            });
        }
        
        if (fetchData !== null  && fetchData !== undefined &&
            Array.isArray(fetchData) && fetchData.length > 0)
        {
            return({
                data: fetchData,
                error: null,
                status: "success"
            });
        }
        
        return({
            data: null,
            error: "Nenhuma despesa encontrada " +
            "para o mês selecionado",
            status: "not_found"
        })
    }
    catch (error)
    {
        return({
            data: null,
            error: "Erro de conexão. " +
            "Verifique sua internet ou tente mais tarde",
            status: "network_error"
        });
    }
}


export async function insertExpense({ monthId, category, amount })
{
    try
    {
        const { data: insertedData, error: insertedError } = await supabase
            .from("expenses")
            .insert({
                month_id: monthId,
                category: category,
                amount: amount
            })
            .select()
            .maybeSingle();
        
        if (insertedError !== null && insertedError !== undefined)
        {
            return({
                data: null,
                error: "Erro ao inserir despesa",
                status: "error"
            });
        }
        
        if (insertedData !== null && insertedData !== undefined)
        {
            return({
                data: insertedData,
                error: null,
                status: "success"
            });
        }
        
        return({
            data: null,
            error: "Despesa não foi inserida, " +
            "mas nenhum erro foi retornado",
            status: "unknown_error"
        });
            
    }
    catch (error)
    {
        return({
            data: null,
            error: "Erro de conexão. " +
            "Verifique sua internet ou tente mais tarde",
            status: "network_error"
        });
    }
}


export async function updateExpense({ monthId, category, amount })
{
    try
    {
        const { data: updatedData, error: updatedError } = await supabase
            .from("expenses")
            .update({ amount: amount })
            .eq("month_id", monthId)
            .eq("category", category)
            .select()
            .maybeSingle();
        
        if (updatedError !== null && updatedError !== undefined)
        {
            return({
                data: null,
                error: "Erro ao atualizar valor da despesa",
                status: "error"
            });
        }
        
        if (updatedData !== null && updatedData !== undefined)
        {
            return({
                data: updatedData,
                error: null,
                status: "success"
            });
        }
        
        return({
            data: null,
            error: "Despesa não foi atualizada, " +
            "mas nenhum erro foi retornado",
            status: "unknown_error"
        });
    }
    catch (error)
    {
        return({
            data: null,
            error: "Erro de conexão. " +
            "Verifique sua internet ou tente mais tarde",
            status: "network_error"
        });
    }
}


export async function deleteExpense({ monthId, category })
{
    try
    {
        const { data: deletedData, error: deletedError } = await supabase
            .from("expenses")
            .delete()
            .eq("month_id", monthId)
            .eq("category", category)
            .select()
            .maybeSingle();
        
        if (deletedError !== null && deletedError !== undefined)
        {
            return({
                data: null,
                error: "Erro ao deletar despesa",
                status: "error"
            });
        }
        
        if (deletedData !== null && deletedData !== undefined)
        {
            return({
                data: deletedData,
                error: null,
                status: "success"
            });
        }

        return({
            data: null,
            error: "Nenhuma despesa com essa " +
            "categoria encontrada para deletar",
            status: "not_found"
        });
            
    }
    catch (error)
    {
        return({
            data: null,
            error: "Erro de conexão. " +
            "Verifique sua internet ou tente mais tarde",
            status: "network_error"
        });
    }
}
