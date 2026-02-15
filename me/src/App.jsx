import React from 'react'
import './App.css'

import { HashRouter as Router, Routes, Route } from 'react-router-dom'

import Header from './components/Header'
import Footer from './components/Footer'
import Home from './components/Home'
import About from './components/About'
import MyWork from './components/MyWork'
import Contact from './components/Contact'
import NotFound from './components/NotFound'

function App(){
  return (
    <Router>
      <div className="page relative z-10">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/my-work" element={<MyWork />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  )
}

export default App
