'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Passion } from '@/lib/passions-db';

interface PassionFormProps {
  passion?: Passion;
}

export default function PassionForm({ passion }: PassionFormProps) {
  const router = useRouter();
  const [title, setTitle] = useState(passion?.title || '');
  const [description, setDescription] = useState(passion?.description || '');
  const [icon, setIcon] = useState(passion?.icon || '');
  const [order, setOrder] = useState(passion?.order || 0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const url = passion ? `/api/passions/${passion.id}` : '/api/passions';
      const method = passion ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description,
          icon: icon || undefined,
          order: parseInt(String(order)),
        }),
      });

      if (response.ok) {
        router.push('/admin/passions');
        router.refresh();
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to save passion');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-4 bg-destructive/10 text-destructive rounded-md">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="title" className="block text-sm font-medium mb-2">
          Title
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          required
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium mb-2">
          Description
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={6}
          className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          required
        />
      </div>

      <div>
        <label htmlFor="icon" className="block text-sm font-medium mb-2">
          Icon (optional - emoji or icon name)
        </label>
        <input
          type="text"
          id="icon"
          value={icon}
          onChange={(e) => setIcon(e.target.value)}
          placeholder="🎨 or art"
          className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>

      <div>
        <label htmlFor="order" className="block text-sm font-medium mb-2">
          Order (display order, lower numbers appear first)
        </label>
        <input
          type="number"
          id="order"
          value={order}
          onChange={(e) => setOrder(parseInt(e.target.value) || 0)}
          className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          required
        />
      </div>

      <div className="flex gap-4">
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50"
        >
          {loading ? 'Saving...' : passion ? 'Update' : 'Create'}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-2 border border-border rounded-md hover:bg-accent transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

