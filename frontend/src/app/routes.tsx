import { createBrowserRouter, Navigate, Outlet } from 'react-router';
import { AuthScreen } from './components/screens/AuthScreen';
import { HomeScreen } from './components/screens/HomeScreen';
import { ProjectChoiceScreen } from './components/screens/ProjectChoiceScreen';
import { DocumentsScreen } from './components/screens/DocumentsScreen';
import { PatrimoineScreen } from './components/screens/PatrimoineScreen';
import { SendScreen } from './components/screens/SendScreen';
import { OtpScreen } from './components/screens/OtpScreen';
import { AppNav } from './components/Navbar';
import React from "react";
import { useAppSelector } from './store/hooks';
import { selectIsAuthenticated } from './features/usersSlice';
import { selectOtpVerified } from './features/userSlice';

function RootLayout() {
  return (
    <>
      <Outlet />
      <AppNav />
    </>
  );
}

function ProtectedRoute() {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const otpVerified = useAppSelector(selectOtpVerified);
  if (!isAuthenticated) return <Navigate to="/" replace />;
  if (!otpVerified) return <Navigate to="/verify-otp" replace />;
  return <Outlet />;
}

function OtpGuard() {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const otpVerified = useAppSelector(selectOtpVerified);
  if (!isAuthenticated) return <Navigate to="/" replace />;
  if (otpVerified) return <Navigate to="/home" replace />;
  return <Outlet />;
}

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      { path: '/', Component: AuthScreen },
      { path: '/verify-otp', element: <OtpGuard />, children: [{ index: true, Component: OtpScreen }] },
      {
        element: <ProtectedRoute />,
        children: [
          { path: '/home', Component: HomeScreen },
          { path: '/projet', Component: ProjectChoiceScreen },
          { path: '/documents', Component: DocumentsScreen },
          { path: '/patrimoine', Component: PatrimoineScreen },
          { path: '/envoi', Component: SendScreen },
        ],
      },
    ],
  },
]);
