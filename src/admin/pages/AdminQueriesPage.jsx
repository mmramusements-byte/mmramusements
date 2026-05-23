import { useState, useEffect, useCallback } from 'react';
import { Search, Trash2, ChevronDown, RefreshCw, Mail } from 'lucide-react';
import PageHeader from '../components/ui/PageHeader';
import { useAdminUIStore } from '../store/useAdminUIStore';
import api from '../../lib/api';

const STATUS_COLORS = {
  new: { bg: 'rgba(59,130,246,0.12)', color: '#3b82f6', label: 'New' },
  in_progress: { bg: 'rgba(251,191,36,0.12)', color: '#fbbf24', label: 'In Progress' },
  resolved: { bg: 'rgba(34,197,94,0.12)', color: '#22c55e', label: 'Resolved' },
  closed: { bg: 'rgba(100,116,139,0.12)', color: '#64748b', label: 'Closed' },
};

const STATUSES = Object.entries(STATUS_COLORS).map(([k, v]) => ({ value: k, ...v }));

export default function AdminQueriesPage() {
  const [queries, setQueries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [expanded, setExpanded] = useState(null);
  const { openConfirm, toast } = useAdminUIStore();

  const fetchQueries = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      if (statusFilter) params.set('status', statusFilter);
      const data = await api.get(`/queries?${params}`);
      setQueries(Array.isArray(data) ? data : []);
    } catch {
      toast.error('Failed to load queries');
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter, toast]);

  useEffect(() => { fetchQueries(); }, [fetchQueries]);

  const handleStatusChange = async (id, status) => {
    try {
      await api.patch(`/queries/${id}/status`, { status });
      setQueries(prev => prev.map(q => q.id === id ? { ...q, status } : q));
      toast.success(`Status updated to ${STATUS_COLORS[status]?.label}`);
    } catch {
      toast.error('Failed to update status');
    }
  };

  const handleDelete = (id, name) => {
    openConfirm({
      title: 'Delete Query',
      message: `Remove ${name}'s query? This cannot be undone.`,
      dangerous: true,
      onConfirm: async () => {
        try {
          await api.delete(`/queries/${id}`);
          setQueries(prev => prev.filter(q => q.id !== id));
          toast.success('Query deleted');
        } catch {
          toast.error('Failed to delete query');
        }
      },
    });
  };

  const inputStyle = {
    background: 'var(--adm-surface)', border: '1px solid var(--adm-border)', borderRadius: '8px',
    padding: '9px 14px', color: 'var(--adm-text)', fontSize: '13.5px', outline: 'none', fontFamily: 'Inter, sans-serif',
  };

  const newCount = queries.filter(q => q.status === 'new').length;

  return (
    <div>
      <PageHeader
        title="Customer Queries"
        subtitle={`${queries.length} total${newCount > 0 ? ` · ${newCount} new` : ''}`}
      />

      {/* Filters */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: '220px' }}>
          <Search size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--adm-muted)' }} />
          <input placeholder="Search by name, email, or subject..." value={search} onChange={e => setSearch(e.target.value)}
            style={{ ...inputStyle, width: '100%', paddingLeft: '36px' }} />
        </div>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} style={{ ...inputStyle, minWidth: '160px' }}>
          <option value="">All Statuses</option>
          {STATUSES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
        </select>
        <button onClick={fetchQueries} style={{ ...inputStyle, display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', color: 'var(--adm-muted)' }}>
          <RefreshCw size={14} /> Refresh
        </button>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px', color: 'var(--adm-muted)' }}>Loading queries...</div>
      ) : queries.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px', color: 'var(--adm-muted)', background: 'var(--adm-surface)', borderRadius: '12px', border: '1px solid var(--adm-border)' }}>
          No queries found.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {queries.map((q) => {
            const st = STATUS_COLORS[q.status] || STATUS_COLORS.new;
            const isExpanded = expanded === q.id;
            const isNew = q.status === 'new';
            return (
              <div key={q.id} style={{ background: 'var(--adm-surface)', border: `1px solid ${isNew ? 'rgba(59,130,246,0.25)' : 'var(--adm-border)'}`, borderRadius: '12px', overflow: 'hidden', transition: 'border-color 0.2s' }}>
                {/* Row */}
                <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1.2fr 1fr auto auto auto', gap: '12px', alignItems: 'center', padding: '16px 20px' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {isNew && <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#3b82f6', flexShrink: 0, display: 'inline-block' }} />}
                      <span style={{ fontWeight: 600, fontSize: '14px', color: 'var(--adm-text)' }}>{q.full_name}</span>
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--adm-muted)', marginTop: '2px' }}>{q.email}</div>
                    {q.company && <div style={{ fontSize: '11px', color: 'var(--adm-muted)', opacity: 0.6 }}>{q.company}</div>}
                  </div>
                  <div style={{ fontSize: '13px', color: 'var(--adm-text)', fontWeight: 500 }}>{q.subject}</div>
                  <div style={{ fontSize: '11px', color: 'var(--adm-muted)' }}>
                    {q.phone || '—'}<br />
                    {new Date(q.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </div>
                  {/* Status */}
                  <select value={q.status} onChange={e => handleStatusChange(q.id, e.target.value)}
                    style={{ background: st.bg, color: st.color, border: `1px solid ${st.color}40`, borderRadius: '6px', padding: '5px 10px', fontSize: '12px', fontWeight: 600, cursor: 'pointer', outline: 'none', fontFamily: 'Inter,sans-serif' }}>
                    {STATUSES.map(s => <option key={s.value} value={s.value} style={{ background: '#1a1a1c', color: '#fff' }}>{s.label}</option>)}
                  </select>
                  {/* Reply */}
                  <a href={`mailto:${q.email}?subject=Re: ${encodeURIComponent(q.subject)}`}
                    style={{ background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.2)', borderRadius: '6px', padding: '7px 12px', cursor: 'pointer', color: '#3b82f6', display: 'flex', alignItems: 'center', gap: '5px', fontSize: '12px', textDecoration: 'none', fontWeight: 600, transition: 'all 0.2s' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(59,130,246,0.15)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'rgba(59,130,246,0.08)'}>
                    <Mail size={13} /> Reply
                  </a>
                  {/* Expand */}
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button onClick={() => setExpanded(isExpanded ? null : q.id)}
                      style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid var(--adm-border)', borderRadius: '6px', padding: '6px 8px', cursor: 'pointer', color: 'var(--adm-muted)', display: 'flex', alignItems: 'center' }}>
                      <ChevronDown size={14} style={{ transform: isExpanded ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
                    </button>
                    <button onClick={() => handleDelete(q.id, q.full_name)}
                      style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.15)', borderRadius: '6px', padding: '7px', cursor: 'pointer', color: '#ef4444', display: 'flex', alignItems: 'center', transition: 'all 0.2s' }}
                      onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.15)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'rgba(239,68,68,0.06)'}>
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                {/* Expanded */}
                {isExpanded && (
                  <div style={{ borderTop: '1px solid var(--adm-border)', padding: '20px', background: 'rgba(0,0,0,0.2)' }}>
                    <div style={{ fontSize: '11px', color: 'var(--adm-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '10px' }}>Message</div>
                    <div style={{ fontSize: '14px', color: 'var(--adm-text)', lineHeight: 1.7, whiteSpace: 'pre-wrap', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', padding: '14px' }}>{q.message}</div>
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
