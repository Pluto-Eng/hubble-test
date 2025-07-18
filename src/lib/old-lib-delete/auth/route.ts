import { NextRequest, NextResponse } from 'next/server';
import { api } from '@/lib/config';

const path = '/accounts';
export async function GET(request: NextRequest) {
  try {
    // Get the authorization header from the request
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized - No valid authorization header' }, { status: 401 });
    }

    const accessToken = authHeader.substring(7); // Remove 'Bearer ' prefix
    log.start(`GET ${path}`, 'Forwarding request to middleware');
    log.info(`GET ${path}`, 'Full URL:', `${api.baseUrl}${path}`);
    log.info(`GET ${path}`, '🔗 Token:', accessToken.substring(0, 20) + '...');
    
    // Forward the request to the middleware
    let response = await fetch(`${api.baseUrl}${path}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    log.responsePayload(`GET ${path}`, 'Middleware response status', response);

    if (response.ok) {
      const data = await response.json();
      log.responsePayload(`GET ${path}`, 'Success, returning data', {account: data.data});
      return NextResponse.json(data);
    } else {
      const errorText = await response.text();
      log.error(`GET ${path}`, 'Middleware error:', {
        status: response.status,
        statusText: response.statusText,
        error: errorText
      });
      return NextResponse.json(
        { error: 'Failed to fetch accounts from middleware' },
        { status: response.status }
      );
    }
  } catch (error) {
    log.error(`GET ${path}`, 'Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Get the authorization header from the request
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized - No valid authorization header' }, { status: 401 });
    }

    const accessToken = authHeader.substring(7); // Remove 'Bearer ' prefix

    // Get the request body
    const body = await request.json();
    log.requestBody(`POST ${path}`, 'Request body:', body);

    log.start(`POST ${path}`, 'Forwarding request to middleware');
    
    // Forward the request to the middleware
    let response = await fetch(`${api.baseUrl}${path}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    log.responsePayload(`POST ${path}`, 'Response payload', response);
    if (response.ok) {
      const data = await response.json();
      log.responsePayload(`POST ${path}`, 'Response result', data);
      return NextResponse.json(data);
    } else {
      const errorText = await response.text();
      log.error(`POST ${path}`, 'Middleware error:', {
        status: response.status,
        statusText: response.statusText,
        error: errorText
      });
      return NextResponse.json(
        { error: 'Failed to create account in middleware' },
        { status: response.status }
      );
    }
  } catch (error) {
    log.error(`POST ${path}`, 'Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 

// export async function GET(request) {
//   console.info('[PROVIDERS/INFO] GET /api/providers invoked'); //remove after debugging;
//   const { searchParams } = new URL(request.url);

//   const pageSize = searchParams.get('pageSize');
//   const offset = searchParams.get('offset');
//   const state = searchParams.get('state')
//   const virtualOnly = searchParams.get('virtualOnly')
//   const name = searchParams.get('name')
//   let filters = `AND({Status} = "Active"`
//   if (state) filters += `, {State} = "${state}"`
//   if (virtualOnly === "Yes") filters += `, {Virtual Only} = "${virtualOnly}"`
//   if (virtualOnly === "No") filters += `, OR({Virtual Only} != "Yes", NOT({Virtual Only}))`
//   if (name) filters += `, FIND(LOWER("${name}"), LOWER({Name})) > 0`
//   filters += ")"
//   try {
//     const [data, error] = await AccountsService({
//       tableName: 'Providers',
//       filters: filters,
//       pageSize: pageSize ?? 12,
//       offset: offset ?? null,
//     });

//     if (error) {
//       console.error('[PROVIDERS/ERROR] Failed to fetch providers from Airtable:', error); //helpful for debugging, containing error stack trace server-side
//       return Response.json(
//         { error: 'Service is temporarily unavailable. Please try again shortly.' }, //user-facing error text; we don't send the raw error object to the frontend as this can expose sensitive info. also noting that the error property is just a property name not an Error object
//         { status: 503 }
//       );
//     }

//     const records = data.records.map((record) => {
//       const id = record["id"] ?? null;
//       const name = record["Name"] ?? null;
//       const licenses = record["Job Title"] ?? null;
//       const virtualOnly = record["Virtual Only"] ?? null;
//       const practice = record["Provider Practice"] ?? null;
//       const address = record["Address"] ?? null;
//       const states = record["State"] ?? null;
//       const email = record["Email"] ?? null;
//       const phone = record["Phone"] ?? null;

//       return {
//         id,
//         name,
//         licenses,
//         virtualOnly,
//         practice,
//         address,
//         states,
//         email,
//         phone
//       };
//     });

//     const providersPayload = {
//       records,
//       nextToken: data.offset
//     }

//     console.info(`[PROVIDERS/INFO] Successfully retrieved ${records.length} provider records`); //remove after debugging
//     return Response.json(providersPayload);
//   } catch (err) {
//     console.error('[PROVIDERS/UNEXPECTED_ERROR] An unexpected internal error occurred. Unhandled exception:', err); //note that namespacing logs as [RESOURCE/ERROR_TYPE] is common in robust codebases to make log searching + filtering easier in centralized logging systems like Datadog, Logstash or Cloudwatch
//     return Response.json(
//       { error: 'An unexpected error occurred. Please try again later.' },
//       { status: 500 }
//     );
//   }
// };