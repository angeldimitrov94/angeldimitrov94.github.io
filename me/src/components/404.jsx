import React from 'react'
import { Link } from 'react-router-dom'

function NotFound() {
  return (
    <div className="mx-auto my-10 px-10 py-10 max-w-4xl bg-gradient-to-b from-white/20 to-white/15 rounded-3xl backdrop-blur-lg shadow-2xl relative text-gray-50">
      <h1 className="text-5xl font-bold text-red-500 mb-4">404</h1>
      <h2 className="text-3xl font-semibold mb-4">Page Not Found</h2>
      <p className="text-lg text-gray-100 mb-6">
        Sorry, the page you're looking for doesn't exist. Would you like to go back to the home page?
      </p>
      <Link 
        to="/" 
        className="inline-block px-8 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-semibold"
      >
        Back to Home
      </Link>
    </div>
  )
}

export default NotFound