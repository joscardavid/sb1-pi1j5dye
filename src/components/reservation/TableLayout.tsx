import React from 'react';
import { Users2 } from 'lucide-react';
import { cn } from '../../utils/helpers';
import type { Table } from '../../types';

interface TableLayoutProps {
  tables: Table[];
  selectedTableId: string | null;
  onTableSelect: (tableId: string) => void;
}

export function TableLayout({ tables, selectedTableId, onTableSelect }: TableLayoutProps) {
  return (
    <div className="relative w-full aspect-square bg-surface rounded-lg p-4">
      {tables.map((table) => (
        <button
          key={table.id}
          onClick={() => table.isAvailable && onTableSelect(table.id)}
          className={cn(
            'absolute transform -translate-x-1/2 -translate-y-1/2',
            'p-2 rounded-lg transition-colors',
            {
              'bg-green-100 hover:bg-green-200': table.isAvailable && selectedTableId !== table.id,
              'bg-red-100': !table.isAvailable,
              'bg-primary text-white': selectedTableId === table.id,
            }
          )}
          style={{
            left: `${table.coordinates.x}%`,
            top: `${table.coordinates.y}%`,
            minWidth: table.seats >= 5 ? '120px' : '80px',
          }}
          disabled={!table.isAvailable}
        >
          <div className="flex flex-col items-center space-y-1">
            <span className="text-xs font-medium">{table.label}</span>
            <div className="flex items-center space-x-1">
              <Users2 className="w-4 h-4" />
              <span>{table.seats}</span>
            </div>
          </div>
        </button>
      ))}
    </div>
  );
}