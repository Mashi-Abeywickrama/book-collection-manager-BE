import path from 'path';
import fs from 'fs';
import Book from '../models/book.model';

export const saveImageToPublic = async (file: Express.Multer.File, userId: number) => {
    const timestamp = Date.now();
    const fileName = `${userId}_${timestamp}.${file.mimetype.split('/')[1]}`;
    console.log(fileName);
    const filePath = path.join(__dirname, process.env.IMAGE_UPLOAD_PATH as string, fileName);
    fs.renameSync(file.path, filePath);
  
    return fileName;
};

export const updateCoverImage = async (id: number, coverImg: string) => {
    return await Book.findByIdAndUpdate(id, { coverImg }, { new: true }).exec();
}