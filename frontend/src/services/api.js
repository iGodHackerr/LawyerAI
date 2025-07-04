const API_BASE_URL = 'https://ai.noobis.live/api';

/**
 * A map of Indian state codes to primary language codes.
 * This is a simplification and may not cover all languages in a state.
 */
const stateToLangCode = {
    'GJ': 'gu', // Gujarat -> Gujarati
    'MH': 'mr', // Maharashtra -> Marathi
    'WB': 'bn', // West Bengal -> Bengali
    'AP': 'te', // Andhra Pradesh -> Telugu
    'TS': 'te', // Telangana -> Telugu
    'TN': 'ta', // Tamil Nadu -> Tamil
    'KA': 'kn', // Karnataka -> Kannada
    'KL': 'ml', // Kerala -> Malayalam
    'PB': 'pa', // Punjab -> Punjabi
    'DL': 'hi', // Delhi -> Hindi
    'UP': 'hi', // Uttar Pradesh -> Hindi
    // Add more mappings as needed
};


/**
 * Fetches the user's language based on their IP address.
 * @returns {Promise<string|null>} The suggested language code (e.g., 'hi') or null.
 */
export const getLanguageByIp = async () => {
    try {
        // Using ipapi.co as it's simple and free for this purpose.
        const response = await fetch('https://ipapi.co/json/');
        if (!response.ok) throw new Error('IP API request failed');
        const data = await response.json();
        
        // Check if the country is India and we have a mapping for the region
        if (data.country_code === 'IN' && data.region_code && stateToLangCode[data.region_code]) {
            return stateToLangCode[data.region_code];
        }
        return 'en'; // Default to English if no specific language is found
    } catch (error) {
        console.error("Could not fetch language from IP:", error);
        return null;
    }
};

/**
 * Handles user login.
 * @returns {Promise<any>} The server response data.
 */
export const loginUser = () => fetch(`${API_BASE_URL}/login`, { method: 'POST' });

/**
 * Fetches all chats for a given user.
 * @param {string} userId - The ID of the user.
 * @returns {Promise<any>} The list of chats.
 */
export const fetchChats = (userId) => fetch(`${API_BASE_URL}/chats/${userId}`);

/**
 * Fetches all messages for a specific chat.
 * @param {string} chatId - The ID of the chat.
 * @returns {Promise<any>} The list of messages.
 */
export const fetchMessages = (chatId) => fetch(`${API_BASE_URL}/chat/${chatId}/messages`);

/**
 * Creates a new chat session.
 * @param {string} userId - The ID of the user creating the chat.
 * @returns {Promise<any>} The new chat object.
 */
export const createNewChat = (userId) => {
    return fetch(`${API_BASE_URL}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
    });
};

/**
 * Sends a new message to a chat.
 * @param {string} chatId - The ID of the chat.
 * @param {string} content - The message content.
 * @param {string} language - The language for the response.
 * @returns {Promise<any>} The assistant's response message.
 */
export const sendMessage = (chatId, content, language) => {
    const messageBody = {
        content: content,
        // Add a directive for the backend to respond in the selected language.
        prompt_instruction: `Please provide the answer in ${language}.`,
    };

    return fetch(`${API_BASE_URL}/chat/${chatId}/message`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(messageBody),
    });
};

/**
 * Deletes a chat.
 * @param {string} chatId - The ID of the chat to delete.
 * @returns {Promise<any>}
 */
export const deleteChat = (chatId) => fetch(`${API_BASE_URL}/chat/${chatId}`, { method: 'DELETE' });

/**
 * Requests the backend to generate and update a title for a chat.
 * @param {string} chatId - The ID of the chat.
 * @returns {Promise<any>}
 */
export const updateChatTitle = (chatId) => fetch(`${API_BASE_URL}/chat/${chatId}/title`, { method: 'POST' });
