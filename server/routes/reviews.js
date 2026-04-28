import createEntityRouter from './_createEntityRouter.js';

export default createEntityRouter('reviews', {
  guest: { read: true, create: false, update: false, delete: false },
  client: { read: false, readOwn: true, create: true, updateOwn: true, deleteOwn: true, update: false, delete: false },
  groomer: { read: true, create: false, update: false, delete: false },
}, { ownerField: 'user_id' });
