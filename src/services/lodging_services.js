const LODGING_API_BASE_URL = 'https://oovzh5owug.execute-api.us-east-1.amazonaws.com/default/wedding_lodging';

/**
 * Fetches general lodging availability information
 * @returns {Promise<Object>} The availability information including total and taken spots
 * @throws {Error} If API errors occur
 */
export const getLodgingAvailability = async () => {
  try {
    const response = await fetch(LODGING_API_BASE_URL);
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Error: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching lodging availability:', error);
    throw error;
  }
};

/**
 * Fetches lodging reservation for a specific invitation
 * @param {string} invitationId - The unique identifier for the invitation
 * @returns {Promise<Object|null>} The reservation information if it exists, or null if not found
 * @throws {Error} If other API errors occur
 */
export const getLodgingReservation = async (invitationId) => {
  try {
    const response = await fetch(`${LODGING_API_BASE_URL}/${invitationId}`);
    if (response.status === 404) {
      return null; // No reservation found is a valid case
    }
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Error: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    if (error.message === 'Error: 404') {
      return null; // Handle case where error was already thrown with 404
    }
    console.error('Error fetching lodging reservation:', error);
    throw error;
  }
};

/**
 * Creates a new lodging reservation
 * @param {string} invitationId - The unique identifier for the invitation
 * @param {Object} reservationData - The reservation data
 * @param {string[]} reservationData.guests - Array of guest names
 * @param {number} reservationData.adults - Number of adults
 * @param {number} reservationData.children - Number of children
 * @returns {Promise<Object>} The created reservation
 * @throws {Error} If creation fails or spots are not available
 */
export const createLodgingReservation = async (invitationId, reservationData) => {
  try {
    const response = await fetch(`${LODGING_API_BASE_URL}/${invitationId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(reservationData),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Error: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error creating lodging reservation:', error);
    throw error;
  }
};

/**
 * Updates an existing lodging reservation
 * @param {string} invitationId - The unique identifier for the invitation
 * @param {Object} reservationData - The updated reservation data
 * @param {string[]} reservationData.guests - Array of guest names
 * @param {number} reservationData.adults - Number of adults
 * @param {number} reservationData.children - Number of children
 * @returns {Promise<Object>} The updated reservation
 * @throws {Error} If update fails or reservation not found
 */
export const updateLodgingReservation = async (invitationId, reservationData) => {
  try {
    const response = await fetch(`${LODGING_API_BASE_URL}/${invitationId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(reservationData),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Error: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error updating lodging reservation:', error);
    throw error;
  }
};

/**
 * Deletes an existing lodging reservation
 * @param {string} invitationId - The unique identifier for the invitation
 * @returns {Promise<Object>} The response message
 * @throws {Error} If deletion fails or reservation not found
 */
export const deleteLodgingReservation = async (invitationId) => {
  try {
    const response = await fetch(`${LODGING_API_BASE_URL}/${invitationId}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Error: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error deleting lodging reservation:', error);
    throw error;
  }
};