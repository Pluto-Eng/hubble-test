'use server';

import { filesClient } from '@/domains/files/client';
import { revalidatePath } from 'next/cache';

export async function uploadFileAction(formData: FormData) {
  try {
    // 1. You can perform validation here in the server action
    const file = formData.get('file') as File;
    if (!file || file.size === 0) {
      return { success: false, error: 'No file provided.' };
    }

    const accountId = formData.get('accountId') as string;
    const documentableId = formData.get('documentableId') as string;
    const id = formData.get('id') as string;

    // 2. Simply invoke the client method with the form data
    const result = await filesClient.downloadFile(accountId, documentableId, id);

    if (!result) {
      return { success: false, error: 'File upload failed on the server.' };
    }

    // 3. Handle success (e.g., revalidate cache)
    revalidatePath(`/dashboard/accounts/${accountId}`);

    return { success: true, data: result };
  } catch (error) {
    const safeErr = {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
    };
    log.error('File upload action error:', safeErr);
    return { success: false, error: 'An unexpected error occurred.' };
  }
}
