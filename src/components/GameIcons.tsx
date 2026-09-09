export function GameAudioOnIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="currentColor" fillOpacity="0.25" />
      <path d="M15.5 8.5a5 5 0 0 1 0 7" />
      <path d="M19 5a9.5 9.5 0 0 1 0 14" />
    </svg>
  );
}

export function GameAudioOffIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <line x1="2" y1="2" x2="22" y2="22" stroke="currentColor" strokeWidth="2.5" />
      <path d="M11 5L6 9H2v6h4l5 4V5z" fill="currentColor" fillOpacity="0.25" />
      <line x1="16" y1="10" x2="21" y2="15" />
      <line x1="21" y1="10" x2="16" y2="15" />
    </svg>
  );
}

export function GameSkipIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <polygon points="4,5 12,12 4,19" />
      <polygon points="11,5 19,12 11,19" />
      <rect x="19.5" y="5" width="2.5" height="14" rx="1" />
    </svg>
  );
}
