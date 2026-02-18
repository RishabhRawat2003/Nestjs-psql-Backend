import multer from 'multer';

export const multerOptions = {
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB
  },
  fileFilter: (req: any, file: Express.Multer.File, cb: any) => {
    if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/')) {
      cb(null, true); // accept the file
    } else {
      cb(null, false); // reject the file
    }
  },
};
