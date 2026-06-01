import { useEffect, useRef, Suspense } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Lenis from 'lenis'
import { motion, useScroll, useSpring, AnimatePresence } from 'framer-motion'
import Cursor from './components/Cursor.jsx'
import Nav from './components/Nav.jsx'
import Footer from './components/Footer.jsx'
import Skeleton from './components/Skeleton.jsx'
import { isReduced } from './lib/hooks'
import { connectLenis, ScrollTrigger, registerGsap } from './lib/gsap'

export default function App() {
  const { pathname } = useLocation()
  const lenisRef = useRef(null)
  const { scrollYProgress } = useScroll()
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.4 })

  useEffect(() => {
    registerGsap()
    if (isReduced()) return
    const lenis = new Lenis({ duration: 1.1, smoothWheel: true, lerp: 0.1 })
    lenisRef.current = lenis
    window.__lenis = lenis
    const disconnect = connectLenis(lenis)
    let raf
    const loop = (t) => { lenis.raf(t); raf = requestAnimationFrame(loop) }
    raf = requestAnimationFrame(loop)
    return () => { cancelAnimationFrame(raf); disconnect(); lenis.destroy(); window.__lenis = null }
  }, [])

  useEffect(() => {
    if (lenisRef.current) lenisRef.current.scrollTo(0, { immediate: true })
    else window.scrollTo(0, 0)
    const id = requestAnimationFrame(() => ScrollTrigger.refresh())
    return () => cancelAnimationFrame(id)
  }, [pathname])

  return (
    <>
      <Cursor />
      <motion.div className="scroll-progress" style={{ scaleX: progress }} />
      <Nav />
      <AnimatePresence mode="wait">
        <motion.main
          key={pathname}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <Suspense fallback={<Skeleton />}>
            <Outlet />
          </Suspense>
        </motion.main>
      </AnimatePresence>
      <Footer />
    </>
  )
}
