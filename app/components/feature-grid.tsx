import { Calendar, Globe, ArrowRight, CheckCircle, Zap, Link, FileText } from "lucide-react"

export function FeatureBentoGrid() {
  return (
    <section className="py-12 md:py-16 lg:py-24 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        {/* Why Choose Us Section */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4 tracking-tight">Why Choose Us</h2>
          <div className="max-w-3xl mx-auto">
            <p className="text-xl text-gray-600 mb-12">
              We combine cutting-edge AI technology with human expertise to deliver content that drives real results.
              Our platform is trusted by businesses of all sizes to create, publish, and optimize content that ranks.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all border border-gray-100 transform hover:-translate-y-1 duration-300">
                <div className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                  <CheckCircle className="w-7 h-7 text-emerald-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">100% Human-Written</h3>
                <p className="text-gray-600 text-center">
                  Content that passes AI detection and meets Google's standards
                </p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all border border-gray-100 transform hover:-translate-y-1 duration-300">
                <div className="w-14 h-14 bg-purple-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                  <Zap className="w-7 h-7 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Full Automation</h3>
                <p className="text-gray-600 text-center">
                  Set it and forget it with our complete content publishing system
                </p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all border border-gray-100 transform hover:-translate-y-1 duration-300">
                <div className="w-14 h-14 bg-cyan-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                  <Globe className="w-7 h-7 text-cyan-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">SEO Optimized</h3>
                <p className="text-gray-600 text-center">
                  Built-in linking and optimization for maximum search visibility
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Top row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Automatic Blog Publishing Card */}
          <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm hover:shadow-md transition-all overflow-hidden group">
            <div className="flex items-start justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 group-hover:text-purple-700 transition-colors">
                Automatic Blog Publishing
              </h2>
              <div className="bg-purple-100 text-purple-700 text-xs font-medium px-3 py-1 rounded-full">Premium</div>
            </div>

            <p className="text-gray-600 mb-8 text-base leading-relaxed">
              AutoBlog allows you to automatically schedule or publish high-quality content. Run your blog on auto-pilot
              with both internal and external linking, making Journalist AI your full-time employee.
            </p>

            <div className="mb-6 bg-gray-50 rounded-xl p-6 border border-gray-100 transform group-hover:scale-105 transition-transform duration-300">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                    <Calendar className="w-5 h-5 text-purple-600" />
                  </div>
                  <span className="text-base font-medium text-gray-800">Publishing Schedule</span>
                </div>
                <div className="text-xs bg-green-100 text-green-800 px-3 py-1.5 rounded-full font-semibold">Active</div>
              </div>

              {/* Calendar visualization */}
              <div className="mb-4">
                {/* Month header */}
                <div className="flex justify-between items-center mb-3">
                  <button className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-200 transition-colors">
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
                      className="text-gray-600"
                    >
                      <polyline points="15 18 9 12 15 6"></polyline>
                    </svg>
                  </button>
                  <div className="text-sm font-medium">October 2023</div>
                  <button className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-200 transition-colors">
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
                      className="text-gray-600"
                    >
                      <polyline points="9 18 15 12 9 6"></polyline>
                    </svg>
                  </button>
                </div>

                {/* Days of week */}
                <div className="grid grid-cols-7 gap-1 mb-2">
                  {["S", "M", "T", "W", "T", "F", "S"].map((day, i) => (
                    <div key={i} className="text-xs font-medium text-gray-500 text-center">
                      {day}
                    </div>
                  ))}
                </div>

                {/* Calendar grid */}
                <div className="grid grid-cols-7 gap-1">
                  {/* First week with empty days */}
                  <div className="h-8 rounded-md"></div>
                  <div className="h-8 rounded-md"></div>
                  <div className="h-8 rounded-md"></div>
                  <div className="h-8 rounded-md"></div>
                  <div className="h-8 rounded-md"></div>
                  <div className="h-8 rounded-md"></div>
                  <div className="h-8 bg-gray-100 rounded-md flex items-center justify-center text-xs">1</div>

                  {/* Second week */}
                  <div className="h-8 bg-gray-100 rounded-md flex items-center justify-center text-xs">2</div>
                  <div className="h-8 bg-purple-500 rounded-md flex items-center justify-center text-xs text-white">
                    3
                  </div>
                  <div className="h-8 bg-gray-100 rounded-md flex items-center justify-center text-xs">4</div>
                  <div className="h-8 bg-purple-500 rounded-md flex items-center justify-center text-xs text-white">
                    5
                  </div>
                  <div className="h-8 bg-gray-100 rounded-md flex items-center justify-center text-xs">6</div>
                  <div className="h-8 bg-gray-100 rounded-md flex items-center justify-center text-xs">7</div>
                  <div className="h-8 bg-gray-100 rounded-md flex items-center justify-center text-xs">8</div>

                  {/* Third week */}
                  <div className="h-8 bg-gray-100 rounded-md flex items-center justify-center text-xs">9</div>
                  <div className="h-8 bg-purple-500 rounded-md flex items-center justify-center text-xs text-white">
                    10
                  </div>
                  <div className="h-8 bg-gray-100 rounded-md flex items-center justify-center text-xs">11</div>
                  <div className="h-8 bg-purple-500 rounded-md flex items-center justify-center text-xs text-white">
                    12
                  </div>
                  <div className="h-8 bg-gray-100 rounded-md flex items-center justify-center text-xs">13</div>
                  <div className="h-8 bg-purple-500 rounded-md flex items-center justify-center text-xs text-white">
                    14
                  </div>
                  <div className="h-8 bg-gray-100 rounded-md flex items-center justify-center text-xs">15</div>
                </div>
              </div>

              {/* Publishing stats */}
              <div className="flex justify-between items-center">
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">12</div>
                  <div className="text-xs text-gray-500">Published</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-cyan-600">8</div>
                  <div className="text-xs text-gray-500">Scheduled</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-amber-600">4</div>
                  <div className="text-xs text-gray-500">Drafts</div>
                </div>
              </div>
            </div>
          </div>

          {/* Blog Preview UI Card */}
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-all group">
            <div className="p-8">
              {/* Browser chrome */}
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm transform group-hover:scale-105 transition-transform duration-300">
                {/* Browser top bar */}
                <div className="p-3 border-b border-gray-100 flex items-center justify-between bg-gray-50">
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 rounded-full bg-red-400"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                    <div className="w-3 h-3 rounded-full bg-green-400"></div>
                  </div>
                  <div className="bg-white text-gray-500 text-xs px-4 py-1.5 rounded-full flex items-center mx-auto shadow-sm">
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
                      className="mr-2"
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
                <div className="p-4 flex items-center border-b border-gray-100">
                  <div className="w-10 h-10 bg-cyan-100 rounded-full flex items-center justify-center mr-3">
                    <FileText className="w-5 h-5 text-cyan-600" />
                  </div>
                  <span className="text-base font-medium text-gray-800">Your Blog</span>
                  <div className="ml-auto flex space-x-3">
                    <div className="h-2 bg-gray-200 rounded w-16"></div>
                    <div className="h-2 bg-gray-200 rounded w-16"></div>
                    <div className="h-2 bg-gray-200 rounded w-16"></div>
                  </div>
                </div>

                {/* Blog grid */}
                <div className="p-6 bg-white">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Article 1 */}
                    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm hover:shadow transition-all">
                      <div className="h-32 bg-gradient-to-r from-cyan-500 to-blue-500"></div>
                      <div className="p-4">
                        <div className="text-xs text-gray-500 mb-1">E-Commerce</div>
                        <div className="text-sm font-medium">Top 10 tools for Amazon FBA sellers in 2023</div>
                      </div>
                    </div>

                    {/* Article 2 */}
                    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm hover:shadow transition-all">
                      <div className="h-32 bg-gradient-to-r from-purple-500 to-pink-500"></div>
                      <div className="p-4">
                        <div className="text-xs text-gray-500 mb-1">Shipping</div>
                        <div className="text-sm font-medium">How to print labels for online marketplaces</div>
                      </div>
                    </div>

                    {/* Article 3 */}
                    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm hover:shadow transition-all">
                      <div className="h-32 bg-gradient-to-r from-amber-500 to-orange-500"></div>
                      <div className="p-4">
                        <div className="text-xs text-gray-500 mb-1">Guide</div>
                        <div className="text-sm font-medium">Selling on Amazon: 12 Step Guide for Beginners</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Search bar at bottom */}
            <div className="border-t border-gray-100 p-6 bg-gray-50">
              <div className="bg-white rounded-full p-3 flex items-center justify-between shadow-sm">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center mr-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="14"
                      height="14"
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
                <div className="w-8 h-8 bg-cyan-100 rounded-full flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-cyan-600"
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Integrate with Any Platform Card */}
          <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm hover:shadow-md transition-all group">
            <div className="h-56 flex items-center justify-center mb-6 relative">
              {/* Central hub with Journalist AI logo */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center z-10 shadow-lg group-hover:shadow-xl transition-all">
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center">
                  <Globe className="w-10 h-10 text-cyan-600" />
                </div>
              </div>

              {/* Connection lines */}
              <div className="absolute w-full h-full top-0 left-0">
                <svg className="w-full h-full" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M70 50 L100 100"
                    stroke="#E0E7FF"
                    strokeWidth="3"
                    strokeDasharray="4 2"
                    className="group-hover:stroke-cyan-200 transition-colors"
                  />
                  <path
                    d="M130 50 L100 100"
                    stroke="#E0E7FF"
                    strokeWidth="3"
                    strokeDasharray="4 2"
                    className="group-hover:stroke-cyan-200 transition-colors"
                  />
                  <path
                    d="M50 120 L100 100"
                    stroke="#E0E7FF"
                    strokeWidth="3"
                    strokeDasharray="4 2"
                    className="group-hover:stroke-cyan-200 transition-colors"
                  />
                  <path
                    d="M150 120 L100 100"
                    stroke="#E0E7FF"
                    strokeWidth="3"
                    strokeDasharray="4 2"
                    className="group-hover:stroke-cyan-200 transition-colors"
                  />
                </svg>
              </div>

              {/* WordPress */}
              <div className="absolute top-0 left-1/4 transform -translate-x-1/2 group-hover:-translate-y-2 transition-transform duration-300">
                <div className="w-18 h-18 bg-blue-50 rounded-full border border-gray-100 flex items-center justify-center shadow-md hover:shadow-lg transition-all p-3">
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 256 256">
                    <path
                      fill="#21759B"
                      d="M128 0C57.29 0 0 57.29 0 128s57.29 128 128 128s128-57.29 128-128S198.71 0 128 0zM22.56 128c0-13.11 2.34-25.65 6.55-37.31l36.09 98.85C40.6 173.77 22.56 152.79 22.56 128zM128 233.44c-8.87 0-17.43-1.29-25.53-3.69l27.15-78.88l27.78 76.14c.18.44.4.84.63 1.22c-9.6 3.4-19.95 5.21-30.03 5.21zm12.17-136.13c5.45-.29 10.36-.86 10.36-.86c4.87-.58 4.3-7.74-.58-7.45c0 0-14.65 1.15-24.1 1.15c-8.87 0-23.81-1.15-23.81-1.15c-4.87-.29-5.45 7.16-.58 7.45c0 0 4.62.57 9.49.86l14.08 38.65l-19.76 59.27L66.71 97.31c5.45-.29 10.36-.86 10.36-.86c4.87-.58 4.3-7.74-.57-7.45c0 0-14.66 1.15-24.11 1.15c-1.7 0-3.69-.04-5.82-.1C68.06 54.44 96.16 33.28 128 33.28c23.69 0 45.26 9.05 61.41 23.88c-.39-.03-.77-.08-1.16-.08c-8.87 0-15.17 7.74-15.17 16.03c0 7.45 4.3 13.75 8.87 21.2c3.45 6.03 7.45 13.75 7.45 24.97c0 7.74-2.99 16.71-6.88 29.22l-9.01 30.1l-27.51-81.83zm54.86 8.3c6.88 12.6 10.79 27.05 10.79 42.4c0 32.61-17.72 61.06-44 76.26l27.03-78.16c5.05-12.63 6.73-22.74 6.73-31.78c0-3.26-.22-6.28-.55-9.05v.33z"
                    />
                  </svg>
                </div>
                <div className="text-sm font-medium text-center mt-2">WordPress</div>
              </div>

              {/* Next.js */}
              <div className="absolute top-0 right-1/4 transform translate-x-1/2 group-hover:-translate-y-2 transition-transform duration-300">
                <div className="w-18 h-18 bg-black rounded-full border border-gray-100 flex items-center justify-center shadow-md hover:shadow-lg transition-all p-3">
                  <svg width="32" height="32" viewBox="0 0 180 180" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <mask
                      id="mask0_408_139"
                      style={{ maskType: "alpha" }}
                      maskUnits="userSpaceOnUse"
                      x="0"
                      y="0"
                      width="180"
                      height="180"
                    >
                      <circle cx="90" cy="90" r="90" fill="black" />
                    </mask>
                    <g mask="url(#mask0_408_139)">
                      <circle cx="90" cy="90" r="90" fill="black" />
                      <path
                        d="M149.508 157.52L69.142 54H54V125.97H66.1136V69.3836L139.999 164.845C143.333 162.614 146.509 160.165 149.508 157.52Z"
                        fill="url(#paint0_linear_408_139)"
                      />
                      <rect x="115" y="54" width="12" height="72" fill="url(#paint1_linear_408_139)" />
                    </g>
                    <defs>
                      <linearGradient
                        id="paint0_linear_408_139"
                        x1="109"
                        y1="116.5"
                        x2="144.5"
                        y2="160.5"
                        gradientUnits="userSpaceOnUse"
                      >
                        <stop stopColor="white" />
                        <stop offset="1" stopColor="white" stopOpacity="0" />
                      </linearGradient>
                      <linearGradient
                        id="paint1_linear_408_139"
                        x1="121"
                        y1="54"
                        x2="120.799"
                        y2="106.875"
                        gradientUnits="userSpaceOnUse"
                      >
                        <stop stopColor="white" />
                        <stop offset="1" stopColor="white" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
                <div className="text-sm font-medium text-center mt-2">Next.js</div>
              </div>

              
              {/* Webflow */}
              <div className="absolute bottom-4 right-0 group-hover:translate-x-2 transition-transform duration-300">
                <div className="w-18 h-18 bg-blue-50 rounded-full border border-gray-100 flex items-center justify-center shadow-md hover:shadow-lg transition-all p-3">
                <svg xmlns="http://www.w3.org/2000/svg" shape-rendering="geometricPrecision" text-rendering="geometricPrecision" image-rendering="optimizeQuality" fill-rule="evenodd" clip-rule="evenodd" viewBox="0 0 512 319.382"><path fill="#146EF5" d="M512 0L348.627 319.382H195.172l68.375-132.364h-3.071C204.072 260.235 119.911 308.437 0 319.382V188.849s76.71-4.533 121.808-51.945H0V.007h136.897v112.594l3.071-.013L195.91.007h103.535V111.89l3.071-.006L360.557 0H512z"/></svg>
                </div>
                <div className="text-sm font-medium text-center mt-2">Webflow</div>
              </div>
            </div>

            <h3 className="text-xl font-bold mb-4">Multi-Platform Integration</h3>

            <div className="space-y-4 mb-4">
              <div className="flex items-start text-sm text-gray-600">
                <ArrowRight className="w-5 h-5 text-cyan-500 mr-3 flex-shrink-0 mt-0.5" />
                <span>One-click publishing to WordPress, Next.js, Shopify and Webflow</span>
              </div>
              <div className="flex items-start text-sm text-gray-600">
                <ArrowRight className="w-5 h-5 text-cyan-500 mr-3 flex-shrink-0 mt-0.5" />
                <span>Automatic formatting optimized for each platform</span>
              </div>
              <div className="flex items-start text-sm text-gray-600">
                <ArrowRight className="w-5 h-5 text-cyan-500 mr-3 flex-shrink-0 mt-0.5" />
                <span>Seamless content synchronization across all your sites</span>
              </div>
            </div>
          </div>

          {/* Automatic Internal Linking Card */}
          <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm hover:shadow-md transition-all group">
            <div className="h-56 flex items-center justify-center mb-6 relative">
              <div className="w-full max-w-xs mx-auto transform group-hover:scale-105 transition-transform duration-300">
                {/* Document representation with internal links */}
                <div className="h-8 bg-gray-100 w-full rounded-lg mb-6"></div>

                <div className="flex items-center gap-6 mb-6">
                  <div className="h-8 bg-gray-100 w-1/2 rounded-lg"></div>
                  <div className="h-8 bg-purple-100 w-1/3 rounded-lg"></div>
                </div>

                <div className="flex items-center gap-6 mb-6">
                  <div className="h-8 bg-purple-100 w-1/3 rounded-lg"></div>
                  <div className="h-8 bg-gray-100 w-1/2 rounded-lg"></div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="h-8 bg-gray-100 w-1/3 rounded-lg"></div>
                  <div className="h-8 bg-purple-100 w-1/3 rounded-lg"></div>
                </div>

                {/* Connecting lines */}
                <div className="absolute top-1/3 left-1/2 w-20 h-1 bg-purple-200 transform -translate-x-full -translate-y-1/2 group-hover:bg-purple-300 transition-colors"></div>
                <div className="absolute top-2/3 left-1/2 w-20 h-1 bg-purple-200 transform -translate-x-full translate-y-1/2 group-hover:bg-purple-300 transition-colors"></div>

                {/* Link icons */}
                <div className="absolute top-1/3 left-1/2 transform -translate-x-full -translate-y-1/2 -ml-10">
                  <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                    <Link className="w-4 h-4 text-white" />
                  </div>
                </div>

                <div className="absolute top-2/3 left-1/2 transform -translate-x-full translate-y-1/2 -ml-10">
                  <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                    <Link className="w-4 h-4 text-white" />
                  </div>
                </div>
              </div>
            </div>

            <h3 className="text-xl font-bold mb-4">Automatic Internal & External Linking</h3>
            <p className="text-gray-600 text-base leading-relaxed">
              Automatically add both internal and external links to your articles. Our system intelligently places links
              to your own pages and authoritative external sources, creating a natural link profile that boosts SEO and
              improves user experience.
            </p>

            
          </div>

          {/* 100% Human-Written Content Card */}
          <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm hover:shadow-md transition-all group">
            <div className="h-56 flex items-center justify-center mb-6 relative">
              <div className="w-full max-w-xs mx-auto relative transform group-hover:scale-105 transition-transform duration-300">
                {/* Document with human writer verification */}
                <div className="w-full bg-white border border-gray-200 rounded-xl p-5 mb-2 shadow-sm">
                  <div className="h-4 bg-gray-100 w-3/4 rounded mb-4"></div>
                  <div className="h-4 bg-gray-100 w-1/2 rounded mb-4"></div>
                  <div className="h-4 bg-gray-100 w-2/3 rounded mb-4"></div>
                  <div className="h-4 bg-gray-100 w-3/5 rounded"></div>
                </div>

                {/* Google verification badge */}
                <div className="absolute -right-4 -top-4 w-20 h-20 bg-white rounded-full border border-gray-100 flex items-center justify-center shadow-md group-hover:shadow-lg transition-all">
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24">
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
                  <div className="w-16 h-16 bg-emerald-100 rounded-full border border-gray-100 flex items-center justify-center shadow-md group-hover:shadow-lg transition-all">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="28"
                      height="28"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-emerald-600"
                    >
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                      <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                  </div>
                </div>

                {/* Checkmark badges */}
                <div className="absolute -left-2 top-1/4">
                  <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center shadow-md group-hover:shadow-lg transition-all">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
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
                  <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center shadow-md group-hover:shadow-lg transition-all">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
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
                  <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center shadow-md group-hover:shadow-lg transition-all">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
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

            <h3 className="text-xl font-bold mb-4">100% Human-Written Content</h3>
            <p className="text-gray-600 text-base leading-relaxed">
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
