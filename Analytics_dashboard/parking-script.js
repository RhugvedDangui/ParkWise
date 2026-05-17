// Theme Toggle
const themeToggle = document.getElementById('themeToggle');
const body = document.body;

themeToggle.addEventListener('click', () => {
    body.classList.toggle('dark-mode');
    
    const icon = themeToggle.querySelector('i');
    if (body.classList.contains('dark-mode')) {
        icon.className = 'fas fa-moon';
    } else {
        icon.className = 'fas fa-sun';
    }
    
    localStorage.setItem('theme', body.classList.contains('dark-mode') ? 'dark' : 'light');
    
    // Redraw all charts with new theme
    drawAllCharts();
    createParticles(themeToggle);
});

// Load saved theme
window.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        body.classList.remove('dark-mode');
        themeToggle.querySelector('i').className = 'fas fa-sun';
    }
});

// Hardcoded Random Data for Charts
const chartData = {
    today: {
        labels: ['12 AM', '2 AM', '4 AM', '6 AM', '8 AM', '10 AM', '12 PM', '2 PM', '4 PM', '6 PM', '8 PM', '10 PM'],
        traffic: [15, 8, 5, 12, 45, 78, 85, 92, 88, 95, 72, 35],
        occupied: [120, 85, 45, 98, 280, 350, 380, 410, 395, 425, 320, 180],
        available: [330, 365, 405, 352, 170, 100, 70, 40, 55, 25, 130, 270]
    },
    week: {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        traffic: [65, 72, 68, 75, 82, 58, 45],
        occupied: [290, 320, 305, 335, 370, 260, 200],
        available: [160, 130, 145, 115, 80, 190, 250]
    },
    month: {
        labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
        traffic: [68, 75, 72, 78],
        occupied: [305, 335, 320, 350],
        available: [145, 115, 130, 100]
    }
};

const peakHoursData = [12, 8, 5, 15, 52, 85, 95, 105, 98, 110, 88, 65, 72, 85, 92, 98, 102, 115, 95, 78, 55, 42, 28, 18];
const zoneData = {
    labels: ['Zone A', 'Zone B', 'Zone C', 'Zone D', 'Zone E'],
    congestion: [85, 62, 35, 78, 58]
};

let currentPeriod = 'today';

// Get theme colors
function getThemeColors() {
    const style = getComputedStyle(document.body);
    return {
        accent: style.getPropertyValue('--accent-color').trim(),
        success: style.getPropertyValue('--success-color').trim(),
        warning: style.getPropertyValue('--warning-color').trim(),
        danger: style.getPropertyValue('--danger-color').trim(),
        textPrimary: style.getPropertyValue('--text-primary').trim(),
        textSecondary: style.getPropertyValue('--text-secondary').trim(),
        bgSecondary: style.getPropertyValue('--bg-secondary').trim()
    };
}

