import supabase from "../config/supabase";

// Get all invoices
const getInvoices = async () => {
    const { data, error } = await supabase
        .from('invoices')
        .select(`
            *,
            customers (
                id,
                name,
                phone,
                email
            )
        `)
        .order('created_at', { ascending: false });

    if (error) {
        throw new Error(error.message);
    }
    return data;
}

// Get invoices for a specific period
const getInvoicesByPeriod = async (period) => {
    const { data, error } = await supabase
        .from('invoices')
        .select(`
            *,
            customers (
                id,
                name,
                phone,
                email,
                address
            )
        `)
        .eq('period', period)
        .order('created_at', { ascending: false });

    if (error) {
        throw new Error(error.message);
    }
    return data;
}

// Get unpaid invoices
const getUnpaidInvoices = async () => {
    const { data, error } = await supabase
        .from('invoices')
        .select(`
            *,
            customers (
                id,
                name,
                phone,
                email
            )
        `)
        .eq('status', 'Unpaid')
        .order('due_date', { ascending: true });

    if (error) {
        throw new Error(error.message);
    }
    return data;
}

// Create invoice
const createInvoice = async (invoiceData) => {
    const { data, error } = await supabase
        .from('invoices')
        .insert([invoiceData])
        .select();

    if (error) {
        throw new Error(error.message);
    }
    return data;
}

// Update invoice status
const updateInvoiceStatus = async (invoiceId, status) => {
    const { data, error } = await supabase
        .from('invoices')
        .update({ status })
        .eq('id', invoiceId)
        .select();

    if (error) {
        throw new Error(error.message);
    }
    return data;
}

// Get app settings (for admin fee)
const getAppSettings = async () => {
    const { data, error } = await supabase
        .from('app_settings')
        .select('*')
        .single();

    if (error) {
        throw new Error(error.message);
    }
    return data;
}

// Get pricing tiers
const getPricingTiers = async () => {
    const { data, error } = await supabase
        .from('pricing_tiers')
        .select('*')
        .order('min_usage', { ascending: true });

    if (error) {
        throw new Error(error.message);
    }
    return data;
}

export {
    getInvoices,
    getInvoicesByPeriod,
    getUnpaidInvoices,
    createInvoice,
    updateInvoiceStatus,
    getAppSettings,
    getPricingTiers
};
