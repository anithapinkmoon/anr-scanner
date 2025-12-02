import shortid from 'shortid';

const designationPrefixes = {
  Student: 'STU',
  Alumni: 'ALU',
  Staff: 'STF',
  Other: 'OTH',
};

export const generateAttendeeCode = (designation) => {
  const prefix = designationPrefixes[designation] || 'GEN';
  const shortId = shortid.generate().toUpperCase().substring(0, 6);
  return `GJ25-${prefix}-${shortId}`;
};

