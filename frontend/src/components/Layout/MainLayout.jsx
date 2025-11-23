import Navbar from './Navbar';
import { useTheme } from '../../contexts/ThemeContext';

export default function MainLayout({ children }) {
  const { isDark } = useTheme();

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDark ? 'bg-gray-950' : 'bg-gray-50'}`}>
      <Navbar />
      <main className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>
        {children}
      </main>
    </div>
  );
}
