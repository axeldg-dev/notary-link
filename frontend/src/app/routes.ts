import { createBrowserRouter } from 'react-router';
import { AuthScreen } from './components/screens/AuthScreen';
import { HomeScreen } from './components/screens/HomeScreen';
import { ProjectChoiceScreen } from './components/screens/ProjectChoiceScreen';
import { DocumentsScreen } from './components/screens/DocumentsScreen';
import { PatrimoineScreen } from './components/screens/PatrimoineScreen';
import { SendScreen } from './components/screens/SendScreen';

export const router = createBrowserRouter([
  { path: '/', Component: AuthScreen },
  { path: '/home', Component: HomeScreen },
  { path: '/projet', Component: ProjectChoiceScreen },
  { path: '/documents', Component: DocumentsScreen },
  { path: '/patrimoine', Component: PatrimoineScreen },
  { path: '/envoi', Component: SendScreen },
]);
