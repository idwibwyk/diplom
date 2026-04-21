import createEntityRouter from './_createEntityRouter.js';

export default createEntityRouter('warehouse_items', {
  guest: { read: false, create: false },
  client: { read: false, create: false },
  groomer: { read: true, create: false, update: false, delete: false },
});
