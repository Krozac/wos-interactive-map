class Toast {
    container;

    constructor(containerId = 'toast-container') {
        // Check if the container already exists
        const existingContainer = document.getElementById(containerId);
        if (existingContainer) {
            this.container = existingContainer;
            return;
        }
        
        this.container = document.createElement('div');
        this.container.id = 'toast-container';
        this.container.style.position = 'fixed';
        this.container.style.bottom = '20px';
        this.container.style.right = '20px';
        this.container.style.zIndex = '9999';
        document.body.appendChild(this.container);
    }

    show(message, type = 'info', duration = 3000) {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.textContent = message;

        // Style the toast
        toast.style.padding = '10px 20px';
        toast.style.marginBottom = '10px';
        toast.style.borderRadius = '5px';
        toast.style.color = '#fff';
        toast.style.fontSize = '14px';
        toast.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.2)';
        toast.style.opacity = '0';
        toast.style.transition = 'opacity 0.3s ease';

        // Set background color based on type
        switch (type) {
            case 'success':
                toast.style.backgroundColor = '#4caf50';
                break;
            case 'error':
                toast.style.backgroundColor = '#f44336';
                break;
            case 'warning':
                toast.style.backgroundColor = '#ff9800';
                break;
            default:
                toast.style.backgroundColor = '#2196f3';
        }

        this.container.appendChild(toast);

        // Fade in the toast
        setTimeout(() => {
            toast.style.opacity = '1';
        }, 100);

        // Remove the toast after the specified duration
        setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => {
                this.container.removeChild(toast);
            }, 300);
        }, duration);
    }
}
