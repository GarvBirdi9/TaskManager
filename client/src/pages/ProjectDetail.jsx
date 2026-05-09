import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import { Card, Badge, Button, Input } from '../components/common/UI';
import { Plus, Users, LayoutList, X, Trash2, ArrowLeft, Mail, Calendar } from 'lucide-react';
import { toast } from 'react-hot-toast';

const ProjectDetail = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modals
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showMemberModal, setShowMemberModal] = useState(false);
  
  const [newTask, setNewTask] = useState({
    title: '', description: '', priority: 'medium', dueDate: '', assignee: ''
  });
  const [memberEmail, setMemberEmail] = useState('');

  const fetchData = async () => {
    try {
      const [projRes, taskRes, userRes] = await Promise.all([
        api.get(`/projects`),
        api.get(`/tasks/project/${id}`),
        api.get('/auth/users')
      ]);
      
      const currentProj = projRes.data.find(p => p._id === id);
      if (!currentProj) {
        toast.error('Project not found');
        return navigate('/projects');
      }
      
      setProject(currentProj);
      setTasks(taskRes.data);
      setAllUsers(userRes.data);
    } catch (error) {
      toast.error('Failed to load project details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      await api.post('/tasks', { ...newTask, project: id });
      toast.success('Task created!');
      setShowTaskModal(false);
      setNewTask({ title: '', description: '', priority: 'medium', dueDate: '', assignee: '' });
      fetchData();
    } catch (error) {
      toast.error('Failed to create task');
    }
  };

  const handleAddMember = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/projects/${id}/members`, { email: memberEmail });
      toast.success('Member added!');
      setShowMemberModal(false);
      setMemberEmail('');
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add member');
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('Delete this task?')) return;
    try {
      await api.delete(`/tasks/${taskId}`);
      toast.success('Task deleted');
      fetchData();
    } catch (error) {
      toast.error('Failed to delete task');
    }
  };

  const handleProjectStatusChange = async (newStatus) => {
    try {
      await api.put(`/projects/${id}`, { status: newStatus });
      toast.success('Project status updated');
      fetchData();
    } catch (error) {
      toast.error('Failed to update project status');
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await api.put(`/tasks/${taskId}`, { status: newStatus });
      toast.success('Status updated');
      fetchData();
    } catch (error) {
      toast.error('Update failed');
    }
  };

  if (loading) return <div className="p-8 text-center font-bold text-slate-400">Loading workspace...</div>;

  return (
    <div className="p-8 max-w-[1200px] mx-auto space-y-8 pb-20">
      {/* Header */}
      <div className="space-y-6 border-b border-zinc-200 pb-6">
        <button onClick={() => navigate('/projects')} className="flex items-center gap-1.5 text-zinc-500 hover:text-zinc-900 font-medium text-sm transition-colors group">
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" /> Back to Projects
        </button>
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold text-zinc-900 tracking-tight">{project.name}</h1>
              {user?.role === 'admin' ? (
                <select 
                  value={project.status}
                  onChange={(e) => handleProjectStatusChange(e.target.value)}
                  className={`appearance-none px-2.5 py-1 rounded-md text-[11px] font-semibold uppercase tracking-wide border cursor-pointer focus:outline-none transition-all
                    ${project.status === 'active' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 
                      'bg-zinc-100 text-zinc-700 border-zinc-200'}`}
                >
                  <option value="active">Active</option>
                  <option value="completed">Completed</option>
                  <option value="archived">Archived</option>
                </select>
              ) : (
                <Badge variant={project.status === 'active' ? 'green' : 'gray'}>{project.status}</Badge>
              )}
            </div>
            <p className="text-zinc-500 text-sm max-w-2xl">{project.description}</p>
          </div>
          
          {user?.role === 'admin' && (
            <div className="flex gap-3">
              <Button variant="secondary" onClick={() => setShowMemberModal(true)}>
                <Users className="h-4 w-4" /> Members
              </Button>
              <Button onClick={() => setShowTaskModal(true)}>
                <Plus className="h-4 w-4" /> Add Task
              </Button>
            </div>
          )}
        </div>
      </div>

      <div className="grid lg:grid-cols-4 gap-8">
        {/* Task List */}
        <div className="lg:col-span-3 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-zinc-900">Tasks</h2>
          </div>
          
          <Card>
            {tasks.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-zinc-50/50 border-b border-zinc-200">
                    <tr>
                      <th className="px-6 py-3 text-xs font-semibold text-zinc-500">Task</th>
                      <th className="px-6 py-3 text-xs font-semibold text-zinc-500">Assignee</th>
                      <th className="px-6 py-3 text-xs font-semibold text-zinc-500">Due</th>
                      <th className="px-6 py-3 text-xs font-semibold text-zinc-500">Status</th>
                      {user?.role === 'admin' && <th className="px-6 py-3 text-right"></th>}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100">
                    {tasks.map(task => (
                      <tr key={task._id} className="hover:bg-zinc-50 transition-colors group">
                        <td className="px-6 py-4">
                          <div className="font-medium text-zinc-900">{task.title}</div>
                          <Badge variant={task.priority === 'high' ? 'red' : task.priority === 'medium' ? 'amber' : 'gray'} className="mt-1">
                            {task.priority}
                          </Badge>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <div className="h-6 w-6 bg-zinc-200 rounded-sm flex items-center justify-center text-[10px] font-bold text-zinc-700">
                              {task.assignee?.name?.substring(0, 2).toUpperCase()}
                            </div>
                            <span className="text-sm text-zinc-600">{task.assignee?.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`text-sm ${new Date(task.dueDate) < new Date() && task.status !== 'done' ? 'text-red-600 font-medium' : 'text-zinc-500'}`}>
                            {new Date(task.dueDate).toLocaleDateString()}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <select 
                            value={task.status}
                            disabled={user?.role !== 'admin' && task.assignee?._id !== user?._id}
                            onChange={(e) => handleStatusChange(task._id, e.target.value)}
                            className="bg-transparent border-b border-zinc-300 text-xs font-medium py-1 focus:outline-none focus:border-zinc-900 cursor-pointer disabled:cursor-not-allowed"
                          >
                            <option value="todo">To Do</option>
                            <option value="in-progress">In Progress</option>
                            <option value="done">Done</option>
                          </select>
                        </td>
                        {user?.role === 'admin' && (
                          <td className="px-6 py-4 text-right">
                            <button onClick={() => handleDeleteTask(task._id)} className="p-1.5 text-zinc-400 hover:text-red-600 transition-colors opacity-0 group-hover:opacity-100">
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-16 text-center text-zinc-500 text-sm">No tasks created yet.</div>
            )}
          </Card>
        </div>

        {/* Sidebar: Members */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-zinc-900">Members</h2>
          <Card className="p-4 space-y-3">
            {project.members?.map(m => (
              <div key={m._id} className="flex items-center gap-3">
                <div className="h-8 w-8 bg-zinc-100 rounded-md flex items-center justify-center font-bold text-xs text-zinc-500">
                  {m.name?.substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <div className="text-sm font-medium text-zinc-900 leading-none">{m.name}</div>
                  <div className="text-[10px] text-zinc-500 font-semibold uppercase mt-1">
                    {m._id === project.owner?._id ? 'Owner' : 'Member'}
                  </div>
                </div>
              </div>
            ))}
          </Card>
        </div>
      </div>

      {/* Task Modal */}
      {showTaskModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-zinc-950/20 backdrop-blur-sm animate-fade" onClick={() => setShowTaskModal(false)} />
          <Card className="relative z-10 w-full max-w-lg p-6 animate-fade">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-zinc-900">Add Task</h2>
              <button onClick={() => setShowTaskModal(false)} className="p-1.5 hover:bg-zinc-100 rounded-md transition-colors">
                <X className="h-5 w-5 text-zinc-400" />
              </button>
            </div>
            <form onSubmit={handleCreateTask} className="space-y-5">
              <Input label="Task Title" value={newTask.title} onChange={e => setNewTask({...newTask, title: e.target.value})} required />
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-zinc-700">Priority</label>
                  <select className="w-full px-3 py-2 rounded-md border border-zinc-300 text-sm text-zinc-900 bg-white focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-900"
                    value={newTask.priority} onChange={e => setNewTask({...newTask, priority: e.target.value})}>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
                <Input label="Due Date" type="date" value={newTask.dueDate} onChange={e => setNewTask({...newTask, dueDate: e.target.value})} required />
              </div>
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-zinc-700">Assign To</label>
                <select className="w-full px-3 py-2 rounded-md border border-zinc-300 text-sm text-zinc-900 bg-white focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-900"
                  value={newTask.assignee} onChange={e => setNewTask({...newTask, assignee: e.target.value})} required>
                  <option value="">Select a user</option>
                  {project.members?.map(m => <option key={m._id} value={m._id}>{m.name}</option>)}
                </select>
              </div>
              <Button type="submit" className="w-full mt-2">Create Task</Button>
            </form>
          </Card>
        </div>
      )}

      {/* Member Modal */}
      {showMemberModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-zinc-950/20 backdrop-blur-sm animate-fade" onClick={() => setShowMemberModal(false)} />
          <Card className="relative z-10 w-full max-w-sm p-6 animate-fade">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-zinc-900">Add Member</h2>
              <button onClick={() => setShowMemberModal(false)} className="p-1.5 hover:bg-zinc-100 rounded-md transition-colors">
                <X className="h-5 w-5 text-zinc-400" />
              </button>
            </div>
            <p className="text-zinc-500 mb-6 text-sm">Add a user to this project by their email address.</p>
            <form onSubmit={handleAddMember} className="space-y-4">
              <Input placeholder="user@example.com" value={memberEmail} onChange={e => setMemberEmail(e.target.value)} required />
              <Button type="submit" className="w-full py-3">Add to Project</Button>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
};

export default ProjectDetail;
