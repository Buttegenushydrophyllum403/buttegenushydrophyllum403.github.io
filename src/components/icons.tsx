type IconProps = { className?: string; size?: number };

export function LinkedInIcon({ className, size = 20 }: IconProps) {
  return (
    <svg aria-hidden width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.34V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13ZM7.12 20.45H3.56V9h3.56v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0Z" />
    </svg>
  );
}

export function GitHubIcon({ className, size = 20 }: IconProps) {
  return (
    <svg aria-hidden width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12 .3a12 12 0 0 0-3.8 23.38c.6.12.83-.26.83-.57L9 21.07c-3.34.72-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.08-.74.09-.73.09-.73 1.2.09 1.83 1.24 1.83 1.24 1.07 1.83 2.8 1.3 3.49 1 .1-.78.42-1.3.76-1.6-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.14-.3-.54-1.52.1-3.18 0 0 1-.32 3.3 1.23a11.5 11.5 0 0 1 6 0c2.28-1.55 3.29-1.23 3.29-1.23.64 1.66.24 2.88.12 3.18a4.65 4.65 0 0 1 1.23 3.22c0 4.61-2.8 5.63-5.48 5.92.42.36.81 1.1.81 2.22l-.01 3.29c0 .32.21.7.82.58A12 12 0 0 0 12 .3Z" />
    </svg>
  );
}

export function PlayStoreIcon({ className, size = 18 }: IconProps) {
  return (
    <svg aria-hidden width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M3.6 1.8c-.3.3-.5.8-.5 1.4v17.6c0 .6.2 1.1.5 1.4l.1.1 9.9-9.9v-.2L3.7 1.7l-.1.1Zm13.3 13.9-3.3-3.3v-.2l3.3-3.3.1.1 3.9 2.2c1.1.6 1.1 1.7 0 2.3l-3.9 2.2h-.1Zm-.1.1L13.4 12l-9.8 9.8c.4.4 1 .4 1.7.1l11.5-6.1m0-7.6L5.3 2.1c-.7-.4-1.3-.3-1.7.1l9.8 9.8 3.4-3.8Z" />
    </svg>
  );
}

export function AppleIcon({ className, size = 18 }: IconProps) {
  return (
    <svg aria-hidden width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M16.37 12.63c-.03-2.8 2.29-4.15 2.39-4.21-1.3-1.9-3.33-2.17-4.06-2.2-1.73-.17-3.37 1.02-4.25 1.02-.88 0-2.23-.99-3.67-.97a5.43 5.43 0 0 0-4.6 2.79c-1.96 3.4-.5 8.44 1.41 11.2.93 1.35 2.04 2.87 3.5 2.81 1.4-.06 1.93-.91 3.63-.91 1.69 0 2.17.91 3.66.88 1.51-.03 2.47-1.37 3.4-2.73a12.2 12.2 0 0 0 1.53-3.15 4.9 4.9 0 0 1-2.94-4.53ZM13.58 4.4A4.95 4.95 0 0 0 14.75.8a5.04 5.04 0 0 0-3.26 1.68 4.72 4.72 0 0 0-1.2 3.46c1.24.1 2.5-.63 3.29-1.54Z" />
    </svg>
  );
}

/** A friendly little quadcopter. */
export function DroneIcon({ className, size = 40 }: IconProps) {
  return (
    <svg aria-hidden width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
      <g stroke="currentColor" strokeWidth="3" strokeLinecap="round">
        <path d="M14 18l12 10M50 18L38 28" />
        <path d="M4 16h20M40 16h20" />
      </g>
      <rect x="22" y="24" width="20" height="14" rx="6" fill="var(--primary)" />
      <circle cx="32" cy="31" r="3.5" fill="var(--bg)" />
      <circle cx="32" cy="31" r="1.6" fill="var(--sky-bright)" />
      <path d="M26 38l-3 6M38 38l3 6" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

/** A small six-wheeled-ish Mars rover. */
export function RoverIcon({ className, size = 40 }: IconProps) {
  return (
    <svg aria-hidden width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
      <path d="M40 22V12l8-4" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="49" cy="7" r="3" fill="var(--gold-bright)" />
      <rect x="10" y="22" width="40" height="16" rx="4" fill="var(--gold-bright)" />
      <rect x="16" y="26" width="10" height="6" rx="2" fill="var(--bg)" />
      <path d="M14 38v6M30 38v6M46 38v6" stroke="currentColor" strokeWidth="3" />
      <circle cx="14" cy="50" r="6" fill="currentColor" />
      <circle cx="30" cy="50" r="6" fill="currentColor" />
      <circle cx="46" cy="50" r="6" fill="currentColor" />
    </svg>
  );
}
