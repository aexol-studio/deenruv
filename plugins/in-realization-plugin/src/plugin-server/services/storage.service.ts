import { Inject, Injectable } from "@nestjs/common";
import { CreateAssetInput } from "@deenruv/common/lib/generated-types";
import { InRealizationPluginOptions, PLUGIN_INIT_OPTIONS } from "../consts.js";
import { Logger } from "@deenruv/core";
import { Readable } from "stream";
import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import mime from "mime-types";

export class StorageLogger {
  private logger: Logger;
  log: (message: string) => void;
  error: (message: string) => void;

  constructor(ctx: string) {
    this.logger = new Logger();
    this.log = (message: string) => this.logger.log(message, ctx);
    this.error = (message: string) =>
      this.logger.error(message, undefined, ctx);
  }
}

@Injectable()
export class StorageService {
  private logger = new StorageLogger("StorageService - PDF");

  constructor(
    @Inject(PLUGIN_INIT_OPTIONS) private config: InRealizationPluginOptions,
  ) {}

  async uploadFile(file: CreateAssetInput["file"]) {
    const { createReadStream, filename, mimetype } = await file;
    try {
      const { ContentLength: size = 0 } = await this.getFile(filename);
      if (size > 0) await this.deleteFile(filename);
    } catch {}
    const stream = createReadStream();
    return await this.writeFile(filename, stream, mimetype);
  }

  async deleteFile(key: string) {
    try {
      await this.config.s3.client.send(
        new DeleteObjectCommand({
          Bucket: this.config.s3.bucket,
          Key: key,
        }),
      );
      this.logger.log("File deleted");
    } catch (error) {
      this.logger.error("File does not exist");
      throw error;
    }
  }

  async getFile(key: string) {
    try {
      const result = await this.config.s3.client.send(
        new GetObjectCommand({
          Bucket: this.config.s3.bucket,
          Key: key,
        }),
      );
      this.logger.log("File exists");
      return result;
    } catch (error) {
      this.logger.error("File does not exist");
      throw error;
    }
  }

  async uploadWithSignature(file: CreateAssetInput["file"]) {
    const key = await this.uploadFile(file);
    const url = await this.getSingedFileUrl(key);
    return url;
  }

  async uploadWithoutSignature(file: CreateAssetInput["file"]) {
    const key = await this.uploadFile(file);
    const url = await this.getFileUrl(key);
    return url;
  }

  async getSingedFileUrl(key: string) {
    const url = await this.getURL(key, true);
    this.logger.log("Obtained file URL, signed");
    return url;
  }

  async getFileUrl(key: string) {
    const url = await this.getURL(key, false);
    this.logger.log("Obtained file URL, not signed");
    return url;
  }

  private doPublicURL(key: string) {
    return `https://${this.config.s3.bucket}/${key}`;
  }

  private async getURL(key: string, singed: boolean) {
    return singed
      ? await getSignedUrl(
          this.config.s3.client,
          new GetObjectCommand({
            Bucket: this.config.s3.bucket,
            Key: key,
          }),
          { expiresIn: this.config.s3.expiresIn },
        )
      : this.doPublicURL(key);
  }

  private async writeFile(
    key: string,
    data: Blob | Readable,
    mimeType: string,
  ) {
    mimeType = (!mimeType && mime.contentType(key)) || mimeType;
    const metaData = {};
    let buffer;
    if (data instanceof Blob) {
      buffer = Buffer.from(await data.arrayBuffer());
    } else {
      buffer = data;
    }
    const uploaded = await this.config.s3.client.send(
      new PutObjectCommand({
        Bucket: this.config.s3.bucket,
        Key: key,
        Body: buffer,
        ContentType: mimeType,
        Metadata: metaData,
      }),
    );
    if (uploaded) this.logger.log("File uploaded");
    return key;
  }
}
