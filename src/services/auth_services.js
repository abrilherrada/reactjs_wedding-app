const AUTH_BASE_URL = import.meta.env.VITE_API_URL + '/auth';

/**
 * Authenticates a user and returns a token
 * @param {Object} credentials - The login credentials
 * @param {string} credentials.email - The user's email
 * @param {string} credentials.password - The user's password
 * @returns {Promise<Object>} The authentication token and user info
 * @throws {Error} If credentials are invalid or other API errors occur
 */
export const login = async (credentials) => {
  try {
    const response = await fetch(`${AUTH_BASE_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials)
    });
    
    if (!response.ok) throw response;
    return await response.json();
  } catch (error) {
    const customError = new Error();
    customError.status = error.status || 500;
    throw customError;
  }
};

/**
 * Creates a new user account
 * @param {Object} userData - The user registration data
 * @param {string} userData.email - Required: The user's email
 * @param {string} userData.password - Required: The user's password
 * @param {string} [userData.weddingId] - Optional: ID of an existing wedding to join
 * @param {string} [userData.weddingName] - Optional: Name for a new wedding if not joining existing
 * @returns {Promise<Object>} The created user information
 * @throws {Error} If registration fails or other API errors occur
 */
export const signup = async (userData) => {
  if (!userData.email || !userData.password) {
    throw new Error('Email and password are required');
  }

  try {
    const response = await fetch(`${AUTH_BASE_URL}/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData)
    });
    
    if (!response.ok) throw response;
    return await response.json();
  } catch (error) {
    const customError = new Error();
    customError.status = error.status || 500;
    throw customError;
  }
};