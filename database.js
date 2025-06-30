// AI-BOS Database Layer - Enhanced Data Management
class AIBOSDatabase {
    constructor() {
        this.dbName = 'aibos_accounting';
        this.version = 1;
        this.db = null;
        this.init();
    }

    async init() {
        try {
            this.db = await this.openDatabase();
            await this.createTables();
            await this.seedInitialData();
        } catch (error) {
            console.error('Database initialization failed:', error);
            // Fallback to localStorage
            this.useLocalStorage = true;
        }
    }

    openDatabase() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, this.version);

            request.onerror = () => reject(request.error);
            request.onsuccess = () => resolve(request.result);

            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                this.createObjectStores(db);
            };
        });
    }

    createObjectStores(db) {
        // Accounts store
        if (!db.objectStoreNames.contains('accounts')) {
            const accountsStore = db.createObjectStore('accounts', { keyPath: 'id', autoIncrement: true });
            accountsStore.createIndex('accountNumber', 'accountNumber', { unique: true });
            accountsStore.createIndex('type', 'type', { unique: false });
            accountsStore.createIndex('active', 'active', { unique: false });
        }

        // Transactions store
        if (!db.objectStoreNames.contains('transactions')) {
            const transactionsStore = db.createObjectStore('transactions', { keyPath: 'id', autoIncrement: true });
            transactionsStore.createIndex('date', 'date', { unique: false });
            transactionsStore.createIndex('referenceNumber', 'referenceNumber', { unique: true });
            transactionsStore.createIndex('debitAccountId', 'debitAccountId', { unique: false });
            transactionsStore.createIndex('creditAccountId', 'creditAccountId', { unique: false });
        }

        // Users store
        if (!db.objectStoreNames.contains('users')) {
            const usersStore = db.createObjectStore('users', { keyPath: 'id', autoIncrement: true });
            usersStore.createIndex('email', 'email', { unique: true });
        }

        // Settings store
        if (!db.objectStoreNames.contains('settings')) {
            db.createObjectStore('settings', { keyPath: 'key' });
        }
    }

    async createTables() {
        // Tables are created in onupgradeneeded
        return Promise.resolve();
    }

    async seedInitialData() {
        // Check if data already exists
        const accounts = await this.getAllAccounts();
        if (accounts.length === 0) {
            await this.seedAccounts();
            await this.seedTransactions();
            await this.seedUsers();
        }
    }

    async seedAccounts() {
        const accounts = [
            // Assets (1000-1999)
            { accountNumber: '1000', name: 'Cash', type: 'asset', description: 'Cash on hand and in bank', active: true, balance: 35000 },
            { accountNumber: '1100', name: 'Accounts Receivable', type: 'asset', description: 'Money owed by customers', active: true, balance: 15000 },
            { accountNumber: '1200', name: 'Inventory', type: 'asset', description: 'Goods available for sale', active: true, balance: 0 },
            { accountNumber: '1300', name: 'Equipment', type: 'asset', description: 'Office equipment and machinery', active: true, balance: 75000 },
            
            // Liabilities (2000-2999)
            { accountNumber: '2000', name: 'Accounts Payable', type: 'liability', description: 'Money owed to suppliers', active: true, balance: 25000 },
            { accountNumber: '2100', name: 'Notes Payable', type: 'liability', description: 'Bank loans and notes', active: true, balance: 0 },
            { accountNumber: '2200', name: 'Accrued Expenses', type: 'liability', description: 'Expenses incurred but not yet paid', active: true, balance: 0 },
            
            // Equity (3000-3999)
            { accountNumber: '3000', name: "Owner's Equity", type: 'equity', description: "Owner's investment in the business", active: true, balance: 100000 },
            { accountNumber: '3100', name: 'Retained Earnings', type: 'equity', description: 'Accumulated profits', active: true, balance: 0 },
            
            // Revenue (4000-4999)
            { accountNumber: '4000', name: 'Sales Revenue', type: 'revenue', description: 'Revenue from sales of goods/services', active: true, balance: 50000 },
            { accountNumber: '4100', name: 'Service Revenue', type: 'revenue', description: 'Revenue from services provided', active: true, balance: 25000 },
            { accountNumber: '4200', name: 'Interest Income', type: 'revenue', description: 'Interest earned on investments', active: true, balance: 0 },
            
            // Expenses (5000-5999)
            { accountNumber: '5000', name: 'Cost of Goods Sold', type: 'expense', description: 'Direct costs of producing goods', active: true, balance: 0 },
            { accountNumber: '5100', name: 'Rent Expense', type: 'expense', description: 'Office and equipment rent', active: true, balance: 12000 },
            { accountNumber: '5200', name: 'Utilities Expense', type: 'expense', description: 'Electricity, water, internet, etc.', active: true, balance: 3000 },
            { accountNumber: '5300', name: 'Salaries Expense', type: 'expense', description: 'Employee salaries and wages', active: true, balance: 30000 },
            { accountNumber: '5400', name: 'Office Supplies', type: 'expense', description: 'Office supplies and materials', active: true, balance: 2000 },
            { accountNumber: '5500', name: 'Insurance Expense', type: 'expense', description: 'Business insurance premiums', active: true, balance: 0 }
        ];

        for (const account of accounts) {
            await this.addAccount(account);
        }
    }

    async seedTransactions() {
        const transactions = [
            {
                referenceNumber: '000001',
                date: '2024-01-15',
                description: 'Sale of services to ABC Company',
                debitAccountId: 1, // Cash
                creditAccountId: 10, // Sales Revenue
                amount: 5000,
                userId: 1
            },
            {
                referenceNumber: '000002',
                date: '2024-01-14',
                description: 'Monthly rent payment',
                debitAccountId: 14, // Rent Expense
                creditAccountId: 1, // Cash
                amount: 2000,
                userId: 1
            },
            {
                referenceNumber: '000003',
                date: '2024-01-13',
                description: 'Purchase of office supplies',
                debitAccountId: 17, // Office Supplies
                creditAccountId: 1, // Cash
                amount: 500,
                userId: 1
            },
            {
                referenceNumber: '000004',
                date: '2024-01-12',
                description: 'Payment received from XYZ Corp',
                debitAccountId: 1, // Cash
                creditAccountId: 2, // Accounts Receivable
                amount: 3500,
                userId: 1
            },
            {
                referenceNumber: '000005',
                date: '2024-01-11',
                description: 'Employee salary payment',
                debitAccountId: 16, // Salaries Expense
                creditAccountId: 1, // Cash
                amount: 4000,
                userId: 1
            }
        ];

        for (const transaction of transactions) {
            await this.addTransaction(transaction);
        }
    }

    async seedUsers() {
        const users = [
            {
                email: 'admin@aibos.com',
                firstName: 'Admin',
                lastName: 'User',
                role: 'admin',
                active: true
            }
        ];

        for (const user of users) {
            await this.addUser(user);
        }
    }

    // Account Operations
    async addAccount(accountData) {
        if (this.useLocalStorage) {
            return this.addAccountLocalStorage(accountData);
        }

        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['accounts'], 'readwrite');
            const store = transaction.objectStore('accounts');
            const request = store.add(accountData);

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    async getAllAccounts() {
        if (this.useLocalStorage) {
            return this.getAllAccountsLocalStorage();
        }

        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['accounts'], 'readonly');
            const store = transaction.objectStore('accounts');
            const request = store.getAll();

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    async getAccountById(id) {
        if (this.useLocalStorage) {
            return this.getAccountByIdLocalStorage(id);
        }

        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['accounts'], 'readonly');
            const store = transaction.objectStore('accounts');
            const request = store.get(id);

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    async updateAccount(id, accountData) {
        if (this.useLocalStorage) {
            return this.updateAccountLocalStorage(id, accountData);
        }

        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['accounts'], 'readwrite');
            const store = transaction.objectStore('accounts');
            const request = store.put({ ...accountData, id });

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    async deleteAccount(id) {
        if (this.useLocalStorage) {
            return this.deleteAccountLocalStorage(id);
        }

        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['accounts'], 'readwrite');
            const store = transaction.objectStore('accounts');
            const request = store.delete(id);

            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    }

    // Transaction Operations
    async addTransaction(transactionData) {
        if (this.useLocalStorage) {
            return this.addTransactionLocalStorage(transactionData);
        }

        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['transactions'], 'readwrite');
            const store = transaction.objectStore('transactions');
            const request = store.add(transactionData);

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    async getAllTransactions() {
        if (this.useLocalStorage) {
            return this.getAllTransactionsLocalStorage();
        }

        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['transactions'], 'readonly');
            const store = transaction.objectStore('transactions');
            const request = store.getAll();

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    async getTransactionsByDateRange(startDate, endDate) {
        if (this.useLocalStorage) {
            return this.getTransactionsByDateRangeLocalStorage(startDate, endDate);
        }

        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['transactions'], 'readonly');
            const store = transaction.objectStore('transactions');
            const index = store.index('date');
            const range = IDBKeyRange.bound(startDate, endDate);
            const request = index.getAll(range);

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    // User Operations
    async addUser(userData) {
        if (this.useLocalStorage) {
            return this.addUserLocalStorage(userData);
        }

        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['users'], 'readwrite');
            const store = transaction.objectStore('users');
            const request = store.add(userData);

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    async getUserByEmail(email) {
        if (this.useLocalStorage) {
            return this.getUserByEmailLocalStorage(email);
        }

        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['users'], 'readonly');
            const store = transaction.objectStore('users');
            const index = store.index('email');
            const request = index.get(email);

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    // LocalStorage Fallback Methods
    addAccountLocalStorage(accountData) {
        const accounts = JSON.parse(localStorage.getItem('aibos_accounts') || '[]');
        const newAccount = { ...accountData, id: accounts.length + 1 };
        accounts.push(newAccount);
        localStorage.setItem('aibos_accounts', JSON.stringify(accounts));
        return Promise.resolve(newAccount.id);
    }

    getAllAccountsLocalStorage() {
        const accounts = JSON.parse(localStorage.getItem('aibos_accounts') || '[]');
        return Promise.resolve(accounts);
    }

    getAccountByIdLocalStorage(id) {
        const accounts = JSON.parse(localStorage.getItem('aibos_accounts') || '[]');
        const account = accounts.find(a => a.id === id);
        return Promise.resolve(account);
    }

    updateAccountLocalStorage(id, accountData) {
        const accounts = JSON.parse(localStorage.getItem('aibos_accounts') || '[]');
        const index = accounts.findIndex(a => a.id === id);
        if (index !== -1) {
            accounts[index] = { ...accounts[index], ...accountData };
            localStorage.setItem('aibos_accounts', JSON.stringify(accounts));
        }
        return Promise.resolve();
    }

    deleteAccountLocalStorage(id) {
        const accounts = JSON.parse(localStorage.getItem('aibos_accounts') || '[]');
        const filteredAccounts = accounts.filter(a => a.id !== id);
        localStorage.setItem('aibos_accounts', JSON.stringify(filteredAccounts));
        return Promise.resolve();
    }

    addTransactionLocalStorage(transactionData) {
        const transactions = JSON.parse(localStorage.getItem('aibos_transactions') || '[]');
        const newTransaction = { ...transactionData, id: transactions.length + 1 };
        transactions.push(newTransaction);
        localStorage.setItem('aibos_transactions', JSON.stringify(transactions));
        return Promise.resolve(newTransaction.id);
    }

    getAllTransactionsLocalStorage() {
        const transactions = JSON.parse(localStorage.getItem('aibos_transactions') || '[]');
        return Promise.resolve(transactions);
    }

    getTransactionsByDateRangeLocalStorage(startDate, endDate) {
        const transactions = JSON.parse(localStorage.getItem('aibos_transactions') || '[]');
        const filtered = transactions.filter(t => t.date >= startDate && t.date <= endDate);
        return Promise.resolve(filtered);
    }

    addUserLocalStorage(userData) {
        const users = JSON.parse(localStorage.getItem('aibos_users') || '[]');
        const newUser = { ...userData, id: users.length + 1 };
        users.push(newUser);
        localStorage.setItem('aibos_users', JSON.stringify(users));
        return Promise.resolve(newUser.id);
    }

    getUserByEmailLocalStorage(email) {
        const users = JSON.parse(localStorage.getItem('aibos_users') || '[]');
        const user = users.find(u => u.email === email);
        return Promise.resolve(user);
    }

    // Backup and Export
    async exportData() {
        const accounts = await this.getAllAccounts();
        const transactions = await this.getAllTransactions();
        const users = JSON.parse(localStorage.getItem('aibos_users') || '[]');

        return {
            accounts,
            transactions,
            users,
            exportDate: new Date().toISOString()
        };
    }

    async importData(data) {
        // Clear existing data
        if (!this.useLocalStorage) {
            const transaction = this.db.transaction(['accounts', 'transactions', 'users'], 'readwrite');
            await Promise.all([
                this.clearStore(transaction.objectStore('accounts')),
                this.clearStore(transaction.objectStore('transactions')),
                this.clearStore(transaction.objectStore('users'))
            ]);
        } else {
            localStorage.removeItem('aibos_accounts');
            localStorage.removeItem('aibos_transactions');
            localStorage.removeItem('aibos_users');
        }

        // Import new data
        for (const account of data.accounts) {
            await this.addAccount(account);
        }
        for (const transaction of data.transactions) {
            await this.addTransaction(transaction);
        }
        for (const user of data.users) {
            await this.addUser(user);
        }
    }

    clearStore(store) {
        return new Promise((resolve, reject) => {
            const request = store.clear();
            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    }
}

// Initialize database
window.aibosDB = new AIBOSDatabase(); 