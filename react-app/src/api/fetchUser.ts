// src/api/fetchUser.ts
export async function fetchUser(userId: string) {
  // simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 1000));
  console.log('foo')
  return { id: userId, name: 'Ada Lovelace' };
}
