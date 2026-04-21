import createEntityRouter from './_createEntityRouter.js';

export default createEntityRouter('documents', {
  guest: { read: true, create: false, update: false, delete: false },
  client: { read: true, create: false, update: false, delete: false },
  groomer: { read: true, create: false, update: false, delete: false },
}, { searchField: 'title' });
