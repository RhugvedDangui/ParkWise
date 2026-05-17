// Theme Toggle Functionality
const themeToggle = document.getElementById('themeToggle');
const body = document.body;

themeToggle.addEventListener('click', () => {
    body.classList.toggle('dark-mode');
    
    // Update icon
    const icon = themeToggle.querySelector('i');
    if (body.classList.contains('dark-mode')) {
        icon.className = 'fas fa-moon';
    } else {
        icon.className = 'fas fa-sun';
    }
    
    // Save preference
    localStorage.setItem('theme', body.classList.contains('dark-mode') ? 'dark' : 'light');
});

// Load saved theme preference
window.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        body.classList.remove('dark-mode');
        themeToggle.querySelector('i').className = 'fas fa-sun';
    }
});

// Page Navigation
const navItems = document.querySelectorAll('.nav-item[data-page]');
const pages = document.querySelectorAll('.page');

navItems.forEach(item => {
    item.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Remove active class from all nav items
        navItems.forEach(nav => nav.classList.remove('active'));
        
        // Add active class to clicked item
        item.classList.add('active');
        
        // Hide all pages
        pages.forEach(page => page.classList.remove('active'));
        
        // Show selected page
        const pageId = item.getAttribute('data-page') + '-page';
        const targetPage = document.getElementById(pageId);
        if (targetPage) {
            targetPage.classList.add('active');
        }
    });
});

// Performance Chart
const canvas = document.getElementById('performanceChart');
if (canvas) {
    const ctx = canvas.getContext('2d');
    
    // Set canvas size
    canvas.width = canvas.offsetWidth;
    canvas.height = 300;
    
    // Chart data
    const data = [2, 3, 4, 3, 5, 7, 9, 12, 15, 13, 10, 8, 6, 4, 3];
    const maxValue = Math.max(...data);
    const padding = 40;
    const chartWidth = canvas.width - padding * 2;
    const chartHeight = canvas.height - padding * 2;
    
    // Get current theme colors
    const computedStyle = getComputedStyle(document.body);
    const accentColor = computedStyle.getPropertyValue('--accent-color').trim();
    const textSecondary = computedStyle.getPropertyValue('--text-secondary').trim();
    
    function drawChart() {
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw grid lines
        ctx.strokeStyle = textSecondary;
        ctx.globalAlpha = 0.1;
        ctx.lineWidth = 1;
        
        for (let i = 0; i <= 5; i++) {
            const y = padding + (chartHeight / 5) * i;
            ctx.beginPath();
            ctx.moveTo(padding, y);
            ctx.lineTo(canvas.width - padding, y);
            ctx.stroke();
        }
        
        ctx.globalAlpha = 1;
        
        // Draw line chart
        ctx.strokeStyle = accentColor;
        ctx.lineWidth = 3;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        
        ctx.beginPath();
        
        data.forEach((value, index) => {
            const x = padding + (chartWidth / (data.length - 1)) * index;
            const y = canvas.height - padding - (value / maxValue) * chartHeight;
            
            if (index === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        });
        
        ctx.stroke();
        
        // Draw gradient fill
        const gradient = ctx.createLinearGradient(0, padding, 0, canvas.height - padding);
        gradient.addColorStop(0, accentColor + '40');
        gradient.addColorStop(1, accentColor + '00');
        
        ctx.fillStyle = gradient;
        ctx.lineTo(canvas.width - padding, canvas.height - padding);
        ctx.lineTo(padding, canvas.height - padding);
        ctx.closePath();
        ctx.fill();
        
        // Draw data points
        ctx.fillStyle = accentColor;
        data.forEach((value, index) => {
            const x = padding + (chartWidth / (data.length - 1)) * index;
            const y = canvas.height - padding - (value / maxValue) * chartHeight;
            
            ctx.beginPath();
            ctx.arc(x, y, 4, 0, Math.PI * 2);
            ctx.fill();
        });
        
        // Draw axis labels
        ctx.fillStyle = textSecondary;
        ctx.font = '12px sans-serif';
        ctx.textAlign = 'center';
        
        const labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        const labelStep = Math.floor(data.length / labels.length);
        
        labels.forEach((label, index) => {
            const x = padding + (chartWidth / (labels.length - 1)) * index;
            ctx.fillText(label, x, canvas.height - 10);
        });
    }
    
    drawChart();
    
    // Redraw chart on theme change
    const observer = new MutationObserver(() => {
        drawChart();
    });
    
    observer.observe(body, {
        attributes: true,
        attributeFilter: ['class']
    });
    
    // Redraw on window resize
    window.addEventListener('resize', () => {
        canvas.width = canvas.offsetWidth;
        drawChart();
    });
}

// Simulate real-time traffic updates
function simulateTrafficUpdates() {
    const statValues = document.querySelectorAll('.stat-value');
    
    setInterval(() => {
        statValues.forEach(stat => {
            const currentValue = parseInt(stat.textContent);
            if (!isNaN(currentValue)) {
                // Random fluctuation
                const change = Math.floor(Math.random() * 3) - 1;
                const newValue = Math.max(0, currentValue + change);
                
                // Animate value change
                stat.style.transform = 'scale(1.1)';
                stat.style.color = 'var(--success-color)';
                
                setTimeout(() => {
                    stat.textContent = newValue;
                    stat.style.transform = 'scale(1)';
                    setTimeout(() => {
                        stat.style.color = 'var(--accent-color)';
                    }, 200);
                }, 200);
            }
        });
    }, 5000);
}

// Start traffic simulation
simulateTrafficUpdates();

// Add floating animation to cards on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const cardObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

document.querySelectorAll('.floating-card').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    cardObserver.observe(card);
});

