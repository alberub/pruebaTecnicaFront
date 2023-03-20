import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { debounceTime, Observable, Subscription, tap } from 'rxjs';
import { ClaseCmb, DepartamentoCmb, FamiliaCmb, ProductoI, ProductoResponse, ProductoU } from '../../interfaces/dynamic.interface';
import { ModalService } from './modal.service';
import { DeshabilitarCampos } from "../../Enums/deshabilitar-campos";
import { ModalEstadosService } from '../../services/modal-estados.service';
import { AccionHttp } from '../../Enums/accion-http';

@Component({
  selector: 'app-modal-form',
  templateUrl: './modal-form.component.html',
  styleUrls: ['./modal-form.component.css']
})
export class ModalFormComponent implements OnInit, OnDestroy {

  fechaAlta: string = '';
  fechaBaja: string = '';  
  altaProducto: boolean =  false;
  existeProducto: boolean = false;
  formulario!: FormGroup;
  consultaDepartamentoCmb$: Observable<DepartamentoCmb[]>;
  cmbClase: ClaseCmb[] = [];
  cmbFamilia: FamiliaCmb[] = [];
  productoSku: number = 0;
  departamentoSeleccionado: number = 0;
  claseSeleccionada: number = 0;
  familiaSeleccionada: number = 0;
  btnCrearInvalido: boolean = false; 
  validarCamposInsertarArr: ReadonlyArray<string> = ['articulo','marca','modelo','departamento','clase','familia','stock','cantidad', 'descontinuado']
  private subscription$: Subscription = new Subscription();

  constructor(private modalService: ModalService, private modalEstadoService: ModalEstadosService, private fb: FormBuilder) { 
    this.consultaDepartamentoCmb$ = this.modalService.getDepartamentoCmb();
    this.modalEstadoService.borrarProducto
      .subscribe( ( _ ) => {
        this.borrarProducto();
      })
  }

  ngOnInit(): void {
    this.formulario = this.fb.group({
      sku: new FormControl('', Validators.maxLength(6)),
      descontinuado: new FormControl(0, Validators.required),
      articulo: new FormControl('', [Validators.required, Validators.maxLength(15)]),
      marca: new FormControl('', [Validators.required, Validators.maxLength(15)]),
      modelo: new FormControl('', [ Validators.required, Validators.maxLength(20)]),
      departamento: new FormControl('', Validators.min(1)),
      clase: new FormControl('', Validators.min(1)),
      familia: new FormControl('', [Validators.required, Validators.min(0)]),
      stock: new FormControl('', [Validators.required, Validators.maxLength(9)]),
      cantidad: new FormControl('', [Validators.required, Validators.maxLength(9)]),
      fechaAlta: new FormControl(),
      fechaBaja: new FormControl()
    });
    
    this.modalService.getDepartamentoCmb()
      .subscribe( () => {        
          this.limpiarSelect('clase');
          this.limpiarSelect('familia');
        });
    this.cambiosDepartamento();
    this.cambiosClase();  
    this.descontinuadoAccion();          

  }

  get form(){
    return this.formulario.controls;
  }

  abirModalBorrar() : void{
    this.modalEstadoService.abrirModalBorrar()
  }

  cambiosDepartamento(): void{        
    this.subscription$.add(
    this.formulario.get('departamento')?.valueChanges
    .subscribe( departamento => {        
        this.limpiarSelect('clase');
        this.limpiarSelect('familia');
        this.departamentoSeleccionado = departamento;        
        this.getClasePorDepartamento(departamento)
      })
    )
  }

  getClasePorDepartamento(departamento: number) :void{
    this.modalService.getClaseCmb(departamento)
      .subscribe( (clases: ClaseCmb[]) => {
        this.cmbClase = clases;
      })
  }

  cambiosClase(): void{
    this.subscription$.add(
    this.formulario.get('clase')?.valueChanges      
      .subscribe( clase => {
        this.claseSeleccionada = clase;
        this.limpiarSelect('familia');
        this.getFamiliaPorClase(this.departamentoSeleccionado, clase);
      })
    )
  }

