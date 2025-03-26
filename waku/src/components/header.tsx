'use client'
import { motion } from 'framer-motion'
import { Link, useRouter_UNSTABLE as useRouter } from 'waku'

const navItems = [
  { path: '/', label: 'Home' },
  { path: '/matches', label: 'Matches' },
  { path: '/create-match', label: 'Create Match' },
]

export function Header() {
  const { path } = useRouter()

  return (
    <header className="fixed w-full top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center"
        >
          <Link to="/" className="text-xl font-bold text-primary">
            Match
            <span className="text-foreground">Hub</span>
          </Link>
        </motion.div>

        <nav className="hidden md:flex items-center space-x-1">
          {navItems.map((item, i) => (
            <motion.div
              key={item.path}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 + i * 0.1 }}
            >
              <Link
                to={item.path}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 relative ${
                  path === item.path
                    ? 'text-primary'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {item.label}
                {path === item.path && (
                  <motion.div
                    layoutId="nav-pill"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full"
                    transition={{
                      type: 'spring',
                      stiffness: 400,
                      damping: 30,
                    }}
                  />
                )}
              </Link>
            </motion.div>
          ))}
        </nav>

        <div className="md:hidden">
          {/* Mobile menu button */}
          <button className="p-2 rounded-full text-muted-foreground hover:text-foreground transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  )
}
