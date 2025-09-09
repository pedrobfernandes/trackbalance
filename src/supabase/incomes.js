import { supabase } from "../lib/supabaseClient";


export async function fetchIncome(monthId)
{
    try
    {
        const { data: fetchData, error: fetchError } = await supabase
            .from("incomes")
            .select("*")
            .eq("month_id", monthId)
            .maybeSingle();
        
        if (fetchError !== null && fetchError !== undefined)
        {
            return({
                data: null,
                error: "Erro ao buscar a receita",
                status: "error"
            });
        }
        
        if (fetchData !== null && fetchData !== undefined)
        {
            return({
                data: fetchData,
                error: null,
                status: "success"
            });
        }
        
        return({
            data: null,
            error: "Nenhuma receita encontrada " +
            "para o mês selecionado",
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


export async function insertIncome(monthId, amount)
{
    try
    {
        const { data: insertedData, error: insertedError } = await supabase
            .from("incomes")
            .insert({ month_id: monthId, amount: amount })
            .select()
            .maybeSingle();
        
        if (insertedError !== null && insertedError !== undefined)
        {
            return({
                data: null,
                error: "Erro ao inserir receita",
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
            error: "Receita não foi inserida, " +
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


export async function updateIncome(monthId, amount)
{
    try
    {
        const { data:updatedData, error: updatedError } = await supabase
            .from("incomes")
            .update({ amount: amount })
            .eq("month_id", monthId)
            .select()
            .maybeSingle();
        
        if (updatedError !== null && updatedError !== undefined)
        {
            return({
                data: null,
                error: "Erro ao atualizar receita",
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
            error: "Nenhuma receita encontrada " +
            " para o mês selecionado",
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


export async function deleteIncome(monthId)
{
    try
    {
        const { data: deletedData, error: deletedError } = await supabase
            .from("incomes")
            .delete()
            .eq("month_id", monthId)
            .select()
            .maybeSingle();
        
        if (deletedError !== null && deletedError !== undefined)
        {
            return({
                data: null,
                error: "Erro deletando receita",
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
            error: "Nenhuma receita encontrada " +
            "para o mês selecionado",
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
