import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.75.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface UserData {
  username: string;
  name: string;
  contact?: string;
  folder_path?: string;
  selection_limit: number;
  password?: string;
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabaseClient = createClient(supabaseUrl, supabaseServiceKey);

    // Verify admin user
    const authHeader = req.headers.get('Authorization')!;
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(token);
    
    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Check admin role
    const { data: roleData } = await supabaseClient
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .eq('role', 'admin')
      .maybeSingle();

    if (!roleData) {
      return new Response(JSON.stringify({ error: 'Forbidden - Admin access required' }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { action, userId, userData } = await req.json() as {
      action: 'create' | 'update' | 'delete';
      userId?: string;
      userData?: UserData;
    };

    console.log(`Admin user management: ${action} ${userId || 'new user'}`);

    switch (action) {
      case 'create': {
        if (!userData || !userData.password) {
          return new Response(JSON.stringify({ error: 'Missing required fields' }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }

        // Create auth user
        const { data: authUser, error: createAuthError } = await supabaseClient.auth.admin.createUser({
          email: userData.contact || `${userData.username}@placeholder.local`,
          password: userData.password,
          email_confirm: true,
          user_metadata: {
            username: userData.username,
            name: userData.name,
          },
        });

        if (createAuthError) {
          console.error('Auth user creation error:', createAuthError);
          return new Response(JSON.stringify({ error: createAuthError.message }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }

        // Create user record
        const { error: insertError } = await supabaseClient
          .from('users')
          .insert({
            id: authUser.user!.id,
            username: userData.username,
            name: userData.name,
            contact: userData.contact,
            folder_path: userData.folder_path,
            selection_limit: userData.selection_limit,
            password_hash: 'managed_by_supabase_auth',
          });

        if (insertError) {
          console.error('User record creation error:', insertError);
          // Clean up auth user if profile creation fails
          await supabaseClient.auth.admin.deleteUser(authUser.user!.id);
          return new Response(JSON.stringify({ error: insertError.message }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }

        return new Response(JSON.stringify({ success: true, userId: authUser.user!.id }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      case 'update': {
        if (!userId || !userData) {
          return new Response(JSON.stringify({ error: 'Missing required fields' }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }

        // Update user record
        const updateData: any = {
          username: userData.username,
          name: userData.name,
          contact: userData.contact,
          folder_path: userData.folder_path,
          selection_limit: userData.selection_limit,
        };

        const { error: updateError } = await supabaseClient
          .from('users')
          .update(updateData)
          .eq('id', userId);

        if (updateError) {
          console.error('User update error:', updateError);
          return new Response(JSON.stringify({ error: updateError.message }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }

        // Update password if provided
        if (userData.password) {
          const { error: passwordError } = await supabaseClient.auth.admin.updateUserById(
            userId,
            { password: userData.password }
          );

          if (passwordError) {
            console.error('Password update error:', passwordError);
            return new Response(JSON.stringify({ error: passwordError.message }), {
              status: 400,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            });
          }
        }

        // Update auth metadata
        await supabaseClient.auth.admin.updateUserById(userId, {
          user_metadata: {
            username: userData.username,
            name: userData.name,
          },
        });

        return new Response(JSON.stringify({ success: true }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      case 'delete': {
        if (!userId) {
          return new Response(JSON.stringify({ error: 'Missing userId' }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }

        // Delete user record (cascade will delete auth user)
        const { error: deleteError } = await supabaseClient
          .from('users')
          .delete()
          .eq('id', userId);

        if (deleteError) {
          console.error('User deletion error:', deleteError);
          return new Response(JSON.stringify({ error: deleteError.message }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }

        // Delete auth user
        await supabaseClient.auth.admin.deleteUser(userId);

        return new Response(JSON.stringify({ success: true }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      default:
        return new Response(JSON.stringify({ error: 'Invalid action' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
    }
  } catch (error) {
    console.error('Error in admin-user-management:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
