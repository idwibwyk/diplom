import createEntityRouter from './_createEntityRouter.js';

export default createEntityRouter('library_articles', {
  guest: { read: true, create: false, update: false, delete: false },
  client: { read: true, create: false, update: false, delete: false },
  groomer: { read: true, create: true, update: true, delete: false },
}, { searchField: 'title' });
