// Daily Health Check Edge Function
// Schedule this to run daily via Supabase Cron or external scheduler
// Returns JSON report of security and health status

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface HealthCheckResult {
  check_name: string;
  status: string;
  details: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Run health check query
    const { data: checks, error } = await supabase.rpc('run_daily_health_check');

    if (error) {
      // Fallback: run checks manually if RPC doesn't exist
      const { data: health } = await supabase
        .from('notification_logs')
        .select('*')
        .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
        .limit(1);

      return new Response(
        JSON.stringify({
          success: true,
          timestamp: new Date().toISOString(),
          checks: [
            {
              check_name: 'Health Check: Notifications',
              status: health && health.length > 0 ? '✅ PASS' : '⚠️ WARN',
              details: 'Using fallback check',
            },
          ],
          note: 'RPC function not available, using basic check',
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Count status types
    const passed = checks?.filter((c: HealthCheckResult) => c.status.includes('✅')).length || 0;
    const warnings = checks?.filter((c: HealthCheckResult) => c.status.includes('⚠️')).length || 0;
    const failures = checks?.filter((c: HealthCheckResult) => c.status.includes('❌')).length || 0;

    // Determine overall status
    const overallStatus = failures > 0 ? '❌ FAIL' : warnings > 0 ? '⚠️ WARN' : '✅ PASS';

    return new Response(
      JSON.stringify({
        success: true,
        timestamp: new Date().toISOString(),
        overall_status: overallStatus,
        summary: {
          total: checks?.length || 0,
          passed,
          warnings,
          failures,
        },
        checks: checks || [],
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Health check error:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
        timestamp: new Date().toISOString(),
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

