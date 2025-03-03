import Link from "next/link"

export default function AnnouncementBanner() {
  return (
    <div className="w-full bg-orange-500 py-2 text-center text-sm text-white">
      <p className="flex items-center justify-center gap-2">
        🔥 LAUNCH OFFER - FULL YEAR BLOGGING AT $1.5/BLOG
        <Link href="https://checkout.dodopayments.com/buy/pdt_wv5ym9qiCQ82f72ZWJUUJ?quantity=1&redirect_url=https://blogosocial.com%2Fafter-payment" className="font-bold underline hover:text-white/90 transition-colors">
          CLICK HERE
        </Link>
        🔥
      </p>
    </div>
  )
}

