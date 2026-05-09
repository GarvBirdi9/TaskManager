import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Input, Button, Card } from '../components/common/UI';
import { Layout, CheckCircle2, Check, X } from 'lucide-react';
import { toast } from 'react-hot-toast';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  // Password Validation State
  const [passwordChecks, setPasswordChecks] = useState({
    length: false,
    number: false,
    special: false
  });

  const handlePasswordChange = (e) => {
    const val = e.target.value;
    setFormData({...formData, password: val});
    
    setPasswordChecks({
      length: val.length >= 8,
      number: /\d/.test(val),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(val)
    });
  };

  const isPasswordValid = Object.values(passwordChecks).every(Boolean);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isPasswordValid) {
      return toast.error('Please meet all password requirements');
    }
    if (formData.password !== formData.confirmPassword) {
      return toast.error('Passwords do not match');
    }
    
    setLoading(true);
    try {
      await register(formData.name, formData.email, formData.password);
      toast.success('Account created successfully!');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
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
            Join the best <br />
            <span className="text-zinc-400">engineering teams.</span>
          </h1>
          <p className="text-zinc-400 max-w-md font-medium">
            Ship features faster with a tool that gets out of your way.
          </p>
        </div>

        <p className="text-zinc-500 font-medium text-sm">
          © {new Date().getFullYear()} TaskManager Inc.
        </p>
      </div>

      {/* Form Panel */}
      <div className="flex items-center justify-center p-8 bg-zinc-50">
        <div className="w-full max-w-[400px] space-y-8">
          <div>
            <h2 className="text-2xl font-bold text-zinc-900">Create an account</h2>
            <p className="text-zinc-500 mt-2 text-sm">Get started with a free workspace.</p>
          </div>

          <Card className="p-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              <Input 
                label="Full Name"
                placeholder="John Doe"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required
              />
              <Input 
                label="Email Address"
                type="email"
                placeholder="name@company.com"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                required
              />
              <Input 
                label="Password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handlePasswordChange}
                required
              />
              
              {/* Live Password Checks */}
              <div className="space-y-2 mt-2 p-3 bg-zinc-100 rounded-md border border-zinc-200">
                <p className="text-xs font-semibold text-zinc-900 mb-2">Password requirements:</p>
                <div className="flex flex-col gap-1.5">
                  <ValidationItem isValid={passwordChecks.length} text="At least 8 characters long" />
                  <ValidationItem isValid={passwordChecks.number} text="Contains at least one number" />
                  <ValidationItem isValid={passwordChecks.special} text="Contains a special character (!@#$%)" />
                </div>
              </div>

              <Input 
                label="Confirm Password"
                type="password"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                required
              />
              <Button type="submit" className="w-full mt-2" loading={loading}>
                Create account
              </Button>
            </form>
          </Card>

          <p className="text-center text-zinc-600 text-sm">
            Already have an account? <Link to="/login" className="text-zinc-900 hover:underline font-medium">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

const ValidationItem = ({ isValid, text }) => (
  <div className={`flex items-center gap-2 text-xs font-medium transition-colors ${isValid ? 'text-emerald-600' : 'text-zinc-500'}`}>
    {isValid ? <Check className="h-3.5 w-3.5" /> : <X className="h-3.5 w-3.5" />}
    <span>{text}</span>
  </div>
);

export default Signup;
