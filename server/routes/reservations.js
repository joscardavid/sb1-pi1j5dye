import { Router } from 'express';
import { getDb } from '../db.js';
import { authenticate } from '../middleware/authenticate.js';

const router = Router();

// Get all reservations
router.get('/', authenticate, (req, res) => {
  const db = getDb();
  const { date, status, tableId } = req.query;

  let query = 'SELECT * FROM reservations WHERE 1=1';
  const params = [];

  if (date) {
    query += ' AND date = ?';
    params.push(date);
  }
  if (status) {
    query += ' AND status = ?';
    params.push(status);
  }
  if (tableId) {
    query += ' AND table_id = ?';
    params.push(tableId);
  }

  try {
    const reservations = db.prepare(query).all(...params);
    res.json(reservations);
  } catch (error) {
    console.error('Error fetching reservations:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create reservation
router.post('/', async (req, res) => {
  const db = getDb();
  const { date, timeSlot, tableId, customerName, customerEmail, customerPhone, birthday, purpose } = req.body;

  try {
    // Check if table is available
    const existing = db.prepare(`
      SELECT * FROM reservations 
      WHERE table_id = ? AND date = ? AND time_slot = ? AND status = 'confirmed'
    `).get(tableId, date, timeSlot);

    if (existing) {
      return res.status(400).json({ message: 'Table not available for selected time' });
    }

    const result = db.prepare(`
      INSERT INTO reservations (
        id, date, time_slot, table_id, customer_name, customer_email, 
        customer_phone, birthday, purpose, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      crypto.randomUUID(),
      date,
      timeSlot,
      tableId,
      customerName,
      customerEmail,
      customerPhone,
      birthday || null,
      purpose || null,
      'confirmed'
    );

    const reservation = db.prepare('SELECT * FROM reservations WHERE id = ?').get(result.lastInsertRowid);
    res.status(201).json(reservation);
  } catch (error) {
    console.error('Error creating reservation:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update reservation
router.patch('/:id', authenticate, (req, res) => {
  const db = getDb();
  const { id } = req.params;
  const updates = req.body;

  try {
    const setClauses = Object.keys(updates)
      .map(key => `${key.replace(/([A-Z])/g, '_$1').toLowerCase()} = ?`)
      .join(', ');

    const query = `UPDATE reservations SET ${setClauses} WHERE id = ?`;
    const params = [...Object.values(updates), id];

    db.prepare(query).run(...params);
    const updated = db.prepare('SELECT * FROM reservations WHERE id = ?').get(id);

    if (!updated) {
      return res.status(404).json({ message: 'Reservation not found' });
    }

    res.json(updated);
  } catch (error) {
    console.error('Error updating reservation:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete reservation
router.delete('/:id', authenticate, (req, res) => {
  const db = getDb();
  const { id } = req.params;

  try {
    const result = db.prepare('DELETE FROM reservations WHERE id = ?').run(id);
    
    if (result.changes === 0) {
      return res.status(404).json({ message: 'Reservation not found' });
    }

    res.status(204).send();
  } catch (error) {
    console.error('Error deleting reservation:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export { router as reservationsRouter };