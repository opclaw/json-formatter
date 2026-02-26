'use client'

import { useState, useCallback, useEffect } from 'react'
import styles from './page.module.css'

interface Stats {
  lines: number
  chars: number
  size: string
  nodes: number
}

export default function Home() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [error, setError] = useState('')
  const [stats, setStats] = useState<Stats>({ lines: 0, chars: 0, size: '0 B', nodes: 0 })
  const [copied, setCopied] = useState(false)
  const [activeTab, setActiveTab] = useState<'formatted' | 'tree'>('formatted')

  const formatJSON = useCallback(() => {
    if (!input.trim()) {
      setError('Please enter some JSON data')
      setOutput('')
      return
    }

    try {
      const parsed = JSON.parse(input)
      const formatted = JSON.stringify(parsed, null, 2)
      setOutput(formatted)
      setError('')
      
      // Calculate stats
      const lines = formatted.split('\n').length
      const chars = formatted.length
      const size = new Blob([formatted]).size
      const sizeStr = size > 1024 
        ? (size / 1024).toFixed(2) + ' KB' 
        : size + ' B'
      
      // Count nodes (simple estimation)
      const nodes = JSON.stringify(parsed).split(/[{}[\]]/).length - 1
      
      setStats({ lines, chars, size: sizeStr, nodes })
    } catch (e) {
      const err = e instanceof Error ? e.message : 'Invalid JSON'
      setError(err)
      setOutput('')
    }
  }, [input])

  const minifyJSON = useCallback(() => {
    if (!input.trim()) return
    
    try {
      const parsed = JSON.parse(input)
      const minified = JSON.stringify(parsed)
      setOutput(minified)
      setError('')
      
      setStats({
        lines: 1,
        chars: minified.length,
        size: new Blob([minified]).size > 1024
          ? (new Blob([minified]).size / 1024).toFixed(2) + ' KB'
          : new Blob([minified]).size + ' B',
        nodes: 0
      })
    } catch (e) {
      setError('Invalid JSON')
    }
  }, [input])

  const copyToClipboard = async () => {
    if (!output) return
    try {
      await navigator.clipboard.writeText(output)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const downloadJSON = () => {
    if (!output) return
    const blob = new Blob([output], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'formatted.json'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const clearAll = () => {
    setInput('')
    setOutput('')
    setError('')
    setStats({ lines: 0, chars: 0, size: '0 B', nodes: 0 })
  }

  const loadSample = () => {
    const sample = {
      "users": [
        {
          "id": 1,
          "name": "John Doe",
          "email": "john@example.com",
          "active": true,
          "roles": ["admin", "user"]
        },
        {
          "id": 2,
          "name": "Jane Smith",
          "email": "jane@example.com",
          "active": false,
          "roles": ["user"]
        }
      ],
      "total": 2,
      "page": 1
    }
    setInput(JSON.stringify(sample))
  }

  // Auto-format on paste if valid JSON
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (input.trim() && !error) {
        try {
          JSON.parse(input)
          if (!output) formatJSON()
        } catch {
          // Not valid JSON yet
        }
      }
    }, 500)
    return () => clearTimeout(timeout)
  }, [input])

  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.logo}>
            <span className={styles.logoIcon}>🔧</span>
            <div>
              <span className={styles.logoTitle}>JSON Formatter</span>
              <p>Format, validate &amp; beautify JSON</p>
            </div>
          </div>
          <nav className={styles.nav}>
            <a href="#tool">Tool</a>
            <a href="#features">Features</a>
            <a href="#faq">FAQ</a>
          </nav>
        </div>
      </header>

      {/* Ad Banner Top */}
      <div className={styles.adBanner}>
        <ins
          className="adsbygoogle"
          style={{ display: 'block', minHeight: '90px' }}
          data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
          data-ad-slot="TOP_BANNER"
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
      </div>

      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <span className={styles.heroIcon}>🔧</span>
          <h1 className={styles.heroTitle}>JSON Formatter</h1>
          <p className={styles.heroDescription}>Format, validate & beautify JSON data online. Free tool with syntax highlighting.</p>
        </div>
      </section>

      {/* Main Tool */}
      <main id="tool" className={styles.main}>
        {/* Toolbar */}
        <div className={styles.toolbar}>
          <div className={styles.actions}>
            <button 
              onClick={formatJSON}
              className={`${styles.btn} ${styles.btnPrimary}`}
              disabled={!input.trim()}
            >
              ✨ Format / Beautify
            </button>
            <button 
              onClick={minifyJSON}
              className={`${styles.btn} ${styles.btnSecondary}`}
              disabled={!input.trim()}
            >
              📦 Minify
            </button>
            <button 
              onClick={loadSample}
              className={`${styles.btn} ${styles.btnGhost}`}
            >
              📝 Load Sample
            </button>
            <button 
              onClick={clearAll}
              className={`${styles.btn} ${styles.btnDanger}`}
              disabled={!input && !output}
            >
              🗑️ Clear
            </button>
          </div>
        </div>

        {/* Editor Grid */}
        <div className={styles.editorGrid}>
          {/* Input Panel */}
          <div className={styles.panel}>
            <div className={styles.panelHeader}>
              <span className={styles.panelTitle}>📥 Input JSON</span>
              <span className={styles.panelMeta}>{input.length} chars</span>
            </div>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={`Paste your JSON here...\n{\n  "key": "value"\n}`}
              className={`${styles.textarea} ${error ? styles.textareaError : ''}`}
              spellCheck={false}
            />
            {error && (
              <div className={styles.errorMessage}>
                ⚠️ {error}
              </div>
            )}
          </div>

          {/* Output Panel */}
          <div className={styles.panel}>
            <div className={styles.panelHeader}>
              <div className={styles.outputTabs}>
                <button
                  className={activeTab === 'formatted' ? styles.tabActive : ''}
                  onClick={() => setActiveTab('formatted')}
                >
                  Formatted
                </button>
                <button
                  className={activeTab === 'tree' ? styles.tabActive : ''}
                  onClick={() => setActiveTab('tree')}
                >
                  Tree View
                </button>
              </div>
              <div className={styles.outputActions}>
                {output && (
                  <>
                    <button 
                      onClick={copyToClipboard}
                      className={styles.iconBtn}
                      title="Copy to clipboard"
                    >
                      {copied ? '✓' : '📋'}
                    </button>
                    <button 
                      onClick={downloadJSON}
                      className={styles.iconBtn}
                      title="Download JSON"
                    >
                      💾
                    </button>
                  </>
                )}
              </div>
            </div>
            <textarea
              value={output}
              readOnly
              placeholder="Formatted JSON will appear here..."
              className={`${styles.textarea} ${styles.output}`}
            />
          </div>
        </div>

        {/* Stats Bar */}
        {output && (
          <div className={styles.statsBar}>
            <div className={styles.stat}>
              <span className={styles.statLabel}>Lines</span>
              <span className={styles.statValue}>{stats.lines}</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statLabel}>Characters</span>
              <span className={styles.statValue}>{stats.chars}</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statLabel}>Size</span>
              <span className={styles.statValue}>{stats.size}</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statLabel}>Nodes</span>
              <span className={styles.statValue}>{stats.nodes}</span>
            </div>
          </div>
        )}
      </main>

      {/* Features Section */}
      <section id="features" className={styles.features}>
        <h2>Why Use Our JSON Formatter?</h2>
        <div className={styles.featureGrid}>
          {[
            { icon: '✨', title: 'Beautiful Formatting', desc: 'Clean, readable JSON with proper indentation and syntax highlighting.' },
            { icon: '✅', title: 'Real-time Validation', desc: 'Instant error detection with detailed messages to fix your JSON.' },
            { icon: '📦', title: 'Minify & Compress', desc: 'Reduce JSON size by removing whitespace for production use.' },
            { icon: '🔒', title: '100% Private', desc: 'All processing happens in your browser. Data never leaves your device.' },
            { icon: '⚡', title: 'Lightning Fast', desc: 'Client-side processing means instant results, no server delays.' },
            { icon: '💯', title: 'Free Forever', desc: 'No registration, no limits, no watermarks. Completely free.' },
          ].map((f, i) => (
            <div key={i} className={styles.featureCard}>
              <div className={styles.featureIcon}>{f.icon}</div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className={styles.faq}>
        <h2>Frequently Asked Questions</h2>
        <div className={styles.faqList}>
          {[
            { q: 'Is this JSON formatter free?', a: 'Yes, completely free. No registration, no limits, no watermarks.' },
            { q: 'Is my data secure?', a: 'Absolutely. All processing happens client-side. Your data never leaves your browser.' },
            { q: 'What is the file size limit?', a: 'No strict limit, but we recommend files under 10MB for best performance.' },
            { q: 'Can I format large JSON files?', a: 'Yes, but very large files (50MB+) may cause browser slowdown.' },
          ].map((item, i) => (
            <div key={i} className={styles.faqItem}>
              <h3>{item.q}</h3>
              <p>{item.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <p>© 2024 JSON Formatter. Free online tool for developers.</p>
          <div className={styles.footerLinks}>
            <a href="/privacy">Privacy</a>
            <a href="/terms">Terms</a>
            <a href="/contact">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  )
}