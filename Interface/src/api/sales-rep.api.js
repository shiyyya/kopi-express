import { apiFetch } from './client.js';

export function getSalesReport(params = {}) {
    const query = new URLSearchParams();
    if (params.storeBranchId) query.set('storeBranchId', params.storeBranchId);
    if (params.startDate) query.set('startDate', params.startDate);
    if (params.endDate) query.set('endDate', params.endDate);
    const queryString = query.toString();
    return apiFetch(`/sales-rep${queryString ? `?${queryString}` : ''}`);
}