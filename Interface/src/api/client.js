export const API_ORIGIN = 'http://localhost:3000';

const API_URL = `${API_ORIGIN}/api/v1`;

const AUTH_ERROR_CODES = ['UNAUTHORIZED','INVALID_TOKEN','ACCOUNT_UNAVAILABLE'];

export async function apiFetch(path, options = {}) {
    const token = localStorage.getItem('token');
    const isFormData = options.body instanceof FormData;
    const response = await fetch(`${API_URL}${path}`, {
        ...options,
        headers: {
            ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
            ...(token && { Authorization: `Bearer ${token}` }),
            ...options.headers,
        },
    });
    if (!response.ok) {
        let message = `API error: ${response.status}`;
        let code;
        try {
            const errorBody = await response.json();
            message = errorBody.error?.message || message;
            code = errorBody.error?.code;
        } catch {
            // response body wasn't JSON, keep default message
        }
        if (response.status === 401 && AUTH_ERROR_CODES.includes(code)) {
            localStorage.removeItem('token');
            localStorage.removeItem('currentUser');
            window.location.assign('/');
        }
        throw new Error(message);
    }
    if (response.status === 204) {
        return null;
    }
    return response.json();
}