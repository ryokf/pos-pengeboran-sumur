import supabase from "../config/supabase";

const getCustomers = async () => {
    const { data, error } = await supabase
        .from('customers')
        .select('name, email, phone, rt, address, current_balance');

    if (error) {
        throw new Error(error.message);
    }
    return data;
}

export { getCustomers };