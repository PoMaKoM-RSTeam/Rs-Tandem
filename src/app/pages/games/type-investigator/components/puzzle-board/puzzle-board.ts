import { ChangeDetectionStrategy, Component, computed, input, OnInit, output, signal } from '@angular/core';
import { CdkDrag, CdkDragDrop, CdkDropList, CdkDropListGroup } from '@angular/cdk/drag-drop';
import { CodeBlock, Puzzle } from '../../models/puzzle.model';
import { TndmButton } from '../../../../../shared/ui/tndm-button/tndm-button';
import { BoardState } from '../../models/board.state.model';
import { buildInitialState } from './build-initial-state';
import { getBlock } from './get-block';
import { applySlotDrop } from './apply-slot-drop';
import { applyPaletteDrop } from './apply-palette-drop';
import { validateSolution } from './validate-solution';

@Component({
  selector: 'tndm-puzzle-board',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CdkDropListGroup, CdkDropList, CdkDrag, TndmButton],
  styleUrl: './puzzle-board.scss',
  template: `
    <div class="puzzle-board_topbar">
      <button class="puzzle-board_back" type="button" (click)="back.emit()">← Back</button>
      <span class="puzzle-board_difficulty puzzle-board_difficulty--{{ puzzle().difficulty }}">{{
        puzzle().difficulty
      }}</span>
    </div>

    <article cdkDropListGroup class="puzzle-board_card">
      <h2 class="puzzle-board_title">{{ puzzle().title }}</h2>
      <p class="puzzle-board_desc">{{ puzzle().description }}</p>

      <div class="puzzle-board_editor">
        @for (line of puzzle().lines; track $index) {
          <div class="puzzle-board_line" [style.padding-left.rem]="line.indent * 1.5">
            @for (seg of line.segments; track $index) {
              @if (seg.kind === 'locked') {
                <span class="puzzle-board_token puzzle-board_token--{{ seg.tokenType }}">{{ seg.text }}</span>
              } @else {
                @let slot = state().slots[seg.slotId];
                @let placedBlock = findBlock(slot.currentBlockId);

                <div
                  cdkDropList
                  class="puzzle-board_slot"
                  [cdkDropListData]="seg.slotId"
                  [class.puzzle-board_slot--correct]="slot.validationState === 'correct'"
                  [class.puzzle-board_slot--filled]="!!placedBlock"
                  [class.puzzle-board_slot--wrong]="slot.validationState === 'wrong'"
                  [id]="seg.slotId"
                  (cdkDropListDropped)="onDrop($event, seg.slotId)">
                  @if (placedBlock) {
                    <div
                      cdkDrag
                      class="puzzle-board_block puzzle-board_block--{{ placedBlock.type }}"
                      tabindex="0"
                      [cdkDragData]="{ blockId: placedBlock.id, fromSlot: seg.slotId }"
                      [class.puzzle-board_block--correct]="slot.validationState === 'correct'"
                      [class.puzzle-board_block--wrong]="slot.validationState === 'wrong'">
                      {{ placedBlock.label }}
                      <div cdkDragPlaceholder class="puzzle-board_placeholder"></div>
                    </div>
                  }
                </div>
              }
            }
          </div>
        }
      </div>

      <div class="puzzle-board_palette-section">
        <p class="puzzle-board_palette-label" id="palette-label">Available blocks</p>
        <div
          cdkDropList
          class="puzzle-board_palette"
          id="palette"
          [cdkDropListData]="'palette'"
          (cdkDropListDropped)="onDropToPalette($event)">
          @for (blockId of state().paletteBlockIds; track blockId) {
            @let block = findBlock(blockId);
            @if (block) {
              <div
                cdkDrag
                class="puzzle-board_block puzzle-board_block--{{ block.type }}"
                tabindex="0"
                [cdkDragData]="{ blockId: block.id, fromSlot: null }">
                {{ block.label }}
                <div cdkDragPlaceholder class="puzzle-board_placeholder"></div>
              </div>
            }
          }
          @if (state().paletteBlockIds.length === 0) {
            <span class="puzzle-board_palette-empty">All blocks placed</span>
          }
        </div>
      </div>

      <div class="puzzle-board_buttons">
        <tndm-button [btnConfig]="{ variant: 'secondary', label: 'Reset' }" (clicked)="resetPuzzle()" />
        <tndm-button [btnConfig]="{ label: 'Check', isDisabled: !allSlotsFilled() }" (clicked)="checkSolution()" />
      </div>

      @if (showHint()) {
        <aside class="puzzle-board_hint">{{ puzzle().hintText }}</aside>
      }
      <button class="puzzle-board_hint-toggle" type="button" (click)="toggleHint()">
        {{ showHint() ? 'Hide hint' : 'Show hint' }}
      </button>

      @if (isSolved()) {
        <div class="puzzle-board_success">Puzzle solved!</div>
      }
    </article>
  `,
})
export class TndmPuzzleBoard implements OnInit {
  readonly puzzle = input.required<Puzzle>();
  readonly solved = output<void>();
  readonly back = output<void>();

  readonly state = signal<BoardState>({ slots: {}, paletteBlockIds: [] });
  readonly showHint = signal(false);
  readonly isSolved = signal(false);

  readonly allSlotsFilled = computed(() => Object.values(this.state().slots).every(s => s.currentBlockId !== null));

  ngOnInit(): void {
    this.resetPuzzle();
  }

  toggleHint(): void {
    this.showHint.update(v => !v);
  }

  resetPuzzle(): void {
    this.state.set(buildInitialState(this.puzzle()));
    this.isSolved.set(false);
  }

  findBlock(id: string | null): CodeBlock | undefined {
    return getBlock(this.puzzle(), id);
  }

  onDrop(event: CdkDragDrop<string>, targetSlotId: string): void {
    const { blockId, fromSlot } = event.item.data as { blockId: string; fromSlot: string | null };
    this.state.update(s => applySlotDrop(s, targetSlotId, blockId, fromSlot));
  }

  onDropToPalette(event: CdkDragDrop<string>): void {
    const { blockId, fromSlot } = event.item.data as { blockId: string; fromSlot: string | null };
    this.state.update(s => applyPaletteDrop(s, blockId, fromSlot));
  }

  checkSolution(): void {
    const result = validateSolution(this.state().slots);
    this.state.update(s => ({ ...s, slots: result.slots }));

    if (result.allCorrect) {
      this.isSolved.set(true);
      this.solved.emit();
    }
  }
}
