import { Component, OnInit } from '@angular/core';
import { ModalEstadosService } from '../../services/modal-estados.service';

@Component({
  selector: 'app-modal-borrar',
  templateUrl: './modal-borrar.component.html',
  styleUrls: ['./modal-borrar.component.css']
})
export class ModalBorrarComponent implements OnInit {

  constructor(private modalEstadoService: ModalEstadosService) { }

  ngOnInit(): void {
  }

  cerrarModal(){    
    this.modalEstadoService.cerrarModalBorrar()
  }

  borrarProducto(){
    this.modalEstadoService.borrar();
  }

}
