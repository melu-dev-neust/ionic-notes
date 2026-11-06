import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SharedNotesPage } from './shared-notes.page';

describe('SharedNotesPage', () => {
  let component: SharedNotesPage;
  let fixture: ComponentFixture<SharedNotesPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(SharedNotesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
