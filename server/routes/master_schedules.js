import createEntityRouter from './_createEntityRouter.js';

export default createEntityRouter('master_schedules', {
  guest: { read: true, create: false, update: false, delete: false },
  client: { read: true, create: false, update: false, delete: false },
  groomer: { read: true, readOwn: true, create: true, updateOwn: true, deleteOwn: true },
}, { ownerField: 'master_id' });
