export function formatCurrency(amount: number, symbol = '৳'): string {
    if (isNaN(amount)) return 'Invalid amount';

    try {
        const formatted = new Intl.NumberFormat('en-BD', {
            minimumFractionDigits: 2,
        }).format(amount);

        return `${symbol}${formatted}`;
    } catch (err) {
        console.log(err);
        return `${symbol}${amount}`;
    }
}

export function formatDate(iso?: string): string {
    if (!iso) return "";
    try {
        return new Intl.DateTimeFormat(undefined, {
            year: "numeric",
            month: "short",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
        }).format(new Date(iso));
    } catch {
        return iso;
    }
}

