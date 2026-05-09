import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Input, Button, Card } from '../components/common/UI';
import { Layout, CheckCircle2 } from 'lucide-react';
import { toast } from 'react-hot-toast';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      toast.success('Welcome back!');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Brand Panel */}
      <div className="hidden lg:flex bg-zinc-950 p-12 flex-col justify-between text-white border-r border-zinc-800">
        
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 bg-white rounded-md flex items-center justify-center">
            <Layout className="h-6 w-6 text-zinc-950" />
          </div>
          <span className="text-2xl font-bold tracking-tight">TaskManager</span>
        </div>

        <div>
          <h1 className="text-4xl font-bold leading-tight mb-6">
            Project management<br />
            <span className="text-zinc-400">built for speed.</span>
          </h1>
          <div className="space-y-4">
            {['Track issues', 'Manage sprints', 'Ship faster'].map((feature, i) => (
              <div key={i} className="flex items-center gap-3 text-zinc-300 font-medium">
                <CheckCircle2 className="h-5 w-5 text-zinc-500" />
                {feature}
              </div>
            ))}
          </div>
        </div>

        <p className="text-zinc-500 font-medium text-sm">
          © {new Date().getFullYear()} TaskManager Inc.
        </p>
      </div>

      {/* Form Panel */}
      <div className="flex items-center justify-center p-8 bg-zinc-50">
        <div className="w-full max-w-[400px] space-y-8">
          <div>
            <h2 className="text-2xl font-bold text-zinc-900">Sign in to TaskManager</h2>
            <p className="text-zinc-500 mt-2 text-sm">Welcome back. Please enter your details.</p>
          </div>

          <Card className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <Input 
                label="Email Address"
                type="email"
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Input 
                label="Password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <Button type="submit" className="w-full" loading={loading}>
                Sign in
              </Button>
            </form>
          </Card>

          <p className="text-center text-zinc-600 text-sm">
            Don't have an account? <Link to="/signup" className="text-zinc-900 hover:underline font-medium">Sign up</Link>
          </p>

        </div>
      </div>
    </div>
  );
};

export default Login;
