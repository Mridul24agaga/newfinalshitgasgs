import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import Footer from "../components/foot"
export default function TermsAndConditions() {
  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-12">
        {/* Back arrow */}
        <Link href="/" className="mb-6 inline-flex items-center text-gray-600 hover:text-orange-500 transition-colors">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Link>

        <h1 className="mb-8 text-3xl font-bold text-gray-900 md:text-4xl">Terms and Conditions</h1>

        <div className="prose max-w-none text-gray-700">
          <p className="text-sm text-gray-500">Last Updated: March 5, 2025</p>

          <h2 className="mt-8 text-xl font-semibold text-gray-900">1. Introduction</h2>
          <p>
            Welcome to Blogosocial ("we," "our," or "us"). These Terms and Conditions govern your use of the Blogosocial
            website, platform, and services (collectively, the "Services"). By accessing or using our Services, you
            agree to be bound by these Terms and Conditions. If you do not agree to these terms, please do not use our
            Services.
          </p>

          <h2 className="mt-8 text-xl font-semibold text-gray-900">2. Description of Services</h2>
          <p>
            Blogosocial provides content creation, blog management, and content strategy services for businesses and
            individuals. Our Services include professionally written blog posts, SEO optimization, content strategy
            consultation, and other related services as described on our website.
          </p>

          <h2 className="mt-8 text-xl font-semibold text-gray-900">3. Account Registration</h2>
          <p>
            To access certain features of our Services, you may need to register for an account. You agree to provide
            accurate, current, and complete information during the registration process and to update such information
            to keep it accurate, current, and complete. You are responsible for safeguarding your password and for all
            activities that occur under your account.
          </p>

          <h2 className="mt-8 text-xl font-semibold text-gray-900">4. Subscription and Payment</h2>
          <p>
            4.1. <strong>Subscription Plans:</strong> We offer various subscription plans with different features and
            pricing. The details of each plan are available on our website.
          </p>
          <p>
            4.2. <strong>Payment:</strong> You agree to pay all fees associated with your selected subscription plan.
            All payments are processed through our third-party payment processors.
          </p>
          <p>
            4.3. <strong>Billing Cycle:</strong> Subscription fees are billed in advance on a monthly or annual basis,
            depending on the billing cycle you select.
          </p>
          <p>
            4.4. <strong>Cancellation:</strong> You may cancel your subscription at any time. Upon cancellation, your
            subscription will remain active until the end of your current billing period.
          </p>

          <h2 className="mt-8 text-xl font-semibold text-gray-900">5. Content Ownership and Licensing</h2>
          <p>
            5.1. <strong>Your Content:</strong> You retain ownership of any content you provide to us for the purpose of
            creating blog posts or other content ("Your Content").
          </p>
          <p>
            5.2. <strong>Our Content:</strong> Upon full payment for our Services, we grant you a non-exclusive,
            worldwide, perpetual license to use the content we create for you ("Delivered Content") for your business
            purposes.
          </p>
          <p>
            5.3. <strong>Restrictions:</strong> You may not resell, redistribute, or sublicense the Delivered Content
            without our prior written consent.
          </p>

          <h2 className="mt-8 text-xl font-semibold text-gray-900">6. Intellectual Property</h2>
          <p>
            6.1. <strong>Our Intellectual Property:</strong> The Blogosocial name, logo, website, and all content and
            materials available through our Services (excluding Delivered Content) are protected by intellectual
            property rights and belong to us or our licensors.
          </p>
          <p>
            6.2. <strong>Limited License:</strong> We grant you a limited, non-exclusive, non-transferable license to
            access and use our Services for your personal or business purposes.
          </p>

          <h2 className="mt-8 text-xl font-semibold text-gray-900">7. Prohibited Conduct</h2>
          <p>You agree not to:</p>
          <ul className="list-disc pl-6">
            <li>Use our Services for any illegal purpose or in violation of any laws</li>
            <li>Infringe upon the intellectual property rights of others</li>
            <li>Interfere with or disrupt our Services or servers</li>
            <li>Attempt to gain unauthorized access to any part of our Services</li>
            <li>Use our Services to transmit harmful code or malware</li>
            <li>Engage in any activity that could damage, disable, or impair our Services</li>
          </ul>

          <h2 className="mt-8 text-xl font-semibold text-gray-900">8. Limitation of Liability</h2>
          <p>
            To the maximum extent permitted by law, we shall not be liable for any indirect, incidental, special,
            consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or
            indirectly, or any loss of data, use, goodwill, or other intangible losses resulting from your use of our
            Services.
          </p>

          <h2 className="mt-8 text-xl font-semibold text-gray-900">9. Indemnification</h2>
          <p>
            You agree to indemnify, defend, and hold harmless Blogosocial and its officers, directors, employees,
            agents, and affiliates from and against any claims, liabilities, damages, losses, and expenses, including
            reasonable attorneys' fees and costs, arising out of or in any way connected with your access to or use of
            our Services or your violation of these Terms and Conditions.
          </p>

          <h2 className="mt-8 text-xl font-semibold text-gray-900">10. Modifications to Terms</h2>
          <p>
            We reserve the right to modify these Terms and Conditions at any time. We will provide notice of any
            material changes by posting the updated terms on our website or by sending you an email. Your continued use
            of our Services after such modifications constitutes your acceptance of the updated terms.
          </p>

          <h2 className="mt-8 text-xl font-semibold text-gray-900">11. Governing Law</h2>
          <p>
            These Terms and Conditions shall be governed by and construed in accordance with the laws of India, without
            regard to its conflict of law provisions.
          </p>

          <h2 className="mt-8 text-xl font-semibold text-gray-900">12. Contact Information</h2>
          <p>If you have any questions about these Terms and Conditions, please contact us at:</p>
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

