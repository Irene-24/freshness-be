import { S3Client, DeleteObjectsCommand } from "@aws-sdk/client-s3";
import multer from "multer";
import multerS3 from "multer-s3";
import config from "@/src/config";
import { Request } from "express";

class S3Service {
  private static s3 = new S3Client(config.s3.credentials);

  private static upload = (folder = "uploads") =>
    multer({
      storage: multerS3({
        s3: this.s3,
        bucket: config.s3.bucket as string,
        contentType: multerS3.AUTO_CONTENT_TYPE,
        key: function (
          req: Request,
          file: Express.Multer.File,
          cb: (error: any, key?: string) => void
        ) {
          // Modify the key if needed, e.g., add a prefix or use a dynamic filename
          const key = `${folder}/${Date.now()}-${file.originalname}`;
          cb(null, key);
        },
      }),

      fileFilter: (
        req: Request,
        file: Express.Multer.File,
        cb: (error: any, acceptFile: boolean) => void
      ) => {
        // Check if the file is an image
        if (!file.mimetype.startsWith("image/")) {
          cb(new Error("Only image files are allowed."), false);
        } else {
          cb(null, true);
        }
      },

      limits: {
        // Max file size in bytes (1MB)
        fileSize: 1024 * 1024,
      },
    });

  public static singleUpload = (fieldName = "file", folder?: string) =>
    this.upload(folder).single(fieldName);

  public static multipleUpload = (
    fieldName = "files",
    maxCount: number,
    folder?: string
  ) => this.upload(folder).array(fieldName, maxCount);

  public static fieldsUpload = (fields: multer.Field[], folder?: string) =>
    this.upload(folder).fields(fields);

  public static deleteFile = async (fileKeys: string | string[]) => {
    if (!Array.isArray(fileKeys)) {
      fileKeys = [fileKeys];
    }

    try {
      const command = new DeleteObjectsCommand({
        Bucket: config.s3.bucket,
        Delete: { Objects: fileKeys.map((Key) => ({ Key })) },
      });

      await this.s3.send(command);
    } catch (err) {
      throw err;
    }
  };
}

export default S3Service;
