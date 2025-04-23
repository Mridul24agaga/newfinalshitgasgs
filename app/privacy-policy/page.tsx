import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import Footer from "../components/foot"

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Back arrow */}
        <Link href="/" className="mb-6 inline-flex items-center text-gray-600 hover:text-green-600 transition-colors">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Link>

        <div className="bg-white rounded-lg shadow-sm p-8 mb-12">
          <h1 className="text-center mb-8 text-3xl font-bold text-gray-900 md:text-4xl">Privacy Policy</h1>

          <div className="prose max-w-none text-gray-700 mx-auto">
            <p className="text-sm text-gray-500 text-center mb-8">Last Updated: April 24, 2025</p>

            <h2 className="mt-8 text-xl font-semibold text-gray-900 border-b pb-2">1. Introduction</h2>
            <p>
              At GETMORESEO, we respect your privacy and are committed to protecting your personal data. This Privacy
              Policy explains how we collect, use, disclose, and safeguard your information when you use our website and
              SEO services. As a company dedicated to improving your online visibility, we understand the importance of
              data protection and transparency.
            </p>

            <h2 className="mt-8 text-xl font-semibold text-gray-900 border-b pb-2">2. Information We Collect</h2>
            <p>We may collect the following types of information:</p>
            <p>
              2.1. <strong>Personal Information:</strong> This includes information that can be used to identify you,
              such as your name, email address, phone number, billing information, company details, and website URLs.
            </p>
            <p>
              2.2. <strong>Website and Analytics Data:</strong> We collect information about your website performance,
              search rankings, keyword data, backlink profiles, and other SEO-related metrics to provide our services.
            </p>
            <p>
              2.3. <strong>Usage Data:</strong> We collect information about how you interact with our website and
              services, including IP address, browser type, pages visited, time spent on pages, and other diagnostic
              data to improve our service delivery.
            </p>
            <p>
              2.4. <strong>Business Information:</strong> Information related to your business needs for SEO services,
              including your industry, target audience, competitors, and content strategy preferences.
            </p>

            <h2 className="mt-8 text-xl font-semibold text-gray-900 border-b pb-2">3. How We Use Your Information</h2>
            <p>We use your information for the following purposes:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>To provide and maintain our SEO services and analytics</li>
              <li>To process and complete transactions</li>
              <li>To conduct keyword research and competitive analysis</li>
              <li>To optimize your website content and structure</li>
              <li>To track and report on your search engine rankings</li>
              <li>To communicate with you about your account, services, or support requests</li>
              <li>To send you SEO insights, marketing communications, and promotional offers</li>
              <li>To improve our website, services, and customer experience</li>
              <li>To detect, prevent, and address technical issues or fraudulent activities</li>
              <li>To comply with legal obligations</li>
            </ul>

            <h2 className="mt-8 text-xl font-semibold text-gray-900 border-b pb-2">4. Data Sharing and Disclosure</h2>
            <p>We may share your information with:</p>
            <p>
              4.1. <strong>Service Providers:</strong> Third-party vendors who provide services on our behalf, such as
              payment processing, SEO tools, analytics platforms, hosting, and content delivery networks.
            </p>
            <p>
              4.2. <strong>SEO Partners:</strong> Companies we partner with to offer integrated or specialized SEO
              services such as link building, content creation, or technical SEO audits.
            </p>
            <p>
              4.3. <strong>Legal Requirements:</strong> When required by law, court order, or governmental authority.
            </p>
            <p>
              4.4. <strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets,
              your information may be transferred as a business asset.
            </p>

            <h2 className="mt-8 text-xl font-semibold text-gray-900 border-b pb-2">5. Data Security</h2>
            <p>
              We implement appropriate technical and organizational measures to protect your personal information from
              unauthorized access, disclosure, alteration, or destruction. Our security measures include encryption,
              secure servers, regular security assessments, and strict access controls. However, no method of
              transmission over the Internet or electronic storage is 100% secure, and we cannot guarantee absolute
              security.
            </p>

            <h2 className="mt-8 text-xl font-semibold text-gray-900 border-b pb-2">6. Your Data Protection Rights</h2>
            <p>Depending on your location, you may have the following rights regarding your personal data:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Right to access your personal data</li>
              <li>Right to rectify inaccurate or incomplete data</li>
              <li>Right to erasure (right to be forgotten)</li>
              <li>Right to restrict processing</li>
              <li>Right to data portability</li>
              <li>Right to object to processing</li>
              <li>Right to withdraw consent</li>
            </ul>
            <p className="mt-4">
              To exercise these rights, please contact us at{" "}
              <a href="mailto:hi@mridulthareja.com" className="text-green-600 hover:underline font-medium">
              hi@mridulthareja.com
              </a>
              .
            </p>

            <h2 className="mt-8 text-xl font-semibold text-gray-900 border-b pb-2">
              7. Cookies and Tracking Technologies
            </h2>
            <p>
              We use cookies and similar tracking technologies to track activity on our website, analyze your website
              usage, and store certain preferences. These technologies help us improve our SEO services by understanding
              user behavior. You can manage your cookie preferences through your browser settings, though disabling
              certain cookies may limit functionality of our services.
            </p>

            <h2 className="mt-8 text-xl font-semibold text-gray-900 border-b pb-2">8. Children's Privacy</h2>
            <p>
              Our services are not intended for individuals under the age of 18. We do not knowingly collect personal
              information from children. If you are a parent or guardian and believe your child has provided us with
              personal information, please contact us immediately.
            </p>

            <h2 className="mt-8 text-xl font-semibold text-gray-900 border-b pb-2">9. International Data Transfers</h2>
            <p>
              As an SEO service provider, we may use tools and services located globally. Your information may be
              transferred to and processed in countries other than the country in which you reside. These countries may
              have data protection laws that differ from your country. We ensure appropriate safeguards are in place to
              protect your information when transferred internationally, including using EU-approved Standard
              Contractual Clauses where applicable.
            </p>

            <h2 className="mt-8 text-xl font-semibold text-gray-900 border-b pb-2">10. Retention of Data</h2>
            <p>
              We retain your personal information only for as long as necessary to fulfill the purposes outlined in this
              Privacy Policy, including for the purposes of satisfying any legal, accounting, or reporting requirements.
              For SEO services, we may retain certain data longer to provide historical performance analysis and trends.
            </p>

            <h2 className="mt-8 text-xl font-semibold text-gray-900 border-b pb-2">
              11. Changes to This Privacy Policy
            </h2>
            <p>
              We may update our Privacy Policy from time to time to reflect changes in our practices or for other
              operational, legal, or regulatory reasons. We will notify you of any material changes by posting the new
              Privacy Policy on this page and updating the "Last Updated" date. You are advised to review this Privacy
              Policy periodically.
            </p>

            <h2 className="mt-8 text-xl font-semibold text-gray-900 border-b pb-2">12. Contact Us</h2>
            <p>If you have any questions about this Privacy Policy or our data practices, please contact us at:</p>
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
      <Footer />
    </div>
  )
}
