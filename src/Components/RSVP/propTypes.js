import PropTypes from 'prop-types';

export const GuestShape = PropTypes.shape({
  name: PropTypes.string.isRequired,
  attending: PropTypes.bool,
});

export const ChildShape = PropTypes.shape({
  name: PropTypes.string.isRequired,
  attending: PropTypes.bool,
});

export const GuestInfoShape = PropTypes.shape({
  _id: PropTypes.string.isRequired,
  mainGuest: GuestShape.isRequired,
  hasCompanion: PropTypes.bool.isRequired,
  companion: GuestShape,
  hasChildren: PropTypes.bool.isRequired,
  children: PropTypes.arrayOf(ChildShape),
  dietaryRestrictionsInGroup: PropTypes.string,
  songRequest: PropTypes.string,
  additionalNotes: PropTypes.string,
});