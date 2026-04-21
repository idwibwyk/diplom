import createEntityRouter from './_createEntityRouter.js';

export default createEntityRouter('course_quiz_answers', {
  guest: { read: false, create: true, update: false, delete: false },
  client: { read: false, readOwn: true, create: true, update: false, delete: false },
  groomer: { read: true, create: false, update: false, delete: false },
}, { ownerField: 'user_id' });
