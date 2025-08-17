// Smart Traffic Management System Application
class TrafficManagementSystem {
    constructor() {
        this.currentPage = 'dashboard';
        this.currentStep = 1;
        this.data = this.initializeData();
        this.init();
    }

    // Initialize application data
    initializeData() {
        return {
            devices: [
                {
                    id: "device_001",
                    name: "Junction Main Street",
                    location: "Main St & Oak Ave",
                    lat: 17.385044,
                    lng: 78.486671,
                    status: "online",
                    type: "Traffic Signal Controller",
                    lanes: [
                        {id: "lane_north", name: "North Bound", timer: 45, current_count: 12, status: "green"},
                        {id: "lane_south", name: "South Bound", timer: 35, current_count: 8, status: "red"},
                        {id: "lane_east", name: "East Bound", timer: 30, current_count: 15, status: "red"},
                        {id: "lane_west", name: "West Bound", timer: 25, current_count: 6, status: "yellow"}
                    ]
                },
                {
                    id: "device_002",
                    name: "City Center Junction",
                    location: "1st Ave & Broadway",
                    lat: 17.395044,
                    lng: 78.496671,
                    status: "online",
                    type: "Smart Camera",
                    lanes: [
                        {id: "lane_north_2", name: "North Bound", timer: 40, current_count: 20, status: "red"},
                        {id: "lane_south_2", name: "South Bound", timer: 50, current_count: 25, status: "green"}
                    ]
                },
                {
                    id: "device_003",
                    name: "School Zone Monitor",
                    location: "School Rd & Park Ave",
                    lat: 17.375044,
                    lng: 78.476671,
                    status: "maintenance",
                    type: "Speed Camera",
                    lanes: [
                        {id: "lane_school", name: "School Zone", timer: 60, current_count: 3, status: "green"}
                    ]
                }
            ],
            violations: [
                {
                    id: "viol_001",
                    type: "No Helmet",
                    timestamp: "2025-08-10 19:45:32",
                    location: "Main St Junction",
                    severity: "Medium",
                    license_plate: "TS09AB1234",
                    status: "pending",
                    evidence_photo: "helmet_violation_001.jpg"
                },
                {
                    id: "viol_002",
                    type: "Red Light",
                    timestamp: "2025-08-10 19:38:15",
                    location: "City Center",
                    severity: "High",
                    license_plate: "TS10CD5678",
                    status: "processed",
                    evidence_photo: "red_light_violation_002.jpg"
                },
                {
                    id: "viol_003",
                    type: "Footpath Violation",
                    timestamp: "2025-08-10 19:22:08",
                    location: "Park Avenue",
                    severity: "Low",
                    license_plate: "TS08EF9012",
                    status: "pending",
                    evidence_photo: "footpath_violation_003.jpg"
                }
            ],
            emergency_alerts: [
                {
                    id: "emerg_001",
                    type: "Ambulance Detected",
                    timestamp: "2025-08-10 20:15:45",
                    location: "Main St Junction",
                    status: "active",
                    priority_lane: "lane_north",
                    estimated_arrival: "2 minutes"
                }
            ],
            accidents: [
                {
                    id: "acc_001",
                    timestamp: "2025-08-10 18:30:22",
                    location: "Highway Overpass",
                    severity: "Major",
                    status: "emergency_dispatched",
                    description: "Multi-vehicle collision detected",
                    emergency_services: ["Police", "Ambulance", "Fire Department"]
                }
            ],
            users: [
                {
                    id: "user_001",
                    name: "Traffic Control Officer",
                    email: "officer@traffic.gov.in",
                    role: "Operator",
                    devices_assigned: ["device_001", "device_002"],
                    last_active: "2025-08-10 20:00:00"
                },
                {
                    id: "user_002",
                    name: "System Administrator",
                    email: "admin@traffic.gov.in",
                    role: "Admin",
                    devices_assigned: ["device_001", "device_002", "device_003"],
                    last_active: "2025-08-10 19:45:00"
                }
            ],
            system_stats: {
                total_devices: 3,
                active_devices: 2,
                total_violations_today: 15,
                pending_violations: 8,
                emergency_alerts: 1,
                accidents_today: 1,
                average_response_time: "3.2 minutes"
            }
        };
    }

