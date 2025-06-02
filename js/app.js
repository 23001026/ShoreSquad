// ShoreSquad Application JavaScript
class ShoreSquadApp {
    constructor() {
        this.map = null;
        this.userLocation = null;
        this.events = [];
        this.weatherData = null;
        
        this.init();
    }

    // Initialize the application
    init() {
        this.setupEventListeners();
        this.initializeMap();
        this.loadWeatherData();
        this.loadEvents();
        this.setupMobileNavigation();
        this.setupSmoothScrolling();
    }

    // Setup event listeners
    setupEventListeners() {
        // Navigation CTAs
        document.getElementById('startCleanupBtn')?.addEventListener('click', this.startCleanup.bind(this));
        document.getElementById('findCrewBtn')?.addEventListener('click', this.findCrew.bind(this));
        document.getElementById('joinSquadBtn')?.addEventListener('click', this.joinSquad.bind(this));
        document.getElementById('createEventBtn')?.addEventListener('click', this.createEvent.bind(this));
        
        // Map controls
        document.getElementById('currentLocationBtn')?.addEventListener('click', this.goToCurrentLocation.bind(this));
        document.getElementById('filterBtn')?.addEventListener('click', this.toggleFilter.bind(this));
        
        // Event cards
        document.querySelectorAll('.join-event-btn').forEach(btn => {
            btn.addEventListener('click', this.joinEvent.bind(this));
        });
    }

    // Setup mobile navigation
    setupMobileNavigation() {
        const hamburger = document.querySelector('.hamburger');
        const navMenu = document.querySelector('.nav-menu');

        hamburger?.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Close mobile menu when clicking on a nav link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }

    // Setup smooth scrolling for navigation
    setupSmoothScrolling() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    // Initialize the map
    initializeMap() {
        try {
            // Default to Los Angeles area
            const defaultLocation = [34.0522, -118.2437];
            
            this.map = L.map('cleanupMap').setView(defaultLocation, 10);
            
            // Add tile layer
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© OpenStreetMap contributors'
            }).addTo(this.map);

            // Add sample cleanup locations
            this.addSampleLocations();
            
