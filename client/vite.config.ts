import { defineConfig } from 'vite';  // Import the Vite configuration function
import react from '@vitejs/plugin-react';  // Import the React plugin for Vite

// https://vite.dev/config/
// This file is used to configure the Vite build tool and development server.
export default defineConfig({
  plugins: [react()],  // Add the React plugin to handle React-specific features and optimizations

  server: {
    // Configure the development server settings
    proxy: {
      // Set up a proxy to forward requests from the frontend to the backend API
      '/api': 'http://localhost:3000',  // Any request to '/api' will be forwarded to 'http://localhost:3000'
      // This is useful for handling CORS issues during development, by allowing the frontend on a different port (default Vite is 5173) to communicate with the backend on port 3000.
    },
  },
});
