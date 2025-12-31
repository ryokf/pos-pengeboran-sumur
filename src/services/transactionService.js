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
        // Monthly filter
        const startDate = new Date(year, month - 1, 1).toISOString().split('T')[0];
        const endDate = new Date(year, month, 0).toISOString().split('T')[0];
        query = query
            .gte('transaction_date', startDate)
            .lte('transaction_date', endDate);
    } else {
        // Annual filter
        const startDate = new Date(year, 0, 1).toISOString().split('T')[0];
        const endDate = new Date(year, 11, 31).toISOString().split('T')[0];
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

export {
    getTransactions,
    getTransactionsByPeriod,
    addTransaction,
    getTransactionSummary
};
