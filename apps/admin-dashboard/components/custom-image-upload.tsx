"use client";

import React, { useState, useCallback, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import Image from "next/image";
import Link from "next/link";
import { Controller, useFormContext } from "react-hook-form";
import { AxiosProgressEvent } from "@workspace/axios/libs";

import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";

import { ErrorMessage } from "./error-message";

import api from "@workspace/axios";
import { CloudUpload, X } from "lucide-react";

const RadialProgress = ({ progress }: { progress: number }) => (
  <div className="text-xl font-bold">{progress}%</div>
);

interface CustomImageUploadProps {
  initialImageUrl?: string | null;
  onChange: (url: string | null) => void;
}

export const CustomImageUpload: React.FC<CustomImageUploadProps> = ({
  initialImageUrl,
  onChange,
}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [uploadedImagePath, setUploadedImagePath] = useState<string | null>(
    initialImageUrl || null
  );

  useEffect(() => {
    setUploadedImagePath(initialImageUrl || null);
  }, [initialImageUrl]);

  const onUploadProgress = (progressEvent: AxiosProgressEvent) => {
    if (progressEvent.total) {
      const percentage = Math.round(
        (progressEvent.loaded * 100) / progressEvent.total
      );
      setProgress(percentage);
    }
  };

  const removeSelectedImage = () => {
    setLoading(false);
    setUploadedImagePath(null);
    setProgress(0);
    onChange(null);
  };

  const handleImageUpload = async (image: File) => {
    if (!image) return;
    setLoading(true);
    setProgress(0);

    const formData = new FormData();
    formData.append("file", image);

    try {
      const res = await api.post("/admin/upload", formData, {
        onUploadProgress,
      });

      if (res.data?.status === "success" && res.data?.data?.url) {
        setLoading(false);
        setUploadedImagePath(res.data.data.url);
        onChange(res.data.data.url);
      } else {
        throw new Error(res.data?.message || "Upload failed.");
      }
    } catch (error) {
      setLoading(false);
      setProgress(0);
      console.error("Error uploading image:", error);
      removeSelectedImage();
    }
  };

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const image = acceptedFiles[0];
      if (image) {
        await handleImageUpload(image);
      }
    },
    [onChange]
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    noClick: true,
    multiple: false,
    accept: { "image/jpeg": [], "image/png": [] },
  });

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const image = event.target.files?.[0];
    if (image) {
      handleImageUpload(image);
    }
  };

  return (
    <div className="space-y-3 h-full">
      <div {...getRootProps()} className="h-full">
        <label
          htmlFor="dropzone-file"
          className="relative flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-lg cursor-pointer dark:bg-input/30 bg-transparent focus:border-ring focus-visible:ring-ring/50 w-full visually-hidden-focusable h-full"
          onClick={(e) => {
            if (loading || uploadedImagePath) {
              e.preventDefault();
            }
          }}
        >
          {loading && (
            <div className="text-center max-w-md">
              <RadialProgress progress={progress} />
              <p className="text-sm font-semibold">Uploading Picture</p>
              <p className="text-xs text-muted-foreground">
                Do not refresh or perform any other action while the picture is
                being uploaded
              </p>
            </div>
          )}

          {!loading && !uploadedImagePath && (
            <div className="text-center">
              <div className="border p-2 rounded-md max-w-min mx-auto">
                <CloudUpload size="1.6em" />
              </div>

              <p className="mt-2 text-sm text-muted-foreground">
                <span className="font-semibold">Drag an image</span>
              </p>
              <p className="text-xs text-muted-foreground">
                Select an image or drag here to upload directly
              </p>
            </div>
          )}

          {uploadedImagePath && !loading && (
            <div className="text-center space-y-2">
              <Image
                width={1000}
                height={1000}
                src={uploadedImagePath}
                className="w-full object-contain max-h-16 opacity-70"
                alt="uploaded image"
              />
              <div className="space-y-1">
                <p className="text-sm font-semibold">Image Uploaded</p>
                <p className="text-xs text-gray-400">
                  Click here to upload another image
                </p>
              </div>
            </div>
          )}
        </label>

        <Input
          {...getInputProps()}
          id="dropzone-file"
          accept="image/png, image/jpeg"
          type="file"
          className="hidden"
          disabled={loading || uploadedImagePath !== null}
          onChange={handleInputChange}
        />
      </div>

      {!!uploadedImagePath && (
        <div className="flex items-center justify-between">
          <Link
            href={uploadedImagePath}
            className=" text-gray-500 text-xs hover:underline "
            target="_blank"
          >
            Click here to see uploaded image :D
          </Link>

          <Button
            onClick={removeSelectedImage}
            type="button"
            variant="secondary"
          >
            Remove
          </Button>
        </div>
      )}
    </div>
  );
};

interface CustomImageInputProps {
  name: string;
  label: string;
}

