import React, { useEffect } from 'react';

export default function Toast({ message, type = 'success', onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const toastStyle = {
    position: 'fixed',
    bottom: '24px',
    right: '24px',
    backgroundColor: type === 'error' ? '#2A1616' : '#1B1E16',
    color: '#FDFDFD',
    border: `1px solid ${type === 'error' ? '#ef4444' : '#F4EC00'}`,
    padding: '16px 24px',
    borderRadius: '8px',
    boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    zIndex: 9999,
    fontFamily: "'Playfair Display', Georgia, serif",
    animation: 'slideIn 0.3s ease-out'
  };

  const accentDotStyle = {
    width: '10px',
    height: '10px',
    borderRadius: '50%',
    backgroundColor: type === 'error' ? '#ef4444' : '#F4EC00'
  };

  return (
    <div style={toastStyle}>
      <div style={accentDotStyle}></div>
      <span>{message}</span>
    </div>
  );
}