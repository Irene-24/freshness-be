import S3Service from "@/services/S3.service";
import multer from "multer";

import { Request, Response, NextFunction } from "express";
import { serializeError } from "serialize-error";

export const checkSingleImage =
  (fieldName: string, folder = "uploads") =>
  async (req: Request, res: Response, next: NextFunction) => {
    S3Service.singleUpload(fieldName, folder)(req, res, (err: any) => {
      if (err instanceof multer.MulterError) {
        res.status(400).json({
          error: "Invalid file format or size",
          message: "Only image files <=1 MB allowed",
        });
      } else if (err) {
        res.status(500).json({
          error: serializeError(err),
          message: "Unable to upload image",
        });
      } else {
        next();
      }
    });
  };

export const checkMixedImages =
  (fields: multer.Field[], folder = "uploads") =>
  async (req: Request, res: Response, next: NextFunction) => {
    S3Service.fieldsUpload(fields, folder)(req, res, (err: any) => {
      if (err instanceof multer.MulterError) {
        res.status(400).json({
          error: "Invalid file format or size",
          message: "Only image(s) files <=1 MB allowed",
        });
      } else if (err) {
        res.status(500).json({
          error: serializeError(err),
          message: "Unable to upload images",
        });
      } else {
        next();
      }
    });
  };