export function CustomImageInput({ name, label }: CustomImageInputProps) {
  const { control } = useFormContext();

  return (
    <div className="flex flex-col gap-2 h-full">
      <Label>{label}</Label>
      <Controller
        name={name}
        control={control}
        render={({ field, fieldState: { error } }) => (
          <>
            <CustomImageUpload
              initialImageUrl={field.value as string | undefined}
              onChange={field.onChange}
            />
            <ErrorMessage message={error?.message} />
          </>
        )}
      />
    </div>
  );
}

interface UploadedFile {
  url: string;
  publicId: string;
}

interface CustomMultiImageUploadProps {
  initialImageUrls?: string[] | null;
  onChange: (urls: string[]) => void;
}

export const CustomMultiImageUpload: React.FC<CustomMultiImageUploadProps> = ({
  initialImageUrls,
  onChange,
}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>(
    initialImageUrls?.map((url) => ({ url, publicId: "" })) || []
  );
  useEffect(() => {
    if (initialImageUrls) {
      const initialFiles = initialImageUrls.map((url) => ({
        url,
        publicId: "",
      }));

      const currentUrls = uploadedFiles.map((f) => f.url).join(",");
      const newUrls = initialImageUrls.join(",");

      if (currentUrls !== newUrls) {
        setUploadedFiles(initialFiles);
      }
    } else if (uploadedFiles.length > 0) {
      setUploadedFiles([]);
    }
  }, [initialImageUrls]);
  const onUploadProgress = (progressEvent: AxiosProgressEvent) => {
    if (progressEvent.total) {
      const percentage = Math.round(
        (progressEvent.loaded * 100) / progressEvent.total
      );
      setProgress(percentage);
    }
  };

  const handleRemoveImage = (urlToRemove: string) => {
    const newFiles = uploadedFiles.filter((file) => file.url !== urlToRemove);
    setUploadedFiles(newFiles);
    onChange(newFiles.map((f) => f.url));
  };

  const handleImagesUpload = async (images: File[]) => {
    if (images.length === 0) return;
    setLoading(true);
    setProgress(0);

    const formData = new FormData();
    images.forEach((image, index) => {
      formData.append(`file${index}`, image);
    });

    try {
      const res = await api.post("/admin/upload/multiple", formData, {
        onUploadProgress,
      });

      if (res.data?.status === "success" && Array.isArray(res.data?.data)) {
        setLoading(false);
        const newUploadedFiles = res.data.data.map((item: any) => ({
          url: item.url,
          publicId: item.publicId,
        }));

        const finalFiles = [...uploadedFiles, ...newUploadedFiles];
        setUploadedFiles(finalFiles);
        onChange(finalFiles.map((f) => f.url));
      } else {
        throw new Error(res.data?.message || "Multiple upload failed.");
      }
    } catch (error) {
      setLoading(false);
      setProgress(0);
      console.error("Error uploading images:", error);
    }
  };

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        await handleImagesUpload(acceptedFiles);
      }
    },
    [onChange, uploadedFiles]
  );

  const { getRootProps, getInputProps, open } = useDropzone({
    onDrop,
    multiple: true,
    accept: { "image/jpeg": [], "image/png": [] },
  });

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      handleImagesUpload(Array.from(event.target.files));
    }
  };

  return (
    <div className="space-y-4">
      <div
        className="relative flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-lg cursor-pointer dark:bg-input/30 hover:bg-transparent"
        onClick={open}
      >
        <div {...getRootProps()}>
          {loading ? (
            <div className="text-center max-w-md">
              <RadialProgress progress={progress} />
              <p className="text-sm font-semibold">
                Uploading {uploadedFiles.length + 1} picture(s)...
              </p>
            </div>
          ) : (
            <div className="text-center">
              <div className="border p-2 rounded-md max-w-min mx-auto">
                <CloudUpload size="1.6em" />
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                <span className="font-semibold">Drag files</span> or click to
                upload
              </p>
              <p className="text-xs text-muted-foreground">
                Supports multiple images (PNG, JPG)
              </p>
            </div>
          )}
        </div>
        <Input
          {...getInputProps()}
          type="file"
          className="hidden"
          multiple
          disabled={loading}
          onChange={handleInputChange}
        />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {uploadedFiles.map((file) => (
          <div
            key={file.url}
            className="relative aspect-square rounded-lg overflow-hidden border"
          >
            <Image
              src={file.url}
              alt="Gallery image"
              width={200}
              height={200}
              className="object-cover w-full h-full"
            />
            <button
              type="button"
              onClick={() => handleRemoveImage(file.url)}
              className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

interface CustomMultiImageInputProps {
  name: string;
  label: string;
}

export function CustomGalleryImagesInput({
  name,
  label,
}: CustomMultiImageInputProps) {
  const { control } = useFormContext();

  return (
    <div className="flex flex-col gap-2">
      <Label>{label}</Label>
      <Controller
        name={name}
        control={control}
        render={({ field, fieldState: { error } }) => (
          <>
            <CustomMultiImageUpload
              initialImageUrls={field.value as string[] | undefined}
              onChange={field.onChange}
            />
            <ErrorMessage message={error?.message} />
          </>
        )}
      />
    </div>
  );
}
