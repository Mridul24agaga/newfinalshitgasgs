import { Sidebar } from "../components/layout/sidebar"

export default function Home() {
  // Mock subscription data
  const subscription = {
    plan_id: "pro",
    credits: 25,
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar subscription={subscription} />
      <main className="flex-1 p-8">
        <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
        <p className="text-gray-600 mb-4">Welcome to your content management dashboard</p>

        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Integrations Overview</h2>
          <p className="text-gray-600 mb-6">Manage your content publishing integrations</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium">Next.js Integration</h3>
                <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">Connected</span>
              </div>
              <p className="text-sm text-gray-500">Auto-publish content to your Next.js blog</p>
            </div>

            <div className="border border-orange-200 bg-orange-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium">GetMoreBacklinks Integration</h3>
                <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">Active</span>
              </div>
              <p className="text-sm text-gray-500">Auto-publish to external blogs</p>
              <p className="text-xs text-orange-600 font-medium mt-2">5 blogs published this week</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

