// mockData.js
// This represents the EXACT data contract that the backend will eventually fulfill.

export const mockDashboardData = {
    kpi: {
        totalActiveUsers: { current: 1420, trend: [1200, 1250, 1300, 1380, 1420, 1400, 1420] },
        totalSessionsToday: { current: 3640, trend: [2000, 2400, 2900, 3100, 3400, 3600, 3640] },
        failedLoginAttempts: { current: 184, trend: [40, 45, 120, 150, 175, 180, 184] },
        detectedAnomalies: { current: 12, trend: [2, 3, 3, 5, 8, 10, 12] },
        averageRiskScore: { current: 24, trend: [15, 18, 20, 22, 23, 24, 24] } // Scale 0-100
    },
    activityTrend: [
        { time: '00:00', successfulLogins: 45, failedLogins: 2, checkouts: 12 },
        { time: '04:00', successfulLogins: 20, failedLogins: 12, checkouts: 5 },
        { time: '08:00', successfulLogins: 350, failedLogins: 15, checkouts: 45 },
        { time: '12:00', successfulLogins: 420, failedLogins: 25, checkouts: 85 },
        { time: '16:00', successfulLogins: 580, failedLogins: 40, checkouts: 120 },
        { time: '20:00', successfulLogins: 610, failedLogins: 60, checkouts: 140 },
        { time: '24:00', successfulLogins: 320, failedLogins: 30, checkouts: 50 },
    ],
    riskDistribution: [
        { name: 'Low Risk (0-30)', count: 8500, color: '#22c55e' },
        { name: 'Medium Risk (31-70)', count: 1200, color: '#f59e0b' },
        { name: 'High Risk (71-100)', count: 145, color: '#ef4444' },
    ],
    alerts: [
        { id: 1, time: '2 mins ago', type: 'RAPID_REQUEST_PATTERN', risk: 'HIGH', user: 'vikram.blocked@nutri.co', ip: '192.168.1.105', description: 'Triggered 15 checkouts in 60 seconds.' },
        { id: 2, time: '14 mins ago', type: 'MULTIPLE_FAILED_ATTEMPTS', risk: 'HIGH', user: 'unknown', ip: '203.0.113.42', description: '5 failed login attempts.' },
        { id: 3, time: '1 hr ago', type: 'NEW_DEVICE_LOGIN', risk: 'MED', user: 'sneha.cooldown@nutri.co', ip: '114.143.205.1', description: 'Login from new device: iPhone 14 Pro.' },
        { id: 4, time: '3 hrs ago', type: 'UNUSUAL_LOGIN_TIME', risk: 'MED', user: 'arjun.highrisk@nutri.co', ip: '45.22.19.88', description: 'Login at 3:14 AM local time.' },
        { id: 5, time: '5 hrs ago', type: 'MULTIPLE_GEO_LOCATIONS', risk: 'HIGH', user: 'mallikarjuna@test.com', ip: '198.51.100.14', description: 'Logins from IND and USA within 2 hours.' },
    ],
    clickstream: [
        { source: 'Home', target: 'Products', value: 5000 },
        { source: 'Products', target: 'Product Detail', value: 3500 },
        { source: 'Product Detail', target: 'Cart', value: 1200 },
        { source: 'Cart', target: 'Checkout', value: 800 },
        { source: 'Checkout', target: 'Success', value: 650 },

        // Anomalous paths
        { source: 'Home', target: 'Checkout', value: 50 }, // Bypassing normal flow
        { source: 'Cart', target: 'Login Failed', value: 120 },
    ],
    sessionAnalytics: {
        devices: [
            { name: 'Desktop (Windows)', value: 45, fill: '#3b82f6' },
            { name: 'Desktop (Mac)', value: 25, fill: '#8b5cf6' },
            { name: 'Mobile (iOS)', value: 20, fill: '#ec4899' },
            { name: 'Mobile (Android)', value: 10, fill: '#14b8a6' },
        ],
        duration: [
            { range: '0-5m', users: 1200 },
            { range: '5-15m', users: 800 },
            { range: '15-30m', users: 450 },
            { range: '30m-1h', users: 200 },
            { range: '1h+', users: 50 },
        ]
    }
};
