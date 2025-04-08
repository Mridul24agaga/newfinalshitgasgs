import Image from "next/image"

export function BlogPreview() {
  return (
    <div className="relative">
      <div className="bg-white rounded-lg shadow-xl overflow-hidden max-w-md mx-auto">
        {/* Browser Bar */}
        <div className="bg-gray-100 px-3 md:px-4 py-2 flex items-center border-b">
          <div className="flex space-x-1.5 mr-3 md:mr-4">
            <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-red-500"></div>
            <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-yellow-500"></div>
            <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-green-500"></div>
          </div>
          <div className="flex-1 bg-white rounded-md px-2 md:px-3 py-1 text-xs text-gray-500 flex items-center">
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
              className="mr-1"
            >
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="2" x2="22" y1="12" y2="12"></line>
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
            </svg>
            yourwebsite.com
          </div>
        </div>

        {/* Blog Content */}
        <div className="p-3 md:p-5">
          <div className="flex items-center mb-3 md:mb-4">
            <div className="w-6 h-6 md:w-8 md:h-8 bg-emerald-500 rounded flex items-center justify-center mr-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="16" x2="8" y1="13" y2="13"></line>
                <line x1="16" x2="8" y1="17" y2="17"></line>
                <line x1="10" x2="8" y1="9" y2="9"></line>
              </svg>
            </div>
            <span className="font-medium text-sm md:text-base">Your Blog</span>
          </div>

          <div className="space-y-1 mb-3 md:mb-4">
            <div className="h-1.5 md:h-2 bg-gray-200 rounded w-3/4"></div>
            <div className="h-1.5 md:h-2 bg-gray-200 rounded"></div>
            <div className="h-1.5 md:h-2 bg-gray-200 rounded w-5/6"></div>
            <div className="h-1.5 md:h-2 bg-gray-200 rounded w-1/2"></div>
          </div>

          <div className="grid grid-cols-2 gap-3 md:gap-4 mb-3 md:mb-4">
            <div className="overflow-hidden rounded-lg">
              <div className="relative h-24 sm:h-32">
                <Image
                  src="/placeholder.svg?height=128&width=200"
                  alt="Blog post thumbnail"
                  fill
                  className="rounded-lg object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 p-1.5 md:p-2 bg-white bg-opacity-90 text-xs">
                  <div className="font-medium">Selling on Amazon</div>
                  <div className="text-gray-600 text-xs">5 Step Guide</div>
                </div>
              </div>
            </div>
            <div className="overflow-hidden rounded-lg">
              <div className="relative h-24 sm:h-32">
                <Image
                  src="/placeholder.svg?height=128&width=200"
                  alt="Blog post thumbnail"
                  fill
                  className="rounded-lg object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 p-1.5 md:p-2 bg-white bg-opacity-90 text-xs">
                  <div className="font-medium">5 Step Guide to</div>
                  <div className="text-gray-600 text-xs">Amazon Selling</div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 md:gap-4">
            <div className="h-16 sm:h-24 bg-gray-200 rounded-lg"></div>
            <div className="h-16 sm:h-24 bg-gray-200 rounded-lg"></div>
          </div>

          <div className="mt-3 md:mt-4">
            <div className="h-1.5 md:h-2 bg-gray-200 rounded w-3/4"></div>
            <div className="h-1.5 md:h-2 bg-gray-200 rounded mt-1"></div>
            <div className="h-1.5 md:h-2 bg-gray-200 rounded w-1/2 mt-1"></div>
          </div>
        </div>
      </div>

      {/* Typing Indicator */}
      <div className="absolute -bottom-6 md:-bottom-8 left-1/2 transform -translate-x-1/2 bg-white rounded-full shadow-lg px-3 md:px-4 py-1.5 md:py-2 flex items-center text-xs md:text-sm">
        <div className="w-5 h-5 md:w-6 md:h-6 bg-black rounded-full flex items-center justify-center mr-1.5 md:mr-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="10"
            height="10"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <line x1="16" x2="8" y1="13" y2="13"></line>
            <line x1="16" x2="8" y1="17" y2="17"></line>
            <line x1="10" x2="8" y1="9" y2="9"></line>
          </svg>
        </div>
        <span>How to optimize...</span>
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
          className="ml-1.5 md:ml-2"
        >
          <path d="m9 18 6-6-6-6"></path>
        </svg>
      </div>
    </div>
  )
}

