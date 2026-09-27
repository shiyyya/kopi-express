import multer from 'multer';
import { generateID } from '../utils/idGenerator.js';

const storage = multer.diskStorage({
  destination: 'uploads/products',

  filename: (_request, file, callback) => {
    const extension = file.originalname.split('.').pop();

    callback(null, `${generateID()}.${extension}`);
  },
});

export const upload = multer({ storage });