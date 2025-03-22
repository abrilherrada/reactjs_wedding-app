const WEDDING_BASE_URL = import.meta.env.VITE_API_URL + '/invitations';

/**
 * Fetches all invitations for a specific wedding
 * @param {string} weddingId - The ID of the wedding
 * @param {string} token - JWT token for authentication
 * @returns {Promise<Array>} Array of invitation objects
 * @throws {Error} If the request fails or wedding is not found
 */
export const getWeddingInvitations = async (weddingId, token) => {
  if (!weddingId) throw new Error('Wedding ID is required');
  if (!token) throw new Error('Authentication token is required');

  try {
    const response = await fetch(`${WEDDING_BASE_URL}/wedding/${weddingId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) throw response;
    return await response.json();
  } catch (error) {
    const customError = new Error(error.message || 'Failed to fetch wedding invitations');
    customError.status = error.status || 500;
    throw customError;
  }
};

/**
 * Updates the sent status of an invitation
 * @param {string} invitationId - The ID of the invitation
 * @param {boolean} sent - Whether the invitation has been sent
 * @returns {Promise<Object>} The updated invitation object
 * @throws {Error} If the request fails
 */
export const updateInvitationSentStatus = async (invitationId, sent) => {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/invitations/${invitationId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ sent })
    });

    if (!response.ok) throw new Error('Failed to update invitation status');
    return await response.json();
  } catch (error) {
    console.error('Error updating invitation status:', error);
    throw error;
  }
};