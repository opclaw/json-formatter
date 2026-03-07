'use client'

interface DonationButtonProps {
  username?: string
  className?: string
}

export default function DonationButton({ username = 'smartok', className = '' }: DonationButtonProps) {
  const donationUrl = `https://donationalerts.com/r/${username}`

  return (
    <a
      href={donationUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-300 ${className}`}
      style={{
        background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 50%, #f06595 100%)',
        color: 'white',
        boxShadow: '0 4px 15px rgba(238, 90, 111, 0.4)',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px)'
        e.currentTarget.style.boxShadow = '0 6px 20px rgba(238, 90, 111, 0.5)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)'
        e.currentTarget.style.boxShadow = '0 4px 15px rgba(238, 90, 111, 0.4)'
      }}
    >
      <svg 
        width="18" 
        height="18" 
        viewBox="0 0 24 24" 
        fill="currentColor"
        style={{ filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.2))' }}
      >
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
      </svg>
      <span>Поддержать проект</span>
    </a>
  )
}
