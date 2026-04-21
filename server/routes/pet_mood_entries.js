import createEntityRouter from './_createEntityRouter.js';

export default createEntityRouter('pet_mood_entries', {
  guest: { read: false },
  client: { read: false, readOwn: true, create: true, updateOwn: true, deleteOwn: true },
  groomer: { read: true, create: false, update: false, delete: false },
}, { ownerField: 'user_id' });
