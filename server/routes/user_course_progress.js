import createEntityRouter from './_createEntityRouter.js';

export default createEntityRouter('user_course_progress', {
  guest: { read: false },
  client: { read: false, readOwn: true, create: true, updateOwn: true, delete: false },
  groomer: { read: true, create: false, update: true, delete: false },
}, { ownerField: 'user_id' });