// Traffic Congestion Chart
function drawTrafficChart() {
    const canvas = document.getElementById('trafficChart');
    const ctx = canvas.getContext('2d');
    const colors = getThemeColors();
    
    canvas.width = canvas.offsetWidth;
    canvas.height = 300;
    
    const data = chartData[currentPeriod].traffic;
    const labels = chartData[currentPeriod].labels;
    const maxValue = Math.max(...data);
    const padding = 50;
    const chartWidth = canvas.width - padding * 2;
    const chartHeight = canvas.height - padding * 2;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw grid
    ctx.strokeStyle = colors.textSecondary;
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
    
    // Draw area gradient
    const gradient = ctx.createLinearGradient(0, padding, 0, canvas.height - padding);
    gradient.addColorStop(0, colors.danger + '60');
    gradient.addColorStop(0.5, colors.warning + '40');
    gradient.addColorStop(1, colors.success + '20');
    
    ctx.beginPath();
    ctx.moveTo(padding, canvas.height - padding);
    
    data.forEach((value, index) => {
        const x = padding + (chartWidth / (data.length - 1)) * index;
        const y = canvas.height - padding - (value / maxValue) * chartHeight;
        
        if (index === 0) {
            ctx.lineTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    });
    
    ctx.lineTo(canvas.width - padding, canvas.height - padding);
    ctx.closePath();
    ctx.fillStyle = gradient;
    ctx.fill();
    
    // Draw line
    ctx.strokeStyle = colors.danger;
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
    
    // Draw points
    data.forEach((value, index) => {
        const x = padding + (chartWidth / (data.length - 1)) * index;
        const y = canvas.height - padding - (value / maxValue) * chartHeight;
        
        ctx.beginPath();
        ctx.arc(x, y, 5, 0, Math.PI * 2);
        ctx.fillStyle = colors.danger;
        ctx.fill();
        ctx.strokeStyle = colors.bgSecondary;
        ctx.lineWidth = 2;
        ctx.stroke();
    });
    
    // Draw labels
    ctx.fillStyle = colors.textSecondary;
    ctx.font = '12px sans-serif';
    ctx.textAlign = 'center';
    
    labels.forEach((label, index) => {
        const x = padding + (chartWidth / (labels.length - 1)) * index;
        ctx.fillText(label, x, canvas.height - 20);
    });
    
    // Draw Y-axis values
    ctx.textAlign = 'right';
    for (let i = 0; i <= 5; i++) {
        const value = Math.round((maxValue / 5) * (5 - i));
        const y = padding + (chartHeight / 5) * i;
        ctx.fillText(value + '%', padding - 10, y + 5);
    }
}

// Parking Occupancy Chart
function drawOccupancyChart() {
    const canvas = document.getElementById('occupancyChart');
    const ctx = canvas.getContext('2d');
    const colors = getThemeColors();
    
    canvas.width = canvas.offsetWidth;
    canvas.height = 300;
    
    const occupiedData = chartData[currentPeriod].occupied;
    const availableData = chartData[currentPeriod].available;
    const labels = chartData[currentPeriod].labels;
    const maxValue = 450;
    const padding = 50;
    const chartWidth = canvas.width - padding * 2;
    const chartHeight = canvas.height - padding * 2;
    const barWidth = chartWidth / labels.length / 2.5;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw grid
    ctx.strokeStyle = colors.textSecondary;
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
    
    // Draw bars
    labels.forEach((label, index) => {
        const x = padding + (chartWidth / labels.length) * index + (chartWidth / labels.length - barWidth * 2) / 2;
        
        // Occupied bar
        const occupiedHeight = (occupiedData[index] / maxValue) * chartHeight;
        const occupiedY = canvas.height - padding - occupiedHeight;
        
        ctx.fillStyle = colors.accent;
        ctx.fillRect(x, occupiedY, barWidth, occupiedHeight);
        
        // Available bar
        const availableHeight = (availableData[index] / maxValue) * chartHeight;
        const availableY = canvas.height - padding - availableHeight;
        
        ctx.fillStyle = colors.success;
        ctx.fillRect(x + barWidth + 5, availableY, barWidth, availableHeight);
    });
    
    // Draw labels
    ctx.fillStyle = colors.textSecondary;
    ctx.font = '12px sans-serif';
    ctx.textAlign = 'center';
    
    labels.forEach((label, index) => {
        const x = padding + (chartWidth / labels.length) * index + (chartWidth / labels.length) / 2;
        ctx.fillText(label, x, canvas.height - 20);
    });
    
    // Draw Y-axis values
    ctx.textAlign = 'right';
    for (let i = 0; i <= 5; i++) {
        const value = Math.round((maxValue / 5) * (5 - i));
        const y = padding + (chartHeight / 5) * i;
        ctx.fillText(value, padding - 10, y + 5);
    }
}

// Peak Hours Chart
function drawPeakHoursChart() {
    const canvas = document.getElementById('peakHoursChart');
    const ctx = canvas.getContext('2d');
    const colors = getThemeColors();
    
    canvas.width = canvas.offsetWidth;
    canvas.height = 300;
    
    const data = peakHoursData;
    const maxValue = Math.max(...data);
    const padding = 50;
    const chartWidth = canvas.width - padding * 2;
    const chartHeight = canvas.height - padding * 2;
    const barWidth = chartWidth / data.length * 0.7;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw grid
    ctx.strokeStyle = colors.textSecondary;
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
    
    // Draw bars with gradient
    data.forEach((value, index) => {
        const x = padding + (chartWidth / data.length) * index + (chartWidth / data.length - barWidth) / 2;
        const barHeight = (value / maxValue) * chartHeight;
        const y = canvas.height - padding - barHeight;
        
        const gradient = ctx.createLinearGradient(x, y, x, canvas.height - padding);
        
        if (value > 90) {
            gradient.addColorStop(0, colors.danger);
            gradient.addColorStop(1, colors.danger + '80');
        } else if (value > 60) {
            gradient.addColorStop(0, colors.warning);
            gradient.addColorStop(1, colors.warning + '80');
        } else {
            gradient.addColorStop(0, colors.success);
            gradient.addColorStop(1, colors.success + '80');
        }
        
        ctx.fillStyle = gradient;
        ctx.fillRect(x, y, barWidth, barHeight);
    });
    
    // Draw hour labels
    ctx.fillStyle = colors.textSecondary;
    ctx.font = '10px sans-serif';
    ctx.textAlign = 'center';
    
    for (let i = 0; i < 24; i += 3) {
        const x = padding + (chartWidth / data.length) * i + (chartWidth / data.length) / 2;
        ctx.fillText(i + ':00', x, canvas.height - 20);
    }
    
    // Draw Y-axis values
    ctx.textAlign = 'right';
    for (let i = 0; i <= 5; i++) {
        const value = Math.round((maxValue / 5) * (5 - i));
        const y = padding + (chartHeight / 5) * i;
        ctx.fillText(value, padding - 10, y + 5);
    }
}

// Zone Congestion Chart (Doughnut)
function drawZoneChart() {
    const canvas = document.getElementById('zoneChart');
    const ctx = canvas.getContext('2d');
    const colors = getThemeColors();
    
    canvas.width = canvas.offsetWidth;
    canvas.height = 300;
    
    const data = zoneData.congestion;
    const labels = zoneData.labels;
    const total = data.reduce((a, b) => a + b, 0);
    
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) - 60;
    const innerRadius = radius * 0.6;
    
    const zoneColors = [colors.danger, colors.warning, colors.success, colors.danger, colors.warning];
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    let currentAngle = -Math.PI / 2;
    
    // Draw doughnut segments
    data.forEach((value, index) => {
        const sliceAngle = (value / total) * Math.PI * 2;
        
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + sliceAngle);
        ctx.arc(centerX, centerY, innerRadius, currentAngle + sliceAngle, currentAngle, true);
        ctx.closePath();
        
        ctx.fillStyle = zoneColors[index];
        ctx.fill();
        
        // Draw label
        const labelAngle = currentAngle + sliceAngle / 2;
        const labelX = centerX + Math.cos(labelAngle) * (radius + 30);
        const labelY = centerY + Math.sin(labelAngle) * (radius + 30);
        
        ctx.fillStyle = colors.textPrimary;
        ctx.font = '14px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(labels[index], labelX, labelY);
        ctx.font = '12px sans-serif';
        ctx.fillStyle = colors.textSecondary;
        ctx.fillText(value + '%', labelX, labelY + 18);
        
        currentAngle += sliceAngle;
    });
    
    // Draw center text
    ctx.fillStyle = colors.textPrimary;
    ctx.font = 'bold 24px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Zones', centerX, centerY - 10);
    ctx.font = '14px sans-serif';
    ctx.fillStyle = colors.textSecondary;
    ctx.fillText('Congestion', centerX, centerY + 15);
}

