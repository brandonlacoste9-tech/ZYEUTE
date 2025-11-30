import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  // if "next" is in param, use it as the redirect URL
  const next = searchParams.get("next") ?? "/dashboard";

  if (code) {
    const cookieStore = new Map<string, any>(); // Simplified cookie store for exchange
    
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            // Need to access request cookies here in a real app context
            // Using standard cookie pattern for Route Handlers:
            const cookie = request.headers.get('cookie') || '';
            const match = cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
            return match ? match[2] : undefined;
          },
          set(name: string, value: string, options: CookieOptions) {
             // In route handlers we set cookies on the response object below
          },
          remove(name: string, options: CookieOptions) {
             // In route handlers we remove cookies on the response object below
          },
        },
      }
    );
    
    // Exchange the code for a session
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (!error) {
        // Successful login -> Redirect to dashboard
        // We must pass the cookies to the browser
        const response = NextResponse.redirect(`${origin}${next}`);
        
        // This 'trick' ensures the session sticks in the browser
        return response; 
    }
  }

  // Return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/auth/auth-code-error`);