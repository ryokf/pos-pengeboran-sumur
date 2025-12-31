import supabase from "../config/supabase";

// Get all customers
const getCustomers = async () => {
    const { data, error } = await supabase
        .from('customers')
        .select('id, name, email, phone, rt, address, current_balance, total_usage_m3');

    if (error) {
        throw new Error(error.message);
    }
    return data;
}

// Get customer by ID
const getCustomerById = async (id) => {
    const { data, error } = await supabase
        .from('customers')
        .select('*')
        .eq('id', id)
        .single();

    if (error) {
        throw new Error(error.message);
    }
    return data;
}

// Get customer meter readings
const getCustomerMeterReadings = async (customerId) => {
    const { data, error } = await supabase
        .from('meter_readings')
        .select('*')
        .eq('customer_id', customerId)
        .order('period_year', { ascending: false })
        .order('period_month', { ascending: false });

    if (error) {
        throw new Error(error.message);
    }
    return data;
}

// Get customer transactions (payments)
const getCustomerTransactions = async (customerId) => {
    const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('customer_id', customerId)
        .eq('type', 'IN')
        .order('transaction_date', { ascending: false });

    if (error) {
        throw new Error(error.message);
    }
    return data;
}

// Get customer invoices
const getCustomerInvoices = async (customerId) => {
    const { data, error } = await supabase
        .from('invoices')
        .select('*')
        .eq('customer_id', customerId)
        .order('created_at', { ascending: false });

    if (error) {
        throw new Error(error.message);
    }
    return data;
}

// Add top up (payment transaction)
const addTopUp = async (customerId, amount, description = 'Top Up Saldo') => {
    const { data, error } = await supabase
        .from('transactions')
        .insert([
            {
                customer_id: customerId,
                type: 'IN',
                category: 'Top Up',
                amount: amount,
                description: description,
                transaction_date: new Date().toISOString().split('T')[0]
            }
        ])
        .select();

    if (error) {
        throw new Error(error.message);
    }
    return data;
}

// Add adjustment (can be positive or negative)
const addAdjustment = async (customerId, amount, type, description = 'Penyesuaian Saldo') => {
    const transactionType = type === 'add' ? 'IN' : 'OUT';

    const { data, error } = await supabase
        .from('transactions')
        .insert([
            {
                customer_id: customerId,
                type: transactionType,
                category: 'Penyesuaian',
                amount: Math.abs(amount),
                description: description,
                transaction_date: new Date().toISOString().split('T')[0]
            }
        ])
        .select();

    if (error) {
        throw new Error(error.message);
    }
    return data;
}

// Add meter reading
const addMeterReading = async (customerId, currentValue, periodMonth, periodYear, previousValue = 0, notes = '') => {
    const { data, error } = await supabase
        .from('meter_readings')
        .insert([
            {
                customer_id: customerId,
                period_month: periodMonth,
                period_year: periodYear,
                reading_date: new Date().toISOString().split('T')[0],
                previous_value: previousValue,
                current_value: currentValue,
                notes: notes
            }
        ])
        .select();

    if (error) {
        throw new Error(error.message);
    }
    return data;
}

export {
    getCustomers,
    getCustomerById,
    getCustomerMeterReadings,
    getCustomerTransactions,
    getCustomerInvoices,
    addTopUp,
    addAdjustment,
    addMeterReading
};