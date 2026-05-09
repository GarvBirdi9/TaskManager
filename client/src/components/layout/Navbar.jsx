import { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { Layout, FolderKanban, LogOut, User as UserIcon } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="h-16 bg-white border-b border-zinc-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="h-8 w-8 bg-zinc-900 rounded-md flex items-center justify-center">
            <Layout className="h-4 w-4 text-white" />
          </div>
          <span className="text-xl font-bold text-zinc-900 tracking-tight">TaskManager</span>
        </Link>

        <div className="hidden md:flex items-center gap-1">
          <Link 
            to="/dashboard" 
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${isActive('/dashboard') ? 'bg-zinc-100 text-zinc-900' : 'text-zinc-500 hover:text-zinc-900'}`}
          >
            Dashboard
          </Link>
          <Link 
            to="/projects" 
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${isActive('/projects') ? 'bg-zinc-100 text-zinc-900' : 'text-zinc-500 hover:text-zinc-900'}`}
          >
            Projects
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-2 py-1 bg-zinc-50 rounded-md border border-zinc-200">
            <div className="h-6 w-6 bg-zinc-200 rounded-sm flex items-center justify-center">
              <UserIcon className="h-3 w-3 text-zinc-700" />
            </div>
            <div className="text-sm font-medium text-zinc-700 mr-2">{user?.name}</div>
            <div className="px-1.5 py-0.5 bg-white rounded text-[10px] font-bold uppercase tracking-wider text-zinc-500 border border-zinc-200">
              {user?.role}
            </div>
          </div>
          
          <button 
            onClick={logout}
            className="p-1.5 text-zinc-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-all"
            title="Logout"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
