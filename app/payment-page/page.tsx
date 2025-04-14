"use client"

import { useState } from "react"
import PaymentPage from "../components/payment-page"

export default function Home() {


  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto">
      <PaymentPage/>
      </div>
    </main>
  )
}
