import React, { Suspense, lazy } from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import { LocaleProvider } from './lib/i18n'

const Home = lazy(() => import('./pages/Home.jsx'))
const Services = lazy(() => import('./pages/Services.jsx'))
const Work = lazy(() => import('./pages/Work.jsx'))
const CaseStudy = lazy(() => import('./pages/CaseStudy.jsx'))
const Process = lazy(() => import('./pages/Process.jsx'))
const Pricing = lazy(() => import('./pages/Pricing.jsx'))
const About = lazy(() => import('./pages/About.jsx'))
const Contact = lazy(() => import('./pages/Contact.jsx'))
const NotFound = lazy(() => import('./pages/NotFound.jsx'))

const fallback = <div style={{ minHeight: '60vh' }} />

const pageRoutes = [
  { index: true, element: <Home /> },
  { path: 'services', element: <Services /> },
  { path: 'work', element: <Work /> },
  { path: 'work/:slug', element: <CaseStudy /> },
  { path: 'process', element: <Process /> },
  { path: 'pricing', element: <Pricing /> },
  { path: 'about', element: <About /> },
  { path: 'contact', element: <Contact /> },
  { path: '*', element: <NotFound /> },
]

const tree = (locale) => ({
  path: locale === 'en' ? '/' : `/${locale}`,
  element: (
    <LocaleProvider locale={locale}>
      <Suspense fallback={fallback}><App /></Suspense>
    </LocaleProvider>
  ),
  children: pageRoutes,
})

const router = createBrowserRouter([tree('en'), tree('ro'), tree('ru')])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
)
