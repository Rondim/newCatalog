export const ROOT_URL = process.env.NODE_ENV === 'development' ?
  'http://localhost:4000' :
  `${global.location.protocol}//${global.window.location.hostname}/graphql`;
export const WS_URL = 'wss://subscriptions.graph.cool/v1/cj5tpc7zsj16i012285uxa6j5';
