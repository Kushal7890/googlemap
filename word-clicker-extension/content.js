class WordClicker {
  constructor() {
    this.isActive = false;
    this.currentWordIndex = 0;
    this.words = [];
    this.clickInterval = null;
    this.detectionInterval = null;
    this.clickDelay = 1; // microseconds converted to milliseconds (minimum 1ms)
    this.detectionDelay = 1; // milliseconds for word detection refresh
  }

  // Detect all clickable words on the page
  detectWords() {
    const textNodes = this.getTextNodes(document.body);
    const words = [];
    
    textNodes.forEach(node => {
      const text = node.textContent;
      const words_in_node = text.split(/\s+/).filter(word => word.length > 0);
      
      words_in_node.forEach((word, index) => {
        // Create a span element for each word to make it clickable
        const range = document.createRange();
        const wordStart = text.indexOf(word);
        
        if (wordStart !== -1) {
          try {
            range.setStart(node, wordStart);
            range.setEnd(node, wordStart + word.length);
            
            const span = document.createElement('span');
            span.textContent = word;
            span.style.cursor = 'pointer';
            span.style.transition = 'background-color 0.1s';
            span.setAttribute('data-word-clicker', 'true');
            span.setAttribute('data-original-word', word);
            
            // Add hover effect
            span.addEventListener('mouseenter', () => {
              span.style.backgroundColor = 'rgba(255, 255, 0, 0.3)';
            });
            
            span.addEventListener('mouseleave', () => {
              span.style.backgroundColor = '';
            });
            
            words.push({
              element: span,
              word: word,
              range: range
            });
          } catch (e) {
            // Skip if range creation fails
          }
        }
      });
    });
    
    return words;
  }

  // Get all text nodes in the document
  getTextNodes(element) {
    const textNodes = [];
    const walker = document.createTreeWalker(
      element,
      NodeFilter.SHOW_TEXT,
      {
        acceptNode: (node) => {
          // Skip script, style, and other non-visible elements
          const parent = node.parentElement;
          if (!parent) return NodeFilter.FILTER_REJECT;
          
          const tagName = parent.tagName.toLowerCase();
          if (['script', 'style', 'noscript', 'meta', 'head'].includes(tagName)) {
            return NodeFilter.FILTER_REJECT;
          }
          
          // Skip if text is only whitespace
          if (node.textContent.trim().length === 0) {
            return NodeFilter.FILTER_REJECT;
          }
          
          return NodeFilter.FILTER_ACCEPT;
        }
      }
    );
    
    let node;
    while (node = walker.nextNode()) {
      textNodes.push(node);
    }
    
    return textNodes;
  }

  // Replace text nodes with clickable spans
  replaceTextWithClickableWords() {
    // Remove existing word-clicker spans
    const existingSpans = document.querySelectorAll('[data-word-clicker="true"]');
    existingSpans.forEach(span => {
      const parent = span.parentNode;
      parent.replaceChild(document.createTextNode(span.textContent), span);
      parent.normalize();
    });

    const textNodes = this.getTextNodes(document.body);
    const allWords = [];
    
    textNodes.forEach(node => {
      const text = node.textContent;
      const words = text.split(/(\s+)/); // Keep whitespace
      
      if (words.length > 1) {
        const fragment = document.createDocumentFragment();
        
        words.forEach(word => {
          if (word.trim().length > 0 && !/^\s+$/.test(word)) {
            // This is a word
            const span = document.createElement('span');
            span.textContent = word;
            span.style.cursor = 'pointer';
            span.style.transition = 'all 0.1s';
            span.setAttribute('data-word-clicker', 'true');
            span.setAttribute('data-original-word', word);
            
            // Add visual feedback
            span.addEventListener('mouseenter', () => {
              span.style.backgroundColor = 'rgba(255, 255, 0, 0.3)';
              span.style.transform = 'scale(1.05)';
            });
            
            span.addEventListener('mouseleave', () => {
              span.style.backgroundColor = '';
              span.style.transform = 'scale(1)';
            });
            
            allWords.push(span);
            fragment.appendChild(span);
          } else {
            // This is whitespace
            fragment.appendChild(document.createTextNode(word));
          }
        });
        
        node.parentNode.replaceChild(fragment, node);
      }
    });
    
    this.words = allWords;
  }

  // Highlight current word
  highlightWord(wordElement) {
    // Remove previous highlights
    const previousHighlighted = document.querySelectorAll('[data-word-clicker="true"][data-highlighted="true"]');
    previousHighlighted.forEach(el => {
      el.style.backgroundColor = '';
      el.style.border = '';
      el.setAttribute('data-highlighted', 'false');
    });
    
    // Highlight current word
    if (wordElement) {
      wordElement.style.backgroundColor = 'rgba(255, 0, 0, 0.5)';
      wordElement.style.border = '2px solid red';
      wordElement.setAttribute('data-highlighted', 'true');
      
      // Scroll into view
      wordElement.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center',
        inline: 'center'
      });
    }
  }

  // Click on the current word
  clickCurrentWord() {
    if (this.words.length === 0) return;
    
    const currentWord = this.words[this.currentWordIndex];
    if (currentWord) {
      // Highlight the word
      this.highlightWord(currentWord);
      
      // Simulate click with microsecond timing
      setTimeout(() => {
        // Create and dispatch click event
        const clickEvent = new MouseEvent('click', {
          bubbles: true,
          cancelable: true,
          view: window
        });
        
        currentWord.dispatchEvent(clickEvent);
        
        // Visual feedback for click
        const originalBg = currentWord.style.backgroundColor;
        currentWord.style.backgroundColor = 'rgba(0, 255, 0, 0.8)';
        currentWord.style.transform = 'scale(1.1)';
        
        setTimeout(() => {
          currentWord.style.backgroundColor = originalBg;
          currentWord.style.transform = 'scale(1)';
        }, 100);
        
        console.log(`Clicked word: "${currentWord.textContent}" at index ${this.currentWordIndex}`);
        
        // Move to next word in cycle
        this.currentWordIndex = (this.currentWordIndex + 1) % this.words.length;
      }, this.clickDelay);
    }
  }

  // Start the word detection and clicking cycle
  start() {
    if (this.isActive) return;
    
    this.isActive = true;
    console.log('Word Clicker Extension: Started');
    
    // Initial word detection and replacement
    this.replaceTextWithClickableWords();
    
    // Start the clicking cycle
    this.clickInterval = setInterval(() => {
      this.clickCurrentWord();
    }, this.clickDelay);
    
    // Periodically refresh word detection for dynamic content
    this.detectionInterval = setInterval(() => {
      this.replaceTextWithClickableWords();
    }, this.detectionDelay);
  }

  // Stop the extension
  stop() {
    if (!this.isActive) return;
    
    this.isActive = false;
    console.log('Word Clicker Extension: Stopped');
    
    // Clear intervals
    if (this.clickInterval) {
      clearInterval(this.clickInterval);
      this.clickInterval = null;
    }
    
    if (this.detectionInterval) {
      clearInterval(this.detectionInterval);
      this.detectionInterval = null;
    }
    
    // Remove highlights
    const highlighted = document.querySelectorAll('[data-word-clicker="true"][data-highlighted="true"]');
    highlighted.forEach(el => {
      el.style.backgroundColor = '';
      el.style.border = '';
      el.setAttribute('data-highlighted', 'false');
    });
    
    // Reset word index
    this.currentWordIndex = 0;
  }

  // Toggle extension on/off
  toggle() {
    if (this.isActive) {
      this.stop();
    } else {
      this.start();
    }
  }

  // Update settings
  updateSettings(settings) {
    if (settings.clickSpeed) {
      this.clickDelay = Math.max(1, settings.clickSpeed * 1000); // Convert to milliseconds
      
      // Restart clicking interval if active
      if (this.isActive && this.clickInterval) {
        clearInterval(this.clickInterval);
        this.clickInterval = setInterval(() => {
          this.clickCurrentWord();
        }, this.clickDelay);
      }
    }
    
    if (settings.detectionSpeed) {
      this.detectionDelay = Math.max(1, settings.detectionSpeed);
      
      // Restart detection interval if active
      if (this.isActive && this.detectionInterval) {
        clearInterval(this.detectionInterval);
        this.detectionInterval = setInterval(() => {
          this.replaceTextWithClickableWords();
        }, this.detectionDelay);
      }
    }
    
    console.log('Settings updated:', settings);
  }
}

// Initialize the word clicker
const wordClicker = new WordClicker();

// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'toggle') {
    wordClicker.toggle();
    sendResponse({ status: wordClicker.isActive ? 'started' : 'stopped' });
  } else if (request.action === 'getStatus') {
    sendResponse({ status: wordClicker.isActive ? 'active' : 'inactive' });
  } else if (request.action === 'updateSettings') {
    wordClicker.updateSettings(request.settings);
    sendResponse({ status: 'settings updated' });
  }
});

// Auto-start the extension when page loads (optional)
// Uncomment the line below if you want it to start automatically
// wordClicker.start();

console.log('Word Clicker Extension: Content script loaded');