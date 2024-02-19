export function getUidFromSub(sub:String) {
    // Extract numeric part from sub
    const subParts = sub.split('|');
    const numericSub = subParts[1];
  
    // Ensure the numeric part is a valid number
    const numericValue = parseInt(numericSub, 10);
    if (isNaN(numericValue)) {
      throw new Error('Invalid numeric sub value');
    }
  
    // Convert the numeric value to a base36 string
    let base36String = numericValue.toString(36);
  
    // Calculate the padding length to ensure the UID is 26 characters long
    const paddingLength = Math.max(26 - base36String.length, 0);
  
    // Pad the string to ensure it's 26 characters long
    const paddedUid = 'a'.repeat(paddingLength) + base36String;
  
    return paddedUid;
  }
  
  export function getSubFromUid(uid:String) {
    // Remove leading 'a' characters used for padding
    const trimmedUid = uid.replace(/^a+/, '');
  
    // Convert the base36 string to a numeric value
    const numericValue = parseInt(trimmedUid, 36);
    if (isNaN(numericValue)) {
      throw new Error('Invalid UID format');
    }
  
    // Construct the original 'sub' value
    const originalSub = `google-oauth2|${numericValue}`;
  
    return originalSub;
  }