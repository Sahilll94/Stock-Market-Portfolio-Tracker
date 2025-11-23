import { Toaster } from 'react-hot-toast';
import { AppRoutes } from './routes/AppRoutes';
import './styles/tailwind.css';
import './styles/globals.css';

function App() {
  return (
    <>
      <AppRoutes />
      <Toaster position="top-right" />
    </>
  );
}

export default App;
