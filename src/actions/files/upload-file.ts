'use server';

import { filesClient } from '@/domains/files/client';
import { revalidatePath } from 'next/cache';
import { UploadFileRequest } from '@/domains/files/types';

export async function uploadFileAction(formData: FormData) {
  try {
    // 1. You can perform validation here in the server action
    const file = formData.get('file') as File;
    if (!file || file.size === 0) {
      return { success: false, error: 'No file provided.' };
    }

    const data: UploadFileRequest = {
      document: file,
      accountId: formData.get('accountId') as string,
      documentableId: formData.get('documentableId') as string,
      documentableType: formData.get('documentableType') as string,
    };

    // 2. Simply invoke the client method with the form data
    const result = await filesClient.uploadFiles(data);

    if (!result) {
      return { success: false, error: 'File upload failed on the server.' };
    }

    // 3. Handle success (e.g., revalidate cache)
    revalidatePath(`/dashboard/accounts/${data.accountId}`);

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
