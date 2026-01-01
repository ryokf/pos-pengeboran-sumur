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

// Add meter reading and auto-generate invoice
// Note: currentValue parameter now represents MONTHLY USAGE, not cumulative meter value
const addMeterReading = async (customerId, usageAmount, periodMonth, periodYear, previousValue = 0, notes = '') => {
    // 1. Calculate cumulative meter value
    const cumulativeValue = previousValue + usageAmount;

    // 2. Insert meter reading
    const { data: meterData, error: meterError } = await supabase
        .from('meter_readings')
        .insert([
            {
                customer_id: customerId,
                period_month: periodMonth,
                period_year: periodYear,
                reading_date: new Date().toISOString().split('T')[0],
                previous_value: previousValue,
                current_value: cumulativeValue,  // Store cumulative value
                usage_amount: usageAmount,        // Store monthly usage
                notes: notes
            }
        ])
        .select()
        .single();

    if (meterError) {
        throw new Error(meterError.message);
    }

    // 3. Use the provided usage amount directly
    const usage = usageAmount;

    // 4. Get pricing tiers from database
    const { data: pricingTiers, error: pricingError } = await supabase
        .from('pricing_tiers')
        .select('*')
        .order('min_usage', { ascending: true });

    if (pricingError) {
        throw new Error('Failed to get pricing tiers: ' + pricingError.message);
    }

    // 5. Calculate water cost based on usage and pricing tiers
    let waterCost = 0;

    if (usage > 0 && pricingTiers && pricingTiers.length > 0) {
        // Find the appropriate pricing tier
        let applicableTier = pricingTiers[0]; // Default to first tier

        for (const tier of pricingTiers) {
            if (usage >= tier.min_usage) {
                // Check if usage is within this tier's range
                if (tier.max_usage === null || usage <= tier.max_usage) {
                    applicableTier = tier;
                    break;
                } else if (usage > tier.max_usage) {
                    // Continue to next tier
                    applicableTier = tier;
                }
            }
        }

        waterCost = usage * applicableTier.price_per_m3;
    }

    // 6. Get admin fee from app settings
    const { data: settings, error: settingsError } = await supabase
        .from('app_settings')
        .select('admin_fee')
        .single();

    if (settingsError) {
        throw new Error('Failed to get app settings: ' + settingsError.message);
    }

    const adminFee = settings?.admin_fee || 0;
    const totalAmount = waterCost + adminFee;

    // 7. Generate invoice number
    const monthNames = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
        'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
    const period = `${ monthNames[periodMonth - 1] } ${ periodYear }`;

    // Get count of invoices this month for numbering
    const { count } = await supabase
        .from('invoices')
        .select('*', { count: 'exact', head: true })
        .like('invoice_number', `INV/${ periodYear }/${ String(periodMonth).padStart(2, '0') }/%`);

    const invoiceNumber = `INV/${ periodYear }/${ String(periodMonth).padStart(2, '0') }/${ String((count || 0) + 1).padStart(3, '0') }`;

    // 7. Create invoice
    const dueDate = new Date(periodYear, periodMonth, 10); // Due on 10th of next month
    const dueDateStr = dueDate.toISOString().split('T')[0];

    const { data: invoiceData, error: invoiceError } = await supabase
        .from('invoices')
        .insert([
            {
                customer_id: customerId,
                reading_id: meterData.id,
                invoice_number: invoiceNumber,
                period: period,
                amount: waterCost,
                admin_fee: adminFee,
                total_amount: totalAmount,
                status: 'Unpaid',
                due_date: dueDateStr
            }
        ])
        .select();

    if (invoiceError) {
        // If invoice creation fails, we should still return the meter reading
        console.error('Failed to create invoice:', invoiceError);
        throw new Error('Meter reading saved but failed to create invoice: ' + invoiceError.message);
    }

    return {
        meterReading: meterData,
        invoice: invoiceData[0]
    };
}

// Add new customer
const addCustomer = async (customerData) => {
    const { data, error } = await supabase
        .from('customers')
        .insert([
            {
                name: customerData.name,
                phone: customerData.phone || null,
                email: customerData.email || null,
                address: customerData.address || null,
                city: customerData.city || null,
                rt: customerData.rt || null,
                rw: customerData.rw || null,
                meter_number: customerData.meter_number || null,
                status: customerData.status || 'active',
                current_balance: 0,
                join_date: new Date().toISOString().split('T')[0]
            }
        ])
        .select()
        .single();

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
    addMeterReading,
    addCustomer
};