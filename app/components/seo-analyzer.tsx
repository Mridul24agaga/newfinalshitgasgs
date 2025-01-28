"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { TypeAnimation } from "react-type-animation"
import { analyzeSeo } from "../actions/analyze-seo"
import styles from "./seo-analyzer.module.css"

export function SeoAnalyzer() {
  const [url, setUrl] = useState("")
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [error, setError] = useState<string | null>(null)

  const steps = [
    "Scraping website data...",
    "Analyzing content...",
    "Generating summary...",
    "Creating SEO-optimized blog...",
    "Performing keyword analysis...",
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setResult(null)
    setError(null)
    setCurrentStep(0)

    try {
      for (let i = 0; i < steps.length; i++) {
        setCurrentStep(i)
        await new Promise((resolve) => setTimeout(resolve, 2000))
      }
      const data = await analyzeSeo(url)
      setResult(data)
    } catch (error: any) {
      console.error("Error:", error)
      setError(error.message || "An unexpected error occurred. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Enter website URL"
          required
          className={styles.input}
        />
        <button type="submit" disabled={loading} className={styles.button}>
          {loading ? "Analyzing..." : "Analyze"}
        </button>
      </form>

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={styles.error}
          >
            {error}
          </motion.div>
        )}

        {loading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={styles.loadingContainer}
          >
            <TypeAnimation
              sequence={[steps[currentStep]]}
              wrapper="p"
              cursor={true}
              repeat={0}
              className={styles.loadingText}
            />
          </motion.div>
        )}

        {result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={styles.resultContainer}
          >
            <div className={styles.card}>
              <h2 className={styles.cardTitle}>Summary</h2>
              <p className={styles.cardContent}>{result.summary}</p>
            </div>

            <div className={styles.card}>
              <h2 className={styles.cardTitle}>SEO Optimized Blog</h2>
              <h3 className={styles.blogTitle}>{result.blogTitle}</h3>
              <div dangerouslySetInnerHTML={{ __html: result.blogContent }} className={styles.blogContent} />
            </div>

            <div className={styles.card}>
              <h2 className={styles.cardTitle}>Keyword Analysis</h2>
              <ul className={styles.keywordList}>
                {result.keywords.map((keyword: string, index: number) => (
                  <li key={index} className={styles.keyword}>
                    {keyword}
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

