function runTypingEffect() {
    const name = "Hi, I'm Ben.";
    const text = 'I build websites.';
    const fadeText = 'Web Developer | Tech Explorer | Elementary Teacher';
    const nameElement = document.getElementById('type-name');
    const typingElement = document.getElementById('typing-text');
    const fadeElement = document.getElementById('fade-in-text');
    const typingDelay = 100;
  
    // Step 1: Type the name
    typeText(name, nameElement, typingDelay, () => {
      // Step 2: Type the description
      typeText(text, typingElement, typingDelay, () => {
        // Step 3: Set the content for the fade-in text
        fadeElement.textContent = fadeText; // Add text content for fade-in
        fadeInElement(fadeElement); // Fade in the element
      });
    });
  }
  
  function typeText(text, element, delay, callback) {
    let i = 0;
    function typeCharacter() {
      if (i < text.length) {
        element.textContent += text.charAt(i); // Add one character at a time
        i++;
        setTimeout(typeCharacter, delay); // Wait for the delay before typing the next character
      } else if (callback) {
        callback(); // Call the callback function once typing is complete
      }
    }
    typeCharacter();
  }
  
  function fadeInElement(element) {
    element.style.opacity = 0; // Start with opacity 0
    element.style.display = 'block'; // Ensure it takes up space
    element.style.transition = 'opacity 1s ease-in'; // Smooth fade-in transition
  
    // Trigger the fade-in by changing opacity
    setTimeout(() => {
      element.style.opacity = 1; // Fade the element in
    }, 100); // Slight delay before fading in
  }
  
  document.addEventListener('DOMContentLoaded', runTypingEffect);

  