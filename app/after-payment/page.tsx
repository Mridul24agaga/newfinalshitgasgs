"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { FormEvent, ChangeEvent } from "react"
import { createClient } from '@supabase/supabase-js'

// Initialize Supabase client with error checking
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Supabase URL and Anon Key must be provided in environment variables')
}

const supabase = createClient(supabaseUrl, supabaseKey)

function AfterPayment() {
  const [step, setStep] = useState<"choice" | "form" | "call" | "success">("choice")
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    startupName: "",
    websiteLaunched: false,
    websiteLink: "",
    email: "",
    problem: "",
    solutions: "",
    usp: "",
    keywords: "",
    countryLanguage: "",
    articleType: "",
    tone: "",
    targetAudience: "",
    pointOfView: "",
    creativityLevel: "",
    lengthPreferred: "",
    linking: ""
  })

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setErrorMessage(null)

    if (!formData.name || !formData.startupName || !formData.email) {
      setErrorMessage("Please fill in all required fields (Name, Startup Name, Email)")
      setIsLoading(false)
      return
    }

    try {
      const { data, error } = await supabase
        .from('user_signups')
        .insert([{
          name: formData.name,
          startup_name: formData.startupName,
          website_launched: formData.websiteLaunched,
          website_link: formData.websiteLink || null,
          email: formData.email,
          problem: formData.problem || null,
          solutions: formData.solutions || null,
          usp: formData.usp || null,
          keywords: formData.keywords || null,
          country_language: formData.countryLanguage || null,
          article_type: formData.articleType || null,
          tone: formData.tone || null,
          target_audience: formData.targetAudience || null,
          point_of_view: formData.pointOfView || null,
          creativity_level: formData.creativityLevel || null,
          length_preferred: formData.lengthPreferred || null,
          linking: formData.linking || null
        }])
        .select()

      if (error) {
        throw new Error(error.message || 'Unknown error occurred during insertion')
      }

      console.log('Successfully inserted data:', data)
      setStep("success")
    } catch (error: any) {
      console.error('Detailed error:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      })
      setErrorMessage(`Failed to submit form: ${error.message || 'Unknown error'}`)
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const target = e.target
    const { name, value } = target
    
    if (target instanceof HTMLInputElement && target.type === "checkbox") {
      setFormData(prev => ({
        ...prev,
        [name]: target.checked
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }))
    }
  }

  const renderGuidelines = () => (
    <div className="max-w-2xl mx-auto p-6 mb-8 bg-gray-100 rounded-lg">
      <h2 className="text-2xl font-bold mb-4">GUIDELINES</h2>
      <ul className="list-disc pl-5 space-y-2 text-gray-700">
        <li>After you submit the form or we complete the explanatory meeting, our experts will begin working, and the process will take seven days. On the eighth day, you will receive all pending blogs according to your plan and will start receiving blogs regularly thereafter.</li>
        <li>You will also gain dashboard access on the eighth day, after our research is completed. There, you can connect your Google Search Console and website for auto-publishing and tracking.</li>
        <li>For any doubts, updates, or changes, you can email us at [insert email] or message us on social media. After the eighth day, you can modify your settings anytime.</li>
        <li>Please keep us informed about any updates so our team can stay aligned with your needs.</li>
      </ul>
    </div>
  )

  const renderChoice = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-2xl mx-auto p-6 text-center"
    >
      <h2 className="text-2xl font-bold mb-6">How would you like to proceed?</h2>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button
          onClick={() => setStep("call")}
          className="px-6 py-3 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition-colors"
        >
          Book a Call With Us
        </button>
        <button
          onClick={() => setStep("form")}
          className="px-6 py-3 bg-white text-gray-700 border border-gray-300 rounded-full hover:bg-gray-50 transition-colors"
        >
          Fill Out Form (We'll Reach Out)
        </button>
      </div>
    </motion.div>
  )

  const renderCallBooking = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-2xl mx-auto p-6"
    >
      <h2 className="text-2xl font-bold mb-6">Book a Call</h2>
      <p className="text-gray-600 mb-6">
        Schedule a call with our team to discuss your needs. Click below to choose a time slot:
      </p>
      <a
        href="https://calendly.com/your-link"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block px-6 py-3 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition-colors"
      >
        Schedule Now
      </a>
      <button
        onClick={() => setStep("choice")}
        className="mt-4 text-gray-600 hover:text-gray-800"
      >
        Back to options
      </button>
    </motion.div>
  )

  const renderForm = () => (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-2xl mx-auto p-6"
    >
      {errorMessage && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-md">
          {errorMessage}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Personal Section */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Personal Information</h2>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Your Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Startup Name *</label>
            <input
              type="text"
              name="startupName"
              value={formData.startupName}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              required
            />
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="websiteLaunched"
              checked={formData.websiteLaunched}
              onChange={handleChange}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Website Launched</label>
          </div>

          {formData.websiteLaunched && (
            <div>
              <label className="block text-sm font-medium text-gray-700">Website Link</label>
              <input
                type="url"
                name="websiteLink"
                value={formData.websiteLink}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700">Email *</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              required
            />
          </div>
        </div>

        {/* Company Section */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Company Information</h2>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Problem You Solve</label>
            <textarea
              name="problem"
              value={formData.problem}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Solutions You Provide</label>
            <textarea
              name="solutions"
              value={formData.solutions}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Unique Selling Proposition</label>
            <input
              type="text"
              name="usp"
              value={formData.usp}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Keywords</label>
            <input
              type="text"
              name="keywords"
              value={formData.keywords}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              placeholder="comma separated keywords"
            />
          </div>
        </div>

        {/* Blog Settings */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Blog Settings</h2>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Country and Language</label>
            <input
              type="text"
              name="countryLanguage"
              value={formData.countryLanguage}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Article Type</label>
            <select
              name="articleType"
              value={formData.articleType}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            >
              <option value="">Select an option</option>
              <option value="expert">Expert (Recommended)</option>
              <option value="how-to">How-To</option>
              <option value="listicle">Listicle</option>
              <option value="review">Review</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Tone</label>
            <select
              name="tone"
              value={formData.tone}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            >
              <option value="">Select an option</option>
              <option value="professional">Professional</option>
              <option value="conversational">Conversational</option>
              <option value="formal">Formal</option>
              <option value="casual">Casual</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Target Audience</label>
            <textarea
              name="targetAudience"
              value={formData.targetAudience}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Point of View</label>
            <select
              name="pointOfView"
              value={formData.pointOfView}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            >
              <option value="">Select an option</option>
              <option value="first">First Person</option>
              <option value="third">Third Person</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Creativity Level</label>
            <select
              name="creativityLevel"
              value={formData.creativityLevel}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            >
              <option value="">Select an option</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Length Preferred</label>
            <select
              name="lengthPreferred"
              value={formData.lengthPreferred}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            >
              <option value="">Select an option</option>
              <option value="short">Short (500-800 words)</option>
              <option value="medium">Medium (800-1200 words)</option>
              <option value="long">Long (1200+ words)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">External & Internal Linking</label>
            <input
              type="text"
              name="linking"
              value={formData.linking}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              placeholder="Link preferences or instructions"
            />
          </div>
        </div>

        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => setStep("choice")}
            className="flex-1 py-3 px-6 bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300 transition-colors"
            disabled={isLoading}
          >
            Back
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className={`flex-1 py-3 px-6 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition-colors ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isLoading ? 'Submitting...' : 'Submit'}
          </button>
        </div>
      </form>
    </motion.div>
  )

  const renderSuccess = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-2xl mx-auto p-6 text-center"
    >
      <h2 className="text-3xl font-bold text-gray-900 mb-4">Submission Successful!</h2>
      <p className="text-gray-600 mb-6">
        Thank you for your submission. Our team will reach out to you soon to discuss next steps.
      </p>
      <button
        onClick={() => setStep("choice")}
        className="px-6 py-3 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition-colors"
      >
        Return to Options
      </button>
    </motion.div>
  )

  return (
    <div className="min-h-screen flex flex-col justify-center">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Thank You for Your Payment!</h1>
        <p className="mt-2 text-gray-600">Let's get started with setting up your account.</p>
      </div>
      {renderGuidelines()}
      {step === "choice" && renderChoice()}
      {step === "form" && renderForm()}
      {step === "call" && renderCallBooking()}
      {step === "success" && renderSuccess()}
    </div>
  )
}

export default AfterPayment