import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import Footer from "../components/foot"

export default function RefundPolicy() {
  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-12">
        {/* Back arrow */}
        <Link href="/" className="mb-6 inline-flex items-center text-gray-600 hover:text-orange-500 transition-colors">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Link>

        <h1 className="mb-8 text-3xl font-bold text-gray-900 md:text-4xl">Refund Policy</h1>

        <div className="prose max-w-none text-gray-700">
          <p className="text-sm text-gray-500">Last Updated: March 5, 2025</p>

          <h2 className="mt-8 text-xl font-semibold text-gray-900">1. Overview</h2>
          <p>
            This Refund Policy outlines the terms and conditions for refunds related to Blogosocial's services. We
            strive to provide high-quality content creation services, and your satisfaction is important to us. Please
            read this policy carefully before purchasing our services.
          </p>

          <h2 className="mt-8 text-xl font-semibold text-gray-900">2. One-Time Trial Payment</h2>
          <p>
            2.1. <strong>Trial Service:</strong> The one-time trial payment of $7 is non-refundable once the service has
            been delivered or content creation has begun.
          </p>
          <p>
            2.2. <strong>Exceptions:</strong> If we are unable to deliver the trial service due to technical issues on
            our end, you may be eligible for a refund at our discretion.
          </p>

          <h2 className="mt-8 text-xl font-semibold text-gray-900">3. Subscription Plans</h2>
          <p>
            3.1. <strong>Cancellation:</strong> You may cancel your subscription at any time. Upon cancellation, your
            subscription will remain active until the end of your current billing period, and you will not be charged
            for subsequent billing periods.
          </p>
          <p>
            3.2. <strong>No Prorated Refunds:</strong> We do not provide prorated refunds for unused portions of your
            subscription period after cancellation.
          </p>
          <p>
            3.3. <strong>First-Time Subscribers:</strong> If you are a first-time subscriber and are not satisfied with
            our services, you may request a refund within the first 7 days of your subscription. This is limited to one
            refund per customer.
          </p>

          <h2 className="mt-8 text-xl font-semibold text-gray-900">4. Service Quality Issues</h2>
          <p>
            4.1. <strong>Content Revisions:</strong> If you are not satisfied with the quality of the content delivered,
            we offer up to two rounds of revisions per content piece to address your concerns before considering refund
            requests.
          </p>
          <p>
            4.2. <strong>Refund Eligibility:</strong> Refunds for quality issues will be considered on a case-by-case
            basis and are at the sole discretion of Blogosocial management.
          </p>
          <p>
            4.3. <strong>Documentation:</strong> To request a refund for quality issues, you must provide specific
            details about the problems with the delivered content and demonstrate that the content does not meet the
            agreed-upon requirements.
          </p>

          <h2 className="mt-8 text-xl font-semibold text-gray-900">5. Technical Issues</h2>
          <p>
            If you experience technical issues that prevent you from accessing or using our services, please contact our
            support team immediately. Refunds for technical issues will be evaluated on a case-by-case basis.
          </p>

          <h2 className="mt-8 text-xl font-semibold text-gray-900">6. Refund Process</h2>
          <p>
            6.1. <strong>Refund Requests:</strong> All refund requests must be submitted in writing to
            <a href="mailto:info@blogosocial.com" className="text-orange-500 hover:underline">
              {" "}
              info@blogosocial.com
            </a>{" "}
            with the subject line "Refund Request."
          </p>
          <p>
            6.2. <strong>Required Information:</strong> Your refund request should include your account information, the
            reason for the refund request, and any relevant documentation.
          </p>
          <p>
            6.3. <strong>Processing Time:</strong> We will review your refund request within 5 business days and notify
            you of our decision. If approved, refunds will be processed within 10 business days.
          </p>
          <p>
            6.4. <strong>Refund Method:</strong> Refunds will be issued using the same payment method used for the
            original purchase.
          </p>

          <h2 className="mt-8 text-xl font-semibold text-gray-900">7. Non-Refundable Items</h2>
          <p>The following are not eligible for refunds:</p>
          <ul className="list-disc pl-6">
            <li>Services that have been fully delivered and accepted</li>
            <li>Additional credits purchased beyond your subscription plan</li>
            <li>Subscriptions that have been active for more than 7 days (for first-time subscribers)</li>
            <li>Subscriptions that have been active for any period (for returning subscribers)</li>
          </ul>

          <h2 className="mt-8 text-xl font-semibold text-gray-900">8. Changes to This Policy</h2>
          <p>
            We reserve the right to modify this Refund Policy at any time. Changes will be effective immediately upon
            posting on our website. Your continued use of our services after such modifications constitutes your
            acceptance of the updated policy.
          </p>

          <h2 className="mt-8 text-xl font-semibold text-gray-900">9. Contact Information</h2>
          <p>If you have any questions about this Refund Policy, please contact us at:</p>
          <p>
            Email:{" "}
            <a href="mailto:info@blogosocial.com" className="text-orange-500 hover:underline">
              info@blogosocial.com
            </a>
          </p>
        </div>
      </div>
      <Footer />
    </div>
  )
}

