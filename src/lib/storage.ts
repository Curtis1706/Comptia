import fs from "fs";
import path from "path";
import os from "os";
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";

/**
 * Interface pour le service de stockage.
 * Abstraction unifiée pour Cloudflare R2, stockage local et éphémère serverless.
 */
export interface StorageService {
  uploadFile(file: Buffer, filename: string, folder: string, mimeType?: string): Promise<string>;
  getSignedUrl(fileUrl: string): Promise<string>;
  deleteFile(fileUrl: string): Promise<void>;
  getFileBuffer(fileUrl: string): Promise<Buffer | null>;
}

/**
 * Service de stockage résilient Cloudflare R2 (compatible S3)
 * avec fallback local et serverless (/tmp).
 */
class CloudflareR2StorageService implements StorageService {
  private s3Client: S3Client | null = null;
  private bucket: string;
  private publicUrl: string;

  constructor() {
    this.bucket = process.env.CLOUDFLARE_R2_BUCKET_NAME || process.env.S3_BUCKET || "";
    this.publicUrl = (process.env.CLOUDFLARE_R2_PUBLIC_URL || "").replace(/\/+$/, "");

    const endpoint = process.env.CLOUDFLARE_R2_ENDPOINT || process.env.S3_ENDPOINT;
    const accessKeyId = process.env.CLOUDFLARE_R2_ACCESS_KEY_ID || process.env.S3_ACCESS_KEY;
    const secretAccessKey = process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY || process.env.S3_SECRET_KEY;

    if (endpoint && accessKeyId && secretAccessKey && this.bucket) {
      this.s3Client = new S3Client({
        region: "auto",
        endpoint,
        credentials: {
          accessKeyId,
          secretAccessKey,
        },
      });
    }
  }

  private isR2Configured(): boolean {
    return this.s3Client !== null && Boolean(this.bucket);
  }

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

  private extractKey(fileUrl: string): string {
    if (!fileUrl) return "";
    if (fileUrl.startsWith("http://") || fileUrl.startsWith("https://")) {
      try {
        const parsed = new URL(fileUrl);
        return parsed.pathname.replace(/^\/+/, "");
      } catch {
        return fileUrl.replace(/^https?:\/\/[^\/]+\/+/, "");
      }
    }
    return fileUrl.replace(/^\/+/, "");
  }

  async uploadFile(file: Buffer, filename: string, folder: string, mimeType?: string): Promise<string> {
    const key = `uploads/${folder}/${filename}`;

    // 1. Sauvegarde principale sur Cloudflare R2 si configuré
    if (this.isR2Configured() && this.s3Client) {
      try {
        await this.s3Client.send(
          new PutObjectCommand({
            Bucket: this.bucket,
            Key: key,
            Body: file,
            ContentType: mimeType || "application/octet-stream",
          })
        );

        // Sauvegarde miroir locale non-bloquante pour cache immédiat
        this.writeLocalCache(file, folder, filename);

        if (this.publicUrl) {
          return `${this.publicUrl}/${key}`;
        }
        return `/${key}`;
      } catch (r2Err) {
        console.error("[storage.uploadFile] Erreur upload Cloudflare R2, basculement local :", r2Err);
      }
    }

    // 2. Fallback local / Serverless (/tmp ou public/uploads)
    return this.uploadLocal(file, filename, folder);
  }

  private writeLocalCache(file: Buffer, folder: string, filename: string): void {
    try {
      const tmpDir = path.join(os.tmpdir(), "uploads", folder);
      fs.mkdirSync(tmpDir, { recursive: true });
      fs.writeFileSync(path.join(tmpDir, filename), file);
    } catch {}
  }

