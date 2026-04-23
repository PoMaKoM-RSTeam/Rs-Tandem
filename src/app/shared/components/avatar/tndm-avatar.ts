import { ChangeDetectionStrategy, Component, computed, inject, input, signal } from '@angular/core';
import { UserService } from '../../../core/services/user-service/user-api.service';
import { NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'tndm-avatar',
  imports: [NgOptimizedImage],
  templateUrl: './tndm-avatar.html',
  styleUrl: './tndm-avatar.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TndmAvatar {
  private readonly userService = inject(UserService);
  private readonly DEFAULT_AVATAR = 'images/default-avatar.png';

  readonly size = input<number>(40);
  readonly src = input<string | null | undefined>();
  readonly alt = input<string | null | undefined>();

  readonly finalSrc = computed(() => {
    // TODO: Implement Supabase Storage integration.
    // 1. Create 'avatars' bucket in Supabase.
    // 2. Implement file upload in TndmUserProfileService.
    // 3. Update profile logic to store and retrieve public URL.
    // const source = this.src() ?? this.userService.context()?.avatarUrl;
    return this.DEFAULT_AVATAR;
  });
  readonly finalAlt = computed(() => this.alt() ?? this.userService.context()?.displayName);

  protected readonly hasError = signal(false);

  protected handleError(): void {
    this.hasError.set(true);
  }
}
