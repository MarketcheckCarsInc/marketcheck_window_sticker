import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WindowStickerV2Component } from './window-sticker-v2.component';

describe('WindowStickerV2Component', () => {
  let component: WindowStickerV2Component;
  let fixture: ComponentFixture<WindowStickerV2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WindowStickerV2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WindowStickerV2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
