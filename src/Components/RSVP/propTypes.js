import PropTypes from 'prop-types';

export const GuestShape = PropTypes.shape({
  name: PropTypes.string.isRequired,
  attending: PropTypes.bool,
});

export const CompanionShape = PropTypes.shape({
  name: PropTypes.string,
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
  companion: PropTypes.oneOfType([
    CompanionShape,
    PropTypes.oneOf([null])
  ]),
  hasChildren: PropTypes.bool.isRequired,
  children: PropTypes.arrayOf(ChildShape),
  dietaryRestrictionsInGroup: PropTypes.string,
  songRequest: PropTypes.string,
  additionalNotes: PropTypes.string,
});