// Wait for the entire page to load
document.addEventListener('DOMContentLoaded', () => {

    // --- PART 1: GSAP SCROLL SCRUBBING (The Title) ---
    
    // First, register the ScrollTrigger plugin with GSAP
    gsap.registerPlugin(ScrollTrigger);
  
    // Animate the .title-filled class
    gsap.to(".title-filled", { 
      clipPath: "inset(0 0% 0 0)", // Animate to 0% hidden (fully visible)
      ease: "none", // Use a linear "ease" for 1-to-1 scrubbing
      
      // Attach it to the scrollbar
      scrollTrigger: {
        trigger: ".title-outline", // Start when the outline title is visible
        start: "top 70%", // Start animation when title is 70% from top
        end: "bottom 50%", // End animation when title is 50% from top
        scrub: true, // This is the magic! Links animation to scroll.
        // markers: true // Uncomment this to see debug markers
      }
    });
  
  
    // --- PART 2: SCROLLYTELLING MAP (Mapbox + IntersectionObserver) ---
    
    // 1. Set Your Mapbox Token (loaded from config.js)
    if (!window.MAPBOX_ACCESS_TOKEN || window.MAPBOX_ACCESS_TOKEN === 'YOUR_PUBLIC_MAPBOX_ACCESS_TOKEN') {
      console.error('Mapbox token not configured. Please copy config.example.js to config.js and add your token.');
    }
    mapboxgl.accessToken = window.MAPBOX_ACCESS_TOKEN || '';
  
    // 2. Define Your Locations
    // A simple object to store your journey points.
    // We'll get the coordinates from the `data-coords` in your HTML.
    const locations = {
      origin: {
        coords: [34.0522, -118.2437],
        zoom: 8
      },
      move: {
        coords: [30.2672, -97.7431],
        zoom: 8
      },
      warriors: {
        coords: [-122.3877, 37.7680], // Note: Mapbox is [Lng, Lat]
        zoom: 12
      },
      toolkit: {
        coords: [-122.3877, 37.7680],
        zoom: 13
      },
      cta: {
        coords: [-98.5795, 39.8283], // Center on USA
        zoom: 3
      }
      // Add more locations here as needed
    };
  
    // 3. Initialize the Map
    const map = new mapboxgl.Map({
      container: 'map-container', // The ID from your HTML
      style: 'mapbox://styles/mapbox/dark-v11', // A sleek, dark style
      center: locations.origin.coords, // Start at the first location
      zoom: locations.origin.zoom,
      interactive: false // Optional: disable map controls
    });
  
    // 4. Set Up the IntersectionObserver
    const options = {
      root: null, // Use the browser viewport
      rootMargin: '0px',
      threshold: 0.5 // Trigger when 50% of the step is visible
    };
  
    const observer = new IntersectionObserver(handleIntersect, options);
  
    // 5. Create the "flyTo" function
    function handleIntersect(entries, observer) {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Get the ID of the step (e.g., "step-1", "step-2")
          const stepId = entry.target.id;
          
          // Get the location name from the data-location attribute
          const locationName = entry.target.dataset.location;
          
          // Find the location data from our object
          const locationData = locations[locationName];
  
          if (locationData) {
            // Tell the map to fly to the new coordinates
            map.flyTo({
              center: locationData.coords,
              zoom: locationData.zoom,
              essential: true, // This ensures the animation plays
              speed: 1.0 // How fast to fly
            });
          }
          
          // Add .is-active class to the current step
          // First, remove it from all steps
          document.querySelectorAll('.story-step').forEach(step => {
            step.classList.remove('is-active');
          });
          // Then, add it to the one in view
          entry.target.classList.add('is-active');
        }
      });
    }
  
    // 6. Tell the Observer to Watch Your Steps
    const steps = document.querySelectorAll('.story-step');
    steps.forEach(step => observer.observe(step));
  });