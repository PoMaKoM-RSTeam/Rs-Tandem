import { computed, effect, inject, Injectable, Signal, signal, WritableSignal } from '@angular/core';
import {
  AuthError,
  AuthResponse,
  AuthTokenResponsePassword,
  createClient,
  Session,
  SupabaseClient,
  User,
} from '@supabase/supabase-js';
import { environment } from '../../environments/environment';
import { handleSupabaseAuthError } from './helpers/supabase-error-messages';
import { AUTH_ERROR_KEYS } from './enums/auth-error-key';
import { AuthProvider } from './types/types';
import { ToastService } from '../core/toast/toast-service';

@Injectable({
  providedIn: 'root',
})
export class TndmAuthService {
  private readonly toastService: ToastService = inject(ToastService);
  private readonly supabase: SupabaseClient = createClient(environment.supabaseUrl, environment.supabaseKey);

  readonly loading: WritableSignal<boolean> = signal(false);
  readonly session: WritableSignal<Session | null> = signal<Session | null>(null);
  readonly error: WritableSignal<string | null> = signal<string | null>(null);
  private initialized = false;

  readonly jwt: Signal<string | null> = computed((): string | null => this.session()?.access_token ?? null);
  readonly user: Signal<User | null> = computed((): User | null => this.session()?.user ?? null);

  constructor() {
    this.supabase.auth.onAuthStateChange((_, session: Session | null): void => {
      this.session.set(session ?? null);
    });

    effect((): void => {
      const errorMessage: string | null = this.error();

      if (errorMessage) {
        this.toastService.warning('error', errorMessage);
        setTimeout((): void => this.error.set(null), 5000);
      }
    });
  }

  get isAuthenticated(): boolean {
    return !!this.jwt();
  }

  get currentUser(): User | null {
    return this.user();
  }

  private async authBody<T>(callback: () => Promise<T>): Promise<T | null> {
    this.loading.set(true);
    this.error.set(null);

    try {
      return await callback();
    } catch (error) {
      if (error instanceof AuthError) {
        this.error.set(handleSupabaseAuthError(error));
      } else if (error instanceof Error) {
        this.error.set(error.message);
      } else {
        this.error.set('Unknown error');
        console.error(error);
      }

      return null;
    } finally {
      this.loading.set(false);
    }
  }

  async checkEmailExists(email: string): Promise<void> {
    const { data } = await this.supabase.rpc('check_email_exists', { p_email: email });

    if (data.exists) {
      throw new AuthError(AUTH_ERROR_KEYS.UserAlreadyExists, 400);
    }
  }

  async register(login: string, email: string, password: string): Promise<User | null> {
    return this.authBody<User | null>(async (): Promise<User | null> => {
      await this.checkEmailExists(email);

      const {
        data: { user },
        error,
      }: AuthResponse = await this.supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            login,
          },
        },
      });

      if (error) {
        this.error.set(handleSupabaseAuthError(error));
        return null;
      }

      return user;
    });
  }

  async login(email: string, password: string): Promise<User | null> {
    return this.authBody<User | null>(async (): Promise<User | null> => {
      const {
        data: { user },
        error,
      }: AuthTokenResponsePassword = await this.supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        this.error.set(handleSupabaseAuthError(error));
        return null;
      }

      return user;
    });
  }

  async logout(): Promise<void | null> {
    return this.authBody(async (): Promise<void | null> => {
      const { error } = await this.supabase.auth.signOut();

      if (error) {
        this.error.set(handleSupabaseAuthError(error));
        return null;
      }
    });
  }

  async signWithOAuth(provider: AuthProvider): Promise<void> {
    await this.authBody(async (): Promise<void> => {
      const { error } = await this.supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${environment.redirectUrl}/`,
        },
      });

      if (error) {
        this.error.set(handleSupabaseAuthError(error));
      }
    });
  }

  async sendPasswordResetEmail(email: string): Promise<boolean> {
    const response: boolean | null = await this.authBody<boolean | null>(async (): Promise<boolean> => {
      const { error } = await this.supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${environment.redirectUrl}/auth/update-password`,
      });

      if (error) {
        this.error.set(handleSupabaseAuthError(error));
        return false;
      }

      return true;
    });

    return response ?? false;
  }

  async updatePassword(newPassword: string): Promise<boolean> {
    const response: boolean | null = await this.authBody<boolean>(async (): Promise<boolean> => {
      const { error } = await this.supabase.auth.updateUser({ password: newPassword });

      if (error) {
        this.error.set(handleSupabaseAuthError(error));
        return false;
      }

      return true;
    });

    return response ?? false;
  }

  async initSession(): Promise<void> {
    if (this.initialized) {
      return;
    }

    const {
      data: { session },
    } = await this.supabase.auth.getSession();

    this.session.set(session ?? null);
    this.initialized = true;
  }
}
