const buildShareFromReq = (body) => {
  const { audio_share, text_share, share_type, feeling_id, emotion } = body;
  const newPendingShare = {
    audio_share,
    text_share,
    share_type,
    feeling_id,
    emotion,
  };

  // ADD error handleing here returning error object if needed

  return newPendingShare;
};

module.exports = { buildShareFromReq };
