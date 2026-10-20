import './globals.css';

export const metadata = {
  title: { default: 'Autostack AI | Properties & Developers', template: '%s | Autostack AI' },
  description: 'Verified properties for sale and rent in DHA, Bahria Town and Islamabad. Buy, sell, rent or build with Autostack AI.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Playfair+Display:wght@600;700&display=swap" rel="stylesheet" />
      </head>
      <body>{children}</body>
    </html>
  );
}
