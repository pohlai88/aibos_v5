// AI-BOS Accounting System - Full Application Logic
class AIBOSAccounting {
    constructor() {
        this.accounts = [];
        this.transactions = [];
        this.currentUser = null;
        this.init();
    }

    init() {
        this.loadData();
        this.setupEventListeners();
        this.renderDashboard();
    }

    // Data Management
    loadData() {
        // Load accounts from localStorage or initialize with default chart of accounts
        const savedAccounts = localStorage.getItem('aibos_accounts');
        if (savedAccounts) {
            this.accounts = JSON.parse(savedAccounts);
        } else {
            this.initializeChartOfAccounts();
        }

        // Load transactions from localStorage
        const savedTransactions = localStorage.getItem('aibos_transactions');
        if (savedTransactions) {
            this.transactions = JSON.parse(savedTransactions);
        } else {
            this.initializeSampleTransactions();
        }

        // Load user data
        const savedUser = localStorage.getItem('aibos_user');
        if (savedUser) {
            this.currentUser = JSON.parse(savedUser);
        }
    }

    saveData() {
        localStorage.setItem('aibos_accounts', JSON.stringify(this.accounts));
        localStorage.setItem('aibos_transactions', JSON.stringify(this.transactions));
        if (this.currentUser) {
            localStorage.setItem('aibos_user', JSON.stringify(this.currentUser));
        }
    }

    // Initialize default chart of accounts
    initializeChartOfAccounts() {
        this.accounts = [
            // Assets (1000-1999)
            { id: 1, accountNumber: '1000', name: 'Cash', type: 'asset', description: 'Cash on hand and in bank', active: true, balance: 35000 },
            { id: 2, accountNumber: '1100', name: 'Accounts Receivable', type: 'asset', description: 'Money owed by customers', active: true, balance: 15000 },
            { id: 3, accountNumber: '1200', name: 'Inventory', type: 'asset', description: 'Goods available for sale', active: true, balance: 0 },
            { id: 4, accountNumber: '1300', name: 'Equipment', type: 'asset', description: 'Office equipment and machinery', active: true, balance: 75000 },
            
            // Liabilities (2000-2999)
            { id: 5, accountNumber: '2000', name: 'Accounts Payable', type: 'liability', description: 'Money owed to suppliers', active: true, balance: 25000 },
            { id: 6, accountNumber: '2100', name: 'Notes Payable', type: 'liability', description: 'Bank loans and notes', active: true, balance: 0 },
            { id: 7, accountNumber: '2200', name: 'Accrued Expenses', type: 'liability', description: 'Expenses incurred but not yet paid', active: true, balance: 0 },
            
            // Equity (3000-3999)
            { id: 8, accountNumber: '3000', name: "Owner's Equity", type: 'equity', description: "Owner's investment in the business", active: true, balance: 100000 },
            { id: 9, accountNumber: '3100', name: 'Retained Earnings', type: 'equity', description: 'Accumulated profits', active: true, balance: 0 },
            
            // Revenue (4000-4999)
            { id: 10, accountNumber: '4000', name: 'Sales Revenue', type: 'revenue', description: 'Revenue from sales of goods/services', active: true, balance: 50000 },
            { id: 11, accountNumber: '4100', name: 'Service Revenue', type: 'revenue', description: 'Revenue from services provided', active: true, balance: 25000 },
            { id: 12, accountNumber: '4200', name: 'Interest Income', type: 'revenue', description: 'Interest earned on investments', active: true, balance: 0 },
            
            // Expenses (5000-5999)
            { id: 13, accountNumber: '5000', name: 'Cost of Goods Sold', type: 'expense', description: 'Direct costs of producing goods', active: true, balance: 0 },
            { id: 14, accountNumber: '5100', name: 'Rent Expense', type: 'expense', description: 'Office and equipment rent', active: true, balance: 12000 },
            { id: 15, accountNumber: '5200', name: 'Utilities Expense', type: 'expense', description: 'Electricity, water, internet, etc.', active: true, balance: 3000 },
            { id: 16, accountNumber: '5300', name: 'Salaries Expense', type: 'expense', description: 'Employee salaries and wages', active: true, balance: 30000 },
            { id: 17, accountNumber: '5400', name: 'Office Supplies', type: 'expense', description: 'Office supplies and materials', active: true, balance: 2000 },
            { id: 18, accountNumber: '5500', name: 'Insurance Expense', type: 'expense', description: 'Business insurance premiums', active: true, balance: 0 }
        ];
        this.saveData();
    }

