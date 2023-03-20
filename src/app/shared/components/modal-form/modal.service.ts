import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ClaseCmb, DepartamentoCmb, FamiliaCmb, ProductoI, ProductoResponse, ProductoU } from "../../interfaces/dynamic.interface";

const url = environment.url;

@Injectable({
  providedIn: 'root'
})
export class ModalService {

  constructor(private http: HttpClient) { }

  getDepartamentoCmb(){
    return this.http.get<DepartamentoCmb[]>(`${url}/ComboBox/DepartamentoConsulta`)
  }

  getClaseCmb(departamento: number){
    return this.http.get<ClaseCmb[]>(`${url}/ComboBox/ClaseConsulta/${departamento}`)
  }

  getFamiliaCmb(departamento: number, clase: number){    
    return this.http.get<FamiliaCmb[]>(`${url}/ComboBox/FamiliaConsulta/${departamento}/${clase}`)
  }

  getProducto(sku: number){
    return this.http.get<ProductoResponse[]>(`${url}/Productos/ProductoConsulta/${sku}`);
  }

  createProduct(producto: ProductoI){
    return this.http.post(`${url}/Productos/ProductoInsertar`, producto);
  }

  updateProduct(producto: ProductoU){
    console.log(producto);
    return this.http.put(`${url}/Productos/ProductoActualizar`, producto)
  }

  deleteProduct(sku: number){
    return this.http.delete(`${url}/Productos/ProductoBaja/${sku}`);
  }

}
