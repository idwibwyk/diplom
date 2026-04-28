import createEntityRouter from './_createEntityRouter.js';

export default createEntityRouter('notifications', {
  guest: { read: false },
  client: { read: false, readOwn: true, create: true, updateOwn: true, deleteOwn: true },
  groomer: { read: false, readOwn: true, create: false, updateOwn: true },
}, { ownerField: 'user_id' });