            // Try to get user's location
            this.getCurrentLocation();
            
        } catch (error) {
            console.error('Error initializing map:', error);
            this.showNotification('Map could not be loaded', 'error');
        }
    }

    // Add sample cleanup locations to the map
    addSampleLocations() {
        const sampleLocations = [
            {
                name: "Santa Monica Beach",
                coords: [34.0195, -118.4912],
                description: "Popular beach cleanup spot",
                nextEvent: "June 15, 2025"
            },
            {
                name: "Venice Beach",
                coords: [33.9850, -118.4695],
                description: "Weekly cleanup events",
                nextEvent: "June 12, 2025"
            },
            {
                name: "Manhattan Beach",
                coords: [33.8845, -118.4085],
                description: "Family-friendly cleanups",
                nextEvent: "June 18, 2025"
            },
            {
                name: "Redondo Beach",
                coords: [33.8439, -118.3901],
                description: "Large group events",
                nextEvent: "June 20, 2025"
            }
        ];

        sampleLocations.forEach(location => {
            const marker = L.marker(location.coords).addTo(this.map);
            
            const popupContent = `
                <div class="map-popup">
                    <h3>${location.name}</h3>
                    <p>${location.description}</p>
                    <p><strong>Next Event:</strong> ${location.nextEvent}</p>
                    <button class="btn btn-sm btn-primary" onclick="app.joinLocationEvent('${location.name}')">
                        Join Cleanup
                    </button>
                </div>
            `;
            
            marker.bindPopup(popupContent);
        });
    }

    // Get user's current location
    getCurrentLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    this.userLocation = [position.coords.latitude, position.coords.longitude];
                    this.showUserLocation();
                },
                (error) => {
                    console.log('Location access denied or unavailable');
                }
            );
        }
    }

    // Show user's location on map
    showUserLocation() {
        if (this.userLocation && this.map) {
            const userMarker = L.marker(this.userLocation, {
                icon: L.divIcon({
                    className: 'user-location-marker',
                    html: '<i class="fas fa-user-circle"></i>',
                    iconSize: [20, 20]
                })
            }).addTo(this.map);
            
            userMarker.bindPopup("You are here!");
        }
    }

    // Go to user's current location
    goToCurrentLocation() {
        if (this.userLocation && this.map) {
            this.map.setView(this.userLocation, 15);
            this.showNotification('Centered on your location', 'success');
        } else {
            this.getCurrentLocation();
            this.showNotification('Getting your location...', 'info');
        }
    }

    // Load weather data
    async loadWeatherData() {
        try {
            // In a real app, you would fetch from a weather API
            // For demo purposes, we'll use mock data
            const mockWeatherData = {
                temperature: 72,
                condition: "Sunny",
                windSpeed: 8,
                visibility: "Clear",
                uvIndex: 6,
                recommendation: "Perfect conditions for beach cleanup!"
            };

            this.weatherData = mockWeatherData;
            this.displayWeather();
            
        } catch (error) {
            console.error('Error loading weather data:', error);
            this.displayWeatherError();
        }
    }

    // Display weather information
    displayWeather() {
        const weatherContent = document.getElementById('weatherContent');
        if (weatherContent && this.weatherData) {
            weatherContent.innerHTML = `
                <div class="weather-display">
                    <div class="weather-main">
                        <span class="temperature">${this.weatherData.temperature}°F</span>
                        <span class="condition">${this.weatherData.condition}</span>
                    </div>
                    <div class="weather-details">
                        <span><i class="fas fa-wind"></i> Wind: ${this.weatherData.windSpeed} mph</span>
                        <span><i class="fas fa-eye"></i> Visibility: ${this.weatherData.visibility}</span>
                        <span><i class="fas fa-sun"></i> UV Index: ${this.weatherData.uvIndex}</span>
                    </div>
                    <div class="weather-recommendation">
                        <i class="fas fa-thumbs-up"></i>
                        ${this.weatherData.recommendation}
                    </div>
                </div>
            `;
        }
    }

    // Display weather error
    displayWeatherError() {
        const weatherContent = document.getElementById('weatherContent');
        if (weatherContent) {
            weatherContent.innerHTML = `
                <p><i class="fas fa-exclamation-triangle"></i> Weather data unavailable</p>
            `;
        }
    }

    // Load events data
    loadEvents() {
        // Mock events data - in a real app, this would come from an API
        this.events = [
            {
                id: 1,
                title: "Santa Monica Beach Cleanup",
                location: "Santa Monica, CA",
                date: "2025-06-15",
                time: "9:00 AM - 12:00 PM",
                participants: 12,
                description: "Join us for a morning of beach cleaning and ocean conservation!"
            },
            {
                id: 2,
                title: "Venice Beach Community Cleanup",
                location: "Venice, CA",
                date: "2025-06-18",
                time: "8:00 AM - 11:00 AM",
                participants: 8,
                description: "Weekly community event to keep Venice Beach beautiful."
            },
            {
                id: 3,
                title: "Manhattan Beach Family Day",
                location: "Manhattan Beach, CA",
                date: "2025-06-22",
                time: "10:00 AM - 2:00 PM",
                participants: 15,
                description: "Family-friendly cleanup with activities for kids."
            }
        ];

        this.displayEvents();
    }

    // Display events
    displayEvents() {
        const eventsGrid = document.getElementById('eventsGrid');
        if (eventsGrid) {
            // Clear existing content except for the sample card
            const sampleCard = eventsGrid.querySelector('.event-card');
            eventsGrid.innerHTML = '';
            
            // Add the sample card back
            if (sampleCard) {
                eventsGrid.appendChild(sampleCard);
            }

            // Add additional events
            this.events.slice(1).forEach(event => {
                const eventCard = this.createEventCard(event);
                eventsGrid.appendChild(eventCard);
            });
        }
    }

    // Create event card element
    createEventCard(event) {
        const eventDate = new Date(event.date);
        const day = eventDate.getDate();
        const month = eventDate.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();

        const cardElement = document.createElement('div');
        cardElement.className = 'event-card';
        cardElement.innerHTML = `
            <div class="event-date">
                <span class="day">${day}</span>
                <span class="month">${month}</span>
            </div>
            <div class="event-details">
                <h3>${event.title}</h3>
                <p><i class="fas fa-map-marker-alt"></i> ${event.location}</p>
                <p><i class="fas fa-users"></i> ${event.participants} squad members going</p>
                <p><i class="fas fa-clock"></i> ${event.time}</p>
            </div>
            <button class="btn btn-outline join-event-btn" data-event-id="${event.id}">Join Event</button>
        `;

        // Add event listener for the join button
        cardElement.querySelector('.join-event-btn').addEventListener('click', () => {
            this.joinEvent(event.id);
        });

        return cardElement;
    }

    // Action methods
    startCleanup() {
        this.showNotification('Starting cleanup creation...', 'info');
        // Scroll to map section
        document.getElementById('map')?.scrollIntoView({ behavior: 'smooth' });
    }

    findCrew() {
        this.showNotification('Finding crews in your area...', 'info');
        // Scroll to events section
        document.getElementById('events')?.scrollIntoView({ behavior: 'smooth' });
    }

    joinSquad() {
        this.showNotification('Welcome to ShoreSquad! 🌊', 'success');
        // In a real app, this would open a registration modal
    }

    createEvent() {
        this.showNotification('Event creation feature coming soon!', 'info');
        // In a real app, this would open an event creation form
    }

    joinEvent(eventId) {
        const event = this.events.find(e => e.id === eventId);
        if (event) {
            event.participants += 1;
            this.showNotification(`Joined ${event.title}! 🎉`, 'success');
            this.displayEvents(); // Refresh events display
        } else {
            this.showNotification('Joined cleanup event! 🎉', 'success');
        }
    }

    joinLocationEvent(locationName) {
        this.showNotification(`Joined ${locationName} cleanup! 🌊`, 'success');
    }

    toggleFilter() {
        this.showNotification('Filter options coming soon!', 'info');
        // In a real app, this would show filter options
    }

    // Utility method to show notifications
    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <span>${message}</span>
            <button class="notification-close">&times;</button>
        `;

        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#2ECC71' : type === 'error' ? '#e74c3c' : '#3498db'};
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 10000;
            display: flex;
            align-items: center;
            gap: 10px;
            min-width: 300px;
            animation: slideIn 0.3s ease;
        `;

        // Add animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
        `;
        document.head.appendChild(style);

        // Add close functionality
        notification.querySelector('.notification-close').addEventListener('click', () => {
            notification.remove();
        });

        // Add to page
        document.body.appendChild(notification);

        // Auto remove after 4 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 4000);
    }

    // Analytics and performance tracking
    trackEvent(eventName, properties = {}) {
        // In a real app, this would send analytics data
        console.log(`Event: ${eventName}`, properties);
    }

    // Lazy loading for performance
    lazyLoadImages() {
        const images = document.querySelectorAll('img[data-src]');
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });

        images.forEach(img => imageObserver.observe(img));
    }
}

// Enhanced CSS for notifications
const notificationStyles = `
    .notification-close {
        background: none;
        border: none;
        color: white;
        font-size: 18px;
        cursor: pointer;
        padding: 0;
        margin-left: auto;
    }
    
    .notification-close:hover {
        opacity: 0.8;
    }
    
    .weather-display {
        text-align: left;
    }
    
    .weather-main {
        display: flex;
        align-items: center;
        gap: 1rem;
        margin-bottom: 1rem;
    }
    
    .temperature {
        font-size: 2rem;
        font-weight: bold;
        color: var(--ocean-blue);
    }
    
    .condition {
        font-size: 1.1rem;
        color: var(--deep-navy);
    }
    
    .weather-details {
        display: flex;
        gap: 1rem;
        margin-bottom: 1rem;
        flex-wrap: wrap;
    }
    
    .weather-details span {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-size: 0.9rem;
        color: var(--medium-gray);
    }
    
    .weather-recommendation {
        background: linear-gradient(135deg, var(--sea-green), #27ae60);
        color: white;
        padding: 0.75rem;
        border-radius: 8px;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-weight: 500;
    }
    
    .map-popup {
        text-align: center;
    }
    
    .map-popup h3 {
        margin-bottom: 0.5rem;
        color: var(--deep-navy);
    }
    
    .map-popup p {
        margin-bottom: 0.5rem;
        color: var(--medium-gray);
    }
    
    .user-location-marker {
        color: var(--sunset-orange);
        font-size: 20px;
    }
`;

// Add styles to document
const styleSheet = document.createElement('style');
styleSheet.textContent = notificationStyles;
document.head.appendChild(styleSheet);

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.app = new ShoreSquadApp();
});

// Service Worker registration for PWA functionality
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}