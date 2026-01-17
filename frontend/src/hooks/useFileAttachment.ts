import { useState, useEffect, useCallback, useRef } from "react";
import { validateFile, fileToBase64 } from "../utils/fileUtils";
import { Attachment } from "../types";
import { generateUUID } from "../utils/uuid";

export interface FileWithPreview {
  id: string;
  file: File;
  previewUrl: string;
}

/**
 * Hook untuk mengelola file attachments dengan preview dan validasi.
 * Menangani memory management untuk blob URLs secara otomatis.
 * @param initialAttachments - Array File opsional untuk inisialisasi
 */
export const useFileAttachment = (initialAttachments: File[] = []) => {
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  // Ref untuk tracking cleanup - menghindari stale closure
  const filesRef = useRef<FileWithPreview[]>([]);
  filesRef.current = files;

  // Initialize dengan initial files jika ada
  useEffect(() => {
    if (initialAttachments.length > 0) {
      const initialFiles: FileWithPreview[] = initialAttachments.map(
        (file) => ({
          id: generateUUID(),
          file,
          previewUrl: URL.createObjectURL(file),
        }),
      );
      setFiles(initialFiles);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Cleanup memory saat unmount - menggunakan ref untuk avoid stale closure
  useEffect(() => {
    return () => {
      filesRef.current.forEach((f) => URL.revokeObjectURL(f.previewUrl));
    };
  }, []);

  const addFiles = useCallback((newFiles: File[]) => {
    const validFiles: FileWithPreview[] = [];
    const newErrors: string[] = [];

    newFiles.forEach((file) => {
      const error = validateFile(file);
      if (error) {
        newErrors.push(error);
      } else {
        validFiles.push({
          id: generateUUID(),
          file,
          previewUrl: URL.createObjectURL(file), // Untuk preview UI saja
        });
      }
    });

    if (newErrors.length > 0) {
      setErrors((prev) => [...prev, ...newErrors]);
      // Clear errors after 5 seconds
      setTimeout(() => setErrors([]), 5000);
    }

    setFiles((prev) => [...prev, ...validFiles]);
  }, []);

  const removeFile = useCallback((id: string) => {
    setFiles((prev) => {
      const target = prev.find((f) => f.id === id);
      if (target) URL.revokeObjectURL(target.previewUrl); // Prevent memory leak
      return prev.filter((f) => f.id !== id);
    });
  }, []);

  const clearFiles = useCallback(() => {
    filesRef.current.forEach((f) => URL.revokeObjectURL(f.previewUrl));
    setFiles([]);
    setErrors([]);
  }, []);

  // Fungsi untuk mengubah state internal menjadi format Attachment yang siap simpan (Base64)
  const processAttachmentsForSubmit = useCallback(async (): Promise<
    Attachment[]
  > => {
    setIsProcessing(true);
    try {
      const processed: Attachment[] = await Promise.all(
        filesRef.current.map(async (f) => {
          const base64 = await fileToBase64(f.file);
          return {
            id: Date.now() + Math.random(),
            name: f.file.name,
            url: base64,
            type: (f.file.type.startsWith("image/") ? "image" : "pdf") as
              | "image"
              | "pdf"
              | "other",
          };
        }),
      );
      return processed;
    } finally {
      setIsProcessing(false);
    }
  }, []);

  return {
    files,
    errors,
    isProcessing,
    addFiles,
    removeFile,
    clearFiles,
    processAttachmentsForSubmit,
  };
};
