module.exports = {
  transform: {
    '^.+\\.(t|j)s?$': [
      'ts-node',

      // configuration
      {
        dynamicImport: true,
      },
    ],
  },
};
