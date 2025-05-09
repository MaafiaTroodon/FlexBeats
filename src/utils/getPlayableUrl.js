// src/utils/getPlayableUrl.js

export const getPlayableUrl = (track) => {
    if (!track) return null;
  
    // ✅ 1. Apple preview (actual audio)
    const applePreview = track.stores?.apple?.previewurl;
    if (applePreview?.includes('audio-ssl.itunes.apple.com')) return applePreview;
  
    // ✅ 2. attributes.previews
    const attrPreview = track.attributes?.previews?.[0]?.url;
    if (attrPreview?.includes('audio-ssl.itunes.apple.com')) return attrPreview;
  
    // ✅ 3. hub.actions (filter out links to /track/)
    const actionPreview = track.hub?.actions?.find(
      (a) => a?.uri?.includes('audio-ssl.itunes.apple.com') || a?.uri?.includes('.m4a') || a?.uri?.includes('.mp3')
    )?.uri;
    if (actionPreview?.includes('audio-ssl.itunes.apple.com') || actionPreview?.endsWith('.m4a') || actionPreview?.endsWith('.mp3')) {
      return actionPreview;
    }
  
    // 🚫 Skip links that go to shazam.com/track (these are *not* playable streams)
    if (track.url?.includes('shazam.com/track')) return null;
  
    return null;
  };