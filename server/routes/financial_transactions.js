import createEntityRouter from './_createEntityRouter.js';

export default createEntityRouter('financial_transactions', {
  guest: { read: false, create: false },
  client: { read: false, create: false },
  groomer: { read: false, create: false },
});
