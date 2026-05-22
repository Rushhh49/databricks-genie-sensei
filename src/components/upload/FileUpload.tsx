'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Loader2, UploadCloud, File as FileIcon, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import axios from 'axios';

interface FileUploadProps {
  sessionId: string;
  onUploadSuccess: (filePath: string) => void;
}

export function FileUpload({ sessionId, onUploadSuccess }: FileUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
      setError(null);
      setIsSuccess(false);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'text/csv': ['.csv'], 'text/tab-separated-values': ['.tsv'] },
    multiple: false,
  });

  const handleUpload = async () => {
    if (!file) return;

    setIsUploading(true);
    setError(null);
    setUploadProgress(0);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('sessionId', sessionId);

    try {
      const response = await axios.post('/api/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (progressEvent) => {
          const percent = Math.round(((progressEvent.loaded * 100) / (progressEvent.total || 1)));
          setUploadProgress(percent);
        },
      });
      
      setIsSuccess(true);
      // Wait a moment on success before proceeding
      setTimeout(() => {
        onUploadSuccess(response.data.filePath);
      }, 1000);

    } catch (err: any) {
      setError(err.response?.data?.error || 'Upload failed.');
      setIsUploading(false);
    }
  };

  if (isSuccess) {
    return (
        <div className="text-center transition-all duration-300">
            <CheckCircle className="mx-auto h-16 w-16 text-green-500" />
            <h2 className="mt-4 text-xl font-semibold">Upload Complete</h2>
            <p className="mt-2 text-muted-foreground">Starting analysis...</p>
        </div>
    )
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <div
        {...getRootProps()}
        className={`w-full cursor-pointer rounded-lg border-2 border-dashed p-12 text-center transition-colors
        ${isDragActive ? 'border-primary bg-primary/10' : 'border-input hover:border-primary/50'}
        `}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center gap-2 text-muted-foreground">
            <UploadCloud className="h-12 w-12" />
            <p className="font-semibold text-foreground">{file ? file.name : "Drag & drop a file here"}</p>
            <p className="text-sm">{file ? `${(file.size / 1024).toFixed(2)} KB` : "or click to select a CSV / TSV file"}</p>
        </div>
      </div>

      {file && (
        <div className="w-full">
            {isUploading && (
                <div className="w-full bg-secondary rounded-full h-2.5 mt-2">
                    <div className="bg-primary h-2.5 rounded-full transition-all duration-300" style={{ width: `${uploadProgress}%` }}></div>
                </div>
            )}
            {!isUploading && (
                <Button onClick={handleUpload} disabled={isUploading} className="w-full" size="lg">
                    Upload & Process
                </Button>
            )}
        </div>
      )}

      {error && <p className="text-destructive mt-2 text-sm">{error}</p>}
    </div>
  );
}