// Add hover effect to route progress bars
document.querySelectorAll('.route-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
        const progressFill = card.querySelector('.progress-fill');
        if (progressFill) {
            const randomProgress = Math.floor(Math.random() * 60) + 20;
            progressFill.style.width = randomProgress + '%';
        }
    });
});

// Simulate CO2 savings counter
function animateCO2Counter() {
    const co2Values = document.querySelectorAll('.co2-badge, .batch-distance .co2');
    
    co2Values.forEach(element => {
        const text = element.textContent;
        const match = text.match(/(\d+\.?\d*)/);
        
        if (match) {
            const targetValue = parseFloat(match[1]);
            let currentValue = 0;
            const increment = targetValue / 50;
            
            const counter = setInterval(() => {
                currentValue += increment;
                if (currentValue >= targetValue) {
                    currentValue = targetValue;
                    clearInterval(counter);
                }
                element.textContent = text.replace(/\d+\.?\d*/, currentValue.toFixed(2));
            }, 30);
        }
    });
}

// Run CO2 animation on page load
window.addEventListener('load', () => {
    setTimeout(animateCO2Counter, 500);
});

// Add click animation to buttons
document.querySelectorAll('button').forEach(button => {
    button.addEventListener('click', function(e) {
        // Create ripple effect
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.style.position = 'absolute';
        ripple.style.borderRadius = '50%';
        ripple.style.background = 'rgba(255, 255, 255, 0.5)';
        ripple.style.transform = 'scale(0)';
        ripple.style.animation = 'ripple 0.6s ease-out';
        ripple.style.pointerEvents = 'none';
        
        this.style.position = 'relative';
        this.style.overflow = 'hidden';
        this.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 600);
    });
});

// Add ripple animation
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Simulate real-time order updates
function simulateOrderUpdates() {
    const orderRows = document.querySelectorAll('.orders-table tbody tr');
    
    setInterval(() => {
        if (orderRows.length > 0) {
            const randomRow = orderRows[Math.floor(Math.random() * orderRows.length)];
            const statusBadge = randomRow.querySelector('.status-badge');
            
            if (statusBadge && statusBadge.classList.contains('pending')) {
                // Highlight the row
                randomRow.style.background = 'rgba(79, 70, 229, 0.1)';
                
                setTimeout(() => {
                    statusBadge.classList.remove('pending');
                    statusBadge.classList.add('batched');
                    statusBadge.textContent = 'BATCHED';
                    
                    setTimeout(() => {
                        randomRow.style.background = '';
                    }, 1000);
                }, 500);
            }
        }
    }, 8000);
}

simulateOrderUpdates();

// Add particle effect on theme toggle
themeToggle.addEventListener('click', () => {
    createParticles(themeToggle);
});

function createParticles(element) {
    const rect = element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    for (let i = 0; i < 12; i++) {
        const particle = document.createElement('div');
        particle.style.position = 'fixed';
        particle.style.left = centerX + 'px';
        particle.style.top = centerY + 'px';
        particle.style.width = '6px';
        particle.style.height = '6px';
        particle.style.borderRadius = '50%';
        particle.style.background = 'var(--accent-color)';
        particle.style.pointerEvents = 'none';
        particle.style.zIndex = '9999';
        
        const angle = (Math.PI * 2 * i) / 12;
        const velocity = 100;
        const vx = Math.cos(angle) * velocity;
        const vy = Math.sin(angle) * velocity;
        
        document.body.appendChild(particle);
        
        let posX = 0;
        let posY = 0;
        let opacity = 1;
        
        const animate = () => {
            posX += vx * 0.016;
            posY += vy * 0.016;
            opacity -= 0.02;
            
            particle.style.transform = `translate(${posX}px, ${posY}px)`;
            particle.style.opacity = opacity;
            
            if (opacity > 0) {
                requestAnimationFrame(animate);
            } else {
                particle.remove();
            }
        };
        
        animate();
    }
}

// Console welcome message
console.log('%c🚚 Traffic Congestion Dashboard', 'font-size: 20px; font-weight: bold; color: #4f46e5;');
console.log('%cWelcome to the Logistics Management System', 'font-size: 14px; color: #666;');
console.log('%cFeatures: Real-time tracking, Route optimization, CO2 monitoring', 'font-size: 12px; color: #999;');
