import createEntityRouter from './_createEntityRouter.js';

export default createEntityRouter('course_bookings', {
  guest: { read: false, create: false },
  client: { read: false, readOwn: true, create: true, updateOwn: true, delete: false },
  groomer: { read: true, create: false, update: true, delete: false },
}, { ownerField: 'user_id' });
