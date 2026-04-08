'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ChevronDown, Menu, X } from 'lucide-react';
import { DOC_SECTIONS } from '../types';
import { Route } from 'next';

interface DocSidebarProps {
  currentSection?: string;
  currentPage?: string;
}

export function DocSidebar({ currentSection, currentPage }: DocSidebarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(currentSection ? [currentSection] : ['getting-started'])
  );

  const toggleSection = (sectionId: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId);
    } else {
      newExpanded.add(sectionId);
    }
    setExpandedSections(newExpanded);
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 md:hidden bg-avs-primary text-white p-2 rounded-avs"
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-screen w-64 bg-avs-secondary border-r border-avs-accent/10 overflow-y-auto transition-transform duration-300 z-40 md:z-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="p-6">
          <h2 className="font-display text-lg font-bold text-avs-accent mb-8">
            AVS Documentation
          </h2>

          <nav className="space-y-2">
            {DOC_SECTIONS.map((section) => (
              <div key={section.id}>
                <button
                  onClick={() => toggleSection(section.id)}
                  className="w-full flex items-center justify-between px-4 py-2 rounded-avs hover:bg-avs-accent/10 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{section.icon}</span>
                    <span className="font-semibold text-sm text-avs-accent">
                      {section.title}
                    </span>
                  </div>
                  <ChevronDown
                    size={16}
                    className={`transition-transform ${
                      expandedSections.has(section.id) ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {/* Pages */}
                {expandedSections.has(section.id) && (
                  <div className="ml-2 mt-1 space-y-1">
                    {section.pages.map((page) => (
                      <Link
                        key={page.id}
                        href={`/documentation/${page.slug}` as Route}
                        onClick={() => setIsOpen(false)}
                        className={`block px-4 py-2 rounded-avs text-sm transition-colors ${
                          currentPage === page.id
                            ? 'bg-avs-primary text-avs-secondary font-semibold'
                            : 'text-avs-accent/70 hover:bg-avs-primary/10'
                        }`}
                      >
                        {page.title}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>
        </div>
      </aside>

      {/* Overlay on mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
