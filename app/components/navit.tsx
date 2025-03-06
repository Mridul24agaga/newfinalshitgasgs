import Link from "next/link"

export default function AnnouncementBanner() {
  return (
    <div className="w-full bg-[#E3FF40] py-2 px-4 text-center text-black font-bold">
      <p className="flex items-center justify-center gap-1 sm:gap-2 text-xs sm:text-sm">
        <span className="hidden sm:inline">🔥 LAUNCH OFFER - FULL YEAR BLOGGING AT $1.5/BLOG 🔥</span>
        <span className="sm:hidden">🔥FULL YEAR BLOGGING: $1.5/BLOG 🔥</span>
        <Link
          href="https://checkout.dodopayments.com/buy/pdt_wv5ym9qiCQ82f72ZWJUUJ?quantity=1&redirect_url=https://blogosocial.com%2Fafter-payment"
          className="underline hover:text-black/80 transition-colors"
        >
          CLICK HERE
        </Link>
      </p>
    </div>
  )
}

