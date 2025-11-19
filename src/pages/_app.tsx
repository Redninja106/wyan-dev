import type { AppProps } from 'next/app'

import { TASA_Explorer } from 'next/font/google'
import './globals.css'; 

const tasaExplorer = TASA_Explorer({
    variable: "--font-tasa-explorer",
})

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div className={`content ${tasaExplorer.className}`}>
      <Component {...pageProps} />
    </div>
  )
}
