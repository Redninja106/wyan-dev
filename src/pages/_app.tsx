import type { AppProps } from 'next/app'

import { TASA_Explorer } from 'next/font/google'
import './globals.css'; 

const tasaExplorer = TASA_Explorer({
    variable: "--font-tasa-explorer",
    fallback: ["Times New Roman"]
})

function Footer() {
  return (
    <div className='footer-links'>
      <hr/>
      <a href='https://github.com/Redninja106' target='_blank' rel='noopener noreferrer' className='social-icon'>
        <img src='/octicon.svg' alt='GitHub' />
      </a>
      <a href='https://www.linkedin.com/in/ryan-andersen1/' target='_blank' rel='noopener noreferrer' className='social-icon'>
        <img src='/linkedin.svg' alt='LinkedIn' />
      </a>
      <a href='https://x.com/whos_wyan' target='_blank' rel='noopener noreferrer' className='social-icon'>
        <img src='/x.svg' alt='X/Twitter' />
      </a>
      <a className='caption'>© 2026 Ryan Andersen</a>
      <a className='caption' href='/resume'>my resume</a>
      <a className='caption' href='mailto:ryan@wyan.dev'>email me</a>
    </div>
  )
}

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div className={`content ${tasaExplorer.className}`}>
      <Component {...pageProps} />
      <Footer></Footer>
    </div>
  )
}
