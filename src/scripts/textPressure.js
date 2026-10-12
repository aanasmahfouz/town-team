/**
 * TextPressure - Vanilla JavaScript implementation for cursor proximity text effects
 * Simulates variable font weight/width changes based on cursor distance
 */

/**
 * Apply text pressure effect to an element
 * @param {string|HTMLElement} selector - Element selector or element
 * @param {object} options - Effect options
 */
export function applyTextPressure(selector, options = {}) {
  const {
    maxDistance = 150,
    minWeight = 400,
    maxWeight = 900,
    minScale = 1,
    maxScale = 1.15,
    textColor = '#FFFFFF',
    smoothing = 0.15
  } = options;

  const element = typeof selector === 'string' 
    ? document.querySelector(selector)
    : selector;

  if (!element) {
    console.warn('TextPressure: Element not found');
    return;
  }

  // Capability check: skip on touch/mobile/small devices
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches || window.innerWidth < 1024) {
    return;
  }

  // Store original text
  const originalText = element.textContent;
  
  // Split text into individual character spans
  element.innerHTML = '';
  const chars = [];
  
  for (let i = 0; i < originalText.length; i++) {
    const char = originalText[i];
    const span = document.createElement('span');
    span.style.display = 'inline-block';
    span.style.position = 'relative';
    span.style.transition = `font-weight ${smoothing}s ease, transform ${smoothing}s ease`;
    span.style.color = textColor;
    span.textContent = char === ' ' ? '\u00A0' : char;
    
    element.appendChild(span);
    chars.push({
      element: span,
      currentWeight: minWeight,
      currentScale: minScale
    });
  }

  // Track mouse position
  let mouseX = 0;
  let mouseY = 0;
  let isHovering = false;

  // Get element bounds
  function getElementBounds() {
    return element.getBoundingClientRect();
  }

  // Calculate distance from point to character
  function getDistance(charElement, x, y) {
    const rect = charElement.getBoundingClientRect();
    const charX = rect.left + rect.width / 2;
    const charY = rect.top + rect.height / 2;
    
    return Math.sqrt(
      Math.pow(x - charX, 2) + Math.pow(y - charY, 2)
    );
  }

  // Update character styles based on cursor proximity
  function updateCharacters() {
    if (!isHovering) return;

    chars.forEach(char => {
      const distance = getDistance(char.element, mouseX, mouseY);
      
      // Calculate weight and scale based on distance
      let intensity = 0;
      if (distance < maxDistance) {
        intensity = 1 - (distance / maxDistance);
      }
      
      // Smooth easing
      intensity = Math.pow(intensity, 2);
      
      const targetWeight = minWeight + (maxWeight - minWeight) * intensity;
      const targetScale = minScale + (maxScale - minScale) * intensity;
      
      // Apply smooth transition
      char.currentWeight += (targetWeight - char.currentWeight) * 0.2;
      char.currentScale += (targetScale - char.currentScale) * 0.2;
      
      char.element.style.fontWeight = Math.round(char.currentWeight);
      char.element.style.transform = `scale(${char.currentScale})`;
    });

    requestAnimationFrame(updateCharacters);
  }

  // Mouse move handler
  function handleMouseMove(e) {
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    const bounds = getElementBounds();
    const expandedBounds = {
      left: bounds.left - maxDistance,
      right: bounds.right + maxDistance,
      top: bounds.top - maxDistance,
      bottom: bounds.bottom + maxDistance
    };
    
    // Check if mouse is within proximity
    const wasHovering = isHovering;
    isHovering = mouseX >= expandedBounds.left &&
                 mouseX <= expandedBounds.right &&
                 mouseY >= expandedBounds.top &&
                 mouseY <= expandedBounds.bottom;
    
    // Start animation loop when entering proximity
    if (isHovering && !wasHovering) {
      updateCharacters();
    }
    
    // Reset when leaving proximity
    if (!isHovering && wasHovering) {
      chars.forEach(char => {
        char.element.style.fontWeight = minWeight;
        char.element.style.transform = `scale(${minScale})`;
        char.currentWeight = minWeight;
        char.currentScale = minScale;
      });
    }
  }

  // Mouse leave handler
  function handleMouseLeave() {
    isHovering = false;
    chars.forEach(char => {
      char.element.style.fontWeight = minWeight;
      char.element.style.transform = `scale(${minScale})`;
      char.currentWeight = minWeight;
      char.currentScale = minScale;
    });
  }

  // Add event listeners
  document.addEventListener('mousemove', handleMouseMove);
  element.addEventListener('mouseleave', handleMouseLeave);

  // Cleanup function
  return () => {
    document.removeEventListener('mousemove', handleMouseMove);
    element.removeEventListener('mouseleave', handleMouseLeave);
  };
}

/**
 * Initialize text pressure for footer
 */
export function initFooterTextPressure() {
  // Wait for fonts to be loaded
  document.fonts.ready.then(() => {
    const footerText = document.querySelector('.footer .end h5');
    
    if (footerText) {
      applyTextPressure(footerText, {
        maxDistance: 200,
        minWeight: 600,
        maxWeight: 900,
        minScale: 1,
        maxScale: 1.08,
        textColor: '#FFFFFF',
        smoothing: 0.1
      });
    }
  });
}

export default applyTextPressure;