  private uploadLocal(file: Buffer, filename: string, folder: string): string {
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
    if (!fileUrl) return null;
    const key = this.extractKey(fileUrl);

    // 1. Récupération depuis Cloudflare R2 via SDK S3
    if (this.isR2Configured() && this.s3Client && key) {
      try {
        const res = await this.s3Client.send(
          new GetObjectCommand({
            Bucket: this.bucket,
            Key: key,
          })
        );
        if (res.Body) {
          const bytes = await res.Body.transformToByteArray();
          return Buffer.from(bytes);
        }
      } catch (s3Err: any) {
        // Si non trouvé sur cette clé, tenter avec le nom de fichier seul
        const filenameOnly = path.basename(key);
        if (filenameOnly !== key) {
          try {
            const fallbackRes = await this.s3Client.send(
              new GetObjectCommand({
                Bucket: this.bucket,
                Key: filenameOnly,
              })
            );
            if (fallbackRes.Body) {
              const bytes = await fallbackRes.Body.transformToByteArray();
              return Buffer.from(bytes);
            }
          } catch {}
        }
      }
    }

    // 2. Si URL publique HTTP/HTTPS accessible, tentative via fetch
    if (fileUrl.startsWith("http://") || fileUrl.startsWith("https://")) {
      try {
        const resp = await fetch(fileUrl, { cache: "no-store" });
        if (resp.ok) {
          const ab = await resp.arrayBuffer();
          return Buffer.from(ab);
        }
      } catch {}
    }

    // 3. Fallback sur le système de fichiers local / cache /tmp
    const cleanRelative = fileUrl.startsWith("/") ? fileUrl.slice(1) : fileUrl;
    const parts = cleanRelative.split("/").filter(Boolean);
    const filenameOnly = path.basename(fileUrl);

    try {
      const tmpPath = path.join(os.tmpdir(), ...parts);
      if (fs.existsSync(tmpPath)) return fs.readFileSync(tmpPath);
    } catch {}

    try {
      const fallbackTmp = path.join(os.tmpdir(), filenameOnly);
      if (fs.existsSync(fallbackTmp)) return fs.readFileSync(fallbackTmp);
    } catch {}

    try {
      const fallbackUploadsTmp = path.join(os.tmpdir(), "uploads", filenameOnly);
      if (fs.existsSync(fallbackUploadsTmp)) return fs.readFileSync(fallbackUploadsTmp);
    } catch {}

    try {
      const publicPath = path.join(process.cwd(), "public", cleanRelative);
      if (fs.existsSync(publicPath)) return fs.readFileSync(publicPath);
    } catch {}

    return null;
  }

  async getSignedUrl(fileUrl: string): Promise<string> {
    if (!fileUrl) return "";
    if (fileUrl.startsWith("http://") || fileUrl.startsWith("https://")) {
      return fileUrl;
    }
    const key = this.extractKey(fileUrl);
    if (this.publicUrl && key) {
      return `${this.publicUrl}/${key}`;
    }
    return fileUrl;
  }

  async deleteFile(fileUrl: string): Promise<void> {
    if (!fileUrl) return;
    const key = this.extractKey(fileUrl);

    // Suppression Cloudflare R2
    if (this.isR2Configured() && this.s3Client && key) {
      try {
        await this.s3Client.send(
          new DeleteObjectCommand({
            Bucket: this.bucket,
            Key: key,
          })
        );
      } catch (err) {
        console.warn("[storage.deleteFile] Erreur suppression R2 :", err);
      }
    }

    // Suppression locale / tmp
    const cleanRelative = fileUrl.startsWith("/") ? fileUrl.slice(1) : fileUrl;
    const filenameOnly = path.basename(fileUrl);
    try {
      const publicPath = path.join(process.cwd(), "public", cleanRelative);
      if (fs.existsSync(publicPath)) fs.unlinkSync(publicPath);
    } catch {}

    try {
      const parts = cleanRelative.split("/").filter(Boolean);
      const tmpPath = path.join(os.tmpdir(), ...parts);
      if (fs.existsSync(tmpPath)) fs.unlinkSync(tmpPath);
    } catch {}

    try {
      const fallbackTmp = path.join(os.tmpdir(), filenameOnly);
      if (fs.existsSync(fallbackTmp)) fs.unlinkSync(fallbackTmp);
    } catch {}
  }
}

export const storage = new CloudflareR2StorageService();
