// app/admin/layout.tsx
import Navbar from '../components/admin/Navbar';

export const metadata = {
  title: 'Admin Dashboard',
  description: 'Admin area for managing content',
};

export default function AdminLayout({ children }) {
  return (
    <div className="h-screen bg-gray-100 text-gray-900">
      <Navbar/>
      {children}
    </div>
  );
}
