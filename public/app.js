// API Base URL - works in both local and deployed environments
const API_URL = window.location.hostname === 'localhost'
    ? 'http://localhost:3000/api'
    : '/api';

// DOM Elements
const btnAddExpense = document.getElementById('btnAddExpense');
const formContainer = document.getElementById('formContainer');
const expenseForm = document.getElementById('expenseForm');
const btnCancel = document.getElementById('btnCancel');
const btnExport = document.getElementById('btnExport');
const expensesList = document.getElementById('expensesList');
const todayTotal = document.getElementById('todayTotal');
const dateInput = document.getElementById('date');

// Filter DOM Elements
const filterStartDate = document.getElementById('filterStartDate');
const filterEndDate = document.getElementById('filterEndDate');
const btnApplyFilter = document.getElementById('btnApplyFilter');
const btnClearFilter = document.getElementById('btnClearFilter');
const filterIndicator = document.getElementById('filterIndicator');
const filterIndicatorText = document.getElementById('filterIndicatorText');
const quickFilterBtns = document.querySelectorAll('.filter-btn');

// State
let currentFilter = {
    startDate: null,
    endDate: null
};

// Category Icons
const categoryIcons = {
    'Alimentação': '🍔',
    'Transporte': '🚗',
    'Lazer': '🎮',
    'Saúde': '💊',
    'Educação': '📚',
    'Moradia': '🏠',
    'Outros': '📦'
};

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    // Set today's date as default
    setTodayDate();

    // Load initial data
    loadExpenses();
    loadTodayTotal();
});

// Set today's date in the date input
function setTodayDate() {
    const today = new Date().toISOString().split('T')[0];
    dateInput.value = today;
}

// Show/Hide form
btnAddExpense.addEventListener('click', () => {
    formContainer.classList.add('active');
    btnAddExpense.style.display = 'none';
    document.getElementById('amount').focus();
});

btnCancel.addEventListener('click', () => {
    formContainer.classList.remove('active');
    btnAddExpense.style.display = 'flex';
    expenseForm.reset();
    setTodayDate();
});

// --- Filter Logic ---

// Quick Filter Buttons
quickFilterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Remove active class from all
        quickFilterBtns.forEach(b => b.classList.remove('active'));
        // Add to clicked
        btn.classList.add('active');

        const filterType = btn.dataset.filter;
        applyQuickFilter(filterType);
    });
});

function applyQuickFilter(type) {
    const today = new Date();
    let start = new Date();
    let end = new Date();
    let label = '';

    // Reset customs inputs
    filterStartDate.value = '';
    filterEndDate.value = '';

    switch (type) {
        case 'today':
            // Start and End are today
            label = 'Hoje';
            break; // uses default new Date() which is today

        case 'last7days':
            start.setDate(today.getDate() - 6); // 7 days inclusive
            label = 'Últimos 7 dias';
            break;

        case 'thismonth':
            start = new Date(today.getFullYear(), today.getMonth(), 1);
            end = new Date(today.getFullYear(), today.getMonth() + 1, 0);
            label = 'Este mês';
            break;

        case 'lastmonth':
            start = new Date(today.getFullYear(), today.getMonth() - 1, 1);
            end = new Date(today.getFullYear(), today.getMonth(), 0);
            label = 'Mês passado';
            break;
    }

    // Format for API (YYYY-MM-DD)
    currentFilter.startDate = start.toISOString().split('T')[0];
    currentFilter.endDate = end.toISOString().split('T')[0];

    updateFilterIndicator(label);
    loadExpenses();
}

// Custom Filter
btnApplyFilter.addEventListener('click', () => {
    const start = filterStartDate.value;
    const end = filterEndDate.value;

    if (!start || !end) {
        alert('Por favor, selecione data inicial e final.');
        return;
    }

    if (start > end) {
        alert('Data inicial não pode ser maior que a final.');
        return;
    }

    // Remove active class from quick filters
    quickFilterBtns.forEach(b => b.classList.remove('active'));

    currentFilter.startDate = start;
    currentFilter.endDate = end;

    updateFilterIndicator(`${formatDate(start)} até ${formatDate(end)}`);
    loadExpenses();
});

// Clear Filter
btnClearFilter.addEventListener('click', () => {
    currentFilter.startDate = null;
    currentFilter.endDate = null;

    filterStartDate.value = '';
    filterEndDate.value = '';
    quickFilterBtns.forEach(b => b.classList.remove('active'));

    filterIndicator.style.display = 'none';
    loadExpenses();
});

function updateFilterIndicator(text) {
    filterIndicatorText.textContent = text;
    filterIndicator.style.display = 'flex';
}

// --- End Filter Logic ---

