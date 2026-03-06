import { createBrowserRouter, Navigate, Outlet } from 'react-router';
import { AuthScreen } from './components/screens/AuthScreen';
import { HomeScreen } from './components/screens/HomeScreen';
import { ProjectChoiceScreen } from './components/screens/ProjectChoiceScreen';
import { DocumentsScreen } from './components/screens/DocumentsScreen';
import { PatrimoineScreen } from './components/screens/PatrimoineScreen';
import { SendScreen } from './components/screens/SendScreen';
import { AppNav } from './components/Navbar';
import React from "react";
import { useAppSelector } from './store/hooks';

function RootLayout() {
  return (
    <>
      <Outlet />
      <AppNav />
    </>
  );
}

function ProtectedRoute() {
  const accessToken = useAppSelector((state) => state.auth.accessToken);
  return accessToken ? <Outlet /> : <Navigate to="/" replace />;
}

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      { path: '/', Component: AuthScreen },
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