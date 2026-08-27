/* src/admin/components/portfolio-content/DeleteDialog.tsx */
import React from 'react';
import { Modal } from '../dialogs/Modal';
import { Button } from '../buttons/Button';

interface DeleteDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isDeleting?: boolean;
}

export const DeleteDialog: React.FC<DeleteDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = 'Delete',
  cancelLabel = 'Cancel',
  isDeleting = false
}) => {
  const footer = (
    <>
      <Button variant="ghost" onClick={onClose} disabled={isDeleting} size="sm">
        {cancelLabel}
      </Button>
      <Button
        variant="danger"
        onClick={onConfirm}
        disabled={isDeleting}
        size="sm"
        style={{
          backgroundColor: 'var(--admin-danger)',
          borderColor: 'var(--admin-danger)',
          color: '#FFFFFF'
        }}
      >
        {isDeleting ? 'Deleting...' : confirmLabel}
      </Button>
    </>
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} footer={footer} size="sm">
      <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', fontFamily: "'Manrope', sans-serif" }}>
        <span style={{ fontSize: '24px' }}>⚠️</span>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <p style={{ margin: 0, fontSize: '13.5px', color: 'var(--admin-text)', lineHeight: 1.5 }}>
            {description}
          </p>
        </div>
      </div>
    </Modal>
  );
};

export default DeleteDialog;
