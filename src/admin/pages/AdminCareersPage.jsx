import { useState, useEffect } from 'react';
import { Search, ChevronDown, ExternalLink, Trash2, RefreshCw, Plus, Edit2, X } from 'lucide-react';
import api from '../../lib/api';
import PageHeader from '../components/ui/PageHeader';
import ConfirmDialog from '../components/ui/ConfirmDialog';

const STATUSES = [
  { value: 'pending', label: 'Pending' },
  { value: 'reviewed', label: 'Reviewed' },
  { value: 'shortlisted', label: 'Shortlisted' },
  { value: 'hired', label: 'Hired' },
  { value: 'rejected', label: 'Rejected' },
];

const STATUS_COLORS = {
  pending: { bg: 'rgba(234,179,8,0.15)', color: '#eab308' },
  reviewed: { bg: 'rgba(59,130,246,0.15)', color: '#3b82f6' },
  shortlisted: { bg: 'rgba(168,85,247,0.15)', color: '#a855f7' },
  hired: { bg: 'rgba(34,197,94,0.15)', color: '#22c55e' },
  rejected: { bg: 'rgba(239,68,68,0.15)', color: '#ef4444' },
};

export default function AdminCareersPage() {
  const [activeTab, setActiveTab] = useState('jobs'); // 'jobs' or 'applications'
  
  // Jobs State
  const [jobs, setJobs] = useState([]);
  const [jobsLoading, setJobsLoading] = useState(true);
  const [isJobModalOpen, setIsJobModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [jobForm, setJobForm] = useState({ title: '', dept: '', type: 'Full-Time', level: 'Mid-Level', location: '' });

  // Apps State
  const [applications, setApplications] = useState([]);
  const [appsLoading, setAppsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [expanded, setExpanded] = useState(null);

  const [confirmDelete, setConfirmDelete] = useState({ isOpen: false, id: null, type: '', name: '' });

  // Fetching
  const fetchJobs = async () => {
    setJobsLoading(true);
    try {
      const res = await api.get('/careers/jobs');
      setJobs(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setJobsLoading(false);
    }
  };

  const fetchApplications = async () => {
    setAppsLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (statusFilter) params.append('status', statusFilter);
      const res = await api.get(`/careers/applications?${params.toString()}`);
      setApplications(res.data);
    } catch (error) {
      console.error('Failed to load applications:', error);
    } finally {
      setAppsLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'jobs') fetchJobs();
    else fetchApplications();
  }, [activeTab, search, statusFilter]);

  // Jobs Actions
  const handleJobSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingJob) {
        await api.put(`/careers/jobs/${editingJob.id}`, jobForm);
      } else {
        await api.post('/careers/jobs', jobForm);
      }
      setIsJobModalOpen(false);
      setEditingJob(null);
      fetchJobs();
    } catch (err) {
      console.error(err);
      alert('Failed to save job');
    }
  };

  const executeDelete = async () => {
    try {
      if (confirmDelete.type === 'job') {
        await api.delete(`/careers/jobs/${confirmDelete.id}`);
        fetchJobs();
      } else {
        await api.delete(`/careers/applications/${confirmDelete.id}`);
        fetchApplications();
      }
    } catch (error) {
      console.error('Delete failed:', error);
      alert('Failed to delete.');
    } finally {
      setConfirmDelete({ isOpen: false, id: null, type: '', name: '' });
    }
  };

  // Apps Actions
  const handleStatusChange = async (id, newStatus) => {
    try {
      await api.put(`/careers/applications/${id}/status`, { status: newStatus });
      setApplications(apps => apps.map(app => app.id === id ? { ...app, status: newStatus } : app));
    } catch (error) {
      console.error('Status update failed:', error);
      alert('Failed to update status.');
    }
  };

  const inputStyle = {
    background: 'var(--adm-surface)', border: '1px solid var(--adm-border)', borderRadius: '8px',
    padding: '9px 14px', color: 'var(--adm-text)', fontSize: '13.5px', outline: 'none',
    fontFamily: 'Inter, sans-serif',
  };

  return (
    <div>
      <PageHeader title="Careers Management" subtitle="Manage job postings and applications" />

      {/* TABS */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', borderBottom: '1px solid var(--adm-border)' }}>
        <button 
          onClick={() => setActiveTab('jobs')}
          style={{ padding: '12px 24px', background: 'transparent', border: 'none', borderBottom: `2px solid ${activeTab === 'jobs' ? 'var(--adm-accent)' : 'transparent'}`, color: activeTab === 'jobs' ? 'var(--adm-accent)' : 'var(--adm-muted)', cursor: 'pointer', fontSize: '14px', fontWeight: 600 }}
        >
          Job Postings
        </button>
        <button 
          onClick={() => setActiveTab('applications')}
          style={{ padding: '12px 24px', background: 'transparent', border: 'none', borderBottom: `2px solid ${activeTab === 'applications' ? 'var(--adm-accent)' : 'transparent'}`, color: activeTab === 'applications' ? 'var(--adm-accent)' : 'var(--adm-muted)', cursor: 'pointer', fontSize: '14px', fontWeight: 600 }}
        >
          Applications
        </button>
      </div>

      {activeTab === 'jobs' ? (
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
            <h2 style={{ fontSize: '18px', color: '#fff', margin: 0 }}>Active Jobs</h2>
            <button 
              onClick={() => { setEditingJob(null); setJobForm({ title: '', dept: '', type: 'Full-Time', level: 'Mid-Level', location: '' }); setIsJobModalOpen(true); }}
              style={{ ...inputStyle, background: 'var(--adm-accent)', color: '#000', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', border: 'none' }}
            >
              <Plus size={16} /> Create Job
            </button>
          </div>

          {jobsLoading ? (
             <div style={{ textAlign: 'center', padding: '60px', color: 'var(--adm-muted)' }}>Loading jobs...</div>
          ) : jobs.length === 0 ? (
             <div style={{ textAlign: 'center', padding: '60px', color: 'var(--adm-muted)', background: 'var(--adm-surface)', borderRadius: '12px', border: '1px solid var(--adm-border)' }}>
                No job postings found.
             </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {jobs.map(job => (
                <div key={job.id} style={{ background: 'var(--adm-surface)', border: '1px solid var(--adm-border)', borderRadius: '12px', padding: '16px 20px', display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr auto', gap: '16px', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '15px', color: '#fff' }}>{job.title}</div>
                    <div style={{ fontSize: '12px', color: 'var(--adm-muted)', marginTop: '4px' }}>{job.dept}</div>
                  </div>
                  <div style={{ fontSize: '13px', color: 'var(--adm-text)' }}>{job.location}</div>
                  <div style={{ fontSize: '13px', color: 'var(--adm-text)' }}>{job.type}</div>
                  <div style={{ fontSize: '13px', color: 'var(--adm-text)' }}>{job.level}</div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button onClick={() => { setEditingJob(job); setJobForm(job); setIsJobModalOpen(true); }} style={{ background: 'rgba(255,255,255,0.06)', border: 'none', borderRadius: '6px', padding: '8px', cursor: 'pointer', color: '#fff' }}>
                      <Edit2 size={14} />
                    </button>
                    <button onClick={() => setConfirmDelete({ isOpen: true, id: job.id, type: 'job', name: job.title })} style={{ background: 'rgba(239,68,68,0.1)', border: 'none', borderRadius: '6px', padding: '8px', cursor: 'pointer', color: '#ef4444' }}>
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      ) : (
        <>
          <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap', alignItems: 'center' }}>
            <div style={{ position: 'relative', flex: 1, minWidth: '220px' }}>
              <Search size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--adm-muted)' }} />
              <input placeholder="Search by name or email..." value={search} onChange={e => setSearch(e.target.value)} style={{ ...inputStyle, width: '100%', paddingLeft: '36px' }} />
            </div>
            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} style={{ ...inputStyle, minWidth: '160px' }}>
              <option value="">All Statuses</option>
              {STATUSES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
            <button onClick={fetchApplications} style={{ ...inputStyle, display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', background: 'var(--adm-surface)', color: 'var(--adm-muted)' }}>
              <RefreshCw size={14} /> Refresh
            </button>
          </div>

          {appsLoading ? (
            <div style={{ textAlign: 'center', padding: '60px', color: 'var(--adm-muted)' }}>Loading applications...</div>
          ) : applications.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px', color: 'var(--adm-muted)', background: 'var(--adm-surface)', borderRadius: '12px', border: '1px solid var(--adm-border)' }}>
              No applications found.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {applications.map((app) => {
                const st = STATUS_COLORS[app.status] || STATUS_COLORS.pending;
                const isExpanded = expanded === app.id;
                return (
                  <div key={app.id} style={{ background: 'var(--adm-surface)', border: '1px solid var(--adm-border)', borderRadius: '12px', overflow: 'hidden' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto auto auto', gap: '12px', alignItems: 'center', padding: '16px 20px' }}>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '14px', color: 'var(--adm-text)' }}>{app.full_name}</div>
                        <div style={{ fontSize: '12px', color: 'var(--adm-muted)', marginTop: '2px' }}>{app.email}</div>
                      </div>
                      <div style={{ fontSize: '13px', color: 'var(--adm-text)' }}>{app.position}</div>
                      <div style={{ fontSize: '12px', color: 'var(--adm-muted)' }}>
                        {app.experience || '—'}<br />
                        <span style={{ fontSize: '11px' }}>{new Date(app.created_at).toLocaleDateString()}</span>
                      </div>
                      <select value={app.status} onChange={e => handleStatusChange(app.id, e.target.value)} style={{ background: st.bg, color: st.color, border: `1px solid ${st.color}40`, borderRadius: '6px', padding: '5px 10px', fontSize: '12px', fontWeight: 600, cursor: 'pointer', outline: 'none' }}>
                        {STATUSES.map(s => <option key={s.value} value={s.value} style={{ background: '#1a1a1c', color: '#fff' }}>{s.label}</option>)}
                      </select>
                      <button onClick={() => setExpanded(isExpanded ? null : app.id)} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid var(--adm-border)', borderRadius: '6px', padding: '6px 10px', cursor: 'pointer', color: 'var(--adm-muted)', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px' }}>
                        <ChevronDown size={14} style={{ transform: isExpanded ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
                        Details
                      </button>
                      <button onClick={() => setConfirmDelete({ isOpen: true, id: app.id, type: 'app', name: app.full_name })} style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.15)', borderRadius: '6px', padding: '7px', cursor: 'pointer', color: '#ef4444' }}>
                        <Trash2 size={14} />
                      </button>
                    </div>

                    {isExpanded && (
                      <div style={{ borderTop: '1px solid var(--adm-border)', padding: '20px', background: 'rgba(0,0,0,0.2)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                        <div>
                          <div style={{ fontSize: '11px', color: 'var(--adm-muted)', textTransform: 'uppercase', marginBottom: '6px' }}>Contact Info</div>
                          <div style={{ fontSize: '13px', color: 'var(--adm-text)', lineHeight: 2 }}>
                            📞 {app.phone || 'Not provided'}<br />
                            ✉️ <a href={`mailto:${app.email}`} style={{ color: '#3b82f6' }}>{app.email}</a>
                            {app.portfolio_url && <><br />🔗 <a href={app.portfolio_url} target="_blank" rel="noreferrer" style={{ color: '#3b82f6' }}>Portfolio / LinkedIn</a></>}
                          </div>
                        </div>
                        <div>
                          {app.resume_url && (
                            <a href={app.resume_url} target="_blank" rel="noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(59,130,246,0.1)', color: '#3b82f6', borderRadius: '8px', padding: '8px 16px', fontSize: '13px', fontWeight: 600, textDecoration: 'none' }}>
                              <ExternalLink size={14} /> Download Resume
                            </a>
                          )}
                        </div>
                        {app.cover_letter && (
                          <div style={{ gridColumn: '1 / -1' }}>
                            <div style={{ fontSize: '11px', color: 'var(--adm-muted)', textTransform: 'uppercase', marginBottom: '8px' }}>Cover Letter</div>
                            <div style={{ fontSize: '13px', color: 'var(--adm-text)', lineHeight: 1.7, background: 'rgba(255,255,255,0.03)', borderRadius: '8px', padding: '14px', whiteSpace: 'pre-wrap' }}>{app.cover_letter}</div>
                          </div>
                        )}
                        {app.notes && (
                          <div style={{ gridColumn: '1 / -1' }}>
                            <div style={{ fontSize: '11px', color: 'var(--adm-muted)', textTransform: 'uppercase', marginBottom: '8px' }}>Additional Notes</div>
                            <div style={{ fontSize: '13px', color: 'var(--adm-text)', lineHeight: 1.7 }}>{app.notes}</div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* JOB MODAL */}
      {isJobModalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999 }}>
          <div style={{ background: 'var(--adm-surface)', border: '1px solid var(--adm-border)', borderRadius: '16px', width: '500px', maxWidth: '90%', padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
              <h3 style={{ margin: 0, color: '#fff' }}>{editingJob ? 'Edit Job' : 'Create Job'}</h3>
              <button onClick={() => setIsJobModalOpen(false)} style={{ background: 'transparent', border: 'none', color: 'var(--adm-muted)', cursor: 'pointer' }}><X size={20} /></button>
            </div>
            <form onSubmit={handleJobSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', color: 'var(--adm-muted)', marginBottom: '8px' }}>Job Title</label>
                <input required value={jobForm.title} onChange={e => setJobForm({...jobForm, title: e.target.value})} style={{ ...inputStyle, width: '100%' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', color: 'var(--adm-muted)', marginBottom: '8px' }}>Department</label>
                <select required value={jobForm.dept} onChange={e => setJobForm({...jobForm, dept: e.target.value})} style={{ ...inputStyle, width: '100%' }}>
                  <option value="">Select Department...</option>
                  <option value="Operations">Operations</option>
                  <option value="Sales">Sales</option>
                  <option value="Logistics">Logistics</option>
                  <option value="Technology">Technology</option>
                  <option value="Marketing">Marketing</option>
                </select>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: 'var(--adm-muted)', marginBottom: '8px' }}>Type</label>
                  <input required value={jobForm.type} onChange={e => setJobForm({...jobForm, type: e.target.value})} style={{ ...inputStyle, width: '100%' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: 'var(--adm-muted)', marginBottom: '8px' }}>Level</label>
                  <input required value={jobForm.level} onChange={e => setJobForm({...jobForm, level: e.target.value})} style={{ ...inputStyle, width: '100%' }} />
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', color: 'var(--adm-muted)', marginBottom: '8px' }}>Location</label>
                <input required value={jobForm.location} onChange={e => setJobForm({...jobForm, location: e.target.value})} style={{ ...inputStyle, width: '100%' }} />
              </div>
              <button type="submit" style={{ ...inputStyle, background: 'var(--adm-accent)', color: '#000', fontWeight: 600, marginTop: '10px', cursor: 'pointer', border: 'none' }}>
                Save Job
              </button>
            </form>
          </div>
        </div>
      )}

      <ConfirmDialog
        isOpen={confirmDelete.isOpen}
        title={confirmDelete.type === 'job' ? 'Delete Job Posting?' : 'Delete Application?'}
        message={`Are you sure you want to delete ${confirmDelete.name}? This action cannot be undone.`}
        onConfirm={executeDelete}
        onCancel={() => setConfirmDelete({ isOpen: false, id: null, type: '', name: '' })}
      />
    </div>
  );
}
