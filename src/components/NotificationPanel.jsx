import React from 'react';
import { CloseIcon, CheckIcon } from './Icons';

export default function NotificationPanel({ isOpen, notifications, onClose, onMarkAllRead, onClear }) {
  if (!isOpen) return null;

  const getStatusColor = (type) => {
    switch (type) {
      case 'success': return 'var(--neon-green)';
      case 'error': return 'var(--neon-pink)';
      case 'warning': return 'var(--neon-yellow)';
      default: return 'var(--neon-blue)';
    }
  };

  return (
    <div className="glass-panel" style={{
      position: 'fixed',
      top: 'var(--header-height)',
      right: '24px',
      width: '360px',
      maxHeight: 'calc(100vh - var(--header-height) - 40px)',
      zIndex: 200,
      display: 'flex',
      flexDirection: 'column',
      boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6), 0 0 20px rgba(157, 0, 255, 0.1)',
      border: '1px solid var(--border-medium)',
      background: 'rgba(10, 8, 20, 0.92)'
    }}>
      {/* Panel Header */}
      <div style={{
        padding: '16px',
        borderBottom: '1px solid var(--border-light)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontWeight: 600, fontSize: '0.95rem' }}>Simulation Event Feed</span>
          <span style={{
            fontSize: '0.7rem',
            background: 'rgba(255, 0, 123, 0.15)',
            color: 'var(--neon-pink)',
            padding: '2px 6px',
            borderRadius: '10px',
            fontWeight: 600
          }}>LIVE</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <button 
            onClick={onMarkAllRead}
            title="Mark all as read"
            style={{
              background: 'none', border: 'none', color: 'var(--text-sub)', cursor: 'pointer', padding: '4px', display: 'flex', borderRadius: '4px'
            }}
            className="btn-icon-hover"
          >
            <CheckIcon style={{ width: '16px', height: '16px' }} />
          </button>
          <button 
            onClick={onClose}
            style={{
              background: 'none', border: 'none', color: 'var(--text-sub)', cursor: 'pointer', padding: '4px', display: 'flex', borderRadius: '4px'
            }}
          >
            <CloseIcon style={{ width: '16px', height: '16px' }} />
          </button>
        </div>
      </div>

      {/* Notifications List */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '8px 0',
        minHeight: '200px',
        maxHeight: '400px'
      }}>
        {notifications.length === 0 ? (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '40px 20px',
            color: 'var(--text-muted)',
            gap: '8px'
          }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
            <span style={{ fontSize: '0.8rem' }}>No events logged in this session</span>
          </div>
        ) : (
          notifications.map((notif) => (
            <div 
              key={notif.id}
              style={{
                padding: '12px 16px',
                borderBottom: '1px solid rgba(255,255,255,0.03)',
                background: notif.read ? 'transparent' : 'rgba(157, 0, 255, 0.03)',
                display: 'flex',
                gap: '12px',
                transition: 'var(--transition-smooth)'
              }}
            >
              {/* Type Indicator Dot */}
              <div style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: getStatusColor(notif.type),
                marginTop: '6px',
                flexShrink: 0,
                boxShadow: `0 0 8px ${getStatusColor(notif.type)}`
              }} />

              {/* Body */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 }}>
                <span style={{ fontSize: '0.82rem', color: 'var(--text-main)', lineHeight: '1.3' }}>
                  {notif.message}
                </span>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                    {notif.agent ? `${notif.agent} Agent` : 'System'}
                  </span>
                  <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                    {notif.time}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      <div style={{
        padding: '12px 16px',
        borderTop: '1px solid var(--border-light)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: 'rgba(0,0,0,0.1)'
      }}>
        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
          {notifications.filter(n => !n.read).length} unread updates
        </span>
        {notifications.length > 0 && (
          <button
            onClick={onClear}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--neon-pink)',
              fontSize: '0.75rem',
              fontWeight: 500,
              cursor: 'pointer'
            }}
          >
            Clear Log
          </button>
        )}
      </div>
    </div>
  );
}
