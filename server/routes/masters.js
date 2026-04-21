import createEntityRouter from './_createEntityRouter.js';

export default createEntityRouter('masters', {
  guest: { read: true, create: false, update: false, delete: false },
  client: { read: true, create: false, update: false, delete: false },
  groomer: { read: true, create: true, update: true, updateOwn: true, delete: false },
});
