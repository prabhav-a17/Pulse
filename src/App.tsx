import { lazy, Suspense, useEffect, type ReactNode } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from 'react-router-dom'
import { QueryClientProvider, useQuery } from '@tanstack/react-query'
import { queryClient } from '@/lib/queryClient'
import { SEED_CHECKINS } from '@/lib/seedData'
import { MobileShell } from '@/components/layout/MobileShell'
import { BottomNav } from '@/components/layout/BottomNav'
import { GroupSheet } from '@/components/layout/GroupSheet'
import { RouteErrorBoundary } from '@/components/layout/RouteErrorBoundary'
import { Skeleton } from '@/components/ui/Skeleton'
import { useAuthStore } from '@/store/useAuthStore'

const Onboarding = lazy(() => import('@/pages/Onboarding'))
const Tonight = lazy(() => import('@/pages/Tonight'))
const Explore = lazy(() => import('@/pages/Explore'))
const Social = lazy(() => import('@/pages/Social'))
const Profile = lazy(() => import('@/pages/Profile'))
const Rate = lazy(() => import('@/pages/Rate'))

function PageTransition({ children }: { children: ReactNode }) {
  return (
    <motion.div
      className="h-full"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{ duration: 0.18, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      {children}
    </motion.div>
  )
}

function PageFallback() {
  return (
    <div className="space-y-4 p-4 pt-8">
      <Skeleton className="h-10 w-2/3" />
      <Skeleton className="h-40 w-full" />
      <Skeleton className="h-40 w-full" />
    </div>
  )
}

/** After midnight with unrated check-ins from last night → /rate. */
function useMorningAfterRedirect(enabled: boolean) {
  const navigate = useNavigate()
  const userId = useAuthStore((s) => s.user.id)
  const { data: hasUnrated } = useQuery({
    queryKey: ['unrated-check'],
    queryFn: () => {
      const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10)
      return SEED_CHECKINS.some((c) => c.userId === userId && c.nightDate === yesterday && !c.rated)
    },
  })

  useEffect(() => {
    if (!enabled || !hasUnrated) return
    const hour = new Date().getHours()
    if (hour >= 0 && hour < 12) navigate('/rate')
    // run once on app load only
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasUnrated])
}

function AnimatedRoutes() {
  const location = useLocation()
  const onboarded = useAuthStore((s) => s.onboarded)
  useMorningAfterRedirect(onboarded)

  const isOnboarding = location.pathname === '/onboarding'

  return (
    <>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route
            path="/"
            element={<Navigate to={onboarded ? '/tonight' : '/onboarding'} replace />}
          />
          <Route
            path="/onboarding"
            element={
              <RouteErrorBoundary>
                <Suspense fallback={<PageFallback />}>
                  <PageTransition>
                    <Onboarding />
                  </PageTransition>
                </Suspense>
              </RouteErrorBoundary>
            }
          />
          {(
            [
              ['/tonight', Tonight],
              ['/explore', Explore],
              ['/social', Social],
              ['/profile', Profile],
              ['/rate', Rate],
            ] as const
          ).map(([path, Page]) => (
            <Route
              key={path}
              path={path}
              element={
                <RouteErrorBoundary>
                  <Suspense fallback={<PageFallback />}>
                    <PageTransition>
                      <Page />
                    </PageTransition>
                  </Suspense>
                </RouteErrorBoundary>
              }
            />
          ))}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AnimatePresence>
      {!isOnboarding && <BottomNav />}
      <GroupSheet />
    </>
  )
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <MobileShell>
          <AnimatedRoutes />
        </MobileShell>
      </BrowserRouter>
    </QueryClientProvider>
  )
}
