function makeTestInput() {
  const testFeelings = [
    {
      id: 1,
      emotion: "Anger",
      color: "Blue"
    },
    {
      id: 2,
      emotion: "Guilt",
      color: "Orange"
    }
  ];

  const testFeelingsUpdate = {
    id: 2,
    emotion: "Guilt",
    color: "Grey"
  };

  const testInvalidInput = {
    id: 1,
    emotion: "Anger",
    color: 4
  };

  const testValidInput = {
    id: 1,
    emotion: "Anger",
    color: "Green"
  };
  return { testFeelings, testValidInput, testInvalidInput, testFeelingsUpdate };
}

module.exports = {
  makeTestInput
};
