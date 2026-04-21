import createEntityRouter from './_createEntityRouter.js';

export default createEntityRouter('visits', {
  guest: { read: false },
  client: { read: false, readOwn: true },
  groomer: { read: true, create: true, update: true, delete: false },
});
