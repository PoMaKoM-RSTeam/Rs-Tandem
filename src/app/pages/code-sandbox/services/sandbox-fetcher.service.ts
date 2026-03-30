import { inject, Injectable } from '@angular/core';
import { SupabaseService } from '../../../core/supabase/supabase-service';
import { SupabaseClient } from '@supabase/supabase-js';
import { catchError, from, map, Observable } from 'rxjs';
import { ToastService } from '../../../core/services/toast/toast-service';

type SandboxResponse = {
  html: string;
  css: string;
  js: string;
};

@Injectable({ providedIn: 'root' })
export class SandboxFetcherService {
  private readonly toastService = inject(ToastService);
  private readonly supabaseService = inject(SupabaseService);
  private readonly supabase: SupabaseClient = this.supabaseService.client;

  private readonly RPC_FUNCTIONS = {
    GET_DATA: 'get_sandbox_data',
    SAVE_DATA: 'save_sandbox_data',
  } as const;

  saveSandboxData(userId: string, html: string, css: string, js: string): Observable<void> {
    return this.callRpc<void>(this.RPC_FUNCTIONS.SAVE_DATA, {
      p_user_id: userId,
      p_html: html,
      p_css: css,
      p_js: js,
    });
  }

  getSandboxData(userId: string): Observable<SandboxResponse | undefined> {
    return this.callRpc<SandboxResponse | undefined>(this.RPC_FUNCTIONS.GET_DATA, {
      p_user_id: userId,
    }).pipe(
      catchError(error => {
        this.toastService.danger('Error saving result', error.message || 'Try again');
        throw error;
      })
    );
  }

  private callRpc<T>(fn: string, params?: Record<string, unknown>): Observable<T> {
    return from(this.supabase.rpc(fn, params)).pipe(
      map(({ data, error }) => {
        if (error) {
          throw error;
        }
        return data as T;
      })
    );
  }
}
