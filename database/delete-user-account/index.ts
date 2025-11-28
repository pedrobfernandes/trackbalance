import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// Se colocar online substituir o Access-Control-Allow-Origin: '*'
// por Access-Control-Allow-Origin': 'url-do-deploy'
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type'
};
serve(async (req)=>{
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', {
      headers: corsHeaders
    });
  }
  try {
    // Criar cliente Supabase com service role key
    const supabaseAdmin = createClient(Deno.env.get('SUPABASE_URL') ?? '', Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '');
    // Obter o token JWT do header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('Missing authorization header');
    }
    // Verificar e validar o token do usuário
    const { data: { user }, error: userError } = await supabaseAdmin.auth.getUser(authHeader.replace('Bearer ', ''));
    if (userError || !user) {
      throw new Error('Invalid token');
    }
    const userId = user.id;
    // ✅ SIMPLES: Apenas deletar o usuário
    // O CASCADE vai automaticamente deletar todos os dados relacionados
    const { error: deleteUserError } = await supabaseAdmin.auth.admin.deleteUser(userId);
    if (deleteUserError) {
      throw deleteUserError;
    }
    return new Response(JSON.stringify({
      success: true,
      message: 'Conta e todos os dados foram deletados com sucesso'
    }), {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      },
      status: 200
    });
  } catch (error) {
    console.error('Erro na função delete-user:', error);
    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      },
      status: 400
    });
  }
});
