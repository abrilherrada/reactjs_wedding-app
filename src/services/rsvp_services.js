const RSVP_BASE_URL = import.meta.env.VITE_API_URL + '/invitations';

/**
 * Fetches RSVP information for a specific invitation
 * @param {string} invitationId - The unique identifier for the invitation
 * @returns {Promise<Object>} The guest party information
 * @throws {Error} If the invitation is not found or other API errors occur
 */
export const getRSVPInfo = async (invitationId) => {
  try {
    const response = await fetch(`${RSVP_BASE_URL}/${invitationId}`);
    if (!response.ok) throw response;
    const data = await response.json();
    return data.invitation || data; // Handle both formats for backward compatibility
  } catch (error) {
    const customError = new Error();
    customError.status = error.status || (error.response?.status) || 500;
    customError.response = error;
    throw customError;
  }
};

/**
 * Updates RSVP information for a party
 * @param {Object} updateData - The data to update
 * @param {string} updateData._id - Required: The unique identifier for the invitation
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
  if (!updateData._id) {
    throw new Error('_id is required');
  }

  try {
    const response = await fetch(`${RSVP_BASE_URL}/${updateData._id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updateData)
    });
    
    if (!response.ok) throw response;
    const data = await response.json();
    return data.invitation || data; // Handle both formats for backward compatibility
  } catch (error) {
    const customError = new Error('Error al actualizar la invitación');
    customError.status = error.status || (error.response?.status) || 500;
    customError.response = error;
    throw customError;
  }
};