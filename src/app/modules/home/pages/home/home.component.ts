import { Component, OnInit } from '@angular/core';
import { ModalEstadosService } from 'src/app/shared/services/modal-estados.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  borrarProducto: boolean = false;

  constructor(public modalEstadosService: ModalEstadosService) { }

  ngOnInit(): void {
  }

}
