import { computed, Directive, inject, OnInit, Signal, signal, WritableSignal } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { passwordValidator } from '../validators/password-validator';
import { Router } from '@angular/router';
import { AUTH_ROUTES, TndmAuthService } from '@auth';
import { AuthProvider } from '../types/types';
import { loginValidator } from '@auth/validators/login-validator';

@Directive()
export abstract class TndmAuthFormCore implements OnInit {
  protected readonly fb: FormBuilder = inject(FormBuilder);

  protected readonly router: Router = inject(Router);

  protected readonly authService: TndmAuthService = inject(TndmAuthService);

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

  protected constructor() {}

  protected abstract buildForm(): void;
  protected abstract handleSubmit(): Promise<void>;

  protected async onSubmit(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    try {
      await this.handleSubmit();
    } finally {
      this.isLoading.set(false);
    }
  }

  ngOnInit(): void {
    this.buildForm();
  }

  protected async navigateToLogin(): Promise<void> {
    await this.router.navigateByUrl(AUTH_ROUTES.LOGIN);
  }

  protected async navigateToRegister(): Promise<void> {
    await this.router.navigateByUrl(AUTH_ROUTES.REGISTER);
  }

  protected async navigateToMain(): Promise<void> {
    await this.router.navigateByUrl('/'); // TODO: change path when route will be implemented
  }

  protected async signWithOAuth(provider: AuthProvider): Promise<void> {
    this.isLoading.set(true);
    try {
      await this.authService.signWithOAuth(provider);

      if (this.authService.isAuthenticated()) {
        await this.navigateToMain();
      }
    } finally {
      this.isLoading.set(false);
    }
  }
}
