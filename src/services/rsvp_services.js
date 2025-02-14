const API_BASE_URL = 'https://enpq096kji.execute-api.us-east-1.amazonaws.com/default/wedding_rsvp';

/**
 * Fetches RSVP information for a specific invitation
 * @param {string} invitationId - The unique identifier for the invitation
 * @returns {Promise<Object>} The guest party information
 * @throws {Error} If the invitation is not found or other API errors occur
 */
export const getRSVPInfo = async (invitationId) => {
  try {
    const response = await fetch(`${API_BASE_URL}?invitationId=${invitationId}`);
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Invitation not found');
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching RSVP info:', error);
    throw error;
  }
};

/**
 * Updates RSVP information for a party
 * @param {Object} updateData - The data to update
 * @param {string} updateData.invitationId - Required: The unique identifier for the invitation
 * @param {Object} [updateData.mainGuest] - Optional: Main guest updates (name, attending)
 * @param {Object} [updateData.companion] - Optional: Companion updates (name, attending)
 * @param {Array} [updateData.children] - Optional: Children updates (array of {name, attending})
 * @param {string} [updateData.dietaryRestrictionsInGroup] - Optional: Dietary restrictions for the group
 * @param {string} [updateData.songRequest] - Optional: Song request
 * @param {string} [updateData.additionalNotes] - Optional: Additional notes
 * @returns {Promise<Object>} The updated RSVP information
 * @throws {Error} If the invitation is not found or other API errors occur
 */
export const updateRSVPStatus = async (updateData) => {
  if (!updateData.invitationId) {
    throw new Error('invitationId is required');
  }

  try {
    const response = await fetch(API_BASE_URL, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updateData)
    });
    
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Invitation not found');
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error updating RSVP:', error);
    throw error;
  }
};