  getFamiliaPorClase(departamento: number, clase: number) : void{
    this.modalService.getFamiliaCmb(departamento, clase)
      .subscribe( (familias: FamiliaCmb[]) => {        
        this.cmbFamilia = familias;
      })
  }

  // getSku() : void{
  //   this.subscription$.add(
  //     this.formulario.get('sku')?.valueChanges
  //       .pipe( debounceTime(1000))
  //       .subscribe( (sku: number) => {
  //         this.consultarProducto(sku);
  //       })
  //   )
  // }

  consultarProducto(): void{        
    const skuValue = this.formulario.get('sku')?.value;
    this.altaProducto = false;
    this.formulario.reset();
    this.modalService.getProducto(skuValue)
      .subscribe( (producto: ProductoResponse[]) => {
        if (producto.length > 0) {          
          this.existeProducto = true;               
          this.camposDeshabilitados(DeshabilitarCampos.Cambio);
          this.departamentoSeleccionado = producto[0].departamento;
          this.claseSeleccionada = producto[0].clase;
          this.productoSku = producto[0].sku;
          this.formulario.get('articulo')?.setValue(producto[0].articulo);
          this.formulario.get('cantidad')?.setValue(producto[0].cantidad);
          this.formulario.get('clase')?.setValue(producto[0].clase);
          this.formulario.get('departamento')?.setValue(producto[0].departamento);
          this.formulario.get('descontinuado')?.setValue(producto[0].descontinuado);      
          this.formulario.get('marca')?.setValue(producto[0].marca);
          this.formulario.get('modelo')?.setValue(producto[0].modelo);
          this.formulario.get('sku')?.setValue(producto[0].sku);
          this.formulario.get('stock')?.setValue(producto[0].stock);
          this.fechaBaja = String(producto[0].fechaBaja);
          this.fechaAlta = String(producto[0].fechaAlta);        
          let timer = setTimeout(() => {
            this.formulario.get('clase')?.setValue(producto[0].clase);
            this.formulario.get('familia')?.setValue(producto[0].familia);
            this.familiaSeleccionada = producto[0].familia;
            clearTimeout(timer)
          }, 300);
        } else { 
          this.existeProducto = false;
          this.altaProducto = true;
          this.formulario.get('sku')?.setValue(skuValue);
          this.camposDeshabilitados(DeshabilitarCampos.Alta);          
        }
      })
  }

  camposDeshabilitados(funcion: number) :void{    
    switch (funcion) {
      case DeshabilitarCampos.Alta:
        this.formulario.get('fechaAlta')?.disable();
        this.formulario.get('fechaBaja')?.disable();
        this.formulario.get('descontinuado')?.disable();
        break;
      
      case DeshabilitarCampos.Cambio:
        this.formulario.get('fechaAlta')?.disable();
        this.formulario.get('fechaBaja')?.disable();
        this.formulario.get('descontinuado')?.enable();
        break;
    
      default:
        break;
    }
  }

  limpiarSelect(campo: string) : void{
    this.formulario.get(campo)?.setValue(0);
  }

  actualizarProducto() : void{        
    const form = this.formulario.getRawValue();    
    if (this.formulario.valid) {            
      const productoU: ProductoU = {
        sku: this.productoSku,
        articulo: form.articulo,
        marca: form.marca,
        modelo: form.modelo,
        departamento: form.departamento,
        clase: form.clase,
        familia: form.familia,
        cantidad: form.cantidad,
        stock: form.stock,
        descontinuado: form.descontinuado,
        fechaBaja: form.fechaBaja
      }
      this.modalService.updateProduct(productoU)
        .subscribe();
    }
  }

  descontinuadoAccion() :void{
    this.subscription$.add(
      this.formulario.get('descontinuado')?.valueChanges
        .subscribe( valor => {
          if (valor === true) {
            let fechaHoy = this.formatoFecha(new Date());            
            this.formulario.get('descontinuado')?.setValue(1);
            this.formulario.get('fechaBaja')?.setValue(fechaHoy);
          } else if(valor === false){
            this.formulario.get('descontinuado')?.setValue(0);
            this.formulario.get('fechaBaja')?.setValue('');
          }
        })
    );    
  }

