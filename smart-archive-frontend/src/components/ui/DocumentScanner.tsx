import React, { useState, useRef, useEffect } from 'react';
import { MdCamera, MdClose, MdCheck, MdCloudUpload } from 'react-icons/md';
import styles from './DocumentScanner.module.css';

interface DocumentScannerProps {
  onUpload: (files: File[]) => Promise<void>;
  onClose: () => void;
  maxFiles?: number;
}

const DocumentScanner: React.FC<DocumentScannerProps> = ({
  onUpload,
  onClose,
  maxFiles = 5,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isCameraActive, setIsCameraActive] = useState(true);
  const [scannedFiles, setScannedFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');

  // Initialiser la caméra au montage
  useEffect(() => {
    if (isCameraActive) {
      startCamera();
    }

    return () => {
      stopCamera();
    };
  }, [isCameraActive]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment', // Caméra arrière sur mobile
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setError('');
    } catch (err: any) {
      setError('Impossible d\'accéder à la caméra. Vérifie les permissions.');
      console.error('Erreur caméra:', err);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach((track) => track.stop());
    }
  };

  // Capturer une image depuis la vidéo
  const captureDocument = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const context = canvasRef.current.getContext('2d');
    if (!context) return;

    // Dimensions de la vidéo
    canvasRef.current.width = videoRef.current.videoWidth;
    canvasRef.current.height = videoRef.current.videoHeight;

    // Dessiner l'image de la vidéo sur le canvas
    context.drawImage(videoRef.current, 0, 0);

    // Convertir en blob et créer un fichier
    canvasRef.current.toBlob((blob) => {
      if (blob) {
        const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
        const file = new File([blob], `document-${timestamp}.png`, { type: 'image/png' });

        // Ajouter à la liste des fichiers scannés
        setScannedFiles((prev) => {
          if (prev.length < maxFiles) {
            return [...prev, file];
          } else {
            setError(`Maximum ${maxFiles} fichiers atteint`);
            return prev;
          }
        });
      }
    }, 'image/png');
  };

  // Gérer l'upload de fichiers via le sélecteur
  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const newFiles = files.slice(0, maxFiles - scannedFiles.length);

    if (newFiles.length < files.length) {
      setError(`Maximum ${maxFiles} fichiers. ${files.length - newFiles.length} non ajoutés.`);
    }

    setScannedFiles((prev) => [...prev, ...newFiles]);
  };

  // Retirer un fichier de la liste
  const removeFile = (index: number) => {
    setScannedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  // Uploader les fichiers
  const handleUpload = async () => {
    if (scannedFiles.length === 0) {
      setError('Aucun fichier à uploader');
      return;
    }

    setIsUploading(true);
    try {
      await onUpload(scannedFiles);
      setScannedFiles([]);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Erreur lors de l\'upload');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.container}>
        {/* Header */}
        <div className={styles.header}>
          <h3>Scanner des Documents</h3>
          <button
            className={styles.closeBtn}
            onClick={onClose}
            disabled={isUploading}
          >
            <MdClose size={24} />
          </button>
        </div>

        {/* Affichage caméra ou liste de fichiers */}
        {scannedFiles.length === 0 && isCameraActive ? (
          <div className={styles.cameraSection}>
            <video ref={videoRef} autoPlay playsInline className={styles.video} />
            <canvas ref={canvasRef} style={{ display: 'none' }} />

            {error && <div className={styles.error}>{error}</div>}

            <div className={styles.controls}>
              <button
                className={styles.captureBtn}
                onClick={captureDocument}
                disabled={isUploading}
              >
                <MdCamera size={32} /> Capturer
              </button>

              <button
                className={styles.uploadBtn}
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
              >
                Télécharger des fichiers
              </button>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*,.pdf"
                onChange={handleFileInputChange}
                style={{ display: 'none' }}
              />
            </div>
          </div>
        ) : (
          <div className={styles.previewSection}>
            {scannedFiles.length > 0 ? (
              <>
                <h4>Fichiers scannés ({scannedFiles.length}/{maxFiles})</h4>
                <div className={styles.fileList}>
                  {scannedFiles.map((file, index) => (
                    <div key={index} className={styles.fileItem}>
                      <div className={styles.fileName}>{file.name}</div>
                      <div className={styles.fileSize}>
                        {(file.size / 1024).toFixed(2)} KB
                      </div>
                      <button
                        className={styles.removeBtn}
                        onClick={() => removeFile(index)}
                        disabled={isUploading}
                      >
                        <MdClose />
                      </button>
                    </div>
                  ))}
                </div>

                {error && <div className={styles.error}>{error}</div>}

                <div className={styles.actions}>
                  <button
                    className={styles.scanMoreBtn}
                    onClick={() => {
                      setIsCameraActive(true);
                    }}
                    disabled={scannedFiles.length >= maxFiles || isUploading}
                  >
                    <MdCamera /> Scanner plus
                  </button>
                  <button
                    className={styles.submitBtn}
                    onClick={handleUpload}
                    disabled={isUploading || scannedFiles.length === 0}
                  >
                    {isUploading ? 'Upload...' : <><MdCloudUpload /> Uploader</>}
                  </button>
                </div>
              </>
            ) : (
              <div className={styles.empty}>
                Aucun fichier scannéé
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DocumentScanner;
