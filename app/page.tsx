'use client'

import { useState, useCallback } from 'react'
import styles from './page.module.css'

export default function Home() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [error, setError] = useState('')
  const [stats, setStats] = useState({ lines: 0, chars: 0, size: '0 B' })

  const formatJSON = useCallback(() => {
    try {
      if (!input.trim()) {
        setError('Please enter JSON data')
        setOutput('')
        return
      }
      
      const parsed = JSON.parse(input)
      const formatted = JSON.stringify(parsed, null, 2)
      setOutput(formatted)
      setError('')
      
      // Stats
      const lines = formatted.split('\n').length
      const chars = formatted.length
      const size = new Blob([formatted]).size
      setStats({ 
        lines, 
        chars, 
        size: size > 1024 ? (size / 1024).toFixed(2) + ' KB' : size + ' B'
      })
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Invalid JSON')
      setOutput('')
    }
  }, [input])

  const minifyJSON = useCallback(() => {
    try {
      if (!input.trim()) return
      const parsed = JSON.parse(input)
      const minified = JSON.stringify(parsed)
      setOutput(minified)
      setError('')
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Invalid JSON')
    }
  }, [input])

  const clearAll = () => {
    setInput('')
    setOutput('')
    setError('')
    setStats({ lines: 0, chars: 0, size: '0 B' })
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output)
  }

  const loadSample = () => {
    const sample = {
      "name": "John Doe",
      "age": 30,
      "email": "john@example.com",
      "address": {
        "street": "123 Main St",
        "city": "New York",
        "country": "USA"
      },
      "hobbies": ["reading", "gaming", "coding"]
    }
    setInput(JSON.stringify(sample))
  }

  return (
    <main className={styles.main}>
      <header className={styles.header}>
        <div className={styles.container}>
          <div className={styles.headerContent}>
            <div className={styles.logo}>🔧 JSON Formatter</div>
            <nav className={styles.nav}>
              <a href="#tool">Tool</a>
              <a href="#features">Features</a>
            </nav>
          </div>
        </div>
      </header>

      <section className={styles.hero}>
        <div className={styles.container}>
          <h1>
            Format & Validate
            <span className={styles.gradient}> JSON</span>
          </h1>
          <p className={styles.subtitle}>
            Free online tool to format, validate, and beautify JSON data. 
            Syntax highlighting, tree view, and instant error detection.
          </p>
          <div className={styles.badges}>
            <span className={styles.badge}>✓ 100% Free</span>
            <span className={styles.badge}>✓ No Registration</span>
            <span className={styles.badge}>✓ Client-side Only</span>
          </div>
        </div>
      </section>

      <section className={styles.toolSection} id="tool">
        <div className={styles.toolContainer}>
          <div className={styles.buttonGroup}
            <button onClick={formatJSON} className={styles.primaryBtn}>
              🎨 Format / Beautify
            </button>
            <button onClick={minifyJSON} className={styles.secondaryBtn}>
              📦 Minify
            </button>
            <button onClick={loadSample} className={styles.secondaryBtn}>
              📝 Load Sample
            </button>
            <button onClick={clearAll} className={styles.dangerBtn}>
              🗑️ Clear
            </button>
          </div>

          <div className={styles.editorGrid}>
            <div className={styles.editorBox}>
              <label>Input JSON</label>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Paste your JSON here..."
                className={styles.textarea}
                spellCheck={false}
              />
            </div>

            <div className={styles.editorBox}>
              <label>
                Output
                {output && (
                  <button onClick={copyToClipboard} className={styles.copyBtn}>
                    📋 Copy
                  </button>
                )}
              </label>
              <textarea
                value={output}
                readOnly
                placeholder="Formatted JSON will appear here..."
                className={`${styles.textarea} ${styles.output}`}
              />
            </div>
          </div>

          {error && (
            <div className={styles.error}>
              ⚠️ Error: {error}
            </div>
          )}

          {output && !error && (
            <div className={styles.stats}>
              <span>📊 Lines: {stats.lines}</span>
              <span>🔤 Characters: {stats.chars}</span>
              <span>💾 Size: {stats.size}</span>
              <span>✅ Valid JSON</span>
            </div>
          )}
        </div>
      </section>

      <section className={styles.features} id="features">
        <div className={styles.container}>
          <h2>Features</h2>
          <div className={styles.featureGrid}>
            {[
              { icon: '🎨', title: 'Format & Beautify', desc: 'Make your JSON readable with proper indentation' },
              { icon: '✅', title: 'Validate', desc: 'Instant error detection and validation' },
              { icon: '📦', title: 'Minify', desc: 'Compress JSON to reduce file size' },
              { icon: '🔒', title: '100% Private', desc: 'All processing happens in your browser' },
            ].map((f, i) => (
              <div key={i} className={styles.feature}>
                <div className={styles.featureIcon}>{f.icon}</div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}