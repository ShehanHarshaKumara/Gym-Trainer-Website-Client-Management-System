import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './auth'
import { SiteDataProvider } from './site-data'
import {
  AdminDashboardPage,
  AdminFeedbackPage,
  AdminLayout,
  AdminLoginPage,
  AdminMessagesPage,
  AdminPackagesPage,
  AdminProfilePage,
  AdminTransformationsPage,
  AdminClientsPage,
} from './pages/AdminApp'
import {
  AboutPage,
  ContactPage,
  FeedbackPage,
  HomePage,
  PackagesPage,
  PublicLayout,
  TransformationsPage,
} from './pages/PublicSite'

export default function App() {
  return (
    <AuthProvider>
      <SiteDataProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<PublicLayout />}>
              <Route index element={<HomePage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/packages" element={<PackagesPage />} />
              <Route path="/transformations" element={<TransformationsPage />} />
              <Route path="/feedback" element={<FeedbackPage />} />
              <Route path="/contact" element={<ContactPage />} />
            </Route>

            <Route path="/admin/login" element={<AdminLoginPage />} />
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboardPage />} />
              <Route path="packages" element={<AdminPackagesPage />} />
              <Route path="clients" element={<AdminClientsPage />} />
              <Route path="transformations" element={<AdminTransformationsPage />} />
              <Route path="feedback" element={<AdminFeedbackPage />} />
              <Route path="messages" element={<AdminMessagesPage />} />
              <Route path="profile" element={<AdminProfilePage />} />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </SiteDataProvider>
    </AuthProvider>
  )
}
