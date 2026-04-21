import createEntityRouter from './_createEntityRouter.js';

export default createEntityRouter('warehouse_transactions', {
  guest: { read: false, create: false },
  client: { read: false, create: false },
  groomer: { read: true, create: true, update: false, delete: false },
});
