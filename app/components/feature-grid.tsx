import { Calendar, Globe, ArrowRight, CheckCircle } from "lucide-react"

export function FeatureBentoGrid() {
  return (
    <section className="py-12 md:py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4">
        {/* Why Choose Us Section */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose Us</h2>
          <div className="max-w-3xl mx-auto">
            <p className="text-xl text-gray-600 mb-8">
              We combine cutting-edge AI technology with human expertise to deliver content that drives real results.
              Our platform is trusted by businesses of all sizes to create, publish, and optimize content that ranks.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mb-3">
                  <CheckCircle className="w-6 h-6 text-indigo-600" />
                </div>
                <h3 className="text-lg font-semibold mb-1">100% Human-Written</h3>
                <p className="text-gray-600 text-center">
                  Content that passes AI detection and meets Google's standards
                </p>
              </div>

              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mb-3">
                  <CheckCircle className="w-6 h-6 text-indigo-600" />
                </div>
                <h3 className="text-lg font-semibold mb-1">Full Automation</h3>
                <p className="text-gray-600 text-center">
                  Set it and forget it with our complete content publishing system
                </p>
              </div>

              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mb-3">
                  <CheckCircle className="w-6 h-6 text-indigo-600" />
                </div>
                <h3 className="text-lg font-semibold mb-1">SEO Optimized</h3>
                <p className="text-gray-600 text-center">
                  Built-in linking and optimization for maximum search visibility
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Top row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Automatic Blog Publishing Card */}
          <div className="bg-white rounded-3xl border border-gray-100 p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Automatic Blog Publishing</h2>
            <p className="text-gray-600 mb-6">
              AutoBlog allows you to automatically schedule or publish high-quality content. Run your blog on auto-pilot
              with both internal and external linking, making Journalist AI your full-time employee.
            </p>

            <div className="mb-6 bg-gray-50 rounded-lg p-4 border border-gray-100">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center mr-2">
                    <Calendar className="w-4 h-4 text-indigo-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-800">Publishing Schedule</span>
                </div>
                <div className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Active</div>
              </div>
              <div className="flex justify-between items-center mb-2">
                <div className="text-xs text-gray-500">Mon</div>
                <div className="text-xs text-gray-500">Wed</div>
                <div className="text-xs text-gray-500">Fri</div>
                <div className="text-xs text-gray-500">Sun</div>
              </div>
              <div className="flex justify-between items-center">
                <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                  <div className="w-6 h-6 bg-indigo-500 rounded-full"></div>
                </div>
                <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                  <div className="w-6 h-6 bg-indigo-500 rounded-full"></div>
                </div>
                <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                  <div className="w-6 h-6 bg-indigo-500 rounded-full"></div>
                </div>
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center"></div>
              </div>
            </div>
          </div>

          {/* Blog Preview UI Card */}
          <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden">
            <div className="p-6">
              {/* Browser chrome */}
              <div className="bg-white rounded-lg border border-gray-100 overflow-hidden">
                {/* Browser top bar */}
                <div className="p-2 border-b border-gray-100 flex items-center justify-between">
                  <div className="flex space-x-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-400"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-400"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-green-400"></div>
                  </div>
                  <div className="bg-gray-100 text-gray-500 text-xs px-3 py-1 rounded-full flex items-center mx-auto">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="10"
                      height="10"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="mr-1"
                    >
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                      <circle cx="8.5" cy="8.5" r="1.5"></circle>
                      <polyline points="21 15 16 10 5 21"></polyline>
                    </svg>
                    yourwebsite.com
                  </div>
                  <div className="w-6"></div> {/* Empty div for spacing */}
                </div>

                {/* Blog header */}
                <div className="p-4 flex items-center">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-green-500"
                    >
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                      <polyline points="14 2 14 8 20 8"></polyline>
                      <line x1="16" y1="13" x2="8" y2="13"></line>
                      <line x1="16" y1="17" x2="8" y2="17"></line>
                      <polyline points="10 9 9 9 8 9"></polyline>
                    </svg>
                  </div>
                  <span className="text-base font-medium text-gray-800">Your Blog</span>
                  <div className="ml-4 flex space-x-2">
                    <div className="h-1.5 bg-gray-300 rounded w-12"></div>
                    <div className="h-1.5 bg-gray-300 rounded w-12"></div>
                    <div className="h-1.5 bg-gray-300 rounded w-12"></div>
                    <div className="h-1.5 bg-gray-300 rounded w-12"></div>
                  </div>
                </div>

                {/* Blog grid */}
                <div className="p-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Article 1 */}
                    <div className="bg-gray-50 rounded-lg border border-gray-100 overflow-hidden">
                      <div className="h-24 bg-gray-200"></div>
                      <div className="p-2">
                        <div className="text-xs font-medium">Top 10 tools for Amazon FBA</div>
                      </div>
                    </div>

                    {/* Article 2 */}
                    <div className="bg-gray-50 rounded-lg border border-gray-100 overflow-hidden">
                      <div className="h-24 bg-gray-200"></div>
                      <div className="p-2">
                        <div className="text-xs font-medium">How to print labels for online marketplaces</div>
                      </div>
                    </div>

                    {/* Article 3 */}
                    <div className="bg-gray-50 rounded-lg border border-gray-100 overflow-hidden">
                      <div className="h-24 bg-gray-200"></div>
                      <div className="p-2">
                        <div className="text-xs font-medium">Selling on Amazon: 12 Step Guide</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Search bar at bottom */}
            <div className="border-t border-gray-100 p-4">
              <div className="bg-gray-100 rounded-full p-2 flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center mr-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-gray-600"
                    >
                      <circle cx="11" cy="11" r="8"></circle>
                      <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                    </svg>
                  </div>
                  <span className="text-sm text-gray-600">Best amazon FBA tools</span>
                </div>
                <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-gray-600"
                  >
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Integrate with Any Platform Card - ENHANCED */}
          <div className="bg-white rounded-3xl border border-gray-100 p-6">
            <div className="h-48 flex items-center justify-center mb-6 relative">
              {/* Central hub with Journalist AI logo - MOVED TO THE CENTER */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center z-10 shadow-md">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
                  <Globe className="w-8 h-8 text-indigo-600" />
                </div>
              </div>

              {/* Connection lines */}
              <div className="absolute w-full h-full top-0 left-0">
                <svg className="w-full h-full" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M70 50 L100 100" stroke="#E0E7FF" strokeWidth="2" strokeDasharray="4 2" />
                  <path d="M130 50 L100 100" stroke="#E0E7FF" strokeWidth="2" strokeDasharray="4 2" />
                </svg>
              </div>

              {/* WordPress - MOVED TO LEFT TOP */}
              <div className="absolute top-0 left-1/4 transform -translate-x-1/2">
                <div className="w-16 h-16 bg-blue-50 rounded-full border border-gray-100 flex items-center justify-center shadow-sm hover:shadow transition-all">
                  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24">
                    <path
                      fill="#21759b"
                      d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm0 19.5c-5.247 0-9.5-4.253-9.5-9.5S6.753 2.5 12 2.5s9.5 4.253 9.5 9.5-4.253 9.5-9.5 9.5z"
                    />
                  </svg>
                </div>
                <div className="text-sm font-medium text-center mt-2">WordPress</div>
              </div>

              {/* Next.js - MOVED TO RIGHT TOP */}
              <div className="absolute top-0 right-1/4 transform translate-x-1/2">
                <div className="w-16 h-16 bg-gray-900 rounded-full border border-gray-100 flex items-center justify-center shadow-sm hover:shadow transition-all">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M11.572 0c-.176 0-.31.001-.358.007a19.76 19.76 0 0 0-.364.033C7.443.346 4.25 2.185 2.228 5.012a11.875 11.875 0 0 0-2.119 5.243c-.096.659-.108.854-.108 1.747s.012 1.089.108 1.748c.652 4.506 3.86 8.292 8.209 9.695.779.25 1.6.422 2.534.525.363.04 1.935.04 2.299 0 1.611-.178 2.977-.577 4.323-1.264.207-.106.247-.134.219-.158-.02-.013-.9-.78-1.963-1.698l-1.93-1.67-.024-.02c-.02-.013-1.07-.928-2.336-2.03l-2.3-2.006-.238.215c-.132.118-.628.561-1.102.984-.475.423-.864.766-.87.767-.006.001-.2.176-.427.39l-.416.39-.258-.176c-.142-.096-.343-.25-.447-.342a7.007 7.007 0 0 1-1.5-1.807 6.957 6.957 0 0 1-1.08-3.374c0-.66.07-1.223.22-1.778.4-1.517 1.372-2.815 2.655-3.543.481-.272 1.075-.519 1.621-.674a7.023 7.023 0 0 1 4.773.366c.219.105.673.349.996.534l.304.174.582-.513c.32-.282 1.153-1.018 1.85-1.635l1.268-1.121.112.07c.585.371 1.463 1.072 2.005 1.605a11.97 11.97 0 0 1 3.18 5.745c.096.659.108.854.108 1.747s-.012 1.089-.108 1.748c-.652 4.506-3.86 8.292-8.209 9.695-.779.25-1.6.422-2.534.525-.363.04-1.935.04-2.299 0-1.612-.178-2.977-.577-4.323-1.264l-.392-.199-.6.518c-.33.285-1.174 1.025-1.876 1.645l-1.277 1.129.11.07c.586.371 1.463 1.072 2.005 1.605.82.808 1.474 1.597 2.069 2.493.82 1.232 1.453 2.71 1.777 4.143.096.419.192.966.237 1.347.046.38.052 1.102.052 5.864V24h2.88v-3.36c0-4.67.006-5.396.052-5.777.268-2.244 1.037-4.258 2.256-5.917.82-1.116 1.925-2.18 3.064-2.943l.23-.154.228.2c.125.11.964.842 1.864 1.628l1.636 1.429.328-.19c1.753-1.014 3.96-1.5 5.95-1.31.734.07 1.635.278 2.35.541 1.833.676 3.256 1.948 4.075 3.637.92 1.903.912 4.214-.024 6.104-.957 1.936-2.74 3.309-4.86 3.743-.335.068-.66.092-1.25.092-.587 0-.91-.024-1.247-.092-.953-.193-1.636-.463-2.423-.961-.946-.598-1.71-1.42-2.242-2.412-.193-.36-.525-1.152-.525-1.256 0-.02.054-.054.12-.076.066-.022.126-.056.134-.076.007-.02.423-.391.923-.825l.909-.789.145.27a4.275 4.275 0 0 0 1.91 1.933 4.318 4.318 0 0 0 2.839.095c.695-.238 1.286-.639 1.753-1.195a4.17 4.17 0 0 0 .918-1.87c.074-.37.074-1.222 0-1.592-.209-1.04-.81-1.971-1.676-2.593-.714-.513-1.675-.802-2.57-.774-.818.026-1.5.224-2.21.644l.193-.115-.152.136c-.084-.075-.976-.855-1.983-1.734l-1.83-1.597-.192.125c-.106.069-.304.22-.44.335-.136.115-.66.58-1.163 1.033l-.914.824-.133-.126c-.073-.07-.287-.262-.475-.428-.992-.883-1.42-1.264-1.42-1.27 0-.003.32-.31.71-.682.39-.372 1.172-1.112 1.736-1.644l1.027-.967.148.087a11.896 11.896 0 0 0 3.153 1.279c.423.082.846.144 1.261.193.363.04 1.935.04 2.299 0 2.488-.275 4.718-1.233 6.6-2.834 1.589-1.352 2.794-3.07 3.56-5.092.495-1.31.777-2.621.86-4.015.022-.374.022-1.12 0-1.494-.083-1.394-.365-2.705-.86-4.015-.766-2.022-1.971-3.74-3.56-5.092C15.22 4.163 12.99 3.205 10.5 2.93c-.363-.04-1.935-.04-2.299 0-.415.049-.838.11-1.261.193a11.896 11.896 0 0 0-3.153 1.279l-.148.087-1.027-.967c-.564-.532-1.346-1.272-1.736-1.644-.39-.372-.71-.679-.71-.682 0-.006.428-.387 1.42-1.27.188-.166.402-.358.475-.428l.133-.126.914.824c.503.453 1.027.918 1.163 1.033.136.115.334.266.44.335l.192.125 1.83-1.597c1.007-.879 1.9-1.659 1.983-1.734l.152-.136.193.115c.71.42 1.392.618 2.21.644.895.028 1.856-.26 2.57-.774.866-.622 1.467-1.553 1.676-2.593.074-.37.074-1.222 0-1.592a4.17 4.17 0 0 0-.918-1.87c-.467-.556-1.058-.957-1.753-1.195a4.318 4.318 0 0 0-2.839.095 4.275 4.275 0 0 0-1.91 1.933l-.145.27-.909-.789c-.5-.434-.916-.805-.923-.825-.008-.02-.068-.054-.134-.076-.066-.022-.12-.056-.12-.076 0-.104.332-.896.525-1.256.532-.992 1.296-1.814 2.242-2.412.787-.498 1.47-.768 2.423-.961.337-.068.66-.092 1.247-.092.59 0 .915.024 1.25.092 2.12.434 3.903 1.807 4.86 3.743.936 1.89.944 4.201.024 6.104-.819 1.689-2.242 2.961-4.075 3.637-.715.263-1.616.47-2.35.541-1.99.19-4.197-.296-5.95-1.31l-.328-.19 1.636-1.429c.9-.786 1.739-1.518 1.864-1.628l.228-.2-.23-.154c-1.139-.763-2.244-1.827-3.064-2.943-1.219-1.659-1.988-3.673-2.256-5.917-.046-.38-.052-1.107-.052-5.777V0h-2.88z"
                      fill="#ffffff"
                    />
                  </svg>
                </div>
                <div className="text-sm font-medium text-center mt-2">Next.js</div>
              </div>
            </div>

            <h3 className="text-xl font-bold mb-3">WordPress & Next.js Integration</h3>

            <div className="space-y-3 mb-4">
              <div className="flex items-center text-sm text-gray-600">
                <ArrowRight className="w-4 h-4 text-indigo-500 mr-2 flex-shrink-0" />
                <span>One-click publishing to WordPress and Next.js</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <ArrowRight className="w-4 h-4 text-indigo-500 mr-2 flex-shrink-0" />
                <span>Automatic formatting for each platform</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <ArrowRight className="w-4 h-4 text-indigo-500 mr-2 flex-shrink-0" />
                <span>Seamless content synchronization</span>
              </div>
            </div>
          </div>

          {/* Automatic Internal Linking Card */}
          <div className="bg-white rounded-3xl border border-gray-100 p-6">
            <div className="h-48 flex items-center justify-center mb-6 relative">
              <div className="w-full max-w-xs mx-auto">
                {/* Document representation with internal links */}
                <div className="h-6 bg-gray-100 w-full rounded-md mb-4"></div>

                <div className="flex items-center gap-4 mb-4">
                  <div className="h-6 bg-gray-100 w-1/2 rounded-md"></div>
                  <div className="h-6 bg-indigo-100 w-1/4 rounded-md"></div>
                </div>

                <div className="flex items-center gap-4 mb-4">
                  <div className="h-6 bg-indigo-100 w-1/4 rounded-md"></div>
                  <div className="h-6 bg-gray-100 w-1/2 rounded-md"></div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="h-6 bg-gray-100 w-1/3 rounded-md"></div>
                  <div className="h-6 bg-indigo-100 w-1/3 rounded-md"></div>
                </div>

                {/* Connecting lines */}
                <div className="absolute top-1/3 left-1/2 w-16 h-0.5 bg-indigo-200 transform -translate-x-full -translate-y-1/2"></div>
                <div className="absolute top-2/3 left-1/2 w-16 h-0.5 bg-indigo-200 transform -translate-x-full translate-y-1/2"></div>
              </div>
            </div>

            <h3 className="text-xl font-bold mb-3">Automatic Internal & External Linking</h3>
            <p className="text-gray-600 text-sm">
              Automatically add both internal and external links to your articles. Our system intelligently places links
              to your own pages and authoritative external sources, creating a natural link profile that boosts SEO and
              improves user experience.
            </p>
          </div>

          {/* Automatic External Linking Card */}
          <div className="bg-white rounded-3xl border border-gray-100 p-6">
            <div className="h-48 flex items-center justify-center mb-6 relative">
              <div className="w-full max-w-xs mx-auto relative">
                {/* Document with human writer verification */}
                <div className="w-full bg-white border border-gray-100 rounded-lg p-3 mb-2">
                  <div className="h-4 bg-gray-100 w-3/4 rounded mb-3"></div>
                  <div className="h-4 bg-gray-100 w-1/2 rounded mb-3"></div>
                  <div className="h-4 bg-gray-100 w-2/3 rounded mb-3"></div>
                  <div className="h-4 bg-gray-100 w-3/5 rounded"></div>
                </div>

                {/* Google verification badge */}
                <div className="absolute -right-4 -top-4 w-16 h-16 bg-white rounded-full border border-gray-100 flex items-center justify-center">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                  </div>
                </div>

                {/* Human writer icon */}
                <div className="absolute left-1/2 bottom-0 transform -translate-x-1/2 translate-y-1/4">
                  <div className="w-14 h-14 bg-green-100 rounded-full border border-gray-100 flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-green-600"
                    >
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                      <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                  </div>
                </div>

                {/* Checkmark badges */}
                <div className="absolute -left-2 top-1/4">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="white"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </div>
                </div>

                <div className="absolute left-1/4 top-2/3">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="white"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </div>
                </div>

                <div className="absolute right-0 top-1/2">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="white"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            <h3 className="text-xl font-bold mb-3">100% Human-Written Content</h3>
            <p className="text-gray-600 text-sm">
              All content is written by professional human writers and approved by Google's quality guidelines. Our
              content passes AI detection tools and maintains the natural tone and expertise that search engines reward
              with higher rankings.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

