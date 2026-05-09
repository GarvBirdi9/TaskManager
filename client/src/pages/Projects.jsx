import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import { Card, Badge, Button, Input } from '../components/common/UI';
import { FolderKanban, Plus, Users, LayoutList, X } from 'lucide-react';
import { toast } from 'react-hot-toast';

const Projects = () => {
  const { user } = useContext(AuthContext);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newProject, setNewProject] = useState({ name: '', description: '' });

  const fetchProjects = async () => {
    try {
      const { data } = await api.get('/projects');
      setProjects(data);
    } catch (error) {
      toast.error('Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await api.post('/projects', newProject);
      toast.success('Project created!');
      setShowModal(false);
      setNewProject({ name: '', description: '' });
      fetchProjects();
    } catch (error) {
      toast.error('Failed to create project');
    }
  };

  if (loading) return <div className="p-8 text-center font-bold text-slate-400">Loading projects...</div>;

  return (
    <div className="p-8 max-w-[1200px] mx-auto space-y-8 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-200 pb-6 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900 tracking-tight">Projects</h1>
          <p className="text-zinc-500 font-medium mt-1">Manage your team's collaborative workspaces.</p>
        </div>
        
        {user?.role === 'admin' && (
          <Button onClick={() => setShowModal(true)}>
            <Plus className="h-4 w-4" /> New Project
          </Button>
        )}
      </div>

      {projects.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map(project => (
            <Link key={project._id} to={`/projects/${project._id}`} className="group block">
              <Card className="p-6 h-full transition-all hover:border-zinc-300 hover:shadow-md">
                <div className="flex justify-between items-start mb-6">
                  <div className="h-10 w-10 bg-zinc-100 rounded-md flex items-center justify-center group-hover:bg-zinc-900 transition-colors">
                    <FolderKanban className="h-5 w-5 text-zinc-600 group-hover:text-white transition-colors" />
                  </div>
                  <Badge variant={project.status === 'active' ? 'green' : 'gray'}>
                    {project.status}
                  </Badge>
                </div>
                
                <h3 className="text-lg font-bold text-zinc-900 mb-1">{project.name}</h3>
                <p className="text-zinc-500 text-sm line-clamp-2 mb-6">{project.description || 'No description provided.'}</p>
                
                <div className="flex items-center gap-4 pt-4 border-t border-zinc-100">
                  <div className="flex items-center gap-1.5 text-zinc-500 font-medium text-xs">
                    <Users className="h-4 w-4" /> {project.members?.length}
                  </div>
                  <div className="flex items-center gap-1.5 text-zinc-500 font-medium text-xs">
                    <LayoutList className="h-4 w-4" /> Tasks
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <Card className="p-16 text-center bg-zinc-50 border-dashed">
          <div className="h-16 w-16 bg-white border border-zinc-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <FolderKanban className="h-8 w-8 text-zinc-400" />
          </div>
          <h2 className="text-xl font-bold text-zinc-900">No projects yet</h2>
          <p className="text-zinc-500 mt-2 max-w-sm mx-auto text-sm">
            {user?.role === 'admin' 
              ? "Start by creating your first project workspace and adding your team."
              : "You haven't been added to any projects yet. Contact your admin."}
          </p>
          {user?.role === 'admin' && (
            <Button onClick={() => setShowModal(true)} className="mt-6 mx-auto">
              Create Project
            </Button>
          )}
        </Card>
      )}

      {/* Create Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-zinc-950/20 backdrop-blur-sm animate-fade" onClick={() => setShowModal(false)} />
          <Card className="relative z-10 w-full max-w-lg p-6 animate-fade">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-zinc-900">Create Project</h2>
              <button onClick={() => setShowModal(false)} className="p-1.5 hover:bg-zinc-100 rounded-md transition-colors">
                <X className="h-5 w-5 text-zinc-400" />
              </button>
            </div>
            
            <form onSubmit={handleCreate} className="space-y-5">
              <Input 
                label="Project Name"
                placeholder="e.g. Q4 Marketing"
                value={newProject.name}
                onChange={(e) => setNewProject({...newProject, name: e.target.value})}
                required
              />
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-zinc-700">Description</label>
                <textarea 
                  className="w-full px-3 py-2 rounded-md border border-zinc-300 text-sm text-zinc-900 bg-white focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-900 transition-colors min-h-[100px]"
                  placeholder="What is this project about?"
                  value={newProject.description}
                  onChange={(e) => setNewProject({...newProject, description: e.target.value})}
                />
              </div>
              <Button type="submit" className="w-full">
                Create Project
              </Button>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Projects;
