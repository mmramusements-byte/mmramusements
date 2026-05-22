import { useState, useEffect, useCallback } from 'react';
import { Search, Trash2, ChevronDown, ExternalLink, RefreshCw } from 'lucide-react';
import PageHeader from '../components/ui/PageHeader';
import { useAdminUIStore } from '../store/useAdminUIStore';
import { useAuthStore } from '../store/useAuthStore';
import api from '../../lib/api';

const STATUS_COLORS = {
  pending: { bg: 'rgba(251,191,36,0.12)', color: '#fbbf24', label: 'Pending' },
  reviewed: { bg: 'rgba(59,130,246,0.12)', color: '#3b82f6', label: 'Reviewed' },
  shortlisted: { bg: 'rgba(168,85,247,0.12)', color: '#a855f7', label: 'Shortlisted' },
  rejected: { bg: 'rgba(239,68,68,0.12)', color: '#ef4444', label: 'Rejected' },
  hired: { bg: 'rgba(34,197,94,0.12)', color: '#22c55e', label: 'Hired' },
};

const STATUSES = Object.entries(STATUS_COLORS).map(([k, v]) => ({ value: k, ...v }));

export default function AdminCareersPage() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [expanded, setExpanded] = useState(null);
  const { openConfirm, toast } = useAdminUIStore();
  const token = useAuthStore(s => s.token);

  const fetchApplications = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      if (statusFilter) params.set('status', statusFilter);
      const data = await api.get(`/careers?${params}`);
      setApplications(Array.isArray(data) ? data : []);
    } catch (err) {
      toast.error('Failed to load applications');
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter, toast]);

  useEffect(() => { fetchApplications(); }, [fetchApplications]);

  const handleStatusChange = async (id, status) => {
    try {
      await api.patch(`/careers/${id}/status`, { status });
      setApplications(prev => prev.map(a => a.id === id ? { ...a, status } : a));
      toast.success(`Status updated to ${STATUS_COLORS[status]?.label}`);
    } catch {
      toast.error('Failed to update status');
    }
  };

  const handleDelete = (id, name) => {
    openConfirm({
      title: 'Delete Application',
      message: `Remove ${name}'s application? This cannot be undone.`,
      dangerous: true,
      onConfirm: async () => {
        try {
          await api.delete(`/careers/${id}`);
          setApplications(prev => prev.filter(a => a.id !== id));
          toast.success('Application deleted');
        } catch {
          toast.error('Failed to delete application');
        }
      },
    });
  };

  const inputStyle = {
    background: 'var(--adm-surface)', border: '1px solid var(--adm-border)', borderRadius: '8px',
    padding: '9px 14px', color: 'var(--adm-text)', fontSize: '13.5px', outline: 'none',
    fontFamily: 'Inter, sans-serif',
  };

  return (
    <div>
      <PageHeader title="Career Applications" subtitle={`${applications.length} application${applications.length !== 1 ? 's' : ''}`} />

      {/* Filters */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: '220px' }}>
          <Search size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--adm-muted)' }} />
          <input placeholder="Search by name or email..." value={search} onChange={e => setSearch(e.target.value)}
            style={{ ...inputStyle, width: '100%', paddingLeft: '36px' }} />
        </div>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} style={{ ...inputStyle, minWidth: '160px' }}>
          <option value="">All Statuses</option>
          {STATUSES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
        </select>
        <button onClick={fetchApplications} style={{ ...inputStyle, display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', background: 'var(--adm-surface)', color: 'var(--adm-muted)' }}>
          <RefreshCw size={14} /> Refresh
        </button>
      </div>

      {loading ? (
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
              <div key={app.id} style={{ background: 'var(--adm-surface)', border: '1px solid var(--adm-border)', borderRadius: '12px', overflow: 'hidden', transition: 'border-color 0.2s' }}>
                {/* Row */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto auto auto', gap: '12px', alignItems: 'center', padding: '16px 20px' }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '14px', color: 'var(--adm-text)' }}>{app.full_name}</div>
                    <div style={{ fontSize: '12px', color: 'var(--adm-muted)', marginTop: '2px' }}>{app.email}</div>
                  </div>
                  <div style={{ fontSize: '13px', color: 'var(--adm-text)' }}>{app.position}</div>
                  <div style={{ fontSize: '12px', color: 'var(--adm-muted)' }}>
                    {app.experience || '—'}<br />
                    <span style={{ fontSize: '11px' }}>{new Date(app.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                  </div>
                  {/* Status selector */}
                  <select value={app.status} onChange={e => handleStatusChange(app.id, e.target.value)}
                    style={{ background: st.bg, color: st.color, border: `1px solid ${st.color}40`, borderRadius: '6px', padding: '5px 10px', fontSize: '12px', fontWeight: 600, cursor: 'pointer', outline: 'none', fontFamily: 'Inter,sans-serif' }}>
                    {STATUSES.map(s => <option key={s.value} value={s.value} style={{ background: '#1a1a1c', color: '#fff' }}>{s.label}</option>)}
                  </select>
                  {/* Expand */}
                  <button onClick={() => setExpanded(isExpanded ? null : app.id)}
                    style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid var(--adm-border)', borderRadius: '6px', padding: '6px 10px', cursor: 'pointer', color: 'var(--adm-muted)', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', transition: 'all 0.2s' }}>
                    <ChevronDown size={14} style={{ transform: isExpanded ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
                    Details
                  </button>
                  {/* Delete */}
                  <button onClick={() => handleDelete(app.id, app.full_name)}
                    style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.15)', borderRadius: '6px', padding: '7px', cursor: 'pointer', color: '#ef4444', display: 'flex', alignItems: 'center', transition: 'all 0.2s' }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.15)'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.06)'; }}>
                    <Trash2 size={14} />
                  </button>
                </div>

                {/* Expanded details */}
                {isExpanded && (
                  <div style={{ borderTop: '1px solid var(--adm-border)', padding: '20px', background: 'rgba(0,0,0,0.2)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                    <div>
                      <div style={{ fontSize: '11px', color: 'var(--adm-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '6px' }}>Contact Info</div>
                      <div style={{ fontSize: '13px', color: 'var(--adm-text)', lineHeight: 2 }}>
                        📞 {app.phone || 'Not provided'}<br />
                        📧 <a href={`mailto:${app.email}`} style={{ color: '#3b82f6', textDecoration: 'none' }}>{app.email}</a>
                        {app.portfolio_url && <><br />🔗 <a href={app.portfolio_url} target="_blank" rel="noopener noreferrer" style={{ color: '#3b82f6', textDecoration: 'none' }}>Portfolio / LinkedIn <ExternalLink size={10} style={{ display: 'inline' }} /></a></>}
                      </div>
                    </div>
                    <div>
                      {app.resume_url && (
                        <a href={app.resume_url} target="_blank" rel="noopener noreferrer"
                          style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(59,130,246,0.1)', color: '#3b82f6', border: '1px solid rgba(59,130,246,0.3)', borderRadius: '8px', padding: '8px 16px', fontSize: '13px', fontWeight: 600, textDecoration: 'none', marginBottom: '16px' }}>
                          <ExternalLink size={14} /> Download Resume
                        </a>
                      )}
                    </div>
                    {app.cover_letter && (
                      <div style={{ gridColumn: '1 / -1' }}>
                        <div style={{ fontSize: '11px', color: 'var(--adm-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>Cover Letter</div>
                        <div style={{ fontSize: '13px', color: 'var(--adm-text)', lineHeight: 1.7, background: 'rgba(255,255,255,0.03)', borderRadius: '8px', padding: '14px', whiteSpace: 'pre-wrap' }}>{app.cover_letter}</div>
                      </div>
                    )}
                    {app.notes && (
                      <div style={{ gridColumn: '1 / -1' }}>
                        <div style={{ fontSize: '11px', color: 'var(--adm-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>Additional Notes</div>
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
    </div>
  );
}
