'use server';

import { NextRequest, NextResponse } from 'next/server';

import { createAdminClient } from '@/utils/supabase/admin-server';

export async function GET(request: NextRequest) {
  const supabase_admin = await createAdminClient();
  //   if (
  //     !Retell.verify(
  //       JSON.stringify(request.body),
  //       process.env.RETELL_API_KEY as string,
  //       request.headers.get('x-retell-signature') as string,
  //     )
  //   ) {
  //     console.error('Invalid signature');
  //     return;
  //   }
  //   console.log(Retell.PhoneNumber);

  return NextResponse.json({ message: `Hello, test!` });
}
