import supabase from "../config/supabase";

// Get dashboard statistics
const getDashboardStats = async () => {
    try {
        // Fetch all necessary data in parallel
        const [customersData, transactionsData, complaintsData, appSettingsData] = await Promise.all([
            // Get all customers
            supabase.from('customers').select('id, name, rt, current_balance, status'),

            // Get current month transactions
            supabase.from('transactions')
                .select('*')
                .gte('transaction_date', new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0])
                .lte('transaction_date', new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).toISOString().split('T')[0]),

            // Get today's complaints
            supabase.from('complaints')
                .select('*, customers(name)')
                .eq('reported_at', new Date().toISOString().split('T')[0]),

            // Get app settings
            supabase.from('app_settings').select('*').single()
        ]);

        if (customersData.error) throw customersData.error;
        if (transactionsData.error) throw transactionsData.error;
        if (complaintsData.error) throw complaintsData.error;
        if (appSettingsData.error) throw appSettingsData.error;

        const customers = customersData.data || [];
        const transactions = transactionsData.data || [];
        const complaints = complaintsData.data || [];
        const appSettings = appSettingsData.data;

        // Calculate total customer balance
        const totalCustomerBalance = customers.reduce((sum, c) => sum + (c.current_balance || 0), 0);

        // Calculate mosque cash balance (from app settings or calculate from transactions)
        const masjidCashBalance = appSettings?.cash_balance || 0;

        // Count today's complaints
        const complaintsTodayCount = complaints.length;

        // Calculate total water usage this month (we'll need to get meter readings)
        const meterReadingsData = await supabase
            .from('meter_readings')
            .select('usage_amount')
            .eq('period_month', new Date().getMonth() + 1)
            .eq('period_year', new Date().getFullYear());

        const totalWaterUsageThisMonth = (meterReadingsData.data || [])
            .reduce((sum, r) => sum + (r.usage_amount || 0), 0);

        // Get top 5 debtors (customers with negative balance)
        const topDebtors = customers
            .filter(c => c.current_balance < 0)
            .sort((a, b) => a.current_balance - b.current_balance)
            .slice(0, 5);

        // Calculate monthly income/expense data for chart (last 6 months)
        const monthlyData = [];
        for (let i = 5; i >= 0; i--) {
            const date = new Date();
            date.setMonth(date.getMonth() - i);
            const month = date.getMonth() + 1;
            const year = date.getFullYear();
            const monthName = date.toLocaleDateString('id-ID', { month: 'short' });

            // Get transactions for this month
            const startDate = new Date(year, month - 1, 1).toISOString().split('T')[0];
            const endDate = new Date(year, month, 0).toISOString().split('T')[0];

            const monthTransactions = await supabase
                .from('transactions')
                .select('type, amount')
                .gte('transaction_date', startDate)
                .lte('transaction_date', endDate);

            const income = (monthTransactions.data || [])
                .filter(t => t.type === 'IN')
                .reduce((sum, t) => sum + (t.amount || 0), 0);

            const expense = (monthTransactions.data || [])
                .filter(t => t.type === 'OUT')
                .reduce((sum, t) => sum + (t.amount || 0), 0);

            monthlyData.push({
                month: monthName,
                income,
                expense
            });
        }

        return {
            totalCustomerBalance,
            masjidCashBalance,
            complaintsTodayCount,
            totalWaterUsageThisMonth,
            topDebtors,
            monthlyIncome: monthlyData,
            complaints: complaints.map(c => ({
                id: c.id,
                type: c.complaint_type || 'Keluhan',
                resident: c.customers?.name || 'Unknown',
                time: new Date(c.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
                status: c.status
            })),
            pumpStatus: appSettings?.current_pump_status || 'Mati'
        };

    } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        throw new Error(error.message);
    }
};

// Get pump status
const getPumpStatus = async () => {
    const { data, error } = await supabase
        .from('app_settings')
        .select('current_pump_status')
        .single();

    if (error) throw new Error(error.message);
    return data?.current_pump_status || 'Mati';
};

// Update pump status
const updatePumpStatus = async (status) => {
    const { data, error } = await supabase
        .from('app_settings')
        .update({ current_pump_status: status })
        .eq('id', 1) // Assuming there's only one settings record
        .select();

    if (error) throw new Error(error.message);
    return data;
};

// Get recent complaints (today)
const getTodayComplaints = async () => {
    const today = new Date().toISOString().split('T')[0];

    const { data, error } = await supabase
        .from('complaints')
        .select(`
            *,
            customers (
                name
            )
        `)
        .gte('created_at', today)
        .order('created_at', { ascending: false });

    if (error) throw new Error(error.message);
    return data;
};

// Add new complaint
const addComplaint = async (complaintData) => {
    const { data, error } = await supabase
        .from('complaints')
        .insert([complaintData])
        .select();

    if (error) throw new Error(error.message);
    return data;
};

export {
    getDashboardStats,
    getPumpStatus,
    updatePumpStatus,
    getTodayComplaints,
    addComplaint
};
