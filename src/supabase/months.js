import { supabase } from "../lib/supabaseClient";


export async function fetchMonth({ userId, year, month })
{
    try
    {
        const { data: fetchData, error: fetchError } = await supabase
            .from("months")
            .select("*")
            .eq("user_id", userId)
            .eq("year", year)
            .eq("month", month)
            .maybeSingle();
        
        if (fetchError !== null && fetchError !== undefined)
        {
            return({
                data: null,
                error: "Erro pegando id do mês",
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
            error: "Mês não encontrado",
            status: "not_found"
        });
    }
    catch (error)
    {
        return({
            data: null,
            error: "Erro de conexão. " +
            "Verifique sua internet ou tente novamente",
            status: "network_error"
        });
    }
}


export async function fetchMonthById(monthId)
{
    try
    {
        const { data: fetchData, error: fetchError } = await supabase
            .from("months")
            .select("*")
            .eq("id", monthId)
            .maybeSingle();
        
        if (fetchError !== null && fetchError !== undefined)
        {
            return({
                data: null,
                error: "Erro ao buscar mês pelo ID",
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
            error: "Mês não encontrado",
            status: "not_found"
        });
    }
    catch (error)
    {
        return({
            data: null,
            error: "Erro de conexão. " +
            "Verifique sua internet ou tente novamente",
            status: "network_error"
        });
    }
}

export async function createMonth({ userId, year, month })
{
    try
    {
        const { data: insertData, error: insertError } = await supabase
            .from("months")
            .insert({ user_id: userId, year: year, month: month })
            .select()
            .maybeSingle();
        
        if (insertError !== null && insertError !== undefined)
        {
            return({
                data: null,
                error: "Erro ao criar o mês",
                status: "error"
            });
        }
        
        if (insertData !== null && insertData !== undefined)
        {
            return({
                data: insertData,
                error: null,
                status: "success"
            });
        }
        
        return({
            data: null,
            error: "Mês não foi inserido, " +
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
