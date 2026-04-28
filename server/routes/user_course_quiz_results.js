import createEntityRouter from './_createEntityRouter.js';

export default createEntityRouter('user_course_quiz_results', {
  guest: { read: false, create: false },
  client: { read: false, readOwn: true, create: true, updateOwn: true, delete: false },
  groomer: { read: true, create: false, update: false, delete: false },
  admin: { read: true, create: true, update: true, delete: true },
}, { ownerField: 'user_id' });
