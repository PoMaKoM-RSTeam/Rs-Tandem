import { computed, Directive, effect, inject, OnInit, Signal, signal, WritableSignal } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { passwordValidator } from '../validators/password-validator';
import { Router } from '@angular/router';
import { AUTH_ROUTES, TndmAuthService } from '@auth';
import { AuthProvider } from '../types/types';

@Directive()
export abstract class TndmAuthFormCore implements OnInit {
  protected readonly fb: FormBuilder = inject(FormBuilder);

  protected readonly router: Router = inject(Router);

  protected readonly authService: TndmAuthService = inject(TndmAuthService);

  protected readonly form: FormGroup = this.fb.group({});

  private readonly formValues: Signal<unknown> = toSignal(this.form.valueChanges, { initialValue: {} });

  protected readonly isLoading: WritableSignal<boolean> = signal<boolean>(false);

  protected readonly loginControl: FormControl<string> = new FormControl<string>('', {
    nonNullable: true,
    validators: [Validators.required, Validators.minLength(3), Validators.maxLength(20)],
  });

  protected readonly emailControl: FormControl<string> = new FormControl<string>('', {
    nonNullable: true,
    validators: [Validators.required, Validators.email],
  });

  protected readonly passwordControl: FormControl<string> = new FormControl<string>('', {
    nonNullable: true,
    validators: [Validators.required, Validators.minLength(8), passwordValidator],
  });

  protected readonly canSubmit: Signal<boolean> = computed((): boolean => {
    this.formValues();

    return this.form.valid && this.form.dirty && !this.isLoading();
  });

  private navigated = false;

  protected constructor() {
    effect((): void => {
      if (this.authService.jwt() && !this.navigated) {
        this.navigated = true;
        this.navigateToMain();
      }
    });
  }

  protected abstract buildForm(): void;
  protected abstract handleSubmit(): void | Promise<void>;

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

  protected navigateToLogin(): void {
    this.router.navigateByUrl(AUTH_ROUTES.LOGIN).then();
  }

  protected navigateToRegister(): void {
    this.router.navigateByUrl(AUTH_ROUTES.REGISTER).then();
  }

  protected navigateToMain(): void {
    this.router.navigateByUrl('/').then(); // TODO: change path when route will be implemented
  }

  protected async signWithOAuth(provider: AuthProvider): Promise<void> {
    this.isLoading.set(true);
    try {
      await this.authService.signWithOAuth(provider);
    } finally {
      this.isLoading.set(false);
    }
  }
}