    // Initialize sample transactions
    initializeSampleTransactions() {
        this.transactions = [
            {
                id: 1,
                referenceNumber: '000001',
                date: '2024-01-15',
                description: 'Sale of services to ABC Company',
                debitAccountId: 1, // Cash
                creditAccountId: 10, // Sales Revenue
                amount: 5000,
                userId: 1
            },
            {
                id: 2,
                referenceNumber: '000002',
                date: '2024-01-14',
                description: 'Monthly rent payment',
                debitAccountId: 14, // Rent Expense
                creditAccountId: 1, // Cash
                amount: 2000,
                userId: 1
            },
            {
                id: 3,
                referenceNumber: '000003',
                date: '2024-01-13',
                description: 'Purchase of office supplies',
                debitAccountId: 17, // Office Supplies
                creditAccountId: 1, // Cash
                amount: 500,
                userId: 1
            },
            {
                id: 4,
                referenceNumber: '000004',
                date: '2024-01-12',
                description: 'Payment received from XYZ Corp',
                debitAccountId: 1, // Cash
                creditAccountId: 2, // Accounts Receivable
                amount: 3500,
                userId: 1
            },
            {
                id: 5,
                referenceNumber: '000005',
                date: '2024-01-11',
                description: 'Employee salary payment',
                debitAccountId: 16, // Salaries Expense
                creditAccountId: 1, // Cash
                amount: 4000,
                userId: 1
            }
        ];
        this.saveData();
    }

    // Account Management
    addAccount(accountData) {
        const newAccount = {
            id: this.accounts.length + 1,
            accountNumber: accountData.accountNumber,
            name: accountData.name,
            type: accountData.type,
            description: accountData.description,
            active: true,
            balance: 0
        };
        this.accounts.push(newAccount);
        this.saveData();
        return newAccount;
    }

    updateAccount(accountId, accountData) {
        const account = this.accounts.find(a => a.id === accountId);
        if (account) {
            Object.assign(account, accountData);
            this.saveData();
        }
    }

    deactivateAccount(accountId) {
        const account = this.accounts.find(a => a.id === accountId);
        if (account) {
            account.active = false;
            this.saveData();
        }
    }

    // Transaction Management
    addTransaction(transactionData) {
        const newTransaction = {
            id: this.transactions.length + 1,
            referenceNumber: this.generateReferenceNumber(),
            date: transactionData.date || new Date().toISOString().split('T')[0],
            description: transactionData.description,
            debitAccountId: transactionData.debitAccountId,
            creditAccountId: transactionData.creditAccountId,
            amount: transactionData.amount,
            userId: this.currentUser ? this.currentUser.id : 1
        };

        // Validate double-entry bookkeeping
        if (this.validateTransaction(newTransaction)) {
            this.transactions.push(newTransaction);
            this.updateAccountBalances(newTransaction);
            this.saveData();
            return newTransaction;
        } else {
            throw new Error('Invalid transaction: Debits must equal credits');
        }
    }

    validateTransaction(transaction) {
        // Basic validation - in a real system, you'd have more complex rules
        return transaction.debitAccountId && transaction.creditAccountId && transaction.amount > 0;
    }

    updateAccountBalances(transaction) {
        const debitAccount = this.accounts.find(a => a.id === transaction.debitAccountId);
        const creditAccount = this.accounts.find(a => a.id === transaction.creditAccountId);

        if (debitAccount && creditAccount) {
            // Update balances based on account type
            if (['asset', 'expense'].includes(debitAccount.type)) {
                debitAccount.balance += transaction.amount;
            } else {
                debitAccount.balance -= transaction.amount;
            }

            if (['liability', 'equity', 'revenue'].includes(creditAccount.type)) {
                creditAccount.balance += transaction.amount;
            } else {
                creditAccount.balance -= transaction.amount;
            }
        }
    }

    generateReferenceNumber() {
        const lastTransaction = this.transactions[this.transactions.length - 1];
        const lastNumber = lastTransaction ? parseInt(lastTransaction.referenceNumber) : 0;
        return (lastNumber + 1).toString().padStart(6, '0');
    }

    // Financial Calculations
    calculateTrialBalance() {
        return this.accounts.filter(a => a.active).map(account => ({
            account: account,
            balance: account.balance,
            type: account.type
        }));
    }

    calculateNetIncome() {
        const revenueAccounts = this.accounts.filter(a => a.type === 'revenue' && a.active);
        const expenseAccounts = this.accounts.filter(a => a.type === 'expense' && a.active);
        
        const totalRevenue = revenueAccounts.reduce((sum, account) => sum + account.balance, 0);
        const totalExpenses = expenseAccounts.reduce((sum, account) => sum + account.balance, 0);
        
        return totalRevenue - totalExpenses;
    }

    getAccountBalance(accountId) {
        const account = this.accounts.find(a => a.id === accountId);
        return account ? account.balance : 0;
    }

