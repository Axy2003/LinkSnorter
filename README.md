# LinkSnorter - URL Shortener Frontend

A modern, responsive frontend for the FastAPI URL shortener backend service.

## Features

- **URL Shortening**: Create short URLs from long ones with validation
- **Click Analytics**: Track how many times your links are clicked
- **URL Management**: View, copy, and delete your shortened URLs using admin keys
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile devices
- **Modern UI**: Beautiful gradient design with smooth animations
- **Real-time Feedback**: Toast notifications for all actions

## Getting Started

### Prerequisites

- Your FastAPI backend should be running on `http://localhost:8000`
- A modern web browser

### Setup

1. Make sure your FastAPI backend is running:
   ```bash
   cd your-backend-directory
   uvicorn app.main:app --reload
   ```

2. Open the frontend:
   - Simply open `index.html` in your web browser
   - Or serve it using a local server (recommended):
     ```bash
     # Using Python
     python -m http.server 8001
     
     # Using Node.js
     npx serve .
     
     # Using PHP
     php -S localhost:8001
     ```

3. Navigate to `http://localhost:8001` (or wherever you're serving the files)

## Usage

### Shortening URLs

1. Enter a long URL in the input field
2. Click "Shorten URL" 
3. Copy your shortened URL and admin URL for management

### Managing URLs

1. Use the admin key from when you created the URL
2. Enter it in the "Manage Your URLs" section
3. View analytics, copy URLs, or delete them

## File Structure

```
├── index.html          # Main HTML structure
├── styles.css          # CSS styling and responsive design
├── script.js           # JavaScript for API integration
└── README.md           # This file
```

## API Integration

The frontend integrates with your FastAPI backend endpoints:

- `POST /url` - Create shortened URL
- `GET /admin/{secret_key}` - Get URL information
- `DELETE /admin/{secret_key}` - Delete URL
- `GET /{url_key}` - Redirect to original URL

## Browser Support

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## Customization

### Changing API URL

To change the API endpoint, modify the `API_BASE_URL` in `script.js`:

```javascript
const API_BASE_URL = 'http://your-api-url:port';
```

### Styling

The CSS is organized into logical sections:
- Reset and base styles
- Header and navigation
- Form components
- Management interface
- Features section
- Responsive design

## Features Included

✅ URL shortening with validation  
✅ Click tracking and analytics  
✅ URL management interface  
✅ Delete functionality  
✅ Copy to clipboard  
✅ Responsive design  
✅ Error handling  
✅ Loading states  
✅ Toast notifications  
✅ Modern UI/UX  

## Troubleshooting

### CORS Issues
If you encounter CORS issues, make sure your FastAPI backend has CORS middleware enabled:

```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure appropriately for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### API Connection Issues
- Ensure your FastAPI backend is running
- Check that the API_BASE_URL in script.js matches your backend URL
- Verify CORS settings in your backend

## License

This project is open source and available under the MIT License.
