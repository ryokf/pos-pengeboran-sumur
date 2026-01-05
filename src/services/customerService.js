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

// Get customer transactions (both top-ups and payments)
const getCustomerTransactions = async (customerId) => {
    const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('customer_id', customerId)
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
// Frontend handles balance update - no database trigger needed
const addTopUp = async (customerId, amount, description = 'Top Up Saldo') => {
    // 1. Get current customer balance
    const { data: customer, error: customerError } = await supabase
        .from('customers')
        .select('current_balance')
        .eq('id', customerId)
        .single();

    if (customerError) {
        throw new Error('Failed to get customer balance: ' + customerError.message);
    }

    // 2. Calculate new balance (add top-up amount)
    const currentBalance = customer.current_balance || 0;
    const newBalance = currentBalance + amount;

    // 3. Update customer balance FIRST
    const { error: updateError } = await supabase
        .from('customers')
        .update({ current_balance: newBalance })
        .eq('id', customerId);

    if (updateError) {
        throw new Error('Failed to update customer balance: ' + updateError.message);
    }

    // 4. Then create transaction record
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
        // Rollback balance if transaction insert fails
        await supabase
            .from('customers')
            .update({ current_balance: currentBalance })
            .eq('id', customerId);
        throw new Error(error.message);
    }

    return data;
}

// Add adjustment (can be positive or negative)
// Frontend handles balance update - no database trigger needed
const addAdjustment = async (customerId, amount, type, description = 'Penyesuaian Saldo') => {
    const transactionType = type === 'add' ? 'IN' : 'OUT';

    // 1. Get current customer balance
    const { data: customer, error: customerError } = await supabase
        .from('customers')
        .select('current_balance')
        .eq('id', customerId)
        .single();

    if (customerError) {
        throw new Error('Failed to get customer balance: ' + customerError.message);
    }

    // 2. Calculate new balance (add or subtract based on type)
    const currentBalance = customer.current_balance || 0;
    const adjustmentAmount = type === 'add' ? Math.abs(amount) : -Math.abs(amount);
    const newBalance = currentBalance + adjustmentAmount;

    // 3. Update customer balance FIRST
    const { error: updateError } = await supabase
        .from('customers')
        .update({ current_balance: newBalance })
        .eq('id', customerId);

    if (updateError) {
        throw new Error('Failed to update customer balance: ' + updateError.message);
    }

    // 4. Then create transaction record
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
        // Rollback balance if transaction insert fails
        await supabase
            .from('customers')
            .update({ current_balance: currentBalance })
            .eq('id', customerId);
        throw new Error(error.message);
    }

    return data;
}

// Pay all unpaid invoices for a customer (Pure Frontend Logic)
// Uses topUpValue as source of funds - balance already updated by addTopUp
const payAllUnpaidInvoices = async (customerId, topUpValue) => {
    try {
        // Use topUpValue as available funds for payment
        let remainingFunds = topUpValue;

        // If no funds available, cannot pay
        if (remainingFunds <= 0) {
            return {
                success: true,
                message: 'Tidak ada dana untuk membayar tagihan',
                invoices_paid: 0,
                total_amount_paid: 0,
                remaining_funds: remainingFunds
            };
        }

        // Get unpaid invoices (oldest first)
        const { data: invoices, error: invoicesError } = await supabase
            .from('invoices')
            .select('*')
            .eq('customer_id', customerId)
            .eq('status', 'Unpaid')
            .order('created_at', { ascending: true });

        if (invoicesError) {
            throw new Error('Failed to get invoices: ' + invoicesError.message);
        }

        if (!invoices || invoices.length === 0) {
            return {
                success: true,
                message: 'Tidak ada tagihan yang perlu dibayar',
                invoices_paid: 0,
                total_amount_paid: 0,
                remaining_funds: remainingFunds
            };
        }

        let invoicesPaid = 0;
        let totalPaid = 0;

        // Log invoices to be processed
        console.log(`Processing ${ invoices.length } unpaid invoices for customer ${ customerId }`);
        console.log('Available funds:', remainingFunds);
        console.log('Invoices:', invoices.map(inv => ({ id: inv.id, period: inv.period, amount: inv.total_amount })));

        // Loop and pay each invoice
        for (const invoice of invoices) {
            // Stop if no more funds available to pay
            if (remainingFunds <= 0) break;

            // Get existing payments for this invoice
            const { data: payments, error: paymentsError } = await supabase
                .from('transactions')
                .select('amount')
                .eq('invoice_id', invoice.id)
                .eq('type', 'OUT');

            if (paymentsError) {
                console.error('Failed to get payments for invoice:', invoice.id, paymentsError);
                continue;
            }

            const totalPayment = payments ? payments.reduce((sum, p) => sum + (p.amount || 0), 0) : 0;
            const remainingDebt = invoice.total_amount - totalPayment;

            if (remainingDebt <= 0) continue; // Already paid

            // Determine payment amount from available funds
            const paymentAmount = Math.max(0, Math.min(remainingFunds, remainingDebt));

            // Skip if no payment can be made
            if (paymentAmount <= 0) continue;

            // Create payment transaction (balance already deducted when invoice was created)
            const { data: transactionData, error: transactionError } = await supabase
                .from('transactions')
                .insert({
                    customer_id: customerId,
                    invoice_id: invoice.id,
                    type: 'OUT',
                    category: 'Pembayaran Tagihan',
                    amount: paymentAmount,
                    description: `Pembayaran untuk ${ invoice.period } (${ invoice.invoice_number })`,
                    transaction_date: new Date().toISOString().split('T')[0]
                })
                .select();

            if (transactionError) {
                console.error('Failed to create payment transaction:', transactionError);
                continue;
            }

            // Log successful payment creation
            console.log(`Payment created: Invoice ${ invoice.invoice_number }, Amount: ${ paymentAmount }, Transaction ID: ${ transactionData?.[0]?.id }`);

            // Update invoice status if fully paid
            if (paymentAmount >= remainingDebt) {
                const { error: updateError } = await supabase
                    .from('invoices')
                    .update({ status: 'Paid' })
                    .eq('id', invoice.id);

                if (updateError) {
                    console.error('Failed to update invoice status:', updateError);
                }

                invoicesPaid++;
            }

            // Deduct from available funds
            remainingFunds -= paymentAmount;
            totalPaid += paymentAmount;
        }

        // Get final customer balance
        const { data: finalCustomer } = await supabase
            .from('customers')
            .select('current_balance')
            .eq('id', customerId)
            .single();

        return {
            success: true,
            message: `Paid ${ invoicesPaid } invoice(s)`,
            invoices_paid: invoicesPaid,
            total_amount_paid: totalPaid,
            new_balance: finalCustomer?.current_balance || 0
        };

    } catch (error) {
        console.error('Error in payAllUnpaidInvoices:', error);
        throw error;
    }
}

