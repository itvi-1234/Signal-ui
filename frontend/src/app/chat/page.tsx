export default function ChatEmptyState() {
  return (
    <div
      className="flex-1 flex flex-col items-center justify-center h-full select-none"
      style={{ backgroundColor: '#1A1A1A' }}
    >
      {/* Signal logo — matches module-splash-screen__logo */}
      <img src="/signal.png" alt="Signal Logo" width={80} height={80} className="mb-6 opacity-95 object-contain" />

      {/* Signal's exact empty state text */}
      <h2 className="text-[20px] font-semibold text-white mb-2" style={{ letterSpacing: '-0.014em' }}>
        Signal Desktop
      </h2>
      <p className="text-[13px] mb-1" style={{ color: 'rgba(255,255,255,0.55)', letterSpacing: '-0.003em' }}>
        See{' '}
        <span
          className="cursor-pointer hover:underline"
          style={{ color: '#2C6BED' }} // ultramarine link color
        >
          what&apos;s new
        </span>
        {' '}in this update
      </p>

      <p className="text-[11px] mt-16" style={{ color: 'rgba(255,255,255,0.30)', letterSpacing: '0.005em' }}>
        Signal is a 501c3 nonprofit
      </p>
    </div>
  );
}
