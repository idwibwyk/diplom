import createEntityRouter from './_createEntityRouter.js';

export default createEntityRouter('education_org_info', {
  guest: { read: true, create: false, update: false, delete: false },
  client: { read: true, create: false, update: false, delete: false },
  groomer: { read: true, create: false, update: false, delete: false },
});
