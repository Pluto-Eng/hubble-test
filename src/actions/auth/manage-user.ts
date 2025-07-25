'use server';

import { auth } from '@/auth';
import { userClient, userNameSchema } from '@/domains/user/index';
import { revalidatePath } from 'next/cache';

export type FormData = {
  name: string;
};

export async function updateUserName(userId: string, data: FormData) {
  try {
    const session = await auth();

    if (!session?.user || session?.user.id !== userId) {
      throw new Error('Unauthorized');
    }

    const { name } = userNameSchema.parse(data);

    // Update the user name.
    await userClient.updateProfile({ nameGiven: name });

    revalidatePath('/dashboard/settings');
    return { status: 'success' };
  } catch (error) {
    const safeErr = {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
    };
    log.error('Actions/Auth/ManageUser', 'Error updating user name', safeErr);
    return { status: 'error' };
  }
}
