import fs from "fs";
import path from "path";

/**
 * Interface pour le service de stockage.
 * Permet d'abstraire le système de fichiers local vs S3.
 */
export interface StorageService {
  uploadFile(file: Buffer, filename: string, folder: string): Promise<string>;
  getSignedUrl(fileUrl: string): Promise<string>;
  deleteFile(fileUrl: string): Promise<void>;
}

/**
 * Implémentation locale pour le développement.
 */
class LocalStorageService implements StorageService {
  async uploadFile(file: Buffer, filename: string, folder: string): Promise<string> {
    const relativePath = `/uploads/${folder}/${filename}`;
    const absoluteDir = path.join(process.cwd(), "public", "uploads", folder);

    if (!fs.existsSync(absoluteDir)) {
      fs.mkdirSync(absoluteDir, { recursive: true });
    }

    const absolutePath = path.join(absoluteDir, filename);
    fs.writeFileSync(absolutePath, file);

    return relativePath;
  }

  async getSignedUrl(fileUrl: string): Promise<string> {
    // En local, l'URL publique est directe.
    return fileUrl;
  }

  async deleteFile(fileUrl: string): Promise<void> {
    const absolutePath = path.join(process.cwd(), "public", fileUrl);
    if (fs.existsSync(absolutePath)) {
      fs.unlinkSync(absolutePath);
    }
  }
}

// TODO: Implémenter S3StorageService pour la production
/*
class S3StorageService implements StorageService {
  // ...
}
*/

export const storage = new LocalStorageService();
