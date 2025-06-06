import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import App from './src/App';
import './index.css';

const helmetContext = {};

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <HelmetProvider context={helmetContext}>
            <App />
        </HelmetProvider>
    </StrictMode>
);