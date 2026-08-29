function runTypingEffect() {
  const name = "Hi, I'm Ben.";
  const lines = [
    'Powered by secondhand parts.',
    'Learning out loud.',
    'Studying, mostly.',
    'Perpetually mid-project.',
    'Chronically curious.',
    'Quietly opting out.',
    'Mostly harmless.',
    'Working on it.',
    'Results may vary.',
    'No warranty implied.',
    'Approximately functional.'
  ];
  const text = lines[Math.floor(Math.random() * lines.length)];
  const nameElement = document.getElementById('type-name');
  const typingElement = document.getElementById('typing-text');
  const fadeElement = document.getElementById('fade-in-text');
  const buttonElement = document.querySelector('.btn'); // Select your button element
  const typingDelay = 100;
  
  // Step 1: Type the name
  typeText(name, nameElement, typingDelay, () => {
    // Step 2: Type the description
    typeText(text, typingElement, typingDelay, () => {
      // Step 3: Fade in the fadeText
      fadeInElement(fadeElement); // Make fade-in-text fade in like the button
      
      // Step 4: Fade in the button after fadeText
      fadeInElement(buttonElement);
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
  element.style.display = 'block'; // Ensure the element is visible (if hidden)
  element.style.transition = 'opacity 1s ease-in'; // Smooth fade-in transition
  
  // Trigger the fade-in by changing opacity
  setTimeout(() => {
    element.style.opacity = 1; // Fade the element in
  }, 500); // Slight delay before fading in
}

document.addEventListener('DOMContentLoaded', runTypingEffect);

// Hover-to-define terms (.term elements with data-def). Handles tap for
// touch devices, where plain CSS :hover doesn't reliably show or dismiss,
// and nudges the tooltip back on-screen if it would clip past the viewport
// edge on a narrow phone.
document.addEventListener('DOMContentLoaded', function () {
  const terms = document.querySelectorAll('.term');
  
  function closeAll(except) {
    terms.forEach(function (t) {
      if (t !== except) {
        t.classList.remove('term-open');
        t.style.removeProperty('--term-shift');
      }
    });
  }
  
  function keepOnScreen(term) {
    const rect = term.getBoundingClientRect();
    const bubbleWidth = 260;
    const margin = 12;
    const halfBubble = bubbleWidth / 2;
    const termCenter = rect.left + rect.width / 2;
    
    let shift = 0;
    if (termCenter - halfBubble < margin) {
      shift = margin - (termCenter - halfBubble);
    } else if (termCenter + halfBubble > window.innerWidth - margin) {
      shift = (window.innerWidth - margin) - (termCenter + halfBubble);
    }
    term.style.setProperty('--term-shift', shift + 'px');
  }
  
  terms.forEach(function (term) {
    term.setAttribute('tabindex', '0');
    
    term.addEventListener('click', function (e) {
      e.preventDefault();
      const isOpen = term.classList.contains('term-open');
      closeAll(term);
      if (!isOpen) {
        term.classList.add('term-open');
        keepOnScreen(term);
      } else {
        term.classList.remove('term-open');
      }
    });
  });
  
  document.addEventListener('click', function (e) {
    if (!e.target.closest('.term')) closeAll(null);
  });
});
