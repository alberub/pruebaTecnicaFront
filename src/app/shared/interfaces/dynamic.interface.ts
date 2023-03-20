export interface DepartamentoCmb {
    numeroDepartamento: number;
    nombreDepartamento: string;
}

export interface ClaseCmb {
    numeroClase: number;
    nombreClase: string;
    numeroDepartamento: number;
}

export interface FamiliaCmb {
    numeroFamilia: number;
    nombreFamilia: string;
    numeroClase: number;
    nombreDepartamento: number;
}

export interface ProductoI {
    sku: number;
    articulo: string;
    marca: string;
    modelo: string;
    departamento: number;
    clase: number;
    familia: number;
    cantidad: number;
    stock: number;
}

export interface ProductoResponse {
    articulo: string;
    modelo: string;
    marca: string;
    cantidad: number;
    clase: number;
    departamento: number;
    descontinuado: number;
    familia: number;
    fechaAlta: number;
    fechaBaja: number;
    sku: number;
    stock: number;
}

export interface ProductoU {
    sku: number;
    articulo: string;
    marca: string;
    modelo: string;
    departamento: number;
    clase: number;
    familia: number;
    cantidad: number;
    stock: number;
    descontinuado: number;
    fechaBaja ?: string;
}