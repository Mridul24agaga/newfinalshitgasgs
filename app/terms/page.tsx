import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import Footer from "../components/foot"

export default function TermsAndConditions() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Back arrow */}
        <Link href="/" className="mb-6 inline-flex items-center text-gray-600 hover:text-green-600 transition-colors">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Link>

        <div className="bg-white rounded-lg shadow-sm p-8 mb-12">
          <h1 className="text-center mb-8 text-3xl font-bold text-gray-900 md:text-4xl">Terms and Conditions</h1>

          <div className="prose max-w-none text-gray-700 mx-auto">
            <p className="text-sm text-gray-500 text-center mb-8">Last Updated: April 24, 2025</p>

            <h2 className="mt-8 text-xl font-semibold text-gray-900 border-b pb-2">1. Introduction</h2>
            <p>
              Welcome to GETMORESEO ("we," "our," or "us"). These Terms and Conditions govern your use of the GETMORESEO
              website, platform, and services (collectively, the "Services"). By accessing or using our Services, you
              agree to be bound by these Terms and Conditions. If you do not agree to these terms, please do not use our
              Services. Our goal is to help improve your online visibility and search engine rankings through ethical
              and effective SEO practices.
            </p>

            <h2 className="mt-8 text-xl font-semibold text-gray-900 border-b pb-2">2. Description of Services</h2>
            <p>
              GETMORESEO provides search engine optimization (SEO) services, including but not limited to keyword
              research, on-page optimization, technical SEO audits, content optimization, link building, local SEO,
              analytics and reporting, and SEO strategy consultation. Our Services are designed to improve your
              website's visibility in search engine results and drive organic traffic to your website.
            </p>

            <h2 className="mt-8 text-xl font-semibold text-gray-900 border-b pb-2">3. Account Registration</h2>
            <p>
              To access certain features of our Services, you may need to register for an account. You agree to provide
              accurate, current, and complete information during the registration process and to update such information
              to keep it accurate, current, and complete. You are responsible for safeguarding your password and for all
              activities that occur under your account. We recommend using strong, unique passwords and enabling
              two-factor authentication where available.
            </p>

            <h2 className="mt-8 text-xl font-semibold text-gray-900 border-b pb-2">4. Service Plans and Payment</h2>
            <p>
              4.1. <strong>Service Plans:</strong> We offer various SEO service plans with different features,
              deliverables, and pricing. The details of each plan are available on our website. Custom plans may be
              created based on your specific needs.
            </p>
            <p>
              4.2. <strong>Payment:</strong> You agree to pay all fees associated with your selected service plan. All
              payments are processed through our secure third-party payment processors. For ongoing services, we may
              require a deposit or retainer before work begins.
            </p>
            <p>
              4.3. <strong>Billing Cycle:</strong> Service fees are billed in advance on a monthly, quarterly, or annual
              basis, depending on the billing cycle you select. One-time services will be billed as specified in your
              service agreement.
            </p>
            <p>
              4.4. <strong>Cancellation:</strong> You may cancel ongoing services with 30 days' written notice. Upon
              cancellation, your service will remain active until the end of your current billing period. No refunds
              will be issued for partial periods or for services already rendered.
            </p>

            <h2 className="mt-8 text-xl font-semibold text-gray-900 border-b pb-2">5. SEO Results and Guarantees</h2>
            <p>
              5.1. <strong>No Guaranteed Rankings:</strong> While we strive to improve your search engine rankings, we
              cannot and do not guarantee specific rankings, traffic increases, or business outcomes. Search engine
              algorithms are complex and frequently updated, and many factors outside our control can affect rankings.
            </p>
            <p>
              5.2. <strong>Timeline:</strong> SEO is a long-term strategy. Significant results typically take 3-6 months
              to materialize, depending on your website's current status, competition, and industry.
            </p>
            <p>
              5.3. <strong>Reporting:</strong> We provide regular reports detailing the work performed and key
              performance metrics. These reports are for informational purposes and do not constitute guarantees of
              future performance.
            </p>

            <h2 className="mt-8 text-xl font-semibold text-gray-900 border-b pb-2">6. Client Responsibilities</h2>
            <p>
              6.1. <strong>Website Access:</strong> You agree to provide necessary access to your website, analytics
              accounts, and other platforms required for us to perform our Services.
            </p>
            <p>
              6.2. <strong>Implementation:</strong> For certain services, you may need to implement our recommendations
              on your website. Failure to implement recommendations may impact the effectiveness of our Services.
            </p>
            <p>
              6.3. <strong>Timely Communication:</strong> You agree to respond to our inquiries and requests for
              information in a timely manner to avoid delays in service delivery.
            </p>

            <h2 className="mt-8 text-xl font-semibold text-gray-900 border-b pb-2">7. Intellectual Property</h2>
            <p>
              7.1. <strong>Our Intellectual Property:</strong> The GETMORESEO name, logo, website, methodologies,
              strategies, and all content and materials available through our Services are protected by intellectual
              property rights and belong to us or our licensors.
            </p>
            <p>
              7.2. <strong>Deliverables:</strong> Upon full payment for our Services, we grant you a non-exclusive,
              worldwide license to use the deliverables we create for you (such as SEO reports, keyword research,
              content recommendations) for your business purposes.
            </p>
            <p>
              7.3. <strong>Your Content:</strong> You retain ownership of your website, content, and other materials you
              provide to us. You grant us a limited license to access and modify these materials as necessary to provide
              our Services.
            </p>

            <h2 className="mt-8 text-xl font-semibold text-gray-900 border-b pb-2">8. Ethical SEO Practices</h2>
            <p>
              8.1. <strong>White Hat SEO:</strong> We employ only ethical, "white hat" SEO techniques that comply with
              search engine guidelines. We do not engage in deceptive practices that could result in penalties.
            </p>
            <p>
              8.2. <strong>Client Conduct:</strong> You agree not to request or implement "black hat" SEO techniques
              that violate search engine guidelines. We reserve the right to refuse any requests that could potentially
              harm your website's standing with search engines.
            </p>

            <h2 className="mt-8 text-xl font-semibold text-gray-900 border-b pb-2">9. Prohibited Conduct</h2>
            <p>You agree not to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Use our Services for any illegal purpose or in violation of any laws</li>
              <li>Infringe upon the intellectual property rights of others</li>
              <li>Provide false or misleading information about your business or website</li>
              <li>Attempt to gain unauthorized access to any part of our Services</li>
              <li>Use our Services to promote content that is discriminatory, harmful, or offensive</li>
              <li>Engage in any activity that could damage, disable, or impair our Services</li>
              <li>Reverse engineer or attempt to extract the source code of our proprietary tools</li>
            </ul>

            <h2 className="mt-8 text-xl font-semibold text-gray-900 border-b pb-2">10. Limitation of Liability</h2>
            <p>
              To the maximum extent permitted by law, we shall not be liable for any indirect, incidental, special,
              consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or
              indirectly, or any loss of data, use, goodwill, or other intangible losses resulting from:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Your use of or inability to use our Services</li>
              <li>Any changes made to search engine algorithms</li>
              <li>Actions taken by search engines regarding your website</li>
              <li>Any unauthorized access to or use of our servers and/or any personal information stored therein</li>
              <li>Any third-party services or websites linked from our Services</li>
            </ul>
            <p className="mt-4">
              Our total liability for any claims arising under these Terms shall not exceed the amount you paid us for
              Services in the 6 months preceding the claim.
            </p>

            <h2 className="mt-8 text-xl font-semibold text-gray-900 border-b pb-2">11. Indemnification</h2>
            <p>
              You agree to indemnify, defend, and hold harmless GETMORESEO and its officers, directors, employees,
              agents, and affiliates from and against any claims, liabilities, damages, losses, and expenses, including
              reasonable attorneys' fees and costs, arising out of or in any way connected with your access to or use of
              our Services, your violation of these Terms and Conditions, or your violation of any third-party rights.
            </p>

            <h2 className="mt-8 text-xl font-semibold text-gray-900 border-b pb-2">12. Confidentiality</h2>
            <p>
              We respect the confidentiality of your business information. We will not disclose your confidential
              information to third parties except as required to provide our Services or as required by law. We may use
              anonymized data from your account for research and service improvement purposes.
            </p>

            <h2 className="mt-8 text-xl font-semibold text-gray-900 border-b pb-2">13. Modifications to Terms</h2>
            <p>
              We reserve the right to modify these Terms and Conditions at any time. We will provide notice of any
              material changes by posting the updated terms on our website or by sending you an email. Your continued
              use of our Services after such modifications constitutes your acceptance of the updated terms.
            </p>

            <h2 className="mt-8 text-xl font-semibold text-gray-900 border-b pb-2">14. Governing Law</h2>
            <p>
              These Terms and Conditions shall be governed by and construed in accordance with the laws of the United
              States, without regard to its conflict of law provisions. Any disputes arising under these Terms shall be
              resolved through arbitration in accordance with the rules of the American Arbitration Association.
            </p>

            <h2 className="mt-8 text-xl font-semibold text-gray-900 border-b pb-2">15. Contact Information</h2>
            <p>If you have any questions about these Terms and Conditions, please contact us at:</p>
            <div className="mt-4 bg-gray-50 p-4 rounded-md text-center">
              <p className="font-medium">GETMORESEO</p>
              <p>
                Email:{" "}
                <a href="mailto:hi@mridulthareja.com" className="text-green-600 hover:underline font-medium">
                  hi@mridulthareja.com
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
