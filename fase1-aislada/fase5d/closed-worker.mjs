// Despliegue inicial autorizado. Sin Google, secretos, datos ni acceso a Sheets.
export default {
  async fetch(request) {
    const api = new URL(request.url).pathname.startsWith('/api');
    return new Response(JSON.stringify({
      environment: 'TEST_ONLY',
      status: 'CONFIGURATION_PENDING',
      operationsEnabled: false,
      ...(api ? {error: 'LAB_NOT_APPROVED', retryable: true} : {})
    }), {
      status: 503,
      headers: {'content-type': 'application/json; charset=utf-8',
        'cache-control': 'no-store', 'x-content-type-options': 'nosniff',
        'content-security-policy': "default-src 'none'; frame-ancestors 'none'",
        'referrer-policy': 'no-referrer'}
    });
  }
};
