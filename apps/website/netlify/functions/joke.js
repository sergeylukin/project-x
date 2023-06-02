export const handler = async () => {
  const randomNum = Math.random();

  return {
    statusCode: 200,
    body: JSON.stringify({
      randomNum,
    }),
  };
};
