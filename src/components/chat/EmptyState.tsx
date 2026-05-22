'use client';

import { MessageSquare } from 'lucide-react';

export function EmptyState() {
    return (
        <div className="flex h-full flex-col items-center justify-center text-center">
            <div className="rounded-full bg-secondary p-4">
                <MessageSquare size={32} className="text-primary" />
            </div>
            <h1 className="mt-6 text-3xl font-bold tracking-tight text-foreground">
                Chat with your Data
            </h1>
            <p className="mt-2 max-w-lg text-muted-foreground">
                Start a conversation by typing a question below. Your uploaded dataset is ready to be explored.
            </p>
        </div>
    );
}
