# LinkSnorter

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

1. Initialize your virtual environment and download all necessary libraries:
   ```bash
   cd LinkSnorter Path
   python -m venv venv
   ```

   For Windows (just ask AI chat about setup venv)
   ```bash
   venv\Scripts\Activate
   pip install -r requirements.txt
   ```

1. Make sure your FastAPI backend is running:
   ```bash
   uvicorn app.main:app --reload
   ```

2. Open the frontend:
   - Simply open `index.html` in your web browser

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
├── app
   ├── init.py
   ├── config.py
   ├── crud.py
   ├── database.py
   ├── keygen.py
   ├── main.py
   ├── models.py
   ├── schemas.py
├── template
   ├── index.html
   ├── style.css
   ├── script.js
├── .env
├── requirements.txt
└── shortner.db
```

## API Integration

The frontend integrates with your FastAPI backend endpoints:

- `POST /url` - Create shortened URL
- `GET /admin/{secret_key}` - Get URL information
- `DELETE /admin/{secret_key}` - Delete URL
- `GET /{url_key}` - Redirect to original URL

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


### API Connection Issues
- Ensure your FastAPI backend is running
- Check that the API_BASE_URL in script.js matches your backend URL


<p align= "center"><i>Axy🤘🏼</i></p>