// Export to CSV
btnExport.addEventListener('click', async () => {
    try {
        // Show loading state
        btnExport.disabled = true;
        btnExport.textContent = '⏳ Exportando...';

        // Build URL with params
        let url = `${API_URL}/expenses/export`;
        const params = new URLSearchParams();

        if (currentFilter.startDate && currentFilter.endDate) {
            params.append('startDate', currentFilter.startDate);
            params.append('endDate', currentFilter.endDate);
            url += `?${params.toString()}`;
        }

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error('Failed to export expenses');
        }

        // Get the CSV content
        const csvContent = await response.text();

        // Create a blob and download link
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const urlObj = URL.createObjectURL(blob);

        // Generate filename with current date
        const today = new Date().toISOString().split('T')[0];
        let filename = `gastos_${today}.csv`;

        // Add filter info to filename if present
        if (currentFilter.startDate) {
            filename = `gastos_${currentFilter.startDate}_${currentFilter.endDate}.csv`;
        }

        link.setAttribute('href', urlObj);
        link.setAttribute('download', filename);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // Reset button
        btnExport.disabled = false;
        btnExport.innerHTML = '📊 Exportar';

        // Show success feedback
        btnExport.innerHTML = '✓ Exportado!';
        setTimeout(() => {
            btnExport.innerHTML = '📊 Exportar';
        }, 2000);

    } catch (error) {
        console.error('Error exporting expenses:', error);
        alert('Erro ao exportar gastos. Tente novamente.');
        btnExport.disabled = false;
        btnExport.innerHTML = '📊 Exportar';
    }
});

// Handle form submission
expenseForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = {
        amount: parseFloat(document.getElementById('amount').value),
        category: document.getElementById('category').value,
        date: document.getElementById('date').value
    };

    try {
        const response = await fetch(`${API_URL}/expenses`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        if (!response.ok) {
            throw new Error('Failed to save expense');
        }

        const result = await response.json();

        // Reset form and hide it
        expenseForm.reset();
        setTodayDate();
        formContainer.classList.remove('active');
        btnAddExpense.style.display = 'flex';

        // Reload data
        loadExpenses();
        loadTodayTotal();

        // Show success feedback (optional)
        showSuccessFeedback();

    } catch (error) {
        console.error('Error saving expense:', error);
        alert('Erro ao salvar gasto. Tente novamente.');
    }
});

// Load expenses from API
async function loadExpenses() {
    try {
        // Build URL with params
        let url = `${API_URL}/expenses`;
        const params = new URLSearchParams();

        if (currentFilter.startDate && currentFilter.endDate) {
            params.append('startDate', currentFilter.startDate);
            params.append('endDate', currentFilter.endDate);
            url += `?${params.toString()}`;
        }

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error('Failed to fetch expenses');
        }

        const expenses = await response.json();
        displayExpenses(expenses);

    } catch (error) {
        console.error('Error loading expenses:', error);
        expensesList.innerHTML = '<p class="empty-state">Erro ao carregar gastos.</p>';
    }
}

// Display expenses in the list
function displayExpenses(expenses) {
    if (expenses.length === 0) {
        expensesList.innerHTML = '<p class="empty-state">Nenhum gasto encontrado para o período.</p>';
        return;
    }

    expensesList.innerHTML = expenses.map(expense => `
        <div class="expense-item">
            <div class="expense-icon">${categoryIcons[expense.category] || '📦'}</div>
            <div class="expense-details">
                <div class="expense-category">${expense.category}</div>
                <div class="expense-date">${formatDate(expense.date)}</div>
            </div>
            <div class="expense-amount">R$ ${formatCurrency(expense.amount)}</div>
        </div>
    `).join('');
}

// Load today's total from API
async function loadTodayTotal() {
    try {
        const response = await fetch(`${API_URL}/expenses/today`);

        if (!response.ok) {
            throw new Error('Failed to fetch today\'s total');
        }

        const data = await response.json();
        todayTotal.textContent = `R$ ${formatCurrency(data.total)}`;

    } catch (error) {
        console.error('Error loading today\'s total:', error);
        todayTotal.textContent = 'R$ 0,00';
    }
}

// Format currency (Brazilian Real)
function formatCurrency(value) {
    return parseFloat(value).toFixed(2).replace('.', ',');
}

// Format date (dd/mm/yyyy)
function formatDate(dateString) {
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
}

// Show success feedback
function showSuccessFeedback() {
    const originalText = btnAddExpense.innerHTML;
    btnAddExpense.innerHTML = '<span class="icon">✓</span> Salvo!';
    btnAddExpense.style.background = '#10b981';

    setTimeout(() => {
        btnAddExpense.innerHTML = originalText;
        btnAddExpense.style.background = '';
    }, 1500);
}

// Auto-refresh data every 30 seconds (optional, for multi-device sync)
setInterval(() => {
    if (!formContainer.classList.contains('active')) {
        loadExpenses();
        loadTodayTotal();
    }
}, 30000);
