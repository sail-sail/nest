module.exports = {
  schema: [ "http://localhost:4001/graphql" ],
  documents: "**/*.ts",
  extensions: {
    endpoints: {
      default: {
        url: "http://localhost:4001/graphql",
        headers: {
          Authorization: "eyJhbGciOiJIUzI1NiJ9.eyJpZCI6IjlMbW5xaExJVHpLc2tGTy9sY1hScUEiLCJkZXB0X2lkIjoiUi9WSFcwa3pSeEs5dEc4bUlITWRiUSIsImV4cCI6MTk4MjYzMTE2M30.unudogI0epH0lsPs2EOYFQAGnPHP0OPeOJG6eyauA2M",
        },
      },
    },
  },
};
