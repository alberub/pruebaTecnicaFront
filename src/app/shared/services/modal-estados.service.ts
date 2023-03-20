import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ModalEstadosService {

  private borrarSubject = new Subject<boolean>();
  borrarProducto = this.borrarSubject.asObservable();
  private _modalBorrar: boolean = false;
  constructor() { }

  get modalBorrar(): boolean{
    return this._modalBorrar;
  }

  abrirModalBorrar(): void{
    this._modalBorrar = true
  }

  cerrarModalBorrar(): void{
    this._modalBorrar = false;
  }

  borrar(): void{
    this.borrarSubject.next(true)
  }
}
