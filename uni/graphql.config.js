module.exports = {
  schema: [ "http://localhost:4001/graphql" ],
  documents: "**/*.ts",
  extensions: {
    endpoints: {
      default: {
        url: "http://localhost:4001/graphql",
        headers: {
          Authorization: "eyJhbGciOiJIUzI1NiJ9.eyJpZCI6IjlMbW5xaExJVHpLc2tGTy9sY1hScUEiLCJvcmdfaWQiOiIiLCJ0ZW5hbnRfaWQiOiJaRGJabEMxT1Q4S2FEZzZzb3hNQ0JRIiwibGFuZyI6InpoLUNOIiwiZXhwIjoxNzQxNjgwMjk1fQ.KY6nS9n7wEK3GBczOIAMA1ZH3mcimvcf5ghVF3nONro",
        },
      },
    },
  },
};
