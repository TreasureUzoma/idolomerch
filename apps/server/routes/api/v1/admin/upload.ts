import { Hono } from "hono";
import { v2 as cloudinary } from "cloudinary";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import { envConfig } from "../../../../config";

cloudinary.config({
  cloud_name: envConfig.CLOUDINARY_CLOUD_NAME,
  api_key: envConfig.CLOUDINARY_API_KEY,
  api_secret: envConfig.CLOUDINARY_API_SECRET,
});

const uploadRoutes = new Hono();

const deleteSchema = z.object({
  publicId: z.string().min(1, "Public ID is required for deletion."),
});

const uploadFileToCloudinary = async (file: File) => {
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const dataUrl = `data:${file.type};base64,${buffer.toString("base64")}`;

  const result = await cloudinary.uploader.upload(dataUrl, {
    folder: "idolomerch-products",
    resource_type: "auto",
    use_filename: true,
    unique_filename: true,
  });

  return {
    url: result.secure_url,
    publicId: result.public_id,
  };
};

uploadRoutes.post("/", async (c) => {
  try {
    const body = await c.req.parseBody();
    const file = body["file"];

    if (!file || !(file instanceof File)) {
      return c.json(
        { status: "error", message: "File data not found in 'file' field." },
        400
      );
    }

    const result = await uploadFileToCloudinary(file);

    return c.json(
      {
        status: "success",
        message: "File uploaded successfully.",
        data: result,
      },
      200
    );
  } catch (e) {
    const message =
      e instanceof Error ? e.message : "Cloudinary upload failed.";
    return c.json({ status: "error", message }, 500);
  }
});

uploadRoutes.post("/upload-multiple", async (c) => {
  try {
    const body = await c.req.parseBody();

    const files: File[] = Object.values(body).filter(
      (item): item is File => item instanceof File
    );

    if (files.length === 0) {
      return c.json({ status: "error", message: "No files provided." }, 400);
    }

    const uploadPromises = files.map(uploadFileToCloudinary);

    const results = await Promise.all(uploadPromises);

    return c.json(
      {
        status: "success",
        message: `${results.length} files uploaded successfully.`,
        data: results,
      },
      200
    );
  } catch (e) {
    const message =
      e instanceof Error ? e.message : "Multiple file upload failed.";
    return c.json({ status: "error", message }, 500);
  }
});

uploadRoutes.delete("/delete", zValidator("json", deleteSchema), async (c) => {
  try {
    const { publicId } = c.req.valid("json");

    const result = await cloudinary.uploader.destroy(publicId);

    if (result.result !== "ok") {
      return c.json(
        { status: "error", message: `Deletion failed: ${result.result}` },
        404
      );
    }

    return c.json(
      {
        status: "success",
        message: `File ${publicId} deleted successfully.`,
        data: null,
      },
      200
    );
  } catch (e) {
    const message =
      e instanceof Error ? e.message : "Failed to process delete request.";
    return c.json({ status: "error", message }, 500);
  }
});

export default uploadRoutes;
