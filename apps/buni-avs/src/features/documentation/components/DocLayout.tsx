'use client';

import React from 'react';
import { DocSidebar } from './DocSidebar';
import { getDocBySlug } from '../content';

interface DocLayoutProps {
  children?: React.ReactNode;
  title?: string;
  slug?: string;
  section?: string;
}

export function DocsPageLayout({ children, title = 'Documentation', slug, section = 'getting-started' }: DocLayoutProps) {
  const doc = slug ? getDocBySlug(slug) : null;

  return (
    <div className="flex min-h-screen bg-avs-secondary">
      {/* Sidebar - Fixed on left */}
      <DocSidebar currentSection={doc?.section || section} currentPage={doc?.id} />

      {/* Main content */}
      <main className="flex-1 ml-0 md:ml-64 px-6 md:px-12 py-12">
        <div className="max-w-4xl">
          <h1 className="font-display text-4xl font-bold text-avs-accent mb-2">
            {doc?.title || title}
          </h1>
          {doc?.description && (
            <p className="text-avs-accent/60 text-lg mb-8">{doc.description}</p>
          )}
          
          {/* Content rendering */}
          <div className="prose prose-sm max-w-none space-y-6 text-avs-accent">
            {doc ? (
              <div className="markdown-content">
                {typeof doc.content === 'string' ? (
                  <div dangerouslySetInnerHTML={{ __html: doc.content }} />
                ) : (
                  doc.content
                )}
              </div>
            ) : (
              children
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