    // Initialize the application
    init() {
        console.log('Initializing Traffic Management System...');
        this.initializeNavigation();
        this.initializeDashboard();
        this.initializeDevicesPage();
        this.initializeViolationsPage();
        this.initializeEmergencyPage();
        this.initializeAccidentsPage();
        this.initializeUsersPage();
        this.initializeTrafficPage();
        this.initializeSettingsPage();
        this.initializeModal();
        this.startRealTimeUpdates();
        
        // Load initial page content
        this.loadPageContent('dashboard');
        console.log('System initialized successfully');
    }

    // Navigation handling
    initializeNavigation() {
        const navItems = document.querySelectorAll('.nav-item');
        console.log('Found navigation items:', navItems.length);
        
        navItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const page = item.getAttribute('data-page');
                console.log('Navigation clicked:', page);
                this.navigateToPage(page);
            });
        });
    }

    navigateToPage(page) {
        console.log('Navigating to page:', page);
        
        // Update active nav item
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });
        
        const activeNavItem = document.querySelector(`[data-page="${page}"]`);
        if (activeNavItem) {
            activeNavItem.classList.add('active');
        }

        // Update page visibility
        document.querySelectorAll('.page').forEach(pageEl => {
            pageEl.classList.remove('active');
        });
        
        const targetPage = document.getElementById(`${page}-page`);
        if (targetPage) {
            targetPage.classList.add('active');
            console.log(`Page ${page} is now active`);
        } else {
            console.error(`Page ${page}-page not found`);
        }

        // Update breadcrumb
        const pageNames = {
            dashboard: 'Dashboard',
            devices: 'Device Management',
            traffic: 'Traffic Monitoring',
            violations: 'Violations',
            emergency: 'Emergency Management',
            accidents: 'Accident Detection',
            users: 'User Management',
            settings: 'Settings'
        };
        
        const breadcrumb = document.getElementById('current-page');
        if (breadcrumb) {
            breadcrumb.textContent = pageNames[page] || page;
        }
        
        this.currentPage = page;

        // Load page-specific content
        this.loadPageContent(page);
    }

    loadPageContent(page) {
        console.log('Loading content for page:', page);
        
        switch(page) {
            case 'dashboard':
                this.updateDashboardMetrics();
                this.initializeIntersectionView();
                this.loadTrafficMap();
                break;
            case 'devices':
                this.loadDevicesTable();
                break;
            case 'violations':
                this.loadViolationsGrid();
                break;
            case 'emergency':
                this.loadEmergencyAlerts();
                break;
            case 'accidents':
                this.loadAccidentsList();
                break;
            case 'users':
                this.loadUsersTable();
                break;
            case 'traffic':
                this.loadTrafficMonitoring();
                break;
            case 'settings':
                // Settings page is static, no loading needed
                break;
        }
    }

    // Dashboard initialization
    initializeDashboard() {
        this.updateDashboardMetrics();
        this.initializeIntersectionView();
        this.loadTrafficMap();
    }

    updateDashboardMetrics() {
        const stats = this.data.system_stats;
        const totalDevicesEl = document.getElementById('total-devices');
        const activeDevicesEl = document.getElementById('active-devices');
        const pendingViolationsEl = document.getElementById('pending-violations');
        const emergencyAlertsEl = document.getElementById('emergency-alerts');
        
        if (totalDevicesEl) totalDevicesEl.textContent = stats.total_devices;
        if (activeDevicesEl) activeDevicesEl.textContent = stats.active_devices;
        if (pendingViolationsEl) pendingViolationsEl.textContent = stats.pending_violations;
        if (emergencyAlertsEl) emergencyAlertsEl.textContent = stats.emergency_alerts;
    }

    initializeIntersectionView() {
        const mainDevice = this.data.devices[0]; // Main Street Junction
        this.updateIntersectionDisplay(mainDevice);
    }

    updateIntersectionDisplay(device) {
        if (!device || !device.lanes) return;
        
        device.lanes.forEach(lane => {
            const laneEl = document.querySelector(`.lane.${lane.name.toLowerCase().replace(' bound', '')}`);
            if (laneEl) {
                laneEl.setAttribute('data-status', lane.status);
                const vehicleCount = laneEl.querySelector('.vehicle-count');
                const timer = laneEl.querySelector('.timer');
                if (vehicleCount) vehicleCount.textContent = lane.current_count;
                if (timer) timer.textContent = `${lane.timer}s`;
            }
        });
    }

    loadTrafficMap() {
        const mapContainer = document.getElementById('traffic-map');
        if (!mapContainer) return;
        
        // Clear existing markers
        const existingMarkers = mapContainer.querySelectorAll('.device-marker');
        existingMarkers.forEach(marker => marker.remove());
        
        // Simulate device markers on map
        this.data.devices.forEach((device, index) => {
            const marker = document.createElement('div');
            marker.className = 'device-marker';
            marker.style.cssText = `
                position: absolute;
                width: 12px;
                height: 12px;
                border-radius: 50%;
                top: ${30 + index * 60}px;
                left: ${50 + index * 40}px;
                cursor: pointer;
                z-index: 10;
                box-shadow: 0 2px 4px rgba(0,0,0,0.2);
            `;
            
            if (device.status === 'online') {
                marker.style.background = '#4CAF50';
            } else if (device.status === 'maintenance') {
                marker.style.background = '#FF9800';
            } else {
                marker.style.background = '#F44336';
            }
            
            marker.title = `${device.name} - ${device.status}`;
            mapContainer.appendChild(marker);
        });
    }

    // Devices page
    initializeDevicesPage() {
        console.log('Initializing devices page...');
        // Wait for DOM to be ready
        setTimeout(() => {
            const addDeviceBtn = document.getElementById('add-device-btn');
            const deviceSearch = document.getElementById('device-search');
            const statusFilter = document.getElementById('status-filter');

            if (addDeviceBtn) {
                console.log('Add device button found, adding event listener');
                addDeviceBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    console.log('Add device button clicked');
                    this.openAddDeviceModal();
                });
            } else {
                console.log('Add device button not found');
            }

            if (deviceSearch) {
                deviceSearch.addEventListener('input', () => {
                    this.filterDevices();
                });
            }

            if (statusFilter) {
                statusFilter.addEventListener('change', () => {
                    this.filterDevices();
                });
            }
        }, 100);
    }

    loadDevicesTable() {
        const tbody = document.getElementById('devices-tbody');
        if (!tbody) {
            console.log('Devices tbody not found');
            return;
        }

        console.log('Loading devices table...');
        tbody.innerHTML = '';
        
        let filteredDevices = this.data.devices;
        
        // Apply filters
        const searchTerm = document.getElementById('device-search')?.value.toLowerCase() || '';
        const statusFilter = document.getElementById('status-filter')?.value || '';

        if (searchTerm) {
            filteredDevices = filteredDevices.filter(device => 
                device.name.toLowerCase().includes(searchTerm) ||
                device.location.toLowerCase().includes(searchTerm)
            );
        }

        if (statusFilter) {
            filteredDevices = filteredDevices.filter(device => device.status === statusFilter);
        }

        filteredDevices.forEach(device => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${device.name}</td>
                <td>${device.location}</td>
                <td>${device.type}</td>
                <td><span class="status-badge ${device.status}">${device.status}</span></td>
                <td>
                    <button class="btn btn--sm btn--outline" onclick="trafficSystem.editDevice('${device.id}')">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn--sm btn--outline" onclick="trafficSystem.deleteDevice('${device.id}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
            tbody.appendChild(row);
        });
        
        console.log(`Loaded ${filteredDevices.length} devices`);
    }

    filterDevices() {
        this.loadDevicesTable();
    }

    editDevice(deviceId) {
        const device = this.data.devices.find(d => d.id === deviceId);
        if (device) {
            alert(`Edit device: ${device.name}\n(Feature not implemented in demo)`);
        }
    }

    deleteDevice(deviceId) {
        if (confirm('Are you sure you want to delete this device?')) {
            this.data.devices = this.data.devices.filter(d => d.id !== deviceId);
            this.data.system_stats.total_devices = this.data.devices.length;
            this.data.system_stats.active_devices = this.data.devices.filter(d => d.status === 'online').length;
            this.loadDevicesTable();
            this.updateDashboardMetrics();
        }
    }

    // Violations page
    initializeViolationsPage() {
        setTimeout(() => {
            const exportBtn = document.getElementById('export-violations');
            const typeFilter = document.getElementById('violation-type-filter');
            const statusFilter = document.getElementById('violation-status-filter');

            if (exportBtn) {
                exportBtn.addEventListener('click', () => {
                    this.exportViolations();
                });
            }

            if (typeFilter) {
                typeFilter.addEventListener('change', () => {
                    this.filterViolations();
                });
            }

            if (statusFilter) {
                statusFilter.addEventListener('change', () => {
                    this.filterViolations();
                });
            }
        }, 100);
    }

    loadViolationsGrid() {
        const grid = document.getElementById('violations-grid');
        if (!grid) {
            console.log('Violations grid not found');
            return;
        }

        console.log('Loading violations grid...');
        grid.innerHTML = '';
        
        let filteredViolations = this.data.violations;
        
        // Apply filters
        const typeFilter = document.getElementById('violation-type-filter')?.value || '';
        const statusFilter = document.getElementById('violation-status-filter')?.value || '';

        if (typeFilter) {
            filteredViolations = filteredViolations.filter(v => v.type === typeFilter);
        }

        if (statusFilter) {
            filteredViolations = filteredViolations.filter(v => v.status === statusFilter);
        }

        filteredViolations.forEach(violation => {
            const card = document.createElement('div');
            card.className = 'violation-card';
            card.innerHTML = `
                <div class="violation-image">
                    <i class="fas fa-camera"></i>
                </div>
                <div class="violation-details">
                    <div class="violation-type">${violation.type}</div>
                    <div class="violation-meta">
                        <div><strong>License:</strong> ${violation.license_plate}</div>
                        <div><strong>Location:</strong> ${violation.location}</div>
                        <div><strong>Time:</strong> ${this.formatDateTime(violation.timestamp)}</div>
                        <div><strong>Severity:</strong> <span class="status-badge ${violation.severity.toLowerCase()}">${violation.severity}</span></div>
                        <div><strong>Status:</strong> <span class="status-badge ${violation.status}">${violation.status}</span></div>
                    </div>
                </div>
                <div class="violation-actions">
                    <button class="btn btn--sm btn--primary" onclick="trafficSystem.processViolation('${violation.id}')">
                        Process
                    </button>
                    <button class="btn btn--sm btn--secondary" onclick="trafficSystem.viewEvidence('${violation.id}')">
                        View Evidence
                    </button>
                </div>
            `;
            grid.appendChild(card);
        });
        
        console.log(`Loaded ${filteredViolations.length} violations`);
    }

    filterViolations() {
        this.loadViolationsGrid();
    }

    processViolation(violationId) {
        const violation = this.data.violations.find(v => v.id === violationId);
        if (violation) {
            violation.status = 'processed';
            this.data.system_stats.pending_violations = this.data.violations.filter(v => v.status === 'pending').length;
            this.loadViolationsGrid();
            this.updateDashboardMetrics();
            alert(`Violation ${violationId} has been processed.`);
        }
    }

    viewEvidence(violationId) {
        const violation = this.data.violations.find(v => v.id === violationId);
        if (violation) {
            alert(`Viewing evidence for violation: ${violation.type}\nLicense: ${violation.license_plate}\n(Evidence photo would be displayed here)`);
        }
    }

    exportViolations() {
        const csvContent = "data:text/csv;charset=utf-8," 
            + "ID,Type,Timestamp,Location,Severity,License Plate,Status\n"
            + this.data.violations.map(v => 
                `${v.id},${v.type},${v.timestamp},${v.location},${v.severity},${v.license_plate},${v.status}`
            ).join("\n");

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "violations_report.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    // Emergency page
    initializeEmergencyPage() {
        setTimeout(() => {
            const overrideBtn = document.querySelector('.emergency-override');
            const clearPathsBtn = document.querySelector('.clear-paths');

            if (overrideBtn) {
                overrideBtn.addEventListener('click', () => {
                    this.overrideAllSignals();
                });
            }

            if (clearPathsBtn) {
                clearPathsBtn.addEventListener('click', () => {
                    this.clearEmergencyPaths();
                });
            }
        }, 100);
    }

    loadEmergencyAlerts() {
        const alertsList = document.getElementById('emergency-alerts-list');
        if (!alertsList) {
            console.log('Emergency alerts list not found');
            return;
        }

        console.log('Loading emergency alerts...');
        alertsList.innerHTML = '';
        
        this.data.emergency_alerts.forEach(alert => {
            const alertEl = document.createElement('div');
            alertEl.className = 'emergency-alert-item';
            alertEl.innerHTML = `
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                    <strong style="color: #F44336;">${alert.type}</strong>
                    <span class="status-badge ${alert.status}">${alert.status}</span>
                </div>
                <div style="font-size: 14px; color: #666;">
                    <div><strong>Location:</strong> ${alert.location}</div>
                    <div><strong>Priority Lane:</strong> ${alert.priority_lane}</div>
                    <div><strong>ETA:</strong> ${alert.estimated_arrival}</div>
                    <div><strong>Time:</strong> ${this.formatDateTime(alert.timestamp)}</div>
                </div>
                <div style="margin-top: 12px;">
                    <button class="btn btn--sm btn--primary" onclick="trafficSystem.acknowledgeAlert('${alert.id}')">
                        Acknowledge
                    </button>
                    <button class="btn btn--sm btn--secondary" onclick="trafficSystem.clearAlert('${alert.id}')">
                        Clear
                    </button>
                </div>
            `;
            alertsList.appendChild(alertEl);
        });

        // Load priority lanes
        const priorityLanesList = document.getElementById('priority-lanes-list');
        if (priorityLanesList) {
            priorityLanesList.innerHTML = '';
            this.data.devices.forEach(device => {
                device.lanes.forEach(lane => {
                    const laneEl = document.createElement('div');
                    laneEl.style.cssText = 'display: flex; justify-content: space-between; align-items: center; padding: 8px; border: 1px solid #ddd; margin-bottom: 8px; border-radius: 4px;';
                    laneEl.innerHTML = `
                        <span>${device.name} - ${lane.name}</span>
                        <button class="btn btn--sm btn--outline" onclick="trafficSystem.togglePriorityLane('${device.id}', '${lane.id}')">
                            Set Priority
                        </button>
                    `;
                    priorityLanesList.appendChild(laneEl);
                });
            });
        }
        
        console.log(`Loaded ${this.data.emergency_alerts.length} emergency alerts`);
    }

    overrideAllSignals() {
        if (confirm('Override all traffic signals for emergency? This will affect all intersections.')) {
            alert('All traffic signals have been overridden for emergency vehicles.');
            // In a real system, this would send commands to all traffic controllers
        }
    }

    clearEmergencyPaths() {
        if (confirm('Clear all emergency path overrides?')) {
            alert('Emergency path overrides have been cleared. Normal traffic flow resumed.');
        }
    }

    acknowledgeAlert(alertId) {
        const alert = this.data.emergency_alerts.find(a => a.id === alertId);
        if (alert) {
            alert.status = 'acknowledged';
            this.loadEmergencyAlerts();
        }
    }

    clearAlert(alertId) {
        this.data.emergency_alerts = this.data.emergency_alerts.filter(a => a.id !== alertId);
        this.data.system_stats.emergency_alerts = this.data.emergency_alerts.length;
        this.loadEmergencyAlerts();
        this.updateDashboardMetrics();
    }

    togglePriorityLane(deviceId, laneId) {
        alert(`Priority set for lane ${laneId} on device ${deviceId}`);
    }

    // Accidents page
    initializeAccidentsPage() {
        // No specific initialization needed for accidents page
    }

    loadAccidentsList() {
        const accidentsList = document.getElementById('accidents-list');
        if (!accidentsList) {
            console.log('Accidents list not found');
            return;
        }

        console.log('Loading accidents list...');
        accidentsList.innerHTML = '';
        
        this.data.accidents.forEach(accident => {
            const card = document.createElement('div');
            card.className = `accident-card severity-${accident.severity.toLowerCase()}`;
            card.innerHTML = `
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                    <h4 style="margin: 0; color: #F44336;">Accident Report #${accident.id}</h4>
                    <span class="status-badge ${accident.status.replace('_', '-')}">${accident.status.replace('_', ' ')}</span>
                </div>
                <div style="margin-bottom: 16px;">
                    <div><strong>Location:</strong> ${accident.location}</div>
                    <div><strong>Severity:</strong> ${accident.severity}</div>
                    <div><strong>Time:</strong> ${this.formatDateTime(accident.timestamp)}</div>
                    <div><strong>Description:</strong> ${accident.description}</div>
                </div>
                <div style="margin-bottom: 16px;">
                    <strong>Emergency Services Dispatched:</strong>
                    <div style="display: flex; gap: 8px; margin-top: 4px;">
                        ${accident.emergency_services.map(service => 
                            `<span class="status-badge info">${service}</span>`
                        ).join('')}
                    </div>
                </div>
                <div style="display: flex; gap: 8px;">
                    <button class="btn btn--sm btn--primary" onclick="trafficSystem.updateAccident('${accident.id}')">
                        Update Status
                    </button>
                    <button class="btn btn--sm btn--secondary" onclick="trafficSystem.viewAccidentDetails('${accident.id}')">
                        View Details
                    </button>
                </div>
            `;
            accidentsList.appendChild(card);
        });
        
        console.log(`Loaded ${this.data.accidents.length} accidents`);
    }

    updateAccident(accidentId) {
        const accident = this.data.accidents.find(a => a.id === accidentId);
        if (accident) {
            const newStatus = prompt('Enter new status:', accident.status);
            if (newStatus) {
                accident.status = newStatus;
                this.loadAccidentsList();
            }
        }
    }

    viewAccidentDetails(accidentId) {
        const accident = this.data.accidents.find(a => a.id === accidentId);
        if (accident) {
            alert(`Accident Details:\n\nLocation: ${accident.location}\nTime: ${accident.timestamp}\nSeverity: ${accident.severity}\nDescription: ${accident.description}\nStatus: ${accident.status}\nEmergency Services: ${accident.emergency_services.join(', ')}`);
        }
    }

    // Users page
    initializeUsersPage() {
        setTimeout(() => {
            const addUserBtn = document.getElementById('add-user-btn');
            if (addUserBtn) {
                addUserBtn.addEventListener('click', () => {
                    this.addUser();
                });
            }
        }, 100);
    }

    loadUsersTable() {
        const tbody = document.getElementById('users-tbody');
        if (!tbody) {
            console.log('Users tbody not found');
            return;
        }

        console.log('Loading users table...');
        tbody.innerHTML = '';
        
        this.data.users.forEach(user => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${user.name}</td>
                <td>${user.email}</td>
                <td><span class="status-badge ${user.role.toLowerCase()}">${user.role}</span></td>
                <td>${user.devices_assigned.length} devices</td>
                <td>${this.formatDateTime(user.last_active)}</td>
                <td>
                    <button class="btn btn--sm btn--outline" onclick="trafficSystem.editUser('${user.id}')">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn--sm btn--outline" onclick="trafficSystem.deleteUser('${user.id}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
            tbody.appendChild(row);
        });
        
        console.log(`Loaded ${this.data.users.length} users`);
    }

    addUser() {
        const name = prompt('Enter user name:');
        const email = prompt('Enter user email:');
        const role = prompt('Enter user role (Admin/Operator):');
        
        if (name && email && role) {
            const newUser = {
                id: `user_${Date.now()}`,
                name,
                email,
                role,
                devices_assigned: [],
                last_active: new Date().toISOString().slice(0, 19).replace('T', ' ')
            };
            this.data.users.push(newUser);
            this.loadUsersTable();
        }
    }

    editUser(userId) {
        const user = this.data.users.find(u => u.id === userId);
        if (user) {
            alert(`Edit user: ${user.name}\n(Feature not implemented in demo)`);
        }
    }

    deleteUser(userId) {
        if (confirm('Are you sure you want to delete this user?')) {
            this.data.users = this.data.users.filter(u => u.id !== userId);
            this.loadUsersTable();
        }
    }

    // Traffic monitoring page
    initializeTrafficPage() {
        // Initialize traffic monitoring features
    }

    loadTrafficMonitoring() {
        console.log('Loading traffic monitoring...');
        this.loadTrafficDensityChart();
        this.loadSignalControls();
    }

    loadTrafficDensityChart() {
        const chartContainer = document.getElementById('traffic-density-chart');
        if (!chartContainer) return;

        chartContainer.innerHTML = `
            <div style="height: 300px; display: flex; align-items: center; justify-content: center; background: #f5f5f5; border-radius: 8px;">
                <div style="text-align: center; color: #666;">
                    <i class="fas fa-chart-bar" style="font-size: 48px; margin-bottom: 16px;"></i>
                    <p>Traffic Density Chart<br><small>Real-time data visualization would be displayed here</small></p>
                </div>
            </div>
        `;
    }

    loadSignalControls() {
        const controlsGrid = document.getElementById('signal-controls');
        if (!controlsGrid) return;

        console.log('Loading signal controls...');
        controlsGrid.innerHTML = '';
        
        this.data.devices.filter(d => d.type === 'Traffic Signal Controller').forEach(device => {
            const controlPanel = document.createElement('div');
            controlPanel.style.cssText = 'border: 1px solid #ddd; padding: 16px; border-radius: 8px; margin-bottom: 16px;';
            controlPanel.innerHTML = `
                <h4 style="margin: 0 0 12px 0;">${device.name}</h4>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 8px;">
                    ${device.lanes.map(lane => `
                        <div style="text-align: center; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
                            <div style="font-size: 12px; font-weight: 500;">${lane.name}</div>
                            <div style="font-size: 18px; font-weight: bold; color: ${this.getStatusColor(lane.status)};">
                                ${lane.timer}s
                            </div>
                            <button class="btn btn--sm btn--outline" onclick="trafficSystem.adjustTimer('${device.id}', '${lane.id}')" style="margin-top: 4px;">
                                Adjust
                            </button>
                        </div>
                    `).join('')}
                </div>
            `;
            controlsGrid.appendChild(controlPanel);
        });
    }

    getStatusColor(status) {
        switch(status) {
            case 'green': return '#4CAF50';
            case 'yellow': return '#FF9800';
            case 'red': return '#F44336';
            default: return '#666';
        }
    }

    adjustTimer(deviceId, laneId) {
        const device = this.data.devices.find(d => d.id === deviceId);
        const lane = device?.lanes.find(l => l.id === laneId);
        if (lane) {
            const newTimer = prompt(`Enter new timer value for ${lane.name}:`, lane.timer);
            if (newTimer && !isNaN(newTimer)) {
                lane.timer = parseInt(newTimer);
                this.loadSignalControls();
                alert(`Timer updated for ${lane.name}: ${newTimer}s`);
            }
        }
    }

    // Settings page
    initializeSettingsPage() {
        setTimeout(() => {
            const saveConfigBtns = document.querySelectorAll('.settings-section .btn--primary');
            saveConfigBtns.forEach(btn => {
                btn.addEventListener('click', () => {
                    alert('Configuration saved successfully!');
                });
            });
        }, 100);
    }

    // Modal functionality
    initializeModal() {
        console.log('Initializing modal...');
        
        setTimeout(() => {
            const modal = document.getElementById('add-device-modal');
            const closeBtn = document.querySelector('.modal-close');
            const prevBtn = document.getElementById('prev-step');
            const nextBtn = document.getElementById('next-step');
            const saveBtn = document.getElementById('save-device');

            if (closeBtn) {
                closeBtn.addEventListener('click', () => {
                    this.closeModal();
                });
            }

            if (prevBtn) {
                prevBtn.addEventListener('click', () => {
                    this.prevStep();
                });
            }

            if (nextBtn) {
                nextBtn.addEventListener('click', () => {
                    this.nextStep();
                });
            }

            if (saveBtn) {
                saveBtn.addEventListener('click', () => {
                    this.saveDevice();
                });
            }

            // Close modal when clicking outside
            if (modal) {
                modal.addEventListener('click', (e) => {
                    if (e.target === modal) {
                        this.closeModal();
                    }
                });
            }

            // Initialize lanes count selector
            const lanesCount = document.getElementById('lanes-count');
            if (lanesCount) {
                lanesCount.addEventListener('change', () => {
                    this.updateLanesConfig();
                });
            }
            
            console.log('Modal initialized');
        }, 100);
    }

    openAddDeviceModal() {
        console.log('Opening add device modal...');
        const modal = document.getElementById('add-device-modal');
        if (modal) {
            modal.classList.remove('hidden');
            this.currentStep = 1;
            this.updateModalStep();
            console.log('Modal opened');
        } else {
            console.error('Modal not found');
        }
    }

    closeModal() {
        const modal = document.getElementById('add-device-modal');
        if (modal) {
            modal.classList.add('hidden');
            this.resetModalForm();
        }
    }

    nextStep() {
        if (this.currentStep < 3) {
            this.currentStep++;
            this.updateModalStep();
        }
    }

    prevStep() {
        if (this.currentStep > 1) {
            this.currentStep--;
            this.updateModalStep();
        }
    }

    updateModalStep() {
        // Update step indicators
        document.querySelectorAll('.step').forEach((step, index) => {
            step.classList.toggle('active', index + 1 === this.currentStep);
        });

        // Update step panels
        document.querySelectorAll('.step-panel').forEach((panel, index) => {
            panel.classList.toggle('active', index + 1 === this.currentStep);
        });

        // Update buttons
        const prevBtn = document.getElementById('prev-step');
        const nextBtn = document.getElementById('next-step');
        const saveBtn = document.getElementById('save-device');

        if (prevBtn) prevBtn.style.display = this.currentStep === 1 ? 'none' : 'inline-flex';
        if (nextBtn) nextBtn.style.display = this.currentStep === 3 ? 'none' : 'inline-flex';
        if (saveBtn) saveBtn.style.display = this.currentStep === 3 ? 'inline-flex' : 'none';

        // Update lanes configuration for step 3
        if (this.currentStep === 3) {
            this.updateLanesConfig();
        }
    }

    updateLanesConfig() {
        const lanesCount = document.getElementById('lanes-count')?.value || '2';
        const lanesConfig = document.getElementById('lanes-config');
        if (!lanesConfig) return;

        lanesConfig.innerHTML = '';
        
        const laneNames = {
            '2': ['North Bound', 'South Bound'],
            '4': ['North Bound', 'South Bound', 'East Bound', 'West Bound'],
            '6': ['North Bound', 'South Bound', 'East Bound', 'West Bound', 'North Right', 'South Right']
        };

        laneNames[lanesCount].forEach((name, index) => {
            const laneDiv = document.createElement('div');
            laneDiv.className = 'form-group';
            laneDiv.innerHTML = `
                <label class="form-label">Lane ${index + 1}: ${name}</label>
                <input type="number" class="form-control" placeholder="Default timer (seconds)" value="60">
            `;
            lanesConfig.appendChild(laneDiv);
        });
    }

    saveDevice() {
        const deviceName = document.getElementById('device-name')?.value;
        const deviceType = document.getElementById('device-type')?.value;
        const deviceLocation = document.getElementById('device-location')?.value;
        const deviceLat = document.getElementById('device-lat')?.value;
        const deviceLng = document.getElementById('device-lng')?.value;

        if (!deviceName || !deviceLocation) {
            alert('Please fill in all required fields.');
            return;
        }

        const newDevice = {
            id: `device_${Date.now()}`,
            name: deviceName,
            location: deviceLocation,
            lat: parseFloat(deviceLat) || 17.385044,
            lng: parseFloat(deviceLng) || 78.486671,
            status: 'online',
            type: deviceType,
            lanes: []
        };

        // Add lanes based on configuration
        const lanesInputs = document.querySelectorAll('#lanes-config input');
        const laneNames = document.querySelectorAll('#lanes-config label');
        
        lanesInputs.forEach((input, index) => {
            const laneName = laneNames[index]?.textContent.split(': ')[1] || `Lane ${index + 1}`;
            newDevice.lanes.push({
                id: `lane_${newDevice.id}_${index}`,
                name: laneName,
                timer: parseInt(input.value) || 60,
                current_count: 0,
                status: 'red'
            });
        });

        this.data.devices.push(newDevice);
        this.data.system_stats.total_devices = this.data.devices.length;
        this.data.system_stats.active_devices = this.data.devices.filter(d => d.status === 'online').length;
        
        this.closeModal();
        
        if (this.currentPage === 'devices') {
            this.loadDevicesTable();
        }
        
        this.updateDashboardMetrics();
        alert('Device added successfully!');
    }

    resetModalForm() {
        const inputs = document.querySelectorAll('#add-device-modal input, #add-device-modal select');
        inputs.forEach(input => {
            if (input.type === 'number') {
                input.value = '';
            } else {
                input.value = '';
            }
        });
        this.currentStep = 1;
        this.updateModalStep();
    }

    // Real-time updates simulation
    startRealTimeUpdates() {
        console.log('Starting real-time updates...');
        
        // Update intersection timers every second
        setInterval(() => {
            this.updateIntersectionTimers();
        }, 1000);

        // Update vehicle counts every 5 seconds
        setInterval(() => {
            this.updateVehicleCounts();
        }, 5000);
    }

    updateIntersectionTimers() {
        const mainDevice = this.data.devices[0];
        if (mainDevice && mainDevice.lanes) {
            mainDevice.lanes.forEach(lane => {
                if (lane.timer > 0) {
                    lane.timer--;
                } else {
                    // Reset timer and potentially change status
                    lane.timer = Math.floor(Math.random() * 60) + 30;
                    const statuses = ['green', 'yellow', 'red'];
                    lane.status = statuses[Math.floor(Math.random() * statuses.length)];
                }
            });
            
            if (this.currentPage === 'dashboard') {
                this.updateIntersectionDisplay(mainDevice);
            }
        }
    }

    updateVehicleCounts() {
        this.data.devices.forEach(device => {
            if (device.lanes) {
                device.lanes.forEach(lane => {
                    // Simulate vehicle count changes
                    const change = Math.floor(Math.random() * 6) - 3; // -3 to +3
                    lane.current_count = Math.max(0, lane.current_count + change);
                });
            }
        });

        if (this.currentPage === 'dashboard') {
            this.updateIntersectionDisplay(this.data.devices[0]);
        } else if (this.currentPage === 'traffic') {
            this.loadSignalControls();
        }
    }

    // Utility methods
    formatDateTime(dateString) {
        const date = new Date(dateString);
        return date.toLocaleString();
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing system...');
    window.trafficSystem = new TrafficManagementSystem();
});

// Export for global access
window.TrafficManagementSystem = TrafficManagementSystem;