// Draw all charts
function drawAllCharts() {
    drawTrafficChart();
    drawOccupancyChart();
    drawPeakHoursChart();
    drawZoneChart();
}

// Period buttons
document.querySelectorAll('.chart-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.chart-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentPeriod = btn.getAttribute('data-period');
        drawTrafficChart();
        drawOccupancyChart();
    });
});

// Particle effect
function createParticles(element) {
    const rect = element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    for (let i = 0; i < 15; i++) {
        const particle = document.createElement('div');
        particle.style.position = 'fixed';
        particle.style.left = centerX + 'px';
        particle.style.top = centerY + 'px';
        particle.style.width = '8px';
        particle.style.height = '8px';
        particle.style.borderRadius = '50%';
        particle.style.background = 'var(--accent-color)';
        particle.style.pointerEvents = 'none';
        particle.style.zIndex = '9999';
        
        const angle = (Math.PI * 2 * i) / 15;
        const velocity = 120;
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

// Animate stats on load
function animateStats() {
    document.querySelectorAll('.stat-value').forEach(stat => {
        const text = stat.textContent;
        const match = text.match(/\d+/);
        
        if (match) {
            const target = parseInt(match[0]);
            let current = 0;
            const increment = target / 50;
            
            const counter = setInterval(() => {
                current += increment;
                if (current >= target) {
                    current = target;
                    clearInterval(counter);
                }
                stat.textContent = text.replace(/\d+/, Math.floor(current));
            }, 30);
        }
    });
}

// Simulate real-time updates
function simulateRealTimeUpdates() {
    setInterval(() => {
        // Update zone bars randomly
        document.querySelectorAll('.zone-fill').forEach(fill => {
            const currentWidth = parseInt(fill.style.width);
            const change = Math.floor(Math.random() * 6) - 3;
            const newWidth = Math.max(10, Math.min(95, currentWidth + change));
            fill.style.width = newWidth + '%';
            
            // Update color based on congestion
            if (newWidth > 75) {
                fill.style.background = '#ef4444';
            } else if (newWidth > 50) {
                fill.style.background = '#f59e0b';
            } else {
                fill.style.background = '#10b981';
            }
        });
    }, 3000);
}

// Initialize
window.addEventListener('load', () => {
    drawAllCharts();
    animateStats();
    simulateRealTimeUpdates();
});

// Redraw charts on resize
window.addEventListener('resize', () => {
    drawAllCharts();
});

// Intersection Observer for scroll animations
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('.floating-card').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(card);
});

console.log('%c🅿️ Smart Parking Dashboard', 'font-size: 20px; font-weight: bold; color: #4f46e5;');
console.log('%cReal-time traffic congestion monitoring system', 'font-size: 14px; color: #666;');
