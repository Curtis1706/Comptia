import fs from "fs";
import path from "path";
import os from "os";

/**
 * Interface pour le service de stockage.
 * Abstraction pour le stockage local, éphémère serverless (Vercel) et cloud.
 */
export interface StorageService {
  uploadFile(file: Buffer, filename: string, folder: string): Promise<string>;
  getSignedUrl(fileUrl: string): Promise<string>;
  deleteFile(fileUrl: string): Promise<void>;
  getFileBuffer(fileUrl: string): Promise<Buffer | null>;
}

/**
 * Implémentation résiliente compatible Vercel Serverless (AWS Lambda /tmp) et développement local.
 * Évite les crashs EROFS (Read-only file system) en production.
 */
class ResilientStorageService implements StorageService {
  private isServerless(): boolean {
    return Boolean(
      process.env.VERCEL ||
      process.env.AWS_LAMBDA_FUNCTION_NAME ||
      process.env.LAMBDA_TASK_ROOT
    );
  }

  private getStorageDir(folder: string): string {
    // Si environnement Vercel / serverless : écriture exclusive dans /tmp
    if (this.isServerless()) {
      const tmpDir = path.join(os.tmpdir(), "uploads", folder);
      if (!fs.existsSync(tmpDir)) {
        fs.mkdirSync(tmpDir, { recursive: true });
      }
      return tmpDir;
    }

    // Sinon tentative dans public/uploads pour le développement local
    try {
      const publicDir = path.join(process.cwd(), "public", "uploads", folder);
      if (!fs.existsSync(publicDir)) {
        fs.mkdirSync(publicDir, { recursive: true });
      }
      return publicDir;
    } catch {
      // Fallback automatique vers os.tmpdir() si le système de fichiers est protégé
      const fallbackDir = path.join(os.tmpdir(), "uploads", folder);
      if (!fs.existsSync(fallbackDir)) {
        fs.mkdirSync(fallbackDir, { recursive: true });
      }
      return fallbackDir;
    }
  }

  async uploadFile(file: Buffer, filename: string, folder: string): Promise<string> {
    const dir = this.getStorageDir(folder);
    const absolutePath = path.join(dir, filename);
    fs.writeFileSync(absolutePath, file);

    // URL relative cohérente pour la persistance en base de données
    return `/uploads/${folder}/${filename}`;
  }

  async getFileBuffer(fileUrl: string): Promise<Buffer | null> {
    const cleanRelative = fileUrl.startsWith("/") ? fileUrl.slice(1) : fileUrl;

    // 1. Recherche dans public/uploads (mode dev)
    const publicPath = path.join(process.cwd(), "public", cleanRelative);
    if (fs.existsSync(publicPath)) {
      return fs.readFileSync(publicPath);
    }

    // 2. Recherche dans os.tmpdir()/uploads (mode serverless /tmp)
    const parts = cleanRelative.split("/");
    const tmpPath = path.join(os.tmpdir(), ...parts);
    if (fs.existsSync(tmpPath)) {
      return fs.readFileSync(tmpPath);
    }

    // 3. Fallback sur le nom de fichier seul dans os.tmpdir()/uploads
    const filenameOnly = path.basename(fileUrl);
    const fallbackTmp = path.join(os.tmpdir(), "uploads", filenameOnly);
    if (fs.existsSync(fallbackTmp)) {
      return fs.readFileSync(fallbackTmp);
    }

    return null;
  }

  async getSignedUrl(fileUrl: string): Promise<string> {
    return fileUrl;
  }

  async deleteFile(fileUrl: string): Promise<void> {
    const cleanRelative = fileUrl.startsWith("/") ? fileUrl.slice(1) : fileUrl;
    const publicPath = path.join(process.cwd(), "public", cleanRelative);
    if (fs.existsSync(publicPath)) {
      try { fs.unlinkSync(publicPath); } catch {}
    }

    const parts = cleanRelative.split("/");
    const tmpPath = path.join(os.tmpdir(), ...parts);
    if (fs.existsSync(tmpPath)) {
      try { fs.unlinkSync(tmpPath); } catch {}
    }
  }
}

export const storage = new ResilientStorageService();
