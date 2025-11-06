import React from 'react';
import styles from './ConfirmModal.module.css';

interface Props {
  isOpen: boolean;
  title?: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmModal: React.FC<Props> = ({ isOpen, title = 'Confirmation', message, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  return (
    <div className={styles.overlay} role="dialog" aria-modal="true">
      <div className={styles.modal}>
        <div className={styles.modalHeader}>{title}</div>
        <div className={styles.modalBody}>{message}</div>
        <div className={styles.modalActions}>
          <button className={`${styles.btn} ${styles.btnCancel}`} onClick={onCancel}>Annuler</button>
          <button className={`${styles.btn} ${styles.btnConfirm}`} onClick={onConfirm}>Confirmer</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
