import request from 'supertest';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

process.env.NODE_ENV = 'test';
process.env.PORT = '4000';
process.env.FRONTEND_ORIGIN = 'http://localhost:5173';
process.env.REQUEST_TIMEOUT_MS = '1000';
process.env.UPSTREAM_TIMEOUT_MS = '1000';
process.env.UPSTREAM_API_URL = 'https://api.openai.com/v1/chat/completions';
process.env.UPSTREAM_MODEL = 'gpt-4o-mini';

const { app } = await import('../src/app.js');

describe('app routes', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('returns health status', async () => {
    const response = await request(app).get('/api/health');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: 'ok' });
    expect(response.headers['x-request-id']).toBeTypeOf('string');
  });

  it('returns structured 404s for unknown api routes', async () => {
    const response = await request(app).get('/api/missing');

    expect(response.status).toBe(404);
    expect(response.body.error.code).toBe('NOT_FOUND');
    expect(response.body.requestId).toBeTypeOf('string');
  });

  it('validates chat payloads before hitting upstream', async () => {
    const fetchSpy = vi.fn();
    vi.stubGlobal('fetch', fetchSpy);

    const response = await request(app).post('/api/chat').send({
      apiKey: 'sk_test_abcdefghijklmnopqrstuvwxyz',
      messages: [{ role: 'assistant', content: 'Hi' }]
    });

    expect(response.status).toBe(400);
    expect(response.body.error.code).toBe('VALIDATION_ERROR');
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it('returns assistant replies from upstream', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        new Response(
          JSON.stringify({
            choices: [{ message: { content: 'Hello from upstream' } }],
            usage: { prompt_tokens: 10, completion_tokens: 5, total_tokens: 15 }
          }),
          {
            status: 200,
            headers: { 'content-type': 'application/json' }
          }
        )
      )
    );

    const response = await request(app).post('/api/chat').send({
      apiKey: 'sk_test_abcdefghijklmnopqrstuvwxyz',
      messages: [{ role: 'user', content: 'Hello there' }]
    });

    expect(response.status).toBe(200);
    expect(response.body.reply).toBe('Hello from upstream');
    expect(response.body.usage).toEqual({
      promptTokens: 10,
      completionTokens: 5,
      totalTokens: 15
    });
  });

  it('maps unsupported upstream responses to a sanitized error', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        new Response('not-json', {
          status: 200,
          headers: { 'content-type': 'text/plain' }
        })
      )
    );

    const response = await request(app).post('/api/chat').send({
      apiKey: 'sk_test_abcdefghijklmnopqrstuvwxyz',
      messages: [{ role: 'user', content: 'Hello there' }]
    });

    expect(response.status).toBe(502);
    expect(response.body.error.code).toBe('UPSTREAM_ERROR');
  });

  it('returns a request timeout when upstream work exceeds the request budget', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockImplementation((_input: unknown, init?: RequestInit) => {
        return new Promise((_resolve, reject) => {
          init?.signal?.addEventListener(
            'abort',
            () => reject(new DOMException('Aborted', 'AbortError')),
            { once: true }
          );
        });
      })
    );

    const response = await request(app).post('/api/chat').send({
      apiKey: 'sk_test_abcdefghijklmnopqrstuvwxyz',
      messages: [{ role: 'user', content: 'Hello there' }]
    });

    expect(response.status).toBe(408);
    expect(response.body.error.code).toBe('REQUEST_TIMEOUT');
  });
});
