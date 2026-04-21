import createEntityRouter from './_createEntityRouter.js';

export default createEntityRouter('users', {
  guest: { create: true, read: false, update: false, delete: false },
  client: { read: false, readOwn: true, updateOwn: true, create: false, update: false, delete: false },
  groomer: { read: true, update: false, delete: false },
}, { excludeFields: ['password_hash'], ownerField: 'id' });
