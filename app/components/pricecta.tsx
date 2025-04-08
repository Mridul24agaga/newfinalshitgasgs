export function PricingCTA() {
    return (
      <section className="py-12 md:py-16 lg:py-24 overflow-hidden relative">
        <div className="max-w-7xl mx-auto px-4">
          <div className="relative bg-[#294df6] rounded-2xl md:rounded-3xl overflow-hidden">
            {/* Background Circles - Now inside the card */}
            <div className="absolute top-0 left-0 w-32 h-32 sm:w-48 sm:h-48 md:w-64 md:h-64 rounded-full bg-white opacity-10 -translate-x-1/3 -translate-y-1/3"></div>
            <div className="absolute bottom-0 right-0 w-48 h-48 sm:w-64 sm:h-64 md:w-80 md:h-80 rounded-full bg-white opacity-10 translate-x-1/4 translate-y-1/4"></div>
  
            <div className="grid md:grid-cols-2 gap-8 p-6 sm:p-8 md:p-12 items-center relative z-10">
              {/* Value Proposition - Now on the left on desktop */}
              <div className="text-white z-10 relative order-1 md:order-1">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 md:mb-4">
                  Why Pay For Multiple Content Tools When You Can Get
                  <span className="block text-orange-300"> Everything In One?</span>
                </h2>
  
                <p className="mb-6 md:mb-8 text-white/90 text-sm sm:text-base">
                  Journalist AI combines everything you need for content creation in a single, affordable platform, for a
                  fraction of the cost of multiple subscriptions.
                </p>
  
                <div className="h-px w-full bg-white/20 mb-6 md:mb-8"></div>
  
                <div className="grid grid-cols-2 gap-4 sm:gap-6 md:gap-8 mb-6 md:mb-8">
                  <div>
                    <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-1 md:mb-2">$2,526</div>
                    <div className="font-medium mb-1 text-sm sm:text-base">Stop Overpaying</div>
                    <p className="text-xs sm:text-sm text-white/80">
                      Your Current Content Tools Are Bleeding Your Budget
                    </p>
                  </div>
  
                  <div>
                    <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-orange-300 mb-1 md:mb-2">$49</div>
                    <div className="font-medium mb-1 text-sm sm:text-base">Start Saving Today</div>
                    <p className="text-xs sm:text-sm text-white/80">
                      Affordable AI Content That Delivers Real, Measurable Results
                    </p>
                  </div>
                </div>
  
                <button className="w-full sm:w-auto bg-white text-[#294df6] hover:bg-orange-300 hover:text-white transition-colors px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-medium text-sm sm:text-base">
                  Start for Free Today
                </button>
              </div>
  
              {/* Pricing Comparison - Now on the right on desktop */}
              <div className="relative z-10 order-2 md:order-2">
                <div className="relative mx-auto md:mx-0 max-w-sm md:max-w-md">
                  {/* Floating UI Elements - Visible on all devices but positioned differently */}
                  <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 mb-4 relative left-0 md:left-0 max-w-full md:max-w-md">
                    <div className="text-xs sm:text-sm text-gray-500 mb-2">Annual Content Writer Subscriptions</div>
                    <div className="flex items-center justify-between mb-3 pb-3 border-b">
                      <div className="flex items-center">
                        <div className="w-6 h-6 sm:w-8 sm:h-8 bg-orange-100 rounded flex items-center justify-center mr-2 sm:mr-3">
                          <span className="text-orange-600 text-xs sm:text-sm">A</span>
                        </div>
                        <div>
                          <div className="font-medium text-sm sm:text-base">Premium AI Writer</div>
                          <div className="text-xs text-gray-500 hidden sm:block">Jul 2, 2024</div>
                        </div>
                      </div>
                      <div className="text-red-500 font-bold text-sm sm:text-base">-$1,188</div>
                    </div>
  
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-100 rounded flex items-center justify-center mr-2 sm:mr-3">
                          <span className="text-blue-600 text-xs sm:text-sm">J</span>
                        </div>
                        <div>
                          <div className="font-medium text-sm sm:text-base">Jasper AI</div>
                          <div className="text-xs text-gray-500 hidden sm:block">Aug 10, 2024</div>
                        </div>
                      </div>
                      <div className="text-red-500 font-bold text-sm sm:text-base">-$588</div>
                    </div>
                  </div>
  
                  <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 max-w-full md:max-w-md ml-auto relative right-0 md:right-0 mb-4 md:mb-0">
                    <div className="text-xs sm:text-sm text-gray-500 mb-2">Monthly Content Services</div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-6 h-6 sm:w-8 sm:h-8 bg-green-100 rounded flex items-center justify-center mr-2 sm:mr-3">
                          <span className="text-green-600 text-xs sm:text-sm">F</span>
                        </div>
                        <div>
                          <div className="font-medium text-sm sm:text-base">Freelance Writer</div>
                          <div className="text-xs text-gray-500 hidden sm:block">Monthly payment</div>
                        </div>
                      </div>
                      <div className="text-red-500 font-bold text-sm sm:text-base">-$750</div>
                    </div>
                  </div>
  
                  <div className="bg-white rounded-xl shadow-lg p-2 sm:p-3 max-w-xs mx-auto md:mx-0 md:absolute md:bottom-0 md:right-0 mt-4">
                    <div className="bg-red-100 text-red-600 text-xs font-bold px-2 py-1 rounded mb-1">
                      Annual Content Costs Rising ↗
                    </div>
                    <div className="text-xs sm:text-sm">$2,526 annual content spend</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    )
  }
  
  