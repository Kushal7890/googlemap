// Background service worker for Word Clicker Extension

// Handle extension installation
chrome.runtime.onInstalled.addListener(() => {
  console.log('Word Clicker Extension installed');
});

// Handle messages from content script or popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getActiveTab') {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      sendResponse({ tab: tabs[0] });
    });
    return true; // Keep message channel open for async response
  }
});

// Handle extension icon click
chrome.action.onClicked.addListener((tab) => {
  // Send message to content script to toggle
  chrome.tabs.sendMessage(tab.id, { action: 'toggle' }, (response) => {
    if (chrome.runtime.lastError) {
      console.error('Error sending message:', chrome.runtime.lastError);
    } else {
      console.log('Extension toggled:', response);
    }
  });
});

// Handle keyboard shortcuts (optional)
chrome.commands.onCommand.addListener((command) => {
  if (command === 'toggle-word-clicker') {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, { action: 'toggle' });
    });
  }
});

console.log('Word Clicker Extension: Background script loaded');