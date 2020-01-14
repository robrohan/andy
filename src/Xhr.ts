
export const xhr = (
  url: string,
  method: 'GET' | 'POST' = 'GET',
  mimeType?: string,
  body?: any): Promise<Response> => {

    const headers = new Headers();
    headers.append('User-Agent', 'Mesh/1.0');
    if (mimeType) {
      headers.append('Accept', mimeType);
      headers.append('Content-Type', mimeType);
    }
    const request = new Request(url, {
      method: method,
      cache: 'reload',
      mode: 'cors',
      credentials: 'same-origin',
      headers: headers,
      body: body    // JSON.stringify text...
    });

    return fetch(request);
};
