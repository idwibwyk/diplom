import createEntityRouter from './_createEntityRouter.js';

export default createEntityRouter('shelter_applications', {
  guest: { read: false, create: true, update: false, delete: false },
  client: { read: false, create: true, update: false, delete: false },
  groomer: { read: false, create: false },
});