    // UI Rendering
    renderDashboard() {
        const dashboard = document.getElementById('dashboard');
        if (!dashboard) return;

        const totalAssets = this.accounts.filter(a => a.type === 'asset' && a.active)
            .reduce((sum, account) => sum + account.balance, 0);
        const totalLiabilities = this.accounts.filter(a => a.type === 'liability' && a.active)
            .reduce((sum, account) => sum + account.balance, 0);
        const netIncome = this.calculateNetIncome();
        const cashBalance = this.getAccountBalance(1); // Cash account

        // Update dashboard metrics
        this.updateMetric('total-assets', totalAssets);
        this.updateMetric('total-liabilities', totalLiabilities);
        this.updateMetric('net-income', netIncome);
        this.updateMetric('cash-balance', cashBalance);

        // Update recent transactions
        this.renderRecentTransactions();
    }

    updateMetric(elementId, value) {
        const element = document.getElementById(elementId);
        if (element) {
            element.textContent = this.formatCurrency(value);
        }
    }

    formatCurrency(amount) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    }

    renderRecentTransactions() {
        const recentTransactions = this.transactions
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(0, 5);

        const tbody = document.querySelector('#recent-transactions tbody');
        if (!tbody) return;

        tbody.innerHTML = '';
        recentTransactions.forEach(transaction => {
            const debitAccount = this.accounts.find(a => a.id === transaction.debitAccountId);
            const creditAccount = this.accounts.find(a => a.id === transaction.creditAccountId);
            
            const row = document.createElement('tr');
            row.innerHTML = `
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${transaction.date}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${transaction.description}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-green-600">+${this.formatCurrency(transaction.amount)}</td>
            `;
            tbody.appendChild(row);
        });
    }

    // Event Listeners
    setupEventListeners() {
        // Navigation
        document.addEventListener('click', (e) => {
            if (e.target.matches('nav a')) {
                e.preventDefault();
                const href = e.target.getAttribute('href');
                this.navigateTo(href);
            }
        });

        // New transaction button
        const newTransactionBtn = document.querySelector('button:contains("New Transaction")');
        if (newTransactionBtn) {
            newTransactionBtn.addEventListener('click', () => {
                this.showNewTransactionModal();
            });
        }

        // Form submissions
        document.addEventListener('submit', (e) => {
            if (e.target.id === 'new-transaction-form') {
                e.preventDefault();
                this.handleNewTransaction(e.target);
            }
        });
    }

    navigateTo(page) {
        window.location.href = page;
    }

    showNewTransactionModal() {
        // Create and show modal for new transaction
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50';
        modal.innerHTML = `
            <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                <div class="mt-3">
                    <h3 class="text-lg font-medium text-gray-900 mb-4">New Transaction</h3>
                    <form id="new-transaction-form">
                        <div class="mb-4">
                            <label class="block text-sm font-medium text-gray-700 mb-2">Description</label>
                            <input type="text" name="description" required class="w-full px-3 py-2 border border-gray-300 rounded-lg">
                        </div>
                        <div class="mb-4">
                            <label class="block text-sm font-medium text-gray-700 mb-2">Debit Account</label>
                            <select name="debitAccountId" required class="w-full px-3 py-2 border border-gray-300 rounded-lg">
                                ${this.accounts.filter(a => a.active).map(account => 
                                    `<option value="${account.id}">${account.accountNumber} - ${account.name}</option>`
                                ).join('')}
                            </select>
                        </div>
                        <div class="mb-4">
                            <label class="block text-sm font-medium text-gray-700 mb-2">Credit Account</label>
                            <select name="creditAccountId" required class="w-full px-3 py-2 border border-gray-300 rounded-lg">
                                ${this.accounts.filter(a => a.active).map(account => 
                                    `<option value="${account.id}">${account.accountNumber} - ${account.name}</option>`
                                ).join('')}
                            </select>
                        </div>
                        <div class="mb-4">
                            <label class="block text-sm font-medium text-gray-700 mb-2">Amount</label>
                            <input type="number" name="amount" step="0.01" required class="w-full px-3 py-2 border border-gray-300 rounded-lg">
                        </div>
                        <div class="flex justify-end space-x-2">
                            <button type="button" onclick="this.closest('.fixed').remove()" class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
                                Cancel
                            </button>
                            <button type="submit" class="px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-blue-600">
                                Save Transaction
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    }

    handleNewTransaction(form) {
        const formData = new FormData(form);
        const transactionData = {
            description: formData.get('description'),
            debitAccountId: parseInt(formData.get('debitAccountId')),
            creditAccountId: parseInt(formData.get('creditAccountId')),
            amount: parseFloat(formData.get('amount'))
        };

        try {
            this.addTransaction(transactionData);
            this.renderDashboard();
            form.closest('.fixed').remove();
            alert('Transaction saved successfully!');
        } catch (error) {
            alert('Error saving transaction: ' + error.message);
        }
    }
}

// Initialize the application when the page loads
document.addEventListener('DOMContentLoaded', function() {
    window.aibos = new AIBOSAccounting();
}); 