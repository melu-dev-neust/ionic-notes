import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, tap } from 'rxjs';
import { User } from '../models/user';

interface AuthResponse {
    user_id: number;
    username: string;
    email: string;
    token: string;
}

@Injectable({ providedIn: 'root' })
export class Auth {
    private http = inject(HttpClient);

    private readonly api = 'https://iroha.ct.ws/ionic-notes-api/api/auth.php';
    private readonly userKey = 'noteit_user';
    private readonly tokenKey = 'noteit_token';

    private user: User | null = this.loadUser();
    private token: string | null = this.loadToken();

    login(email: string, password: string): Observable<User> {
        return this.http.post<AuthResponse>(`${this.api}?type=login`, { email, password }).pipe(
            tap(res => this.setSession(res)),
            map(res => this.toUser(res))
        );
    }

    register(email: string, password: string, username: string): Observable<User> {
        return this.http.post<AuthResponse>(`${this.api}?type=register`, { email, password, username }).pipe(
            tap(res => this.setSession(res)),
            map(res => this.toUser(res))
        );
    }

    /** Revokes the token on the server (best effort), then clears the local session */
    logout() {
        const token = this.token;
        if (token) {
        this.http
            .post(`${this.api}?type=logout`, {}, { headers: { Authorization: `Bearer ${token}` } })
            .subscribe({ error: () => {} });
        }
        this.clearSession();
    }

    /** Clears the local session only (used by the interceptor when the token is rejected) */
    clearSession() {
        this.user = null;
        this.token = null;
        try {
            localStorage.removeItem(this.userKey);
            localStorage.removeItem(this.tokenKey);
        } catch {}
    }

    getUser(): User | null {
        return this.user;
    }

    getToken(): string | null {
        return this.token;
    }

    isLoggedIn(): boolean {
        return this.user !== null && this.token !== null;
    }

    // ===== helpers =====
    private toUser(res: AuthResponse): User {
        return { id: Number(res.user_id), username: res.username, email: res.email };
    }

    private setSession(res: AuthResponse) {
        this.user = this.toUser(res);
        this.token = res.token;
        try {
            localStorage.setItem(this.userKey, JSON.stringify(this.user));
            localStorage.setItem(this.tokenKey, res.token);
        } catch {}
    }

    private loadUser(): User | null {
        try {
            const raw = localStorage.getItem(this.userKey);
        return raw ? (JSON.parse(raw) as User) : null;
        } catch {
            return null;
        }
    }

    private loadToken(): string | null {
        try {
            return localStorage.getItem(this.tokenKey);
        } catch {
            return null;
        }
    }
}