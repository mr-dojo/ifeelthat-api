function makeTestShareInput() {
  const testShare = [
    {
      id: 1,
      audio_share: "testURLstring",
      text_share: null,
      emotion: "Joy",
      feeling_id: 1,
      share_type: "Audio",
    },
  ];

  const invalidTestShareInput = [
    {
      id: 1,
      audio_share: null,
      emotion: "Joy",
      text_share: 2154,
      feeling_id: 1,
      share_type: "Text",
    },
  ];

  const validTestShareInput = {
    id: 1,
    audio_share: "testURLstring",
    emotion: "Joy",
    text_share: null,
    feeling_id: 1,
    share_type: "Audio",
  };

  const updateTestShareInput = {
    id: 1,
    audio_share: "updated string",
    emotion: "Joy",
    text_share: null,
    feeling_id: 1,
    share_type: "Audio",
  };

  return {
    testShare,
    invalidTestShareInput,
    validTestShareInput,
    updateTestShareInput,
  };
}

module.exports = {
  makeTestShareInput,
};
