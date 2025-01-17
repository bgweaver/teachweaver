function runTypingEffect() {
  const name = "Hi, I'm Ben.";
  const text = 'I build websites.';
  const fadeText = 'Web Developer | Tech Explorer | Elementary Teacher';
  const nameElement = document.getElementById('type-name');
  const typingElement = document.getElementById('typing-text');
  const fadeElement = document.getElementById('fade-in-text');
  const buttonElement = document.querySelector('.btn'); // Select your button element
  const typingDelay = 100;

  // Step 1: Type the name
  typeText(name, nameElement, typingDelay, () => {
    // Step 2: Type the description
    typeText(text, typingElement, typingDelay, () => {
      // Step 3: Set the content for the fade-in text
      fadeElement.textContent = fadeText; // Add text content for fade-in
      fadeInElement(fadeElement); // Fade in the element

      // Step 4: Fade in the button after the typing and fade-in text
      fadeInButton(buttonElement);
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

// Function to fade in the button after text is typed
function fadeInButton(button) {
  button.style.opacity = 0; // Start with opacity 0
  button.style.display = 'inline-block'; // Ensure the button is displayed correctly
  button.style.transition = 'opacity 1s ease-in'; // Smooth fade-in transition
  
  // Trigger the fade-in by changing opacity
  setTimeout(() => {
    button.style.opacity = 1; // Fade the button in
  }, 1000); // Slight delay before fading in
}

document.addEventListener('DOMContentLoaded', runTypingEffect);
