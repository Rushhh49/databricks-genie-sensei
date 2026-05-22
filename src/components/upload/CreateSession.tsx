'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import axios from 'axios';

export function CreateSession() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleCreateSession = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.post('/api/sessions');
      const { sessionId } = response.data;
      router.push(`/upload?session_id=${sessionId}`);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to create session.');
      setIsLoading(false);
    }
  };

  return (
    <div className="text-center">
      <h2 className="text-2xl font-semibold mb-2 text-foreground">Start a New Session</h2>
      <p className="text-muted-foreground mb-6">
        Begin by creating a new session to upload and analyze your dataset.
      </p>
      <Button onClick={handleCreateSession} disabled={isLoading} size="lg">
        {isLoading ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : null}
        Create New Session
      </Button>
      {error && <p className="text-destructive mt-4">{error}</p>}
    </div>
  );
}
