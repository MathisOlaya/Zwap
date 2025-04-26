import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

// Cloudinary
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryConfig } from './cloudinary.config';

@Injectable()
export class CloudinaryService {
  constructor() {
    CloudinaryConfig();
  }

  async uploadImage(file: Express.Multer.File, folder: string) {
    try {
      return new Promise((resolve, reject) => {
        const upload = cloudinary.uploader.upload_stream(
          {
            folder,
            quality: 'auto:low',
            resource_type: 'image',
          },
          (error, result) => {
            if (error) {
              reject(
                new HttpException(
                  "Erreur lors de l'upload de l'image",
                  HttpStatus.INTERNAL_SERVER_ERROR,
                ),
              );
            } else {
              resolve(result?.secure_url);
            }
          },
        );

        // Give image's buffer
        upload.end(file.buffer);
      });
    } catch (err) {
      console.error(err);
      throw new HttpException(
        'Erreur lors le sauvegarde des images.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
