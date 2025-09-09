import { supabase } from "../lib/supabaseClient";


export async function fetchUserFlags(userId)
{
    try
    {
        const { data: fetchData, error: fetchError } = await supabase
            .from("user_flags")
            .select("*")
            .eq("user_id", userId)
            .maybeSingle();
        
        if (fetchError !== null && fetchError !== undefined)
        {
            return({
                data: null,
                error: "Erro ao buscar flags do usuário",
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
            error: "Flags do usuário não foram encontradas",
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


export async function insertUserFlags(userId, monthId)
{
    try
    {
        const { data: insertedData, error: insertedError } = await supabase
            .from("user_flags")
            .insert({
                user_id: userId,
                first_month_id: monthId,
                last_month_id: monthId,
                current_month_id: monthId
            })
            .select()
            .maybeSingle();
        
        if (insertedError !== null && insertedError !== undefined)
        {
            return({
                data: null,
                error: "Erro ao ativar flags do usuário",
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
            error: "Flags do usuário não foram ativadas, " +
            "mas não retornou erro",
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


export async function updateUserFlags({ userId, lastMonthId, currentMonthId })
{
    try
    {
        const { data: updatedData, error: updatedError } = await supabase
            .from("user_flags")
            .update({
                last_month_id: lastMonthId,
                current_month_id: currentMonthId
            })
            .eq("user_id", userId)
            .select()
            .maybeSingle();
        
        if (updatedError !== null && updatedError !== undefined)
        {
            return({
                data: null,
                error: "Erro atualizando flags do usuário",
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
            error: "Flags de usuário não foram atualizadas, " +
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
