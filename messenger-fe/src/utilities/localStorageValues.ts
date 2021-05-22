const ALL_PREFIX = "simple_messenger";

export const USER_PREFIX = `${ALL_PREFIX}_app_chat`;

export const USER_DETAILS = `${ALL_PREFIX}_user_detail`;
export const CHAT_RECORDS = `${ALL_PREFIX}_chats`;

export function getUserStorageLocation(userId: string): string {
  return `${USER_PREFIX}_${userId}`;
}
