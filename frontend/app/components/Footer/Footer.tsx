import Link from 'next/link'
import React from 'react'

const Footer = () => {
  return (
    <div>
      <footer className="bg-gray-800 sticky  text-white py-6 w-full shrink-0 items-center px-1 md:px-6 border-t">
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-6 items-center justify-between w-full">
          <p className="text-xs text-gray-400">© 2024 CoWork Marketplace. All rights reserved.</p>
          <nav className="sm:ml-auto flex gap-4 sm:gap-6">
            <Link className="text-xs hover:text-gray-400 hover:underline underline-offset-4" href="#">
              Terms of Service
            </Link>
            <Link className="text-xs hover:text-gray-400 hover:underline underline-offset-4" href="#">
              Privacy
            </Link>
            <Link className="text-xs hover:text-gray-400 hover:underline underline-offset-4" href="#">
              Cookie Policy
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  )
}

export default Footer
