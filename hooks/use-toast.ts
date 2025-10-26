export function useToast() {
  return {
    toast: (props: {
      title?: string
      description?: string
      variant?: 'default' | 'destructive'
    }) => {
      const { title = '', description = '', variant = 'default' } = props
      
      // Create a styled toast notification
      const toastEl = document.createElement('div')
      toastEl.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 16px 24px;
        background: ${variant === 'destructive' ? '#ef4444' : '#10b981'};
        color: white;
        border-radius: 8px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        z-index: 9999;
        max-width: 400px;
        animation: slideIn 0.3s ease-out;
      `
      
      toastEl.innerHTML = `
        <div style="font-weight: 600; margin-bottom: 4px;">${title}</div>
        ${description ? `<div style="font-size: 14px; opacity: 0.9;">${description}</div>` : ''}
      `
      
      // Add animation styles
      if (!document.getElementById('toast-styles')) {
        const style = document.createElement('style')
        style.id = 'toast-styles'
        style.textContent = `
          @keyframes slideIn {
            from {
              transform: translateX(100%);
              opacity: 0;
            }
            to {
              transform: translateX(0);
              opacity: 1;
            }
          }
          @keyframes slideOut {
            from {
              transform: translateX(0);
              opacity: 1;
            }
            to {
              transform: translateX(100%);
              opacity: 0;
            }
          }
        `
        document.head.appendChild(style)
      }
      
      document.body.appendChild(toastEl)
      
      // Auto remove after 3 seconds
      setTimeout(() => {
        toastEl.style.animation = 'slideOut 0.3s ease-in'
        setTimeout(() => {
          if (toastEl.parentNode) {
            document.body.removeChild(toastEl)
          }
        }, 300)
      }, 3000)
    },
  }
}

