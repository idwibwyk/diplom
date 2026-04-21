import createEntityRouter from './_createEntityRouter.js';

export default createEntityRouter('course_quiz_options', {
  guest: { read: true, create: false, update: false, delete: false },
  client: { read: true, create: false, update: false, delete: false },
  groomer: { read: true, create: false, update: false, delete: false },
});