  formatoFecha(fecha: Date) :string{
    let anio = fecha.getFullYear();
    let mes = fecha.getMonth() + 1;
    let dia = fecha.getDate();    
    if (mes < 10) {
      return `${anio}-0${mes}-${dia}`
    }    
    if (dia < 10) {
      return `${anio}-${mes}-0${dia}`
    }
    if ((mes && dia) < 10) {
      return `${anio}-0${mes}-0${dia}`
    }
    return `${anio}-${mes}-${dia}`
  }

  // Crear producto

  crearProducto() : void{        
    const form = this.formulario.getRawValue();         
    if (this.formulario.valid) {         
      const producto: ProductoI = {
        sku: form.sku, 
        articulo: form.articulo, 
        marca: form.marca, 
        modelo: form.modelo, 
        departamento: form.departamento, 
        clase: form.clase, 
        familia: form.familia, 
        cantidad: form.cantidad, 
        stock: form.stock
      }
      this.modalService.createProduct(producto)
        .subscribe( ( _ ) => {
          this.consultarProducto();
          this.altaProducto = false;        
        });
    } else{            
      this.btnCrearInvalido = true;
    }
  }

  borrarProducto() :void{
    this.modalService.deleteProduct(this.productoSku)
      .subscribe( ( _ ) => {
        this.formulario.reset();
        this.modalEstadoService.cerrarModalBorrar();
        this.existeProducto = false;
      })
  }

  ngOnDestroy(): void {
    this.subscription$.unsubscribe();
  }

}

















  // async addValidators(accion: AccionHttp){
    // let formControlsArr = this.validarCamposInsertarArr.slice();
    // console.log(formControlsArr, 'valor al iniciar addValidators');
    // console.log(this.validarCamposInsertarArr, 'valor validarCamposInsertarArr');

    //   if (accion === AccionHttp.Alta) {        
    //     this.formulario.controls["articulo"].addValidators(Validators.required);
    //     this.formulario.get('articulo')?.updateValueAndValidity();
    //     this.formulario.controls["marca"].addValidators(Validators.required);
    //     this.formulario.get('marca')?.updateValueAndValidity();
    //     this.formulario.controls["modelo"].addValidators(Validators.required);
    //     this.formulario.get('modelo')?.updateValueAndValidity();
    //     this.formulario.controls["departamento"].addValidators(Validators.required);
    //     this.formulario.get('departamento')?.updateValueAndValidity();        
    //     this.formulario.controls["clase"].addValidators(Validators.required);
    //     this.formulario.get('clase')?.updateValueAndValidity();
    //     this.formulario.controls["familia"].addValidators(Validators.required);
    //     this.formulario.get('familia')?.updateValueAndValidity();
    //     this.formulario.controls["cantidad"].addValidators(Validators.required);
    //     this.formulario.get('cantidad')?.updateValueAndValidity();
    //     this.formulario.controls["stock"].addValidators(Validators.required);
    //     this.formulario.get('stock')?.updateValueAndValidity();
    //   }
    // }

    // switch (accion) {
    //   case DeshabilitarCampos.Alta:
    //       const formAlta = formControlsArr.indexOf('descontinuado');
    //       formControlsArr.splice(formAlta, 1);
    //       console.log(formControlsArr)
    //     break;
    //   case DeshabilitarCampos.Cambio:
    //       const formCambio = formControlsArr.indexOf('articulo');
    //       formControlsArr.splice(formCambio, 1);
    //       console.log(formControlsArr)
    //     break;
    
    //   default:
    //     break;
    // }


    // const formAlta = formControlsArr.indexOf('descontinuado');
    // formControlsArr.splice(formAlta, 1);
    // console.log(formControlsArr)

    // console.log('valores en formControlsArr', formControlsArr);
    // await this.validarCamposInsertarArr.forEach( el => {
    //   this.formulario.controls[el].addValidators(Validators.required);
    //   this.formulario.get(el)?.updateValueAndValidity();
    // });