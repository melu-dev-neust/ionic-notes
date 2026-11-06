import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoteEditorPage } from './note-editor.page';

describe('NoteEditorPage', () => {
  let component: NoteEditorPage;
  let fixture: ComponentFixture<NoteEditorPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(NoteEditorPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
