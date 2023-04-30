
import crypto from 'crypto';

export function titleCase(str) {
    return str
      .toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
}

export function sha256(x) {
  return crypto.createHash('sha256').update(x).digest('hex');
}

export async function isLoggedIn(db, cookies) {
  const actualPassword = await db.password.findFirst();
  const storedPassword = await cookies.get('password');

  return storedPassword && sha256(actualPassword.password) == storedPassword
}

export function urlEncode(obj) {
  if (!obj) return ''

  let str = '?'
  for (let key in obj) {
    if (str !== '') {
      str += '&'
    }
    str += key + '=' + encodeURIComponent(obj[key])
  }
  return str
}
