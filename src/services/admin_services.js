const USER_BASE_URL = import.meta.env.VITE_API_URL + '/user';

/**
 * Fetches information about the authenticated user including their weddings
 * @returns {Promise<Object>} User information and associated weddings
 * @throws {Error} If the request fails or user is not authenticated
 */
export const getUserInfo = async (token) => {
  if (!token) {
    throw new Error('Authentication token is required');
  }

  try {
    const response = await fetch(`${USER_BASE_URL}/me`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      }
    });

    if (!response.ok) throw response;
    return await response.json();
  } catch (error) {
    const customError = new Error(error.message || 'Failed to fetch user information');
    customError.status = error.status || 500;
    throw customError;
  }
};