import type { Request, Response } from "express";
import path from "path";

// Handle single image upload and return public URL
export const uploadImage = async (req: Request, res: Response) => {
  try {
    // multer attaches file to req.file
    const file = (req as any).file;
    if (!file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // Build a URL that the frontend can use to fetch the uploaded image
    const host = req.get("host");
    const protocol = req.protocol;
    const publicUrl = `${protocol}://${host}/uploads/${file.filename}`;

    res.status(201).json({ imageUrl: publicUrl });
  } catch (error) {
    console.error("Error uploading image:", error);
    res.status(500).json({ error: "Failed to upload image" });
  }
};
