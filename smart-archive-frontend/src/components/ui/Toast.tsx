import React from 'react';
import styles from './Toast.module.css';

interface ToastProps {
  message: string;
  type?: 'default' | 'success' | 'error';
}

const Toast: React.FC<ToastProps> = ({ message, type = 'default' }) => {
  const clazz = `${styles.toast} ${type === 'success' ? styles['toast--success'] : ''}`;
  return <div className={clazz}>{message}</div>;
};

export default Toast;
