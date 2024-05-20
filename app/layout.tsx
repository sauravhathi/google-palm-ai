import './globals.css'
import type { Metadata } from 'next'

import { Providers } from "./providers";

export const metadata: Metadata = {
  title: 'Google Palm Ai',
  description: 'Google Palm Ai is a tool that uses Google\'s Palm AI to generate text based on a prompt.',
  keywords: 'Google Palm Ai, Google, Palm, Ai, ai, google, google ai, google palm ai, palm ai, palm google ai, google palm, palm google',
  authors: [{ name: 'Saurav Hathi' }, { name: 'Saurav Hathi', url: 'https://github.com/sauravhathi' }],
  creator: 'Saurav Hathi',
  publisher: 'Saurav Hathi',
  viewport: 'width=device-width, initial-scale=0.1',
  
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className='dark'>
      <body>
        <main className="min-h-screen flex flex-col gap-10 py-5 relative">
          <Providers>
            {children}
          </Providers>
          <footer className="flex flex-col items-center justify-center gap-2">
            <p className="text-gray-500 text-sm">
              Made with ❤️ by <a href="https://github.com/sauravhathi" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:underline">Saurav Hathi</a>
            </p>
          </footer>
        </main>
      </body>
    </html>
  );
}