import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TndmCodeGolfRank } from './code-golf-rank';
import { GolfRank } from '../../types/golf-rank';

describe('TndmCodeGolfRank', () => {
  let component: TndmCodeGolfRank;
  let fixture: ComponentFixture<TndmCodeGolfRank>;

  const mockRank: GolfRank = { maxBytes: 50, label: 'Senior', color: '#059669', icon: '👑', width: 100 };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TndmCodeGolfRank],
    }).compileComponents();

    fixture = TestBed.createComponent(TndmCodeGolfRank);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('rank', mockRank);
    fixture.componentRef.setInput('byteCount', 42);

    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should display the correct rank label and icon', () => {
    const iconElement = fixture.nativeElement.querySelector('.icon');
    const labelElement = fixture.nativeElement.querySelector('.rank');

    expect(iconElement.textContent).toBe(mockRank.icon);
    expect(labelElement.textContent).toBe(mockRank.label);
    expect(labelElement.style.color).toBe('rgb(5, 150, 105)');
  });

  it('should display the correct byte count', () => {
    const bytesElement = fixture.nativeElement.querySelector('.bytes-amount');
    expect(bytesElement.textContent).toContain('42 Bytes');
  });

  it('should apply correct styles to the progress bar', () => {
    const progressFill = fixture.nativeElement.querySelector('.progress-fill');

    expect(progressFill.style.width).toBe('100%');
    expect(progressFill.style.backgroundColor).toBe('rgb(5, 150, 105)');
  });

  it('should update UI when inputs change', () => {
    const newRank: GolfRank = { maxBytes: 200, label: 'Junior', color: '#d97706', icon: '🐣', width: 50 };

    fixture.componentRef.setInput('rank', newRank);
    fixture.componentRef.setInput('byteCount', 150);
    fixture.detectChanges();

    const labelElement = fixture.nativeElement.querySelector('.rank');
    const bytesElement = fixture.nativeElement.querySelector('.bytes-amount');
    const progressFill = fixture.nativeElement.querySelector('.progress-fill');

    expect(labelElement.textContent).toBe('Junior');
    expect(bytesElement.textContent).toContain('150 Bytes');
    expect(progressFill.style.width).toBe('50%');
  });
});
