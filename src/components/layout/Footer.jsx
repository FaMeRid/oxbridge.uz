import React from 'react';
import '../../styles/globals.css';

export function Footer() {
  const currentYear = new Date().getFullYear();

  const footerSections = [
    {
      title: 'Product',
      links: [
        { name: 'Features', href: '#features' },
        { name: 'Pricing', href: '#pricing' },
        { name: 'Study Tools', href: '/study-tools' },
        { name: 'Practice Tests', href: '/practice' },
        { name: 'Blog', href: '#blog' },
      ],
    },
    {
      title: 'Company',
      links: [
        { name: 'About Us', href: '/about' },
        { name: 'Careers', href: '#careers' },
        { name: 'Contact', href: '#contact' },
        { name: 'Press Kit', href: '#press' },
        { name: 'Partners', href: '#partners' },
      ],
    },
    {
      title: 'Resources',
      links: [
        { name: 'Documentation', href: '#docs' },
        { name: 'FAQ', href: '#faq' },
        { name: 'Community', href: '#community' },
        { name: 'Support', href: '#support' },
        { name: 'Status', href: '#status' },
      ],
    },
    {
      title: 'Legal',
      links: [
        { name: 'Privacy Policy', href: '#privacy' },
        { name: 'Terms of Service', href: '#terms' },
        { name: 'Cookie Policy', href: '#cookies' },
        { name: 'GDPR', href: '#gdpr' },
        { name: 'Accessibility', href: '#accessibility' },
      ],
    },
  ];

  const socialLinks = [
    { icon: '𝕏', name: 'Twitter', url: 'https://twitter.com/oxbridge', color: '#000' },
    { icon: 'f', name: 'Facebook', url: 'https://facebook.com/oxbridge', color: '#1877F2' },
    { icon: 'in', name: 'LinkedIn', url: 'https://linkedin.com/company/oxbridge', color: '#0077B5' },
    { icon: '📷', name: 'Instagram', url: 'https://instagram.com/oxbridge', color: '#E1306C' },
    { icon: '▶', name: 'YouTube', url: 'https://youtube.com/oxbridge', color: '#FF0000' },
  ];

  return (
    <footer style={{
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
      color: '#e2e8f0',
      paddingTop: '60px',
      paddingBottom: '24px',
      borderTop: '1px solid rgba(226,232,240,0.1)',
      marginTop: '80px',
    }}>
      <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '0 28px' }}>
        
        {/* Main Footer Content */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '48px',
          marginBottom: '60px',
        }}>
          {/* Brand Column */}
          <div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '20px',
            }}>
              <div style={{
                width: '42px',
                height: '42px',
                background: 'linear-gradient(145deg, #a81011, #d42022)',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.5rem',
                boxShadow: '0 4px 24px rgba(168,16,17,0.28)',
              }}>
                🎓
              </div>
              <div>
                <h3 style={{
                  fontFamily: 'Playfair Display, serif',
                  fontSize: '1.2rem',
                  fontWeight: 800,
                  color: '#fff',
                  lineHeight: 1,
                  marginBottom: '4px',
                }}>
                  Oxbridge
                </h3>
                <p style={{
                  fontSize: '0.65rem',
                  fontWeight: 700,
                  letterSpacing: '2px',
                  textTransform: 'uppercase',
                  color: '#94a3b8',
                }}>
                  IELTS Platform
                </p>
              </div>
            </div>
            <p style={{
              fontSize: '0.9rem',
              color: '#cbd5e1',
              lineHeight: 1.6,
              marginBottom: '20px',
            }}>
              Prepare for IELTS with confidence using our comprehensive study platform and expert tools.
            </p>
            
            {/* Social Links */}
            <div style={{
              display: 'flex',
              gap: '12px',
              flexWrap: 'wrap',
            }}>
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  title={social.name}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    background: 'rgba(226,232,240,0.1)',
                    border: '1px solid rgba(226,232,240,0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: social.color,
                    fontWeight: 700,
                    fontSize: '0.9rem',
                    transition: 'all 0.2s',
                    textDecoration: 'none',
                    cursor: 'pointer',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = social.color;
                    e.currentTarget.style.color = '#fff';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(226,232,240,0.1)';
                    e.currentTarget.style.color = social.color;
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Link Sections */}
          {footerSections.map((section, idx) => (
            <div key={idx}>
              <h4 style={{
                fontSize: '0.85rem',
                fontWeight: 700,
                color: '#fff',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                marginBottom: '16px',
                paddingBottom: '12px',
                borderBottom: '1px solid rgba(226,232,240,0.1)',
              }}>
                {section.title}
              </h4>
              <ul style={{
                listStyle: 'none',
                padding: 0,
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
              }}>
                {section.links.map((link, linkIdx) => (
                  <li key={linkIdx}>
                    <a
                      href={link.href}
                      style={{
                        color: '#cbd5e1',
                        textDecoration: 'none',
                        fontSize: '0.9rem',
                        transition: 'all 0.2s',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = '#c9a227';
                        e.currentTarget.style.transform = 'translateX(4px)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = '#cbd5e1';
                        e.currentTarget.style.transform = 'translateX(0)';
                      }}
                    >
                      <span style={{ opacity: 0, width: 0, transition: 'opacity 0.2s' }}>→</span>
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter Section */}
        <div style={{
          background: 'rgba(201,162,39,0.05)',
          border: '1px solid rgba(201,162,39,0.2)',
          borderRadius: '16px',
          padding: '32px',
          marginBottom: '48px',
        }}>
          <div style={{
            maxWidth: '500px',
          }}>
            <h3 style={{
              fontSize: '1.2rem',
              fontWeight: 700,
              color: '#fff',
              marginBottom: '8px',
            }}>
              📬 Get IELTS Tips & Updates
            </h3>
            <p style={{
              fontSize: '0.9rem',
              color: '#cbd5e1',
              marginBottom: '16px',
            }}>
              Subscribe to receive weekly tips, study strategies, and exclusive offers delivered to your inbox.
            </p>
            <div style={{
              display: 'flex',
              gap: '8px',
            }}>
              <input
                type="email"
                placeholder="your@email.com"
                style={{
                  flex: 1,
                  padding: '12px 16px',
                  background: 'rgba(226,232,240,0.1)',
                  border: '1px solid rgba(226,232,240,0.2)',
                  borderRadius: '10px',
                  color: '#fff',
                  fontSize: '0.9rem',
                  outline: 'none',
                  transition: 'all 0.2s',
                  fontFamily: 'Inter, sans-serif',
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(201,162,39,0.5)';
                  e.currentTarget.style.background = 'rgba(226,232,240,0.15)';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(226,232,240,0.2)';
                  e.currentTarget.style.background = 'rgba(226,232,240,0.1)';
                }}
              />
              <button
                style={{
                  padding: '12px 28px',
                  background: 'linear-gradient(135deg, #c9a227, #e4c354)',
                  color: '#0f172a',
                  border: 'none',
                  borderRadius: '10px',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  whiteSpace: 'nowrap',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 8px 20px rgba(201,162,39,0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingTop: '28px',
          borderTop: '1px solid rgba(226,232,240,0.1)',
          flexWrap: 'wrap',
          gap: '16px',
        }}>
          {/* Left - Copyright */}
          <div style={{
            fontSize: '0.85rem',
            color: '#64748b',
          }}>
            <p>
              © {currentYear} Oxbridge IELTS Platform. All rights reserved. 
              <span style={{ margin: '0 8px' }}>•</span>
              Made with ❤️ for IELTS Students
            </p>
          </div>

          {/* Right - Quick Links */}
          <div style={{
            display: 'flex',
            gap: '20px',
            flexWrap: 'wrap',
            justifyContent: 'flex-end',
          }}>
            {[
              { label: 'Privacy', href: '#privacy' },
              { label: 'Terms', href: '#terms' },
              { label: 'Cookies', href: '#cookies' },
              { label: 'Contact', href: '#contact' },
            ].map((item, idx) => (
              <a
                key={idx}
                href={item.href}
                style={{
                  fontSize: '0.85rem',
                  color: '#64748b',
                  textDecoration: 'none',
                  transition: 'color 0.2s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#c9a227')}
                onMouseLeave={(e) => (e.currentTarget.style.color = '#64748b')}
              >
                {item.label}
              </a>
            ))}
          </div>
        </div>

        {/* Status Badge */}
        <div style={{
          marginTop: '24px',
          paddingTop: '24px',
          borderTop: '1px solid rgba(226,232,240,0.1)',
          textAlign: 'center',
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            fontSize: '0.8rem',
            color: '#64748b',
          }}>
            <span style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: '#22c55e',
              animation: 'pulse 2s infinite',
            }}></span>
            All Systems Operational • 99.9% Uptime
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;