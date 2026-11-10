// Small icons for the payment options (Bootstrap Icons, MIT license, copied as inline SVG)
// "currentColor" means the icon uses the text colour, so it turns white when the button is selected.

// QR code icon (for ABA QR)
export function QrIcon({ size = 24 }) {
  return (
    <svg width={size} height={size} fill="currentColor" viewBox="0 0 16 16" aria-hidden="true" className="flex-shrink-0">
      <path d="M2 2h2v2H2z"/>
      <path d="M6 0v6H0V0zM5 1H1v4h4zM4 12H2v2h2z"/>
      <path d="M6 10v6H0v-6zm-5 1v4h4v-4zm11-9h2v2h-2z"/>
      <path d="M10 0v6h6V0zm5 1v4h-4V1zM8 1V0h1v2H8v2H7V1zm0 5V4h1v2zM6 8V7h1V6h1v2h1V7h5v1h-4v1H7V8zm0 0v1H2V8H1v1H0V7h3v1zm10 1h-1V7h1zm-1 0h-1v2h2v-1h-1zm-4 0h2v1h-1v1h-1zm2 3v-1h-1v1h-1v1H9v1h3v-2zm0 0h3v1h-2v1h-1zm-4-1v1h1v-2H7v1z"/>
      <path d="M7 12h1v3h4v1H7zm9 2v2h-3v-1h2v-1z"/>
    </svg>
  );
}

// Cash icon (for Cash on delivery)
export function CashIcon({ size = 24 }) {
  return (
    <svg width={size} height={size} fill="currentColor" viewBox="0 0 16 16" aria-hidden="true" className="flex-shrink-0">
      <path d="M1 3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1zm7 8a2 2 0 1 0 0-4 2 2 0 0 0 0 4"/>
      <path d="M0 5a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H1a1 1 0 0 1-1-1zm3 0a2 2 0 0 1-2 2v4a2 2 0 0 1 2 2h10a2 2 0 0 1 2-2V7a2 2 0 0 1-2-2z"/>
    </svg>
  );
}