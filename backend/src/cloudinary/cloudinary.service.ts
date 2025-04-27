import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

// Cloudinary
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryConfig } from './cloudinary.config';

@Injectable()
export class CloudinaryService {
  constructor() {
    CloudinaryConfig();
  }

  async uploadImage(
    file: Express.Multer.File,
    folder: string,
  ): Promise<string> {
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
              if (result?.secure_url) {
                resolve(result.secure_url);
              } else {
                reject(
                  new HttpException(
                    "L'URL sécurisée de l'image est introuvable.",
                    HttpStatus.INTERNAL_SERVER_ERROR,
                  ),
                );
              }
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

  async destroyAllImagesFromFolder(folder: string): Promise<void> {
    try {
      // Get all pictures from articles by user
      const results = await cloudinary.api.resources({
        type: 'upload',
        prefix: folder,
      });

      // Delete them
      for (const resource of results.resources) {
        const publicId = resource.public_id;

        // Destroy
        await cloudinary.uploader.destroy(publicId);
      }
    } catch {
      throw new HttpException(
        'Erreur lors de la suppression des images',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
