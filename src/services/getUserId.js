import { supabase } from "../lib/supabaseClient";


async function getUser()
{
    const user = await supabase.auth.getUser();
    return(user);
}


export async function getUserId()
{
    try
    {
        const response = await getUser();
        
        if (response.error !== null)
        {
            return(null);
        }
        
        if (response.data !== null)
        {
            const userId = response.data.user.id;
            return(userId);
        }
        
        return(null);
    }
    catch (error)
    {
        return(null);
    }
}
