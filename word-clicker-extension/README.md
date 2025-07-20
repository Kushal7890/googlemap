# Word Clicker Extension

A Chrome web extension that automatically detects and clicks words on web pages in a cyclic pattern with microsecond precision timing.

## Features

- 🎯 **Automatic Word Detection**: Scans and identifies all clickable words on any webpage
- ⚡ **Microsecond Timing**: Clicks words with precise timing control
- 🔄 **Cyclic Pattern**: Follows a continuous cycle through all detected words
- 🎨 **Visual Feedback**: Highlights current word and provides click animations
- ⚙️ **Customizable Settings**: Adjust click speed and detection refresh rate
- 📱 **Modern UI**: Beautiful popup interface with real-time controls

## How It Works

1. **Word Detection**: The extension scans the webpage and detects all text words
2. **Word Replacement**: Replaces text with clickable span elements
3. **Cyclic Clicking**: Clicks words in sequence, returning to the first word after the last
4. **Real-time Updates**: Continuously refreshes word detection for dynamic content
5. **Visual Indicators**: Highlights the current word and shows click feedback

## Installation

### Method 1: Developer Mode (Recommended for testing)

1. **Download the Extension**:
   - Clone or download this repository
   - Extract to a folder on your computer

2. **Open Chrome Extensions**:
   - Open Google Chrome
   - Navigate to `chrome://extensions/`
   - Enable "Developer mode" (toggle in top-right corner)

3. **Load the Extension**:
   - Click "Load unpacked"
   - Select the `word-clicker-extension` folder
   - The extension should now appear in your extensions list

4. **Pin the Extension** (Optional):
   - Click the extensions icon (puzzle piece) in Chrome toolbar
   - Pin the "Word Clicker Extension" for easy access

### Method 2: Chrome Web Store (Future)
*This extension is currently in development and not yet published to the Chrome Web Store.*

## Usage

### Basic Usage

1. **Navigate to any webpage** with text content
2. **Click the extension icon** in the Chrome toolbar
3. **Click "Start Clicking"** in the popup
4. **Watch the magic happen** - words will be highlighted and clicked automatically

### Controls

- **Start/Stop**: Toggle the extension on/off
- **Click Speed**: Adjust how fast words are clicked (0.1 to 5 seconds)
- **Detection Speed**: Control how often the page is scanned for new words (1 to 1000ms)

### Keyboard Shortcuts

- **Enter** or **Space**: Toggle extension when popup is open
- **Extension Icon Click**: Quick toggle without opening popup

## Settings

### Click Speed
- **Range**: 0.1 to 5 seconds
- **Default**: 1 second
- **Description**: Time interval between word clicks

### Detection Refresh Rate
- **Range**: 1 to 1000 milliseconds  
- **Default**: 1 millisecond
- **Description**: How often the extension scans for new words (useful for dynamic content)

## Visual Indicators

- 🟡 **Yellow Hover**: Words highlight when you hover over them
- 🔴 **Red Border**: Current word being targeted for clicking
- 🟢 **Green Flash**: Visual confirmation when a word is clicked
- 📍 **Auto Scroll**: Page automatically scrolls to keep current word visible

## Technical Details

### Architecture
- **Manifest V3**: Uses the latest Chrome extension architecture
- **Content Script**: Handles word detection and clicking logic
- **Background Script**: Manages extension lifecycle and messaging
- **Popup Interface**: Provides user controls and settings

### Performance
- **Lightweight**: Minimal impact on page performance
- **Efficient**: Uses TreeWalker API for optimal DOM traversal
- **Non-intrusive**: Doesn't modify original page content permanently

### Compatibility
- **Chrome**: Version 88+ (Manifest V3 support)
- **Edge**: Chromium-based versions
- **Websites**: Works on all HTTP/HTTPS websites

## Development

### File Structure
```
word-clicker-extension/
├── manifest.json          # Extension configuration
├── content.js            # Main word detection and clicking logic
├── background.js         # Background service worker
├── popup.html           # Extension popup interface
├── popup.js             # Popup functionality
├── icon16.png           # 16x16 extension icon
├── icon48.png           # 48x48 extension icon
├── icon128.png          # 128x128 extension icon
└── README.md            # This file
```

### Key Classes and Methods

#### WordClicker Class
- `detectWords()`: Scans page for text words
- `replaceTextWithClickableWords()`: Converts text to clickable elements
- `clickCurrentWord()`: Performs the clicking action
- `start()`: Begins the clicking cycle
- `stop()`: Stops the extension
- `updateSettings()`: Applies new user settings

## Troubleshooting

### Extension Not Working
1. **Refresh the page** after enabling the extension
2. **Check if JavaScript is enabled** on the website
3. **Verify the extension is enabled** in Chrome settings
4. **Look for errors** in Chrome DevTools console

### No Words Detected
1. **Ensure the page has text content**
2. **Check if content is loaded dynamically** (extension will adapt)
3. **Try refreshing the page** and restarting the extension

### Performance Issues
1. **Reduce detection refresh rate** in settings
2. **Increase click speed interval** to reduce CPU usage
3. **Disable on heavy websites** if needed

## Privacy & Security

- **No Data Collection**: Extension doesn't collect or store personal data
- **Local Processing**: All operations happen locally in your browser
- **No Network Requests**: Extension doesn't communicate with external servers
- **Minimal Permissions**: Only requests necessary permissions for functionality

## Contributing

Contributions are welcome! Please feel free to submit pull requests or open issues for:

- Bug fixes
- Feature enhancements
- Performance improvements
- Documentation updates

## License

This project is open source and available under the [MIT License](LICENSE).

## Changelog

### Version 1.0 (Current)
- Initial release
- Basic word detection and clicking
- Cyclic pattern implementation
- Settings panel with speed controls
- Visual feedback and animations
- Real-time status updates

## Support

If you encounter any issues or have questions:

1. Check the troubleshooting section above
2. Open an issue on GitHub
3. Review Chrome extension documentation

---

**Note**: This extension is for educational and demonstration purposes. Please use responsibly and in accordance with website terms of service.