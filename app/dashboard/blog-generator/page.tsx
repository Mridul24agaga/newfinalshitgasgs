"use client"

import type React from "react"

import { Suspense, useEffect, useState } from "react"
import { Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { createClient } from "@/utitls/supabase/client"
import BlogGenerator from "@/app/blog-generator/blog-content"

  

export default function DashboardPage() {
  return (
    <div>
        <BlogGenerator/>
    </div>
   
  )
}
