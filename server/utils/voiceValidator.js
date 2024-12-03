export const validateVoiceSettings = (settings) => {
  // Normalize keys to lowercase
  const normalizedSettings = Object.keys(settings).reduce((acc, key) => {
    acc[key.toLowerCase()] = settings[key];
    return acc;
  }, {});
  
  const { stability, similarity_boost, style } = normalizedSettings;
  
  // Check if all required fields exist
  if (stability === undefined || similarity_boost === undefined || style === undefined) {
    console.error('Missing required voice settings fields');
    return false;
  }
  
  // Validate value ranges
  if (typeof stability !== 'number' || stability < 0 || stability > 1) {
    console.error('Invalid stability value:', stability);
    return false;
  }
  
  if (typeof similarity_boost !== 'number' || similarity_boost < 0 || similarity_boost > 1) {
    console.error('Invalid similarity_boost value:', similarity_boost);
    return false;
  }
  
  if (typeof style !== 'number' || style < 0 || style > 1) {
    console.error('Invalid style value:', style);
    return false;
  }
  
  return true;
};