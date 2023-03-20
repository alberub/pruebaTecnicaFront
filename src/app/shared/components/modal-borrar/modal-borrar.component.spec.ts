import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalBorrarComponent } from './modal-borrar.component';

describe('ModalBorrarComponent', () => {
  let component: ModalBorrarComponent;
  let fixture: ComponentFixture<ModalBorrarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalBorrarComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalBorrarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
