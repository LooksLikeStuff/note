import { createRoot } from 'react-dom/client';
import axios from 'axios';
import App from './Pages/Notes/Index';
import '../css/app.css';

axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
axios.defaults.headers.common['Accept'] = 'application/json';
axios.defaults.withCredentials = true;
axios.defaults.xsrfCookieName = 'XSRF-TOKEN';
axios.defaults.xsrfHeaderName = 'X-XSRF-TOKEN';

const csrfToken = document
    .querySelector('meta[name="csrf-token"]')
    ?.getAttribute('content');

if (csrfToken) {
    axios.defaults.headers.common['X-CSRF-TOKEN'] = csrfToken;
}

const root = document.getElementById('app');

if (!root) {
    throw new Error('Root element #app not found');
}

createRoot(root).render(<App />);
