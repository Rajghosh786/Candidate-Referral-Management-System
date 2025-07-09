import React from 'react'

const Footer = () => {
  return (
    <footer className="bg-blue-100 text-blue-700 text-center py-4 shadow-inner">
      <p className="text-sm">&copy; {new Date().getFullYear()} Your Company. All rights reserved.</p>
    </footer>
  )
}

export default Footer
