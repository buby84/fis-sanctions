import axios from 'axios';
import { AVAILABLE_DISCIPLINES } from '../globals';

const API_URL = import.meta.env.MODE === 'development' ? '/api' : 'https://api.fis-ski.com';
const SANCTIONS_URL = 'sanctions';
const TOKEN_URL = 'oauth/token';
const CLIENT_ID = '1';
const CLIENT_SECRET = 'your_client_secret';
const USERNAME = 'your_username';
const PASSWORD = 'your_password';
const X_API_KEY = 'ApiXKey123';

let apiToken = null;

//TO-DO: chose authentication method

// Configura Axios per includere l'header x-api-key in tutte le richieste effettuate
axios.defaults.headers.common['x-api-key'] = X_API_KEY;

/* auth*/
const getToken = async () => {
    console.log('Generating token...');
    const response = await axios.post(`${API_URL}/${TOKEN_URL}`, {
        grant_type: 'password',
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        usenrame: USERNAME,
        password: PASSWORD
    });
    apiToken = response.data.access_token;
    console.log('Token:', apiToken);
};
getToken();

/* fetch athletes sanctions */
export const fetchSanctions = async (discipline= null, season = null) => {

    if (!discipline || !AVAILABLE_DISCIPLINES.some(d => d.code === discipline)) {
        console.warn(`Disciplina non valida: ${discipline}`);
        return []; // Non effettuare la richiesta e restituisci un array vuoto
    }
    
    let url = `${API_URL}/${SANCTIONS_URL}/${discipline || ''}`;
    if (season) {
        url += `/${season}`;
    }

    try {
        console.warn(`Disciplina richiesta: ${discipline}`);
        const response = await axios.get(url, {
            headers: {
                'accept': 'application/json',
                'Authorization': `Bearer ${apiToken}`
            }
        });
        return response.data.sort((a, b) => new Date(b.time) - new Date(a.time));
    } catch (error) {
        console.error('Errore nella richiesta:', error);
        throw error;
    }

};


