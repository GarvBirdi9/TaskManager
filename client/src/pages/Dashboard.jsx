import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import { Card, Badge, Button } from '../components/common/UI';
import { CheckCircle2, Clock, ListTodo, AlertCircle, ChevronDown } from 'lucide-react';
import { toast } from 'react-hot-toast';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTasks = async () => {
    try {
      const { data } = await api.get('/tasks');
      setTasks(data);
    } catch (error) {
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await api.put(`/tasks/${taskId}`, { status: newStatus });
      toast.success(`Task moved to ${newStatus}`);
      fetchTasks();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const getStats = () => {
    const stats = {
      total: tasks.length,
      todo: tasks.filter(t => t.status === 'todo').length,
      inProgress: tasks.filter(t => t.status === 'in-progress').length,
      done: tasks.filter(t => t.status === 'done').length,
      overdue: tasks.filter(t => t.status !== 'done' && new Date(t.dueDate) < new Date()).length
    };
    return stats;
  };

  const stats = getStats();

  if (loading) {
    return (
      <div className="p-8 max-w-7xl mx-auto space-y-8">
        <div className="h-32 bg-slate-200 rounded-3xl animate-pulse" />
        <div className="grid md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => <div key={i} className="h-32 bg-slate-100 rounded-2xl animate-pulse" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-[1200px] mx-auto space-y-8 pb-20">
      {/* Welcome Header */}
      <div className="border-b border-zinc-200 pb-6 mb-8">
        <h1 className="text-3xl font-bold text-zinc-900 tracking-tight">Overview</h1>
        <p className="text-zinc-500 font-medium mt-1">
          {user?.role === 'admin' 
            ? "Track team activities and project progress."
            : `You have ${stats.todo} tasks to start and ${stats.overdue} overdue items.`}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <StatCard icon={<ListTodo />} label="Total Tasks" value={stats.total} color="indigo" />
        <StatCard icon={<Clock />} label="To Do" value={stats.todo} color="slate" />
        <StatCard icon={<AlertCircle />} label="Overdue" value={stats.overdue} color="red" />
        <StatCard icon={<CheckCircle2 />} label="Completed" value={stats.done} color="green" />
      </div>

      {/* My Tasks Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-zinc-900">Priority Tasks</h2>
        </div>

        <Card>
          {tasks.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-zinc-50/50 border-b border-zinc-200">
                  <tr>
                    <th className="px-6 py-3 text-xs font-semibold text-zinc-500">Task Details</th>
                    <th className="px-6 py-3 text-xs font-semibold text-zinc-500">Project</th>
                    <th className="px-6 py-3 text-xs font-semibold text-zinc-500">Due Date</th>
                    <th className="px-6 py-3 text-xs font-semibold text-zinc-500">Priority</th>
                    <th className="px-6 py-3 text-xs font-semibold text-zinc-500">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  {tasks.map(task => (
                    <tr key={task._id} className="hover:bg-zinc-50 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="font-medium text-zinc-900">{task.title}</div>
                        <div className="text-xs text-zinc-500 mt-0.5 line-clamp-1">{task.description}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-zinc-600">{task.project?.name}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className={`text-sm ${new Date(task.dueDate) < new Date() && task.status !== 'done' ? 'text-red-600 font-medium' : 'text-zinc-500'}`}>
                          {new Date(task.dueDate).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant={task.priority === 'high' ? 'red' : task.priority === 'medium' ? 'amber' : 'gray'}>
                          {task.priority}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        <div className="relative inline-block group/select">
                          <select 
                            value={task.status}
                            onChange={(e) => handleStatusChange(task._id, e.target.value)}
                            className={`appearance-none pl-3 pr-8 py-1.5 rounded-md text-xs font-medium border cursor-pointer focus:outline-none transition-all
                              ${task.status === 'done' ? 'bg-emerald-50/50 border-emerald-200 text-emerald-700' : 
                                task.status === 'in-progress' ? 'bg-amber-50/50 border-amber-200 text-amber-700' : 
                                'bg-white border-zinc-200 text-zinc-700 hover:bg-zinc-50'}`}
                          >
                            <option value="todo">To Do</option>
                            <option value="in-progress">In Progress</option>
                            <option value="done">Done</option>
                          </select>
                          <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 pointer-events-none opacity-50" />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-16 text-center">
              <div className="h-20 w-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <ListTodo className="h-10 w-10 text-slate-300" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">No tasks found</h3>
              <p className="text-slate-500 mt-1">You're all caught up for now!</p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

const StatCard = ({ icon, label, value, color }) => {
  const colors = {
    indigo: 'text-zinc-900',
    red: 'text-red-600',
    green: 'text-emerald-600',
    slate: 'text-zinc-600',
  };

  return (
    <Card className="p-5 flex flex-col justify-between h-32">
      <div className="flex items-center justify-between">
        <div className="text-sm font-medium text-zinc-500">{label}</div>
        <div className={`h-8 w-8 rounded-md flex items-center justify-center bg-zinc-50 border border-zinc-100 ${colors[color]}`}>
          {React.cloneElement(icon, { className: 'h-4 w-4' })}
        </div>
      </div>
      <div className="text-3xl font-bold text-zinc-900 leading-none">{value}</div>
    </Card>
  );
};

export default Dashboard;
