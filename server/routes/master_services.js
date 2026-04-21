import createEntityRouter from './_createEntityRouter.js';

export default createEntityRouter('master_services', {
  guest: { read: true, create: false, update: false, delete: false },
  client: { read: true, create: false, update: false, delete: false },
  groomer: { read: true, create: true, update: true, delete: false },
});
