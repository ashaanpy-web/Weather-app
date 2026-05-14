# Glassmorphism Weather App 🌦️

A premium, highly responsive weather application built with HTML, Tailwind CSS, and Vanilla JavaScript. The app features a stunning dynamic glassmorphism UI that automatically adjusts based on real-time weather conditions and the time of day.

## ✨ Features

- **Real-Time Weather Data**: Fetches current temperature, humidity, visibility, and feels-like temperature using the OpenWeatherMap API.
- **Dynamic Backgrounds**: The background seamlessly transitions between vibrant daytime gradients, deep midnight themes, and moody storm colors based on the current weather condition.
- **Interactive Trend Graph**: A dynamically generated, smooth Bezier-curve SVG graph plots upcoming temperature trends perfectly.
- **18-Hour Forecast**: Scroll through a beautifully frosted 3-hour interval forecast for the next 18 hours.
- **Skeleton Loading State**: A premium shimmering skeleton animation ensures the UI never looks broken while fetching data.
- **Geolocation Support**: Automatically detects the user's location on startup to provide immediate local weather insights.
- **Premium Typography**: Utilizes the modern "Outfit" Google Font for a sleek, expensive feel.

## 🚀 Getting Started

### Prerequisites
- Node.js (if you wish to recompile the Tailwind CSS via CLI)
- An OpenWeatherMap API Key

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/weather-app.git
   cd weather-app
   ```

2. Install dependencies (Optional, for Tailwind CLI):
   ```bash
   npm install
   ```

3. **Configure API Key**:
   Open `script.js` and replace the `API_KEY` constant at the very top with your own free OpenWeatherMap API key.
   ```javascript
   const API_KEY = 'YOUR_API_KEY_HERE';
   ```

4. **Run the App**:
   Simply open `index.html` in your browser, or use a local development server like VS Code Live Server.

## 🛠️ Built With

- **HTML5** & **Vanilla JavaScript** (No heavy frontend frameworks)
- **Tailwind CSS v4** (For rapid, highly customizable styling)
- **OpenWeatherMap API** (Current Weather & 5-Day/3-Hour Forecast endpoints)
- **FontAwesome** (Icons)
- **Google Fonts** (Outfit typography)

## 📝 Security Note
Since this is a purely client-side application, the API key is placed directly in the `script.js` file. If you are deploying this to a public domain, consider securing your key by restricting its usage via the OpenWeatherMap developer dashboard, or moving the fetching logic to a small serverless backend function.
