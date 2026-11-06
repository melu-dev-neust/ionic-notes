import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MynotesPage } from './mynotes.page';

describe('MynotesPage', () => {
  let component: MynotesPage;
  let fixture: ComponentFixture<MynotesPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MynotesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
