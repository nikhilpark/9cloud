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

  export const formatFileSize = (sizeInBytes: number): string => {
    const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  
    let size = sizeInBytes;
    let unitIndex = 0;
  
    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }
  
    return `${size.toFixed(2)} ${units[unitIndex]}`;
  };

  export const getFileType = (extension:string) => {
    const fileTypeMap:Record<string,string> = {
      txt: 'text', 
      doc: 'document',
      docx: 'document',
      pdf: 'document',
      xls: 'document',
      xlsx: 'document',
      pptx: 'document',
      rtf: 'document',
      csv: 'document',
      jpg: 'image',
      jpeg: 'image',
      png: 'image',
      gif: 'image',
      bmp: 'image',
      tiff: 'image',
      svg: 'image',
      mp4: 'video',
      avi: 'video',
      mov: 'video',
      mkv: 'video',
      flv: 'video',
      wmv: 'video',
      zip: 'archive',
      rar: 'archive',
      tar: 'archive',
      gz: 'archive',
      bz2: 'archive',
      "7z": 'archive',
      mp3: 'audio',
      wav: 'audio',
      aac: 'audio',
      flac: 'audio',
      ogg: 'audio',
      exe: 'executable',
      dll: 'executable',
      bat: 'script',
      sh: 'script',
      py: 'script',
      js: 'script',
      css: 'stylesheet',
      scss: 'stylesheet',
      less: 'stylesheet',
      html: 'markup',
      xml: 'markup',
      md: 'markup',
      php: 'code',
      java: 'code',
      cpp: 'code',
      c: 'code',
      h: 'code',
      hpp: 'code',
      rb: 'code',
      ts: 'code',
      jsx: 'code',
      vue: 'code',
      swift: 'code',
      go: 'code',
      pl: 'code',
      sql: 'code',
      asm: 'code',
      dat: 'data',
      sqlite: 'database',
      bak: 'backup',
      log: 'log',
      ini: 'configuration',
      cfg: 'configuration',
      yml: 'configuration',
      json: 'configuration',
      tom: 'configuration',
      ppt: 'presentation',
      crt: 'certificate',
      pem: 'certificate',
      csr: 'certificate',
      key: 'certificate',

    };
  
    const lowercasedExtension = extension.toLowerCase();
    return fileTypeMap[lowercasedExtension] || 'unknown';
  };

  export  const getTimeDifference = (time:string) => {
    const prevTime = new Date(time).getTime()
    const currentTime = new Date().getTime()
    const timeDifference = currentTime - prevTime
    const timeDifferenceInMinutes = timeDifference / 60000
    if (timeDifferenceInMinutes <= 1) {
      return `${(timeDifferenceInMinutes * 60).toFixed(0)} s`
    }
    else if (timeDifferenceInMinutes > 1 && timeDifferenceInMinutes <= 60) {
      return `${timeDifferenceInMinutes.toFixed(0)} m`
    } else if (timeDifferenceInMinutes > 60 && timeDifferenceInMinutes <= 1440) {
      const timeDifferenceInHours = (timeDifferenceInMinutes / 60).toFixed(2)
      const hours = String(timeDifferenceInHours).split('.')[0]
      console.log(String(timeDifferenceInHours.split('.')))
      const minutes = (parseFloat('0.' + String(timeDifferenceInHours).split('.')[1]) * 60).toFixed(0)
      return `${hours} h `
    } else if (timeDifferenceInMinutes > 1440) {
      const timeDifferenceInDays = (timeDifferenceInMinutes / 1440).toFixed(2)
      const days = String(timeDifferenceInDays).split('.')[0]
      const hours = (parseFloat('0.' + String(timeDifferenceInDays).split('.')[1]) * 24).toFixed(0)
      return `${days} days `
    }
  }