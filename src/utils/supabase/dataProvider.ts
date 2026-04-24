import { dataProvider as supabaseDataProvider } from "@refinedev/supabase";
import { supabaseBrowserClient } from "./client";

export const dataProvider = supabaseDataProvider(supabaseBrowserClient);