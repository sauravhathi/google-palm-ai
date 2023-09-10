import './globals.css'
import type { Metadata } from 'next'

import {Providers} from "./providers";

export const metadata: Metadata = {
  title: 'Google Palm Ai',
  description: 'Google Palm Ai is a tool that uses Google\'s Palm AI to generate text based on a prompt.',
  keywords: 'Google Palm Ai, Google, Palm, Ai, ai, google, google ai, google palm ai, palm ai, palm google ai, google palm, palm google',
}

export default function RootLayout({children}: { children: React.ReactNode }) {
  return (
    <html lang="en" className='dark'>
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}