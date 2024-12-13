import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Calendar } from 'lucide-react';
import { Button } from './components/ui/Button';
import { ReservationFlow } from './components/reservation/ReservationFlow';
import { AdminLayout } from './components/admin/AdminLayout';
import { LoginPage } from './pages/admin/LoginPage';
import { DashboardPage } from './pages/admin/DashboardPage';
import { ReservationsPage } from './pages/admin/ReservationsPage';
import { PrivateRoute } from './components/admin/PrivateRoute';

function App() {
  const [showReservation, setShowReservation] = React.useState(false);

  return (
    <BrowserRouter>
      <Routes>
        {/* Admin Routes */}
        <Route path="/admin/login" element={<LoginPage />} />
        <Route
          path="/admin"
          element={
            <PrivateRoute>
              <AdminLayout />
            </PrivateRoute>
          }
        >
          <Route index element={<DashboardPage />} />
          <Route path="reservations" element={<ReservationsPage />} />
        </Route>

        {/* Public Routes */}
        <Route
          path="/"
          element={
            <div className="min-h-screen bg-background">
              <header className="bg-secondary text-white py-4">
                <div className="container mx-auto px-4">
                  <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Ramen Fusion</h1>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => setShowReservation(true)}
                    >
                      <Calendar className="w-4 h-4 mr-2" />
                      Reservar Ahora
                    </Button>
                  </div>
                </div>
              </header>

              <main className="container mx-auto px-4 py-8">
                {showReservation ? (
                  <ReservationFlow />
                ) : (
                  <section className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6">
                    <h2 className="text-3xl font-bold text-center mb-8">
                      Bienvenido a Ramen Fusion
                    </h2>
                    <p className="text-center text-gray-600 mb-8">
                      Reserve su mesa y disfrute de la mejor experiencia culinaria
                      de ramen fusión
                    </p>

                    <div className="grid gap-8 md:grid-cols-2">
                      <div className="space-y-4">
                        <h3 className="text-xl font-semibold">Horario</h3>
                        <p>Miércoles a Domingo</p>
                        <p>12:00 PM - 10:00 PM</p>
                        <p className="text-gray-500">Lunes y Martes: Cerrado</p>
                      </div>

                      <div className="space-y-4">
                        <h3 className="text-xl font-semibold">Ubicación</h3>
                        <p>Av. Principal #123</p>
                        <p>Ciudad, País</p>
                      </div>
                    </div>
                  </section>
                )}
              </main>
            </div>
          }
        />

        {/* Catch all route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;