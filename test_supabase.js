import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const fileContent = fs.readFileSync('./apps/web/src/supabaseClient.js', 'utf8');
const urlMatch = fileContent.match(/supabaseUrl\s*=\s*['"]([^'"]+)['"]/);
const keyMatch = fileContent.match(/supabaseAnonKey\s*=\s*['"]([^'"]+)['"]/);

if (urlMatch && keyMatch) {
  const supabase = createClient(urlMatch[1], keyMatch[1]);
  supabase.from('transactions').select('*').limit(1).then(res => {
    console.log("Transactions table response:", res);
  });
} else {
  console.log("Could not find keys");
}
