import createEntityRouter from './_createEntityRouter.js';

export default createEntityRouter('loyalty_accounts', {
  guest: { read: false },
  client: { read: false, readOwn: true, create: false, update: false, delete: false },
  groomer: { read: true, create: false, update: false, delete: false },
}, { ownerField: 'user_id' });
