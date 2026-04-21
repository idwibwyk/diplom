import createEntityRouter from './_createEntityRouter.js';

export default createEntityRouter('zone_rental_applications', {
  guest: { read: false, create: true, update: false, delete: false },
  client: { read: false, readOwn: true, create: true, update: false, delete: false },
  groomer: { read: false, create: false },
}, { ownerField: 'user_id' });
