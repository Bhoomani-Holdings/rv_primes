export default function PasswordVisibilityToggle({ visible, onToggle }) {
  return (
    <button
      className="login-password-toggle"
      type="button"
      aria-label={visible ? "Hide password" : "Show password"}
      aria-pressed={visible}
      onClick={onToggle}
    >
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        {visible ? (
          <>
            <path d="M3 3l18 18" />
            <path d="M10.6 10.6a2 2 0 0 0 2.8 2.8" />
            <path d="M9.9 5.2A11.7 11.7 0 0 1 12 5c5 0 8.5 4.2 9.5 6-.4.7-1.2 1.8-2.4 2.9M6.2 6.2C4.2 7.4 2.9 9.2 2.5 11c.7 1.3 4.1 6 9.5 6 1 0 1.9-.2 2.7-.5" />
          </>
        ) : (
          <>
            <path d="M2.5 12s3.4-7 9.5-7 9.5 7 9.5 7-3.4 7-9.5 7-9.5-7-9.5-7Z" />
            <circle cx="12" cy="12" r="3" />
          </>
        )}
      </svg>
    </button>
  );
}
