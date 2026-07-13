import axios from 'axios';

axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
axios.defaults.withCredentials = true;
axios.defaults.xsrfCookieName = 'XSRF-TOKEN';
axios.defaults.xsrfHeaderName = 'X-XSRF-TOKEN';

type Envelope<T> = { data: T };

export async function apiGet<T>(url: string): Promise<T> {
    const { data } = await axios.get<Envelope<T>>(url);
    return data.data;
}

export async function apiPost<T>(url: string, body?: unknown): Promise<T> {
    const { data } = await axios.post<Envelope<T>>(url, body);
    return data.data;
}

export async function apiPatch<T>(url: string, body?: unknown): Promise<T> {
    const { data } = await axios.patch<Envelope<T>>(url, body);
    return data.data;
}

export async function apiDelete(url: string): Promise<void> {
    await axios.delete(url);
}
