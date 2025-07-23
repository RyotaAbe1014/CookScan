import React, { useState, useCallback } from 'react';
import { Box, Paper, Typography, IconButton, LinearProgress } from '@mui/material';
import { CloudUpload, Close } from '@mui/icons-material';

interface ImageUploadProps {
  onImageSelect?: (file: File) => void;
  onUpload?: (file: File) => void;
  loading?: boolean;
  onReset?: () => void;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({ onImageSelect, onUpload, loading = false, onReset }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      handleFileSelect(file);
    }
  }, []);

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
    if (onImageSelect) {
      onImageSelect(file);
    } else if (onUpload) {
      onUpload(file);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const clearSelection = () => {
    setSelectedFile(null);
    setPreview(null);
    if (onReset) {
      onReset();
    }
  };

  return (
    <Paper
      elevation={3}
      sx={{
        p: 4,
        textAlign: 'center',
        position: 'relative',
        backgroundColor: isDragging ? 'action.hover' : 'background.paper',
        border: '2px dashed',
        borderColor: isDragging ? 'primary.main' : 'divider',
        transition: 'all 0.3s ease',
        cursor: 'pointer',
      }}
      onDrop={handleDrop}
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
    >
      {loading && (
        <LinearProgress
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
          }}
        />
      )}

      {preview ? (
        <Box sx={{ position: 'relative' }}>
          <IconButton
            onClick={(e) => {
              e.stopPropagation();
              clearSelection();
            }}
            sx={{
              position: 'absolute',
              top: -10,
              right: -10,
              backgroundColor: 'background.paper',
              '&:hover': { backgroundColor: 'action.hover' },
            }}
          >
            <Close />
          </IconButton>
          <img
            src={preview}
            alt="Preview"
            style={{
              maxWidth: '100%',
              maxHeight: '400px',
              borderRadius: '8px',
            }}
          />
          <Typography variant="caption" display="block" sx={{ mt: 1 }}>
            {selectedFile?.name}
          </Typography>
        </Box>
      ) : (
        <>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileInput}
            style={{ display: 'none' }}
            id="file-input"
            disabled={loading}
          />
          <label htmlFor="file-input" style={{ cursor: 'pointer' }}>
            <CloudUpload sx={{ fontSize: 64, color: 'primary.main', mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              画像をドラッグ＆ドロップ
            </Typography>
            <Typography variant="body2" color="text.secondary">
              または、クリックしてファイルを選択
            </Typography>
            <Typography variant="caption" display="block" color="text.secondary" sx={{ mt: 1 }}>
              対応形式: JPG, PNG, GIF など
            </Typography>
          </label>
        </>
      )}
    </Paper>
  );
};

export default ImageUpload;