'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Trash2 } from 'lucide-react';

interface DeleteCaseStudyButtonProps {
  id: number;
}

export default function DeleteCaseStudyButton({
  id,
}: DeleteCaseStudyButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [confirming, setConfirming] = useState(false);

  const handleDelete = async () => {
    if (!confirming) {
      setConfirming(true);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/case-studies/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        router.push('/admin/case-studies');
        router.refresh();
      }
    } catch (err) {
      console.error('Failed to delete case study:', err);
    } finally {
      setLoading(false);
      setConfirming(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className={`p-2 rounded-md transition-colors ${
        confirming
          ? 'bg-destructive text-destructive-foreground'
          : 'hover:bg-accent text-destructive'
      } disabled:opacity-50`}
      title={confirming ? 'Click again to confirm' : 'Delete'}
    >
      <Trash2 className="h-4 w-4" />
    </button>
  );
}

