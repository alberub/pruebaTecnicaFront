import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalFormComponent } from './components/modal-form/modal-form.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ModalBorrarComponent } from './components/modal-borrar/modal-borrar.component';
import { SoloNumerosDirective } from './directives/solo-numeros.directive';



@NgModule({
  declarations: [
    ModalFormComponent,
    ModalBorrarComponent,
    SoloNumerosDirective
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule
  ],
  exports: [
    ModalFormComponent,
    ModalBorrarComponent,
    SoloNumerosDirective
  ]
})
export class SharedModuleModule { }
