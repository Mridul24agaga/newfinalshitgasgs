import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import Footer from "../components/foot"

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-12">
        {/* Back arrow */}
        <Link href="/" className="mb-6 inline-flex items-center text-gray-600 hover:text-orange-500 transition-colors">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Link>

        <h1 className="mb-8 text-3xl font-bold text-gray-900 md:text-4xl">Privacy Policy</h1>

        <div className="prose max-w-none text-gray-700">
          <p className="text-sm text-gray-500">Last Updated: March 5, 2025</p>

          <h2 className="mt-8 text-xl font-semibold text-gray-900">1. Introduction</h2>
          <p>
            At Blogosocial, we respect your privacy and are committed to protecting your personal data. This Privacy
            Policy explains how we collect, use, disclose, and safeguard your information when you use our website and
            services.
          </p>

          <h2 className="mt-8 text-xl font-semibold text-gray-900">2. Information We Collect</h2>
          <p>We may collect the following types of information:</p>
          <p>
            2.1. <strong>Personal Information:</strong> This includes information that can be used to identify you, such
            as your name, email address, phone number, billing information, and company details.
          </p>
          <p>
            2.2. <strong>Usage Data:</strong> We collect information about how you interact with our website and
            services, including IP address, browser type, pages visited, time spent on pages, and other diagnostic data.
          </p>
          <p>
            2.3. <strong>Content Information:</strong> Information related to the content you provide us for creating
            blog posts or other deliverables, including your industry, target audience, and content preferences.
          </p>

          <h2 className="mt-8 text-xl font-semibold text-gray-900">3. How We Use Your Information</h2>
          <p>We use your information for the following purposes:</p>
          <ul className="list-disc pl-6">
            <li>To provide and maintain our services</li>
            <li>To process and complete transactions</li>
            <li>To create and deliver content based on your requirements</li>
            <li>To communicate with you about your account, services, or support requests</li>
            <li>To send you updates, marketing communications, and promotional offers</li>
            <li>To improve our website, services, and customer experience</li>
            <li>To detect, prevent, and address technical issues or fraudulent activities</li>
            <li>To comply with legal obligations</li>
          </ul>

          <h2 className="mt-8 text-xl font-semibold text-gray-900">4. Data Sharing and Disclosure</h2>
          <p>We may share your information with:</p>
          <p>
            4.1. <strong>Service Providers:</strong> Third-party vendors who provide services on our behalf, such as
            payment processing, content creation, hosting, and analytics.
          </p>
          <p>
            4.2. <strong>Business Partners:</strong> Companies we partner with to offer integrated or joint services.
          </p>
          <p>
            4.3. <strong>Legal Requirements:</strong> When required by law, court order, or governmental authority.
          </p>
          <p>
            4.4. <strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets, your
            information may be transferred as a business asset.
          </p>

          <h2 className="mt-8 text-xl font-semibold text-gray-900">5. Data Security</h2>
          <p>
            We implement appropriate technical and organizational measures to protect your personal information from
            unauthorized access, disclosure, alteration, or destruction. However, no method of transmission over the
            Internet or electronic storage is 100% secure, and we cannot guarantee absolute security.
          </p>

          <h2 className="mt-8 text-xl font-semibold text-gray-900">6. Your Data Protection Rights</h2>
          <p>Depending on your location, you may have the following rights regarding your personal data:</p>
          <ul className="list-disc pl-6">
            <li>Right to access your personal data</li>
            <li>Right to rectify inaccurate or incomplete data</li>
            <li>Right to erasure (right to be forgotten)</li>
            <li>Right to restrict processing</li>
            <li>Right to data portability</li>
            <li>Right to object to processing</li>
            <li>Right to withdraw consent</li>
          </ul>
          <p>
            To exercise these rights, please contact us at{" "}
            <a href="mailto:info@blogosocial.com" className="text-orange-500 hover:underline">
              info@blogosocial.com
            </a>
            .
          </p>

          <h2 className="mt-8 text-xl font-semibold text-gray-900">7. Cookies and Tracking Technologies</h2>
          <p>
            We use cookies and similar tracking technologies to track activity on our website and store certain
            information. Cookies are files with a small amount of data that may include an anonymous unique identifier.
            You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.
          </p>

          <h2 className="mt-8 text-xl font-semibold text-gray-900">8. Children's Privacy</h2>
          <p>
            Our services are not intended for individuals under the age of 18. We do not knowingly collect personal
            information from children. If you are a parent or guardian and believe your child has provided us with
            personal information, please contact us.
          </p>

          <h2 className="mt-8 text-xl font-semibold text-gray-900">9. International Data Transfers</h2>
          <p>
            Your information may be transferred to and processed in countries other than the country in which you
            reside. These countries may have data protection laws that differ from your country. By using our services,
            you consent to the transfer of your information to countries outside your country of residence.
          </p>

          <h2 className="mt-8 text-xl font-semibold text-gray-900">10. Changes to This Privacy Policy</h2>
          <p>
            We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new
            Privacy Policy on this page and updating the "Last Updated" date. You are advised to review this Privacy
            Policy periodically for any changes.
          </p>

          <h2 className="mt-8 text-xl font-semibold text-gray-900">11. Contact Us</h2>
          <p>If you have any questions about this Privacy Policy, please contact us at:</p>
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

