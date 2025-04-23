// List of CORS proxies we can use as fallback
const CORS_PROXIES = [
    'https://api.allorigins.win/raw?url=',
    'https://cors-anywhere.herokuapp.com/',
    'https://cors.bridged.cc/'
];

export const fetchWithCorsProxy = async (url: string): Promise<any> => {
    // Try each proxy in sequence until one works
    for (const proxy of CORS_PROXIES) {
        try {
            const response = await fetch(proxy + encodeURIComponent(url));
            if (response.ok) {
                return await response.json();
            }
        } catch (error) {
            console.warn(`Proxy ${proxy} failed:`, error);
            continue;
        }
    }
    throw new Error('All CORS proxies failed');
}; 