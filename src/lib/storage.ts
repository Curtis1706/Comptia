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
      process.env.VERCEL_ENV ||
      process.env.VERCEL_URL ||
      process.env.VERCEL_REGION ||
      process.env.NOW_REGION ||
      process.env.AWS_REGION ||
      process.env.AWS_LAMBDA_FUNCTION_NAME ||
      process.env.LAMBDA_TASK_ROOT ||
      process.env.NODE_ENV === "production"
    );
  }

  async uploadFile(file: Buffer, filename: string, folder: string): Promise<string> {
    // 1. En environnement serverless / production : écriture exclusive dans /tmp
    if (this.isServerless()) {
      const tmpDir = path.join(os.tmpdir(), "uploads", folder);
      try {
        fs.mkdirSync(tmpDir, { recursive: true });
        fs.writeFileSync(path.join(tmpDir, filename), file);
        return `/uploads/${folder}/${filename}`;
      } catch (err) {
        console.warn("[storage.uploadFile] Fallback tmp racine :", err);
        const rootTmp = path.join(os.tmpdir(), filename);
        fs.writeFileSync(rootTmp, file);
        return `/uploads/${folder}/${filename}`;
      }
    }

    // 2. En développement local : tentative d'écriture dans public/uploads avec fallback
    try {
      const publicDir = path.join(process.cwd(), "public", "uploads", folder);
      fs.mkdirSync(publicDir, { recursive: true });
      fs.writeFileSync(path.join(publicDir, filename), file);
      return `/uploads/${folder}/${filename}`;
    } catch (localErr) {
      console.warn("[storage.uploadFile] Fallback local vers os.tmpdir() :", localErr);
      const tmpDir = path.join(os.tmpdir(), "uploads", folder);
      fs.mkdirSync(tmpDir, { recursive: true });
      fs.writeFileSync(path.join(tmpDir, filename), file);
      return `/uploads/${folder}/${filename}`;
    }
  }

  async getFileBuffer(fileUrl: string): Promise<Buffer | null> {
    const cleanRelative = fileUrl.startsWith("/") ? fileUrl.slice(1) : fileUrl;
    const parts = cleanRelative.split("/");
    const filenameOnly = path.basename(fileUrl);

    // 1. Recherche dans os.tmpdir()/uploads/${folder}/${filename}
    try {
      const tmpPath = path.join(os.tmpdir(), ...parts);
      if (fs.existsSync(tmpPath)) {
        return fs.readFileSync(tmpPath);
      }
    } catch {}

    // 2. Recherche directe dans os.tmpdir()/${filename}
    try {
      const fallbackTmp = path.join(os.tmpdir(), filenameOnly);
      if (fs.existsSync(fallbackTmp)) {
        return fs.readFileSync(fallbackTmp);
      }
    } catch {}

    // 3. Recherche dans os.tmpdir()/uploads/${filename}
    try {
      const fallbackUploadsTmp = path.join(os.tmpdir(), "uploads", filenameOnly);
      if (fs.existsSync(fallbackUploadsTmp)) {
        return fs.readFileSync(fallbackUploadsTmp);
      }
    } catch {}

    // 4. Recherche dans public/${cleanRelative} (mode dev)
    try {
      const publicPath = path.join(process.cwd(), "public", cleanRelative);
      if (fs.existsSync(publicPath)) {
        return fs.readFileSync(publicPath);
      }
    } catch {}

    return null;
  }

  async getSignedUrl(fileUrl: string): Promise<string> {
    return fileUrl;
  }

  async deleteFile(fileUrl: string): Promise<void> {
    const cleanRelative = fileUrl.startsWith("/") ? fileUrl.slice(1) : fileUrl;
    const filenameOnly = path.basename(fileUrl);
    const publicPath = path.join(process.cwd(), "public", cleanRelative);
    if (fs.existsSync(publicPath)) {
      try { fs.unlinkSync(publicPath); } catch {}
    }

    const parts = cleanRelative.split("/");
    const tmpPath = path.join(os.tmpdir(), ...parts);
    if (fs.existsSync(tmpPath)) {
      try { fs.unlinkSync(tmpPath); } catch {}
    }

    const fallbackTmp = path.join(os.tmpdir(), filenameOnly);
    if (fs.existsSync(fallbackTmp)) {
      try { fs.unlinkSync(fallbackTmp); } catch {}
    }
  }
}

export const storage = new ResilientStorageService();
