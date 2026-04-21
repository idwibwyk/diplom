import createEntityRouter from './_createEntityRouter.js';

export default createEntityRouter('pets', {
  guest: { read: false, create: false },
  client: { read: false, readOwn: true, create: true, updateOwn: true, deleteOwn: true, update: false, delete: false },
  groomer: { read: true, create: false, update: false, delete: false },
}, { ownerField: 'user_id' });
