'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';

interface ClarificationItem {
  column_name: string;
  clarifying_question: string;
}

interface ClarificationFormProps {
  items: ClarificationItem[];
  onSubmit: (answers: Record<string, string>) => void;
}

export function ClarificationForm({ items, onSubmit }: ClarificationFormProps) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    onSubmit(answers);
  };

  const handleInputChange = (columnName: string, value: string) => {
    setAnswers(prev => ({ ...prev, [columnName]: value }));
  };

  return (
    <div className="text-left">
        <div className="mb-6 text-center">
            <h2 className="text-2xl font-semibold text-foreground">Clarification Needed</h2>
            <p className="text-muted-foreground mt-2">
                Help us understand your data by answering these questions.
            </p>
        </div>
        <form onSubmit={handleSubmit}>
            <div className="space-y-6">
            {items.map(item => (
                <div key={item.column_name} className="space-y-2">
                    <Label htmlFor={item.column_name} className="font-medium text-foreground">
                        {item.column_name}
                    </Label>
                    <p className="text-sm text-muted-foreground">{item.clarifying_question}</p>
                    <Input
                        id={item.column_name}
                        value={answers[item.column_name] || ''}
                        onChange={e => handleInputChange(item.column_name, e.target.value)}
                        required
                        className="bg-secondary/50"
                    />
                </div>
            ))}
            </div>
            <Button type="submit" className="w-full mt-8" size="lg" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Submit Answers
            </Button>
      </form>
    </div>
  );
}
