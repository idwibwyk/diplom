import createEntityRouter from './_createEntityRouter.js';

export default createEntityRouter('favorite_services', {
  guest: { read: false },
  client: { read: false, readOwn: true, create: true, deleteOwn: true, update: false, delete: false },
  groomer: { read: true, create: false, update: false, delete: false },
}, { ownerField: 'user_id' });
