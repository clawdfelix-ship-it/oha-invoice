export const metadata = {
  title: 'OHA Invoice System',
  description: 'Invoice Generator for Trading Companies',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
