import { isDev } from './isDev';

export const getUploadedFileUrl = (file: Express.Multer.File) => {
  return isDev()
    ? `${process.env.STATIC_URL}/files/${file.filename}`
    : `${process.env.URL}/files/${file.filename}}`;
};
