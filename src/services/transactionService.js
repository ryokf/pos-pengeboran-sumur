import supabase from "../config/supabase";

// Get all transactions
const getTransactions = async () => {
    const { data, error } = await supabase
        .from('transactions')
        .select(`
            *,
            customers (
                name
            )
        `)
        .order('transaction_date', { ascending: false });

    if (error) {
        throw new Error(error.message);
    }
    return data;
}

// Get transactions by period
const getTransactionsByPeriod = async (year, month = null) => {
    let query = supabase
        .from('transactions')
        .select(`
            *,
            customers (
                name
            )
        `);

    if (month) {
        // Monthly filter - construct date strings directly to avoid timezone issues
        const startDate = `${year}-${String(month).padStart(2, '0')}-01`;
        // Calculate last day of month: create date on day 0 of next month
        const lastDay = new Date(year, month, 0).getDate();
        const endDate = `${year}-${String(month).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`;
        query = query
            .gte('transaction_date', startDate)
            .lte('transaction_date', endDate);
    } else {
        // Annual filter
        const startDate = `${year}-01-01`;
        const endDate = `${year}-12-31`;
        query = query
            .gte('transaction_date', startDate)
            .lte('transaction_date', endDate);
    }

    const { data, error } = await query.order('transaction_date', { ascending: false });

    if (error) {
        throw new Error(error.message);
    }
    return data;
}

// Add transaction (income or expense)
const addTransaction = async (transactionData) => {
    const { data, error } = await supabase
        .from('transactions')
        .insert([transactionData])
        .select();

    if (error) {
        throw new Error(error.message);
    }
    return data;
}

// Get transaction summary
const getTransactionSummary = async (year, month = null) => {
    const transactions = await getTransactionsByPeriod(year, month);

    const totalIncome = transactions
        .filter(t => t.type === 'IN')
        .reduce((sum, t) => sum + (t.amount || 0), 0);

    const totalExpenses = transactions
        .filter(t => t.type === 'OUT')
        .reduce((sum, t) => sum + (t.amount || 0), 0);

    const netBalance = totalIncome - totalExpenses;

    return {
        totalIncome,
        totalExpenses,
        netBalance,
        transactionCount: transactions.length
    };
}

// Delete a transaction by ID
const deleteTransaction = async (transactionId) => {
    const { error } = await supabase
        .from('transactions')
        .delete()
        .eq('id', transactionId);

    if (error) {
        throw new Error(error.message);
    }
    return true;
}

export {
    getTransactions,
    getTransactionsByPeriod,
    addTransaction,
    getTransactionSummary,
    deleteTransaction
};
