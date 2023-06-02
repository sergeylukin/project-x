import { builder } from '@netlify/functions';

const {
  handler: internalHandler,
} = require('../../.netlify/functions-internal/entry.mjs');

const handler = builder(async (event, context) => {
  const originalResponse = await internalHandler(event, context);
  originalResponse.ttl = 60;

  return originalResponse;
});

module.exports = { handler };
