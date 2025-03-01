const API_BASE_URL = import.meta.env.VITE_API_URL;

/**
 * Fetches general availability information
 * @returns {Promise<Object>} The availability information including total and taken spots
 * @throws {Error} If API errors occur
 */
export const getAvailability = async (reservationType) => {
  try {
    const response = await fetch(API_BASE_URL + "/" + reservationType);
    if (!response.ok) throw response;
    return await response.json();
  } catch (error) {
    const customError = new Error();
    customError.status = error.status || 500;
    throw customError;
  }
};

/**
 * Fetches reservation for a specific invitation
 * @param {string} invitationId - The unique identifier for the invitation
 * @returns {Promise<Object|null>} The reservation information if it exists, or null if not found
 * @throws {Error} If other API errors occur
 */
export const getReservation = async (invitationId, reservationType) => {
  try {
    const response = await fetch(`${API_BASE_URL + "/" + reservationType}/${invitationId}`);
    if (response.status === 404) {
      return null; // No reservation is a valid case
    }
    if (!response.ok) throw response;
    return await response.json();
  } catch (error) {
    if (error.status === 404) {
      return null; // Handle case where error was already thrown with 404
    }
    const customError = new Error();
    customError.status = error.status || 500;
    throw customError;
  }
};

/**
 * Creates a new reservation
 * @param {string} invitationId - The unique identifier for the invitation
 * @param {Object} reservationData - The reservation data
 * @param {string[]} reservationData.guests - Array of guest names
 * @param {number} reservationData.adults - Number of adults
 * @param {number} reservationData.children - Number of children
 * @returns {Promise<Object>} The created reservation
 * @throws {Error} If creation fails
 */
export const createReservation = async (invitationId, reservationData, reservationType) => {
  if (!invitationId) {
    const error = new Error();
    error.status = 400;
    throw error;
  }

  try {
    const response = await fetch(`${API_BASE_URL + "/" + reservationType}/${invitationId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(reservationData)
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
 * Updates an existing reservation
 * @param {string} invitationId - The unique identifier for the invitation
 * @param {Object} reservationData - The updated reservation data
 * @param {string[]} reservationData.guests - Array of guest names
 * @param {number} reservationData.adults - Number of adults
 * @param {number} reservationData.children - Number of children
 * @returns {Promise<Object>} The updated reservation
 * @throws {Error} If update fails or reservation not found
 */
export const updateReservation = async (invitationId, reservationData, reservationType) => {
  if (!invitationId) {
    const error = new Error();
    error.status = 400;
    throw error;
  }

  try {
    const response = await fetch(`${API_BASE_URL + "/" + reservationType}/${invitationId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(reservationData)
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
 * Deletes an existing reservation
 * @param {string} invitationId - The unique identifier for the invitation
 * @returns {Promise<Object>} The response message
 * @throws {Error} If deletion fails or reservation not found
 */
export const deleteReservation = async (invitationId, reservationType) => {
  if (!invitationId) {
    const error = new Error();
    error.status = 400;
    throw error;
  }

  try {
    const response = await fetch(`${API_BASE_URL + "/" + reservationType}/${invitationId}`, {
      method: 'DELETE'
    });
    
    if (!response.ok) throw response;
    return await response.json();
  } catch (error) {
    const customError = new Error();
    customError.status = error.status || 500;
    throw customError;
  }
};