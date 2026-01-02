const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Initialize SQLite database
const db = new sqlite3.Database('./expenses.db', (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
    } else {
        console.log('Connected to SQLite database');
        initializeDatabase();
    }
});

// Create expenses table if it doesn't exist
function initializeDatabase() {
    db.run(`
    CREATE TABLE IF NOT EXISTS expenses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      amount REAL NOT NULL,
      category TEXT NOT NULL,
      date TEXT NOT NULL,
      description TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `, (err) => {
        if (err) {
            console.error('Error creating table:', err.message);
        } else {
            console.log('Database initialized successfully');

            // Check if description column exists (for existing databases)
            db.all("PRAGMA table_info(expenses)", (err, rows) => {
                if (err) {
                    console.error('Error checking table schema:', err.message);
                    return;
                }

                const hasDescription = rows.some(col => col.name === 'description');
                if (!hasDescription) {
                    console.log('Adding description column to existing table...');
                    db.run('ALTER TABLE expenses ADD COLUMN description TEXT', (err) => {
                        if (err) {
                            console.error('Error adding description column:', err.message);
                        } else {
                            console.log('Description column added successfully');
                        }
                    });
                }
            });
        }
    });
}

// API Routes

// POST /api/expenses - Create new expense
app.post('/api/expenses', (req, res) => {
    const { amount, category, date, description } = req.body;
    console.log(`[POST] /api/expenses - Adding expense: Amount=${amount}, Category=${category}, Date=${date}, Desc=${description || 'None'}`);


    // Validation
    if (!amount || !category || !date) {
        return res.status(400).json({ error: 'Amount, category, and date are required' });
    }

    if (isNaN(amount) || amount <= 0) {
        return res.status(400).json({ error: 'Amount must be a positive number' });
    }

    const sql = 'INSERT INTO expenses (amount, category, date, description) VALUES (?, ?, ?, ?)';
    db.run(sql, [amount, category, date, description || ''], function (err) {
        if (err) {
            console.error('Error inserting expense:', err.message);
            return res.status(500).json({ error: 'Failed to save expense' });
        }

        res.status(201).json({
            id: this.lastID,
            amount,
            category,
            date,
            description,
            message: 'Expense saved successfully'
        });
    });
});

// GET /api/expenses - Get recent expenses (last 20) with optional date range filter
app.get('/api/expenses', (req, res) => {
    const { startDate, endDate } = req.query;

    let sql = 'SELECT * FROM expenses';
    let params = [];

    // Add date range filter if provided
    if (startDate && endDate) {
        sql += ' WHERE date >= ? AND date <= ?';
        params = [startDate, endDate];
    } else if (startDate) {
        sql += ' WHERE date >= ?';
        params = [startDate];
    } else if (endDate) {
        sql += ' WHERE date <= ?';
        params = [endDate];
    }

    sql += ' ORDER BY date DESC, created_at DESC';

    // Only limit if no filter is applied
    if (!startDate && !endDate) {
        sql += ' LIMIT 20';
    }

    db.all(sql, params, (err, rows) => {
        if (err) {
            console.error('Error fetching expenses:', err.message);
            return res.status(500).json({ error: 'Failed to fetch expenses' });
        }

        res.json(rows);
    });
});

// GET /api/expenses/today - Get today's total
app.get('/api/expenses/today', (req, res) => {
    const today = new Date().toISOString().split('T')[0];
    const sql = 'SELECT SUM(amount) as total FROM expenses WHERE date = ?';

    db.get(sql, [today], (err, row) => {
        if (err) {
            console.error('Error calculating today\'s total:', err.message);
            return res.status(500).json({ error: 'Failed to calculate total' });
        }

        res.json({
            date: today,
            total: row.total || 0
        });
    });
});

// GET /api/expenses/export - Export all expenses as CSV with optional date range filter
app.get('/api/expenses/export', (req, res) => {
    const { startDate, endDate } = req.query;
    console.log(`[GET] /api/expenses/export - Exporting CSV. Filter: Start=${startDate || 'All'}, End=${endDate || 'All'}`);


    let sql = 'SELECT * FROM expenses';
    let params = [];

    // Add date range filter if provided
    if (startDate && endDate) {
        sql += ' WHERE date >= ? AND date <= ?';
        params = [startDate, endDate];
    } else if (startDate) {
        sql += ' WHERE date >= ?';
        params = [startDate];
    } else if (endDate) {
        sql += ' WHERE date <= ?';
        params = [endDate];
    }

    sql += ' ORDER BY date DESC, created_at DESC';

    db.all(sql, params, (err, rows) => {
        if (err) {
            console.error('Error fetching expenses for export:', err.message);
            return res.status(500).json({ error: 'Failed to export expenses' });
        }

        // Create CSV header
        const csvHeader = 'ID,Valor,Categoria,Data,Descrição,Criado em\n';

        // Create CSV rows
        const csvRows = rows.map(row => {
            const description = row.description ? `"${row.description.replace(/"/g, '""')}"` : ''; // Handle quotes
            return `${row.id},${row.amount},${row.category},${row.date},${description},${row.created_at}`;
        }).join('\n');

        const csv = csvHeader + csvRows;

        // Set headers for file download
        res.setHeader('Content-Type', 'text/csv; charset=utf-8');
        res.setHeader('Content-Disposition', 'attachment; filename=gastos.csv');
        res.send('\uFEFF' + csv); // Add BOM for Excel compatibility
    });
});

// DELETE /api/expenses/:id - Delete an expense
app.delete('/api/expenses/:id', (req, res) => {
    const { id } = req.params;
    console.log(`[DELETE] /api/expenses/${id} - Deleting expense ID: ${id}`);
    const sql = 'DELETE FROM expenses WHERE id = ?';

    db.run(sql, id, function (err) {
        if (err) {
            console.error('Error deleting expense:', err.message);
            return res.status(500).json({ error: 'Failed to delete expense' });
        }

        if (this.changes === 0) {
            return res.status(404).json({ error: 'Expense not found' });
        }

        res.json({ message: 'Expense deleted successfully', id });
    });
});

// Start server

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
    console.log(`Open your browser and navigate to http://localhost:${PORT}`);
});

// Graceful shutdown
process.on('SIGINT', () => {
    db.close((err) => {
        if (err) {
            console.error('Error closing database:', err.message);
        } else {
            console.log('Database connection closed');
        }
        process.exit(0);
    });
});
