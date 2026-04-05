import { TestBed } from '@angular/core/testing';
import { SandboxFetcherService } from './sandbox-fetcher.service';
import { SupabaseService } from '../../../core/supabase/supabase-service';
import { ToastService } from '../../../core/services/toast/toast-service';
import { firstValueFrom } from 'rxjs';

type SpyRpc = {
  (): Promise<unknown>;
  mockResolvedValue: (val: unknown) => void;
};

describe('SandboxFetcherService', (): void => {
  let service: SandboxFetcherService;
  let supabaseClientMock: { rpc: SpyRpc };
  let toastServiceMock: Record<string, () => void>;

  beforeEach((): void => {
    const rpcSpy = ((): SpyRpc => {
      let resolvedValue: unknown;

      const fn = async (): Promise<unknown> => resolvedValue;

      (fn as unknown as SpyRpc).mockResolvedValue = (val: unknown): void => {
        resolvedValue = val;
      };

      return fn as unknown as SpyRpc;
    })();

    supabaseClientMock = {
      rpc: rpcSpy,
    };

    const supabaseServiceMock = {
      get client(): { rpc: SpyRpc } {
        return supabaseClientMock;
      },
    };

    toastServiceMock = {
      danger: (): void => {},
      success: (): void => {},
    };

    TestBed.configureTestingModule({
      providers: [
        SandboxFetcherService,
        { provide: SupabaseService, useValue: supabaseServiceMock },
        { provide: ToastService, useValue: toastServiceMock },
      ],
    });

    service = TestBed.inject(SandboxFetcherService);
  });

  it('should be created', (): void => {
    expect(service).toBeTruthy();
  });

  describe('saveData', (): void => {
    it('should call RPC save_sandbox_data with correct parameters', async (): Promise<void> => {
      const mockUserId = 'user-123';
      const mockHtml = '<h1>Hello</h1>';
      const mockCss = 'h1 { color: red; }';
      const mockJs = 'console.log("test");';

      supabaseClientMock.rpc.mockResolvedValue({ data: null, error: null });

      await firstValueFrom(service.saveData(mockUserId, mockHtml, mockCss, mockJs));

      expect(supabaseClientMock.rpc).toBeTruthy();
    });

    it('should throw an error if Supabase returns an error', async (): Promise<void> => {
      const mockError = { message: 'DB Error' };
      supabaseClientMock.rpc.mockResolvedValue({ data: null, error: mockError });

      await expect(firstValueFrom(service.saveData('1', '', '', ''))).rejects.toEqual(mockError);
    });
  });

  describe('getData', (): void => {
    const mockUserId = 'user-123';

    it('should return the first element of the array on success', async (): Promise<void> => {
      const mockResponse = [{ html: 'html', css: 'css', js: 'js' }];
      supabaseClientMock.rpc.mockResolvedValue({ data: mockResponse, error: null });

      const data = await firstValueFrom(service.getData(mockUserId));

      expect(data).toEqual(mockResponse[0]);
    });

    it('should return undefined if the data array is empty', async (): Promise<void> => {
      supabaseClientMock.rpc.mockResolvedValue({ data: [], error: null });

      const data = await firstValueFrom(service.getData(mockUserId));

      expect(data).toBeUndefined();
    });

    it('should return undefined if the data is null', async (): Promise<void> => {
      supabaseClientMock.rpc.mockResolvedValue({ data: null, error: null });

      const data = await firstValueFrom(service.getData(mockUserId));

      expect(data).toBeUndefined();
    });

    it('should throw an error if RPC fails with an error', async (): Promise<void> => {
      const mockError = { message: 'Fetch Error' };
      supabaseClientMock.rpc.mockResolvedValue({ data: null, error: mockError });

      await expect(firstValueFrom(service.getData(mockUserId))).rejects.toEqual(mockError);
    });
  });
});
