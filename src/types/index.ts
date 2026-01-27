export interface Marca {
  id: number;
  nombre: string;
}

export interface Modelo {
  id: number;
  nombre: string;
  marca: Marca;
}

export interface Caracteristica {
  id: number;
  nombre: string;
  valor: string;
}

export interface Version {
  id: number;
  nombre: string;
  modelo: Modelo;
  caracteristicas: Caracteristica[];
}

export interface Vehiculo {
  id: number;
  vin: string;
  color: string;
  estado: 'disponible' | 'reservado' | 'vendido';
  precio_final: number;
  version: Version;
}
