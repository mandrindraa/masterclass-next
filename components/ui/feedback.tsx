import { Button } from './button';
import { X } from 'lucide-react';

type FeedbackModalProps = {
  isOpen: boolean;

  message: string;

  title: string;

  closeLabel: string;

  confirmLabel: string;

  onCancel: () => void;

  onConfirm: () => void;
};

export default function FeedbackModal({
  isOpen,
  message,
  title,
  closeLabel,
  confirmLabel,
  onCancel,
  onConfirm,
}: FeedbackModalProps) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed w-100 inset-0 z-99999 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl">
        {/* Close */}
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 rounded-full p-2 text-gray-500 transition hover:bg-gray-100"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Title */}
        <h2 className="mb-3 text-center text-2xl font-bold">
          {title}
        </h2>

        {/* Message */}
        <p className="mb-8 text-center leading-relaxed text-gray-600">{message}</p>

        {/* Action */}
        <Button
          onClick={onCancel}
          className='w-full justify-center rounded-2xl py-3 border border-red-200 text-red-600 hover:bg-red-50'
        >
          {closeLabel}
        </Button>
        <Button
          onClick={onConfirm}
          className='w-full justify-center rounded-2xl py-3 border border-red-200 text-green-600 hover:bg-red-50'
        >
          {confirmLabel}
        </Button>
      </div>
    </div>
  );
}
