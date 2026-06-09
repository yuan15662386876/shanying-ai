/**
 * 腾讯云 COS (Cloud Object Storage) client
 * File upload / download / delete
 * SDK: cos-nodejs-sdk-v5
 */

import COS from "cos-nodejs-sdk-v5";

const cos = new COS({
  SecretId: process.env.COS_SECRET_ID || "",
  SecretKey: process.env.COS_SECRET_KEY || "",
});

const BUCKET = process.env.COS_BUCKET || "shanying-ai-dev";
const REGION = process.env.COS_REGION || "ap-shanghai";

/** Get public URL for an object key */
export function getPublicUrl(key: string): string {
  return `https://${BUCKET}.cos.${REGION}.myqcloud.com/${key}`;
}

/**
 * Upload a file buffer to COS
 * @param key - Object key (path) in COS bucket
 * @param body - File buffer to upload
 * @param contentType - MIME type of the file
 * @returns Public URL of the uploaded file
 */
export async function uploadFile(
  key: string,
  body: Buffer,
  contentType?: string
): Promise<string> {
  return new Promise((resolve, reject) => {
    cos.putObject(
      {
        Bucket: BUCKET,
        Region: REGION,
        Key: key,
        Body: body,
        ContentType: contentType,
      },
      (err) => {
        if (err) {
          reject(new Error(`COS upload error: ${err.message}`));
        } else {
          resolve(getPublicUrl(key));
        }
      }
    );
  });
}

/**
 * Upload a Base64-encoded file to COS
 * @param key - Object key (path) in COS bucket
 * @param base64Data - Base64-encoded file data (without data URI prefix)
 * @param contentType - MIME type
 * @returns Public URL of the uploaded file
 */
export async function uploadBase64(
  key: string,
  base64Data: string,
  contentType?: string
): Promise<string> {
  const buffer = Buffer.from(base64Data, "base64");
  return uploadFile(key, buffer, contentType);
}

/**
 * Download a file from COS as a Buffer
 * @param key - Object key (path) in COS bucket
 * @returns File buffer
 */
export async function downloadFile(key: string): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    cos.getObject(
      {
        Bucket: BUCKET,
        Region: REGION,
        Key: key,
      },
      (err, data) => {
        if (err) {
          reject(new Error(`COS download error: ${err.message}`));
        } else {
          resolve(data.Body as Buffer);
        }
      }
    );
  });
}

/**
 * Delete a file from COS
 * @param key - Object key (path) in COS bucket
 */
export async function deleteFile(key: string): Promise<void> {
  return new Promise((resolve, reject) => {
    cos.deleteObject(
      {
        Bucket: BUCKET,
        Region: REGION,
        Key: key,
      },
      (err) => {
        if (err) {
          reject(new Error(`COS delete error: ${err.message}`));
        } else {
          resolve();
        }
      }
    );
  });
}

/**
 * Generate a unique object key for uploads
 * @param userId - User ID
 * @param prefix - File type prefix (e.g., "avatars", "audios", "videos")
 * @param filename - Original filename
 * @returns Object key like "avatars/uuid/timestamp-filename"
 */
export function generateKey(
  userId: string,
  prefix: string,
  filename: string
): string {
  const ts = Date.now();
  return `${prefix}/${userId}/${ts}-${filename}`;
}

export default cos;