// Add meter reading and auto-generate invoice
// Frontend handles all calculations and balance updates - no database trigger needed
const addMeterReading = async (meterReadingData) => {
    // 1. Get previous meter reading to calculate previous_value
    const { data: previousReadings, error: previousError } = await supabase
        .from('meter_readings')
        .select('current_value')
        .eq('customer_id', meterReadingData.customer_id)
        .order('reading_date', { ascending: false })
        .limit(1);

    if (previousError) {
        throw new Error('Failed to get previous reading: ' + previousError.message);
    }

    // 2. Calculate previous_value and current_value
    const previous_value = previousReadings && previousReadings.length > 0
        ? previousReadings[0].current_value
        : 0;

    const current_value = previous_value + meterReadingData.usage_amount;

    // 3. Insert meter reading with calculated values
    const { data: meterData, error: meterError } = await supabase
        .from('meter_readings')
        .insert([{
            ...meterReadingData,
            previous_value,
            current_value
        }])
        .select()
        .single();

    if (meterError) {
        throw new Error(meterError.message);
    }

    // 4. Get the usage amount
    const usage = meterData.usage_amount;

    // 5. Get pricing tiers from database
    const { data: pricingTiers, error: pricingError } = await supabase
        .from('pricing_tiers')
        .select('*')
        .order('min_usage', { ascending: true });

    if (pricingError) {
        throw new Error('Failed to get pricing tiers: ' + pricingError.message);
    }

    // 6. Calculate water cost based on usage and pricing tiers
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

    // 7. Get admin fee from app settings
    const { data: settings, error: settingsError } = await supabase
        .from('app_settings')
        .select('admin_fee')
        .single();

    if (settingsError) {
        throw new Error('Failed to get app settings: ' + settingsError.message);
    }

    const adminFee = settings?.admin_fee || 0;
    const totalAmount = waterCost + adminFee;

    // 8. Generate invoice number
    const monthNames = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
        'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
    const period = `${ monthNames[meterData.period_month - 1] } ${ meterData.period_year }`;

    // Get count of invoices this month for numbering
    const { count } = await supabase
        .from('invoices')
        .select('*', { count: 'exact', head: true })
        .like('invoice_number', `INV/${ meterData.period_year }/${ String(meterData.period_month).padStart(2, '0') }/%`);

    const invoiceNumber = `INV/${ meterData.period_year }/${ String(meterData.period_month).padStart(2, '0') }/${ String((count || 0) + 1).padStart(3, '0') }`;

    // 9. Create invoice
    const dueDate = new Date(meterData.period_year, meterData.period_month, 10); // Due on 10th of next month
    const dueDateStr = dueDate.toISOString().split('T')[0];

    const { data: invoiceData, error: invoiceError } = await supabase
        .from('invoices')
        .insert([
            {
                customer_id: meterData.customer_id,
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

    // 10. Deduct invoice amount from customer balance (replaces database trigger)
    const { data: customer, error: customerError } = await supabase
        .from('customers')
        .select('current_balance')
        .eq('id', meterData.customer_id)
        .single();

    if (customerError) {
        console.error('Failed to get customer balance:', customerError);
    } else {
        const newBalance = (customer.current_balance || 0) - totalAmount;
        const { error: updateError } = await supabase
            .from('customers')
            .update({ current_balance: newBalance })
            .eq('id', meterData.customer_id);

        if (updateError) {
            console.error('Failed to update customer balance:', updateError);
        }
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

// Auto-pay invoices after top-up (called from handleTopUp in CustomerDetail)
// This is the same logic as payAllUnpaidInvoices, just with a different name for clarity
const autoPayInvoicesAfterTopUp = async (customerId, topUpValue) => {
    return await payAllUnpaidInvoices(customerId, topUpValue);
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
    addCustomer,
    payAllUnpaidInvoices,
    autoPayInvoicesAfterTopUp
};