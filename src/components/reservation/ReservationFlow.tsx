import React from 'react';
import { Calendar } from './Calendar';
import { TimeSlots } from './TimeSlots';
import { TableLayout } from './TableLayout';
import { ReservationForm } from './ReservationForm';
import { ReservationSummary } from './ReservationSummary';
import { Button } from '../ui/Button';
import type { Table } from '../../types';
import { isOperatingDay } from '../../utils/helpers';
import { submitReservation } from '../../utils/api';

const TABLES: Table[] = [
  // Bar Area (4 seats)
  {
    id: 'bar',
    type: 'bar',
    seats: 4,
    isAvailable: true,
    coordinates: { x: 15, y: 15 },
    label: 'BARRA 4P',
  },
  // 4-seater tables
  {
    id: 'table-4-1',
    type: '4-seater',
    seats: 4,
    isAvailable: true,
    coordinates: { x: 25, y: 45 },
    label: 'MESA 4P',
  },
  {
    id: 'table-4-2',
    type: '4-seater',
    seats: 4,
    isAvailable: true,
    coordinates: { x: 25, y: 75 },
    label: 'MESA 4P',
  },
  // 2-seater tables
  {
    id: 'table-2-1',
    type: '2-seater',
    seats: 2,
    isAvailable: true,
    coordinates: { x: 50, y: 45 },
    label: 'MESA 2P',
  },
  {
    id: 'table-2-2',
    type: '2-seater',
    seats: 2,
    isAvailable: true,
    coordinates: { x: 50, y: 75 },
    label: 'MESA 2P',
  },
  // 5-seater tables
  {
    id: 'table-5-1',
    type: '5-seater',
    seats: 5,
    isAvailable: true,
    coordinates: { x: 80, y: 30 },
    label: 'MESA 5P',
  },
  {
    id: 'table-5-2',
    type: '5-seater',
    seats: 5,
    isAvailable: true,
    coordinates: { x: 80, y: 60 },
    label: 'MESA 5P',
  },
  // VIP table (8 seats)
  {
    id: 'vip',
    type: '8-seater',
    seats: 8,
    isAvailable: true,
    coordinates: { x: 80, y: 90 },
    label: 'VIP 8P',
  },
];

export function ReservationFlow() {
  const [step, setStep] = React.useState(1);
  const [selectedDate, setSelectedDate] = React.useState(new Date());
  const [selectedTime, setSelectedTime] = React.useState<string | null>(null);
  const [selectedTableId, setSelectedTableId] = React.useState<string | null>(null);
  const [formData, setFormData] = React.useState<any>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [submitError, setSubmitError] = React.useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = React.useState(false);

  const selectedTable = React.useMemo(
    () => TABLES.find(table => table.id === selectedTableId),
    [selectedTableId]
  );

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setSelectedTime(null);
    setStep(2);
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
    setStep(3);
  };

  const handleTableSelect = (tableId: string) => {
    setSelectedTableId(tableId);
    setStep(4);
  };

  const handleFormSubmit = async (data: any) => {
    setFormData(data);
    setStep(5);
  };

  const handleConfirmReservation = async () => {
    if (!selectedTable || !selectedTime || !formData) return;

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const result = await submitReservation({
        date: selectedDate,
        timeSlot: selectedTime,
        tableId: selectedTable.id,
        ...formData,
      });

      if (result.success) {
        setSubmitSuccess(true);
      } else {
        setSubmitError(result.message);
      }
    } catch (error) {
      setSubmitError('Ha ocurrido un error al procesar su reservación. Por favor intente nuevamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitSuccess) {
    return (
      <div className="text-center py-8">
        <h3 className="text-2xl font-bold text-primary mb-4">¡Reservación Confirmada!</h3>
        <p className="text-gray-600 mb-6">
          Hemos enviado un correo electrónico con los detalles de su reservación.
        </p>
        <Button onClick={() => window.location.reload()}>
          Realizar otra reservación
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="space-y-6">
          {step >= 1 && (
            <div>
              <h3 className="text-lg font-semibold mb-4">Seleccione una fecha</h3>
              <Calendar selectedDate={selectedDate} onDateSelect={handleDateSelect} />
            </div>
          )}

          {step >= 2 && (
            <div>
              <h3 className="text-lg font-semibold mb-4">Seleccione una hora</h3>
              <TimeSlots 
                selectedDate={selectedDate}
                selectedTime={selectedTime} 
                onTimeSelect={handleTimeSelect} 
              />
            </div>
          )}

          {step >= 3 && (
            <div>
              <h3 className="text-lg font-semibold mb-4">Seleccione una mesa</h3>
              <TableLayout
                tables={TABLES}
                selectedTableId={selectedTableId}
                onTableSelect={handleTableSelect}
              />
            </div>
          )}

          {step === 4 && (
            <div>
              <h3 className="text-lg font-semibold mb-4">Complete sus datos</h3>
              <ReservationForm onSubmit={handleFormSubmit} />
            </div>
          )}

          {step === 5 && selectedTable && selectedTime && formData && (
            <div>
              <h3 className="text-lg font-semibold mb-4">Confirmar Reservación</h3>
              <ReservationSummary
                date={selectedDate}
                time={selectedTime}
                table={selectedTable}
                {...formData}
              />
              
              {submitError && (
                <p className="text-red-500 mt-4">{submitError}</p>
              )}

              <div className="flex space-x-4 mt-6">
                <Button
                  variant="outline"
                  onClick={() => setStep(4)}
                  disabled={isSubmitting}
                >
                  Volver
                </Button>
                <Button
                  onClick={handleConfirmReservation}
                  disabled={isSubmitting}
                  className="flex-1"
                >
                  {isSubmitting ? 'Confirmando...' : 'Confirmar Reservación'}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}