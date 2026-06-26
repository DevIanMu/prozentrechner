'use client';

import * as React from 'react';
import { Percent, Menu, ChevronDown } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Link } from '@/lib/navigation';
import { modes } from '@/lib/calculations';
import type { CalculatorMode } from '@/lib/calculations/types';
import {
  Sheet,
  SheetTrigger,
  SheetContent,
} from '@/components/ui/sheet';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion';

const priorityModeIds: string[] = [
  'prozentwert',
  'rabatt-berechnen',
  'mehrwertsteuer',
  'prozentuale-veraenderung',
];

interface ModeLinkProps {
  mode: CalculatorMode;
  className?: string;
  onClick?: () => void;
}

function ModeLink({ mode, className, onClick }: ModeLinkProps) {
  const t = useTranslations('calculator');
  return (
    <Link
      href={mode.path}
      className={className}
      onClick={onClick}
    >
      {t(mode.labelKey as Parameters<typeof t>[0])}
    </Link>
  );
}

export function TopNav() {
  const t = useTranslations('nav');
  const [sheetOpen, setSheetOpen] = React.useState(false);

  const priorityModes = React.useMemo(
    () => modes.filter((mode) => priorityModeIds.includes(mode.id)),
    []
  );

  return (
    <header className={"site-header sticky top-0 z-40 h-16 bg-canvas border-b border-hairline" /* print hook */}>
      <div className="flex h-full items-center justify-between px-4 md:px-6">
        <Link
          href="/"
          className="flex items-center gap-2 text-nav-link"
        >
          <Percent className="h-5 w-5" aria-hidden="true" />
          <span>ProzentRechner</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          {priorityModes.map((mode) => (
            <ModeLink key={mode.id} mode={mode} className="text-nav-link" />
          ))}
        </nav>

        <div className="hidden md:block">
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-1 text-nav-link outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm px-1 -mx-1">
              {t('alleRechner')}
              <ChevronDown className="h-4 w-4" aria-hidden="true" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {modes.map((mode) => (
                <DropdownMenuItem key={mode.id} asChild>
                  <ModeLink mode={mode} className="w-full cursor-pointer" />
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
          <SheetTrigger asChild className="md:hidden">
            <button
              type="button"
              aria-label="Menü"
              className="inline-flex h-10 w-10 items-center justify-center rounded-md text-ink hover:bg-surface-soft focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <Menu className="h-6 w-6" aria-hidden="true" />
            </button>
          </SheetTrigger>
          <SheetContent side="right" className="w-full sm:max-w-full">
            <div className="flex h-full flex-col gap-6 pt-8">
              <nav className="flex flex-col gap-4">
                {priorityModes.map((mode) => (
                  <ModeLink
                    key={mode.id}
                    mode={mode}
                    className="text-title-sm py-2"
                    onClick={() => setSheetOpen(false)}
                  />
                ))}
              </nav>

              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="all" className="border-hairline">
                  <AccordionTrigger className="text-title-sm py-4">
                    {t('alleRechner')}
                  </AccordionTrigger>
                  <AccordionContent>
                    <nav className="flex flex-col gap-3 pl-2">
                      {modes.map((mode) => (
                        <ModeLink
                          key={mode.id}
                          mode={mode}
                          className="text-nav-link py-2"
                          onClick={() => setSheetOpen(false)}
                        />
                      ))}
                    </nav>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
