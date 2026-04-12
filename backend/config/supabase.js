// backend/config/supabase.js
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseAnonKey || !supabaseServiceRoleKey) {
  console.error('❌ Отсутствуют SUPABASE_URL, SUPABASE_ANON_KEY или SUPABASE_SERVICE_ROLE_KEY в .env файле!');
  console.error('Проверьте файл .env и перезапустите сервер.');
  process.exit(1);
}

// ============== ADMIN CLIENT (полные права, обходит RLS) ==============
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
    detectSessionInUrl: false,
  },
  global: {
    headers: {
      'X-Client-Info': 'oxbridge-backend',
    },
  },
});

// ============== PUBLIC CLIENT (для регистрации, логина и клиентских операций) ==============
const supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
    detectSessionInUrl: false,
  },
  global: {
    headers: {
      'X-Client-Info': 'oxbridge-backend',
    },
  },
});

console.log('✅ Supabase успешно подключён');
console.log(`   URL: ${supabaseUrl}`);
console.log(`   Environment: ${process.env.NODE_ENV || 'development'}`);

module.exports = {
  supabaseAdmin,
  supabaseClient,
};