document.addEventListener('DOMContentLoaded', function() {
  const toggleBtn = document.getElementById('toggleBtn');
  const statusDiv = document.getElementById('status');
  const clickSpeedSlider = document.getElementById('clickSpeed');
  const clickSpeedValue = document.getElementById('clickSpeedValue');
  const detectionSpeedSlider = document.getElementById('detectionSpeed');
  const detectionSpeedValue = document.getElementById('detectionSpeedValue');
  
  // Sync slider and number input values
  clickSpeedSlider.addEventListener('input', function() {
    clickSpeedValue.value = this.value;
    updateSettings();
  });
  
  clickSpeedValue.addEventListener('input', function() {
    clickSpeedSlider.value = this.value;
    updateSettings();
  });
  
  detectionSpeedSlider.addEventListener('input', function() {
    detectionSpeedValue.value = this.value;
    updateSettings();
  });
  
  detectionSpeedValue.addEventListener('input', function() {
    detectionSpeedSlider.value = this.value;
    updateSettings();
  });
  
  // Load saved settings
  chrome.storage.sync.get(['clickSpeed', 'detectionSpeed'], function(result) {
    if (result.clickSpeed) {
      clickSpeedSlider.value = result.clickSpeed;
      clickSpeedValue.value = result.clickSpeed;
    }
    if (result.detectionSpeed) {
      detectionSpeedSlider.value = result.detectionSpeed;
      detectionSpeedValue.value = result.detectionSpeed;
    }
  });
  
  // Update settings in content script
  function updateSettings() {
    const settings = {
      clickSpeed: parseFloat(clickSpeedValue.value),
      detectionSpeed: parseInt(detectionSpeedValue.value)
    };
    
    // Save settings
    chrome.storage.sync.set(settings);
    
    // Send settings to content script
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {
        action: 'updateSettings',
        settings: settings
      });
    });
  }
  
  // Get current status
  function updateStatus() {
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, { action: 'getStatus' }, function(response) {
        if (chrome.runtime.lastError) {
          console.error('Error getting status:', chrome.runtime.lastError);
          statusDiv.textContent = 'Status: Error';
          statusDiv.className = 'status inactive';
          toggleBtn.textContent = 'Start Clicking';
          return;
        }
        
        if (response && response.status === 'active') {
          statusDiv.textContent = 'Status: Active';
          statusDiv.className = 'status active';
          toggleBtn.textContent = 'Stop Clicking';
        } else {
          statusDiv.textContent = 'Status: Inactive';
          statusDiv.className = 'status inactive';
          toggleBtn.textContent = 'Start Clicking';
        }
      });
    });
  }
  
  // Toggle extension
  toggleBtn.addEventListener('click', function() {
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, { action: 'toggle' }, function(response) {
        if (chrome.runtime.lastError) {
          console.error('Error toggling extension:', chrome.runtime.lastError);
          // Try to inject content script if it's not loaded
          chrome.scripting.executeScript({
            target: { tabId: tabs[0].id },
            files: ['content.js']
          }, function() {
            if (chrome.runtime.lastError) {
              console.error('Error injecting script:', chrome.runtime.lastError);
              statusDiv.textContent = 'Status: Error - Reload page';
              statusDiv.className = 'status inactive';
            } else {
              // Try toggle again after injection
              setTimeout(() => {
                chrome.tabs.sendMessage(tabs[0].id, { action: 'toggle' }, function(response) {
                  updateStatus();
                });
              }, 100);
            }
          });
          return;
        }
        
        updateStatus();
      });
    });
  });
  
  // Initialize status
  updateStatus();
  
  // Refresh status periodically
  setInterval(updateStatus, 1000);
  
  // Handle keyboard shortcuts
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggleBtn.click();
    }
  });
});

// Handle messages from content script
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === 'statusUpdate') {
    const statusDiv = document.getElementById('status');
    const toggleBtn = document.getElementById('toggleBtn');
    
    if (request.status === 'active') {
      statusDiv.textContent = 'Status: Active';
      statusDiv.className = 'status active';
      toggleBtn.textContent = 'Stop Clicking';
    } else {
      statusDiv.textContent = 'Status: Inactive';
      statusDiv.className = 'status inactive';
      toggleBtn.textContent = 'Start Clicking';
    }
  }
});