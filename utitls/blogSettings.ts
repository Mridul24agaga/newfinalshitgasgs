import { createClient } from "@/utitls/supabase/client"

export const getUserBlogSettings = async (userId: string) => {
  const supabase = createClient()

  const { data, error } = await supabase.from("user_blog_settings").select("*").eq("user_id", userId).single()

  if (error) {
    console.error("Error fetching user blog settings:", error)
    return null
  }

  return data
}

