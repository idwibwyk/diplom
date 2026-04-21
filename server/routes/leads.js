import createEntityRouter from './_createEntityRouter.js';

export default createEntityRouter('leads', {
  guest: { create: true, read: false, update: false, delete: false },
  client: { read: false, create: true, update: false, delete: false },
  groomer: { read: false, create: false, update: false, delete: false },
});
