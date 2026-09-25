'use client';

import { useCallback, useState } from 'react';
import { Upload, FileText, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Props {
  file: File | null;
  onFileChange: (file: File | null) => void;
}

export function UploadZone({ file, onFileChange }: Props) {
  const [dragging, setDragging] = useState(false);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(false);
      const dropped = e.dataTransfer.files[0];
      if (dropped) onFileChange(dropped);
    },
    [onFileChange]
  );

  if (file) {
    return (
      <div className="flex items-center justify-between rounded-lg border-2 border-dashed border-green-300 bg-green-50 p-6">
        <div className="flex items-center gap-3">
          <FileText className="h-8 w-8 text-green-600" />
          <div>
            <p className="font-medium">{file.name}</p>
            <p className="text-sm text-muted-foreground">
              {(file.size / 1024).toFixed(1)} KB
            </p>
          </div>
        </div>
        <Button variant="ghost" size="icon" onClick={() => onFileChange(null)}>
          <X className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  return (
    <label
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
      className={`flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-12 transition-colors ${
        dragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
      }`}
    >
      <Upload className="mb-3 h-10 w-10 text-gray-400" />
      <p className="mb-1 font-medium">Drop your resume here</p>
      <p className="text-sm text-muted-foreground">PDF or TXT — max 5MB</p>
      <input
        type="file"
        accept=".pdf,.txt,.md"
        className="hidden"
        onChange={(e) => onFileChange(e.target.files?.[0] || null)}
      />
    </label>
  );
}