import React from 'react';
import { Calendar, Clock, Users2 } from 'lucide-react';
import { formatDate, formatTime } from '../../utils/formatters';
import type { Table } from '../../types';

interface ReservationSummaryProps {
  date: Date;
  time: string;
  table: Table;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  birthday?: string;
  purpose?: string;
}

export function ReservationSummary({
  date,
  time,
  table,
  customerName,
  customerEmail,
  customerPhone,
  birthday,
  purpose,
}: ReservationSummaryProps) {
  return (
    <div className="bg-surface p-6 rounded-lg space-y-4">
      <h4 className="text-lg font-semibold">Resumen de Reservación</h4>
      
      <div className="space-y-3">
        <div className="flex items-center space-x-2">
          <Calendar className="w-5 h-5 text-primary" />
          <span>{formatDate(date)}</span>
        </div>
        
        <div className="flex items-center space-x-2">
          <Clock className="w-5 h-5 text-primary" />
          <span>{formatTime(time)}</span>
        </div>
        
        <div className="flex items-center space-x-2">
          <Users2 className="w-5 h-5 text-primary" />
          <span>{table.label} ({table.seats} personas)</span>
        </div>
      </div>

      <div className="border-t border-gray-200 my-4 pt-4">
        <h5 className="font-medium mb-2">Datos del Cliente</h5>
        <div className="space-y-2 text-sm">
          <p><span className="font-medium">Nombre:</span> {customerName}</p>
          <p><span className="font-medium">Email:</span> {customerEmail}</p>
          <p><span className="font-medium">Teléfono:</span> {customerPhone}</p>
          {birthday && (
            <p>
              <span className="font-medium">Fecha de Nacimiento:</span>{' '}
              {formatDate(birthday, 'dd/MM/yyyy')}
            </p>
          )}
          {purpose && (
            <p><span className="font-medium">Motivo:</span> {purpose}</p>
          )}
        </div>
      </div>
    </div>
  );
}