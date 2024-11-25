export function validateEmail(email: string): boolean {
  if (email.includes('..')) {
    throw new Error('Invalid email');
  }
  
  const emailRegex = /^[a-zA-Z0-9._+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(email)) {
    throw new Error('Invalid email');
  }
  
  return true;
}
