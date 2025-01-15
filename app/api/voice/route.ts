/* eslint-disable unicorn/no-negated-condition */
/* eslint-disable unicorn/prevent-abbreviations */
'use server';

import Fastify, { FastifyInstance } from 'fastify';
import { NextRequest, NextResponse } from 'next/server';
async function startCallByPhone(call_data: {
  From: string;
  To: string;
  CallSid: string;
}) {
  return { active_call_id: 1 };
}
const isDev = true;

const fastify: FastifyInstance = Fastify({ logger: true });

// Initialize Fastify routes
fastify.get('/', async (request, reply) => {
  return { message: 'Voice API is running' };
});

fastify.all('/incoming-call', async (request, reply) => {
  console.log('TEST');
  const { query, body } = request;

  // Handle incoming call logic here
  const twimlResponse = `<?xml version="1.0" encoding="UTF-8"?>
    <Response>
      <Say>Welcome to the voice API</Say>
    </Response>`;

  reply.type('text/xml').send(twimlResponse);
});

let fastifyReady = false;

async function ensureFastifyReady() {
  if (!fastifyReady) {
    await new Promise<void>(resolve => {
      fastify.ready(err => {
        if (err) console.error('Fastify initialization error:', err);
        fastifyReady = true;
        resolve();
      });
    });
  }
}

async function handleRequest(request: NextRequest) {
  await ensureFastifyReady();

  const url = new URL(request.url);
  const pathname = url.pathname.replace('/api/voice', '');

  try {
    const res = await fastify.inject({
      method: request.method as
        | 'GET'
        | 'POST'
        | 'PUT'
        | 'DELETE'
        | 'PATCH'
        | 'HEAD'
        | 'OPTIONS',
      url: pathname || '/',
      headers: Object.fromEntries(request.headers),
      query: Object.fromEntries(url.searchParams),
      payload: await request.text(),
    });

    if (res.headers['content-type'] === 'text/xml') {
      return new NextResponse(res.payload, {
        status: res.statusCode,
        headers: { 'Content-Type': 'text/xml' },
      });
    }

    return NextResponse.json(JSON.parse(res.payload), {
      status: res.statusCode,
      headers: res.headers as HeadersInit,
    });
  } catch (error) {
    console.error('Error processing request:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    );
  }
}

export const GET = handleRequest;
export const POST = handleRequest;
export const PUT = handleRequest;
export const DELETE = handleRequest;
export const PATCH = handleRequest;
export const HEAD = handleRequest;
export const OPTIONS = handleRequest;
