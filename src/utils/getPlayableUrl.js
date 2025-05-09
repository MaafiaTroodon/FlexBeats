export const getPlayableUrl = (track) => {
    console.log("🧪 getPlayableUrl input:", track);
  
    const tryLog = (label, url) => {
      if (url) console.log(`✅ ${label}: ${url}`);
    };
  
    if (!track) return null;
  
    const applePreview = track.stores?.apple?.previewurl;
    tryLog("Apple Preview", applePreview);
    if (applePreview?.endsWith('.m4a') || applePreview?.endsWith('.mp3')) return applePreview;
  
    const attrPreview = track.attributes?.previews?.[0]?.url;
    tryLog("Attribute Preview", attrPreview);
    if (attrPreview?.endsWith('.m4a') || attrPreview?.endsWith('.mp3')) return attrPreview;
  
    const actionPreview = track.hub?.actions?.find(
      (a) => a?.uri?.endsWith('.m4a') || a?.uri?.endsWith('.mp3')
    )?.uri;
    tryLog("Action Preview", actionPreview);
    if (actionPreview) return actionPreview;
  
    if (track.url?.includes('shazam.com/track')) {
      console.log("❌ Skipping Shazam web URL:", track.url);
      return null;
    }
  
    return null;
  };