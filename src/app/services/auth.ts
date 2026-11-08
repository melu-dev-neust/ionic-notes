import { Service } from '@angular/core';

@Service()
export class Auth {

      // ===== AUTH (stub — replace with HttpClient calls to your PHP API later) =====

  // login(email, password) / register(email, password, username) / logout()
  // searchUser(username) etc.
  
/** Returns true on success. TODO: POST /api/login.php { email, password } */
login(email: string, password: string): boolean {
  // fake check: any non-empty credentials "succeed" for now
  if (!email || !password) return false;
  this._user = { id: 1, email, username: email.split('@')[0] };
  return true;
}

/** Returns true on success, false if username is taken. TODO: POST /api/register.php */
register(email: string, password: string, username: string): boolean {
  // fake uniqueness check against a small list
  const taken = ['alex_dev', 'admin', 'test'].includes(username.toLowerCase());
  if (taken) return false;
  this._user = { id: 1, email, username };
  return true;
}

logout() {
  // TODO: clear token
}
}
