import createEntityRouter from './_createEntityRouter.js';

export default createEntityRouter('messages', {
  guest: { read: false },
  client: { read: false, readOwn: true, create: true, updateOwn: true },
  groomer: { read: false, readOwn: true, create: true, updateOwn: true },
}, { ownerField: 'sender_id' });
