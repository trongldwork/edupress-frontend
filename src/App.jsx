import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Footer from './components/Footer/Footer'
import { Account } from '@toolpad/core'
import AccountMenu from './components/AccountMenu/AccountMenu'

function App() {

  return (
    <>
      <AccountMenu/>
      <Footer/>
    </>
  )
}

export default App
