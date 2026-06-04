type IconName = 'grid' | 'deposit' | 'agents' | 'activity' | 'docs' | 'shield';

interface IconProps {
  name: IconName;
  size?: number;
}

export function Icon({ name, size = 16 }: IconProps) {
  const stroked = name === 'deposit' || name === 'activity' || name === 'shield';
  return (
    <svg
      className="ic"
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill={stroked ? 'none' : 'currentColor'}
      stroke={stroked ? 'currentColor' : 'none'}
      aria-hidden="true"
    >
      {name === 'grid' && (
        <>
          <rect x="2" y="2" width="5.5" height="5.5" rx="1.4" />
          <rect x="8.5" y="2" width="5.5" height="5.5" rx="1.4" />
          <rect x="2" y="8.5" width="5.5" height="5.5" rx="1.4" />
          <rect x="8.5" y="8.5" width="5.5" height="5.5" rx="1.4" />
        </>
      )}
      {name === 'deposit' && (
        <>
          <path d="M8 2.5v7M5 7l3 3 3-3" strokeWidth="1.4" />
          <path d="M3 12.5h10" strokeWidth="1.4" />
        </>
      )}
      {name === 'agents' && (
        <>
          <circle cx="5" cy="5" r="2.2" />
          <circle cx="11" cy="5" r="2.2" />
          <circle cx="8" cy="11" r="2.2" />
        </>
      )}
      {name === 'activity' && (
        <path d="M2 8h3l1.5-4 3 8L13 8h1" strokeWidth="1.4" strokeLinejoin="round" strokeLinecap="round" />
      )}
      {name === 'docs' && (
        <>
          <rect x="3.5" y="2" width="9" height="12" rx="1.5" />
          <path d="M5.5 5h5M5.5 7.5h5M5.5 10h3" strokeWidth="1.1" />
        </>
      )}
      {name === 'shield' && (
        <>
          <path d="M8 1.8l5 1.8v3.6c0 3-2.2 5-5 6-2.8-1-5-3-5-6V3.6L8 1.8z" strokeWidth="1.3" />
          <path d="M6 8l1.4 1.4L10.5 6" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
        </>
      )}
    </svg>
  );
}
