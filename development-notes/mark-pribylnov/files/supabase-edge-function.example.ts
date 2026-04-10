import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import { corsHeaders } from 'jsr:@supabase/supabase-js/cors';

Deno.serve(async req => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const apiKeyPaid = Deno.env.get('GEMINI_KEY');
    const apiKeyFreeTier = Deno.env.get('GEMINI_FREE_TIER_KEY');
    const { model, contents, systemInstruction, generationConfig, useFreeTier  } = await req.json();

    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
      method: 'POST',
      headers: {
        'x-goog-api-key': useFreeTier ? apiKeyFreeTier : apiKeyPaid || '',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents, systemInstruction, generationConfig
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      console.error('Gemini API Error:', data.error);
      return new Response(JSON.stringify({
        error: 'Gemini API Error',
        details: data.error?.message || 'Unknown configuration error'
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: res.status, // Pass the 400, 401, etc., down to the client
      });
    }

    const text = data.candidates?.[0]?.content?.parts?.[0]?.text ?? 'I formulated an answer, but failed to output it.';

    return new Response(JSON.stringify({ data, text, supaData: {model, contents, systemInstruction, generationConfig } }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    // Catch absolute failures (like Deno crashing or network timeouts)
    console.error('Edge Function Crash:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error', details: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
