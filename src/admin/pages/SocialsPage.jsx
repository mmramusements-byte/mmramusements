import { useState } from 'react';
import { Save, Globe, ExternalLink, Share2, Info } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { FaInstagram, FaYoutube, FaXTwitter, FaWhatsapp, FaFacebook, FaDiscord, FaTelegram } from 'react-icons/fa6';
import { useSocialStore } from '../store/useSocialStore';
import { useAdminUIStore } from '../store/useAdminUIStore';
import PageHeader from '../components/ui/PageHeader';

const iconMap = {
  instagram: <FaInstagram size={20} color="#e1306c" />,
  youtube: <FaYoutube size={20} color="#ff0000" />,
  twitter: <FaXTwitter size={20} color="#ffffff" />,
  whatsapp: <FaWhatsapp size={20} color="#25d366" />,
  facebook: <FaFacebook size={20} color="#1877f2" />,
  discord: <FaDiscord size={20} color="#5865f2" />,
  telegram: <FaTelegram size={20} color="#0088cc" />,
};

export default function SocialsPage() {
  const { socials, updateSocial } = useSocialStore();
  const toast = useAdminUIStore((state) => state.toast);
  const [isSaving, setIsSaving] = useState(false);

  // Initialize React Hook Form with stored social URLs and visibility states
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: socials.reduce((acc, curr) => {
      acc[`url_${curr.id}`] = curr.url;
      acc[`visible_${curr.id}`] = curr.visible;
      return acc;
    }, {}),
  });

  const onSubmit = async (data) => {
    setIsSaving(true);
    // Premium network delay representation
    await new Promise((resolve) => setTimeout(resolve, 600));

    try {
      socials.forEach((social) => {
        const url = data[`url_${social.id}`]?.trim() || '';
        const visible = data[`visible_${social.id}`];
        updateSocial(social.id, url, visible);
      });

      toast.success('Social media configuration updated globally.', 'Settings Saved');
    } catch (err) {
      toast.error('Could not save social configurations.', 'Error');
    } finally {
      setIsSaving(false);
    }
  };

  const urlPattern = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([\/\w .-]*)*\/?$/i;

  return (
    <div>
      <PageHeader
        title="Social Media Links"
        subtitle="Dynamically control and visibility toggle all B2B social channels on storefront headers & footers."
      />

      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Banner Announcement */}
        <div
          style={{
            background: 'rgba(99,102,241,0.06)',
            border: '1px solid rgba(99,102,241,0.15)',
            borderRadius: '12px',
            padding: '16px 20px',
            display: 'flex',
            gap: '12px',
            alignItems: 'flex-start',
            marginBottom: '28px',
          }}
        >
          <Info size={18} style={{ color: 'var(--adm-accent)', marginTop: 2, flexShrink: 0 }} />
          <div>
            <div style={{ fontSize: '13.5px', fontWeight: 600, color: 'var(--adm-text)' }}>
              Real-time CMS Propagation
            </div>
            <div style={{ fontSize: '12px', color: 'var(--adm-muted)', marginTop: '4px', lineHeight: 1.5 }}>
              Disabled or empty links are automatically hidden from the storefront layout to prevent broken user experiences.
              Ensure that all links start with <code style={{ color: '#fff', background: '#252528', padding: '2px 4px', borderRadius: '4px' }}>https://</code>.
            </div>
          </div>
        </div>

        {/* Social Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '20px',
            marginBottom: '32px',
          }}
        >
          {socials.map((social) => {
            const isVisible = watch(`visible_${social.id}`);
            const inputUrl = watch(`url_${social.id}`);
            const hasError = errors[`url_${social.id}`];

            return (
              <div
                key={social.id}
                className="adm-card"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '16px',
                  borderColor: isVisible ? 'rgba(99,102,241,0.15)' : 'var(--adm-border)',
                  background: isVisible ? 'rgba(99,102,241,0.01)' : 'var(--adm-card)',
                  transition: 'all 0.2s ease',
                }}
              >
                {/* Channel Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div
                      style={{
                        width: '36px',
                        height: '36px',
                        background: 'rgba(255,255,255,0.03)',
                        border: '1px solid var(--adm-border)',
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {iconMap[social.id] || <Share2 size={16} />}
                    </div>
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--adm-text)' }}>
                        {social.name}
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--adm-muted)' }}>
                        {social.id === 'whatsapp' ? 'wa.me standard' : 'External link'}
                      </div>
                    </div>
                  </div>

                  {/* Toggle Switch */}
                  <label
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      fontSize: '12px',
                      color: 'var(--adm-muted)',
                    }}
                  >
                    <span>{isVisible ? 'Active' : 'Hidden'}</span>
                    <button
                      type="button"
                      onClick={() => setValue(`visible_${social.id}`, !isVisible, { shouldWatch: true })}
                      className={`adm-toggle ${isVisible ? 'on' : ''}`}
                    />
                  </label>
                </div>

                {/* Input Area */}
                <div>
                  <label className="adm-label">Target URL</label>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <div style={{ position: 'relative', flex: 1 }}>
                      <span
                        style={{
                          position: 'absolute',
                          left: '12px',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          color: 'var(--adm-muted)',
                        }}
                      >
                        <Globe size={14} />
                      </span>
                      <input
                        type="text"
                        placeholder={social.id === 'whatsapp' ? 'https://wa.me/1...' : 'https://...'}
                        className={`adm-input ${hasError ? 'adm-input-error' : ''}`}
                        style={{ paddingLeft: '34px', fontSize: '13px' }}
                        {...register(`url_${social.id}`, {
                          validate: (v) => {
                            if (!v) return true; // empty is ok (auto hides)
                            return urlPattern.test(v) || 'Please enter a valid URL';
                          },
                        })}
                      />
                    </div>

                    {/* Test Link Button */}
                    <a
                      href={inputUrl && urlPattern.test(inputUrl) ? inputUrl : '#'}
                      target={inputUrl && urlPattern.test(inputUrl) ? '_blank' : undefined}
                      rel="noopener noreferrer"
                      className="adm-btn adm-btn-secondary"
                      style={{
                        padding: '10px',
                        borderRadius: '8px',
                        cursor: inputUrl && urlPattern.test(inputUrl) ? 'pointer' : 'not-allowed',
                        opacity: inputUrl && urlPattern.test(inputUrl) ? 1 : 0.4,
                      }}
                      title="Test URL in new window"
                      onClick={(e) => {
                        if (!inputUrl || !urlPattern.test(inputUrl)) {
                          e.preventDefault();
                          toast.warning('Please enter a valid URL before testing.', 'Invalid Link');
                        }
                      }}
                    >
                      <ExternalLink size={14} />
                    </a>
                  </div>

                  {/* Validation Error Message */}
                  {hasError && (
                    <div className="adm-error-msg" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      {errors[`url_${social.id}`].message}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Action Button */}
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-start' }}>
          <button type="submit" className="adm-btn adm-btn-primary" disabled={isSaving}>
            <Save size={16} />
            <span>{isSaving ? 'Applying Changes...' : 'Save Social Settings'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
