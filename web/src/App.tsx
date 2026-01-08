import { BrowserRouter } from 'react-router-dom';

import { AppRoutes } from './routes';
import { ThemeProvider } from './context/ThemeContext';

export default function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </ThemeProvider>
  );
}
