import { computed, Directive, inject, OnInit, Signal, signal, WritableSignal } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { passwordValidator } from '../validators/password-validator';
import { Router } from '@angular/router';
import { AuthProvider } from '../types/types';
import { loginValidator } from '@auth/validators/login-validator';
import { TndmAuthService } from '@auth/tndm-auth-service';
import { ToastService } from '../../core/toast/toast-service';
import { AUTH_ROUTES } from '@auth';
import { AUTH_ERROR_MESSAGES } from '../constants/auth-error-messages';
import { APP_ROUTES } from '../../shared/constants/app-routes';
import { TranslocoService } from '@jsverse/transloco';

@Directive()
export abstract class TndmAuthFormCore implements OnInit {
  protected readonly toRegisterPath: string = AUTH_ROUTES.REGISTER;
  protected readonly toLoginPath: string = AUTH_ROUTES.LOGIN;
  protected readonly toForgotPasswordPath: string = AUTH_ROUTES.FORGOT_PASSWORD;
  protected readonly toHomePath: string = `/${APP_ROUTES.home}`;

  protected readonly fb: FormBuilder = inject(FormBuilder);

  protected readonly router: Router = inject(Router);

  protected readonly authService: TndmAuthService = inject(TndmAuthService);

  protected readonly toastService: ToastService = inject(ToastService);

  protected readonly transloco: TranslocoService = inject(TranslocoService);

  protected readonly form: FormGroup = this.fb.group({});

  private readonly formValues: Signal<unknown> = toSignal(this.form.valueChanges, { initialValue: {} });

  private readonly formStatus = toSignal(this.form.statusChanges, {
    initialValue: this.form.status,
  });

  protected readonly isLoading: WritableSignal<boolean> = signal<boolean>(false);

  protected readonly loginControl: FormControl<string> = new FormControl<string>('', {
    nonNullable: true,
    validators: [Validators.required, Validators.minLength(3), loginValidator, Validators.maxLength(20)],
  });

  protected readonly emailControl: FormControl<string> = new FormControl<string>('', {
    nonNullable: true,
    validators: [Validators.required, Validators.email],
  });

  protected readonly passwordControl: FormControl<string> = new FormControl<string>('', {
    nonNullable: true,
    validators: [Validators.required, Validators.minLength(8), passwordValidator],
  });

  private readonly validFormStatus = 'VALID';

  protected readonly canSubmit: Signal<boolean> = computed((): boolean => {
    this.formValues();
    return this.formStatus() === this.validFormStatus && this.form.dirty && !this.isLoading();
  });

  protected readonly AUTH_ERROR_MESSAGES = AUTH_ERROR_MESSAGES;

  protected constructor() {}

  protected abstract buildForm(): void;
  protected abstract handleSubmit(): Promise<void>;

  private async handleActionWithFeedback<T>(cb: () => Promise<T>): Promise<T | void> {
    this.isLoading.set(true);
    try {
      return await cb();
    } catch (e) {
      if (e instanceof Error) {
        this.toastService.warning(this.transloco.translate('toast.warning'), e.message);
      } else {
        this.toastService.warning(
          this.transloco.translate('toast.warning'),
          this.transloco.translate('common.somethingWentWrong')
        );
      }
    } finally {
      this.isLoading.set(false);
    }
  }

  protected async onSubmit(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    await this.handleActionWithFeedback(() => this.handleSubmit());
  }

  ngOnInit(): void {
    this.buildForm();
  }

  protected async navigateToMain(): Promise<void> {
    await this.router.navigateByUrl(APP_ROUTES.home);
  }

  protected async signWithOAuth(provider: AuthProvider): Promise<void> {
    await this.handleActionWithFeedback(async () => {
      await this.authService.signWithOAuth(provider);

      if (this.authService.isAuthenticated) {
        await this.navigateToMain();
      }
    });
  }
}
