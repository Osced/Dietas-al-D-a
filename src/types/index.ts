/**
 * Tipos de datos para Dietas al Día - Plataforma de Nutrición Clínica
 */

export type OrigenAlimento = 'Animal' | 'Vegetal' | 'Fúngico' | 'Marino' | 'Mineral' | 'Fermentado';

export interface Alimento {
  id: string;
  nombre: string;
  definicion: string;
  origen: OrigenAlimento;
  funcionalidadPrincipal: string;
  alergenos: string[];
  categoria: string;
  calorias100g: number;
  macronutrientes: {
    proteinas: number;
    grasas: number;
    carbohidratos: number;
    fibra: number;
  };
  micronutrientesClave: string[];
  indiceGlucemico: 'Bajo' | 'Medio' | 'Alto';
}

export type TipoNutriente = 'Macronutriente' | 'Micronutriente' | 'Compuesto Bioactivo';

export interface Nutriente {
  id: string;
  nombre: string;
  definicion: string;
  funcionalidad: string;
  tipo: TipoNutriente;
  subtipo: string;
  enfermedadesPorDeficit: string[];
  fuentesAlimentarias: string[];
}

export type ClasificacionVitaminaMineral = 
  | 'Vitamina Liposoluble' 
  | 'Vitamina Hidrosoluble' 
  | 'Macromineral' 
  | 'Oligoelemento';

export interface VitaminaMineral {
  id: string;
  nombre: string;
  clasificacion: ClasificacionVitaminaMineral;
  funcionesAsociadas: string[];
  racionDieteticaRecomendada: string;
  fuentesPrincipales: string[];
  sintomasDeficiencia: string[];
  limiteSuperiorSeguro?: string;
}

export type ViaAdministracion = 'Oral' | 'Enteral' | 'Sonda nasogástrica' | 'Parenteral';

export interface DietaPredisenada {
  id: string;
  nombre: string;
  objetivos: string[];
  definicionTecnica: string;
  aporteCalorico: string;
  distribucionMacros: {
    proteinasPct: number;
    grasasPct: number;
    carbohidratosPct: number;
  };
  componentes: string[]; // Alimentos o categorías de alimentos que la forman
  alimentosDesaconsejados: string[];
  ingestaNecesaria: string;
  viaAdministracion: ViaAdministracion;
  duracion: string;
  dosificacion: string;
  pauta: string;
  suplementos: string[];
  patologiasIndicadas: string[];
  contraindicaciones: string[];
}

export interface EnfermedadNutricional {
  id: string;
  nombre: string;
  causas: string;
  diagnosis: string;
  diagnosticosDiferenciales: string[];
  tratamiento: string;
  objetivoTratamiento: string;
  alimentosContraindicados: string[];
  nutrientesRecomendados: string[];
}

export interface RegistroEvolucionItem {
  fecha: string;
  pesoKg: number;
  imc: number;
  observacionesMedicas: string;
  adherenciaDieta: string;
}

export interface Paciente {
  id: string;
  datosPersonales: {
    nombre: string;
    apellidos: string;
    fechaNacimiento: string;
    edad?: number;
    sexo: 'Femenino' | 'Masculino' | 'Otro';
    telefono?: string;
    email?: string;
    documentoIdentidad?: string;
    ocupacion?: string;
  };
  antecedentesFamiliares: string[];
  antecedentesPatologicosPersonales: string[];
  habitosToxicos?: string;
  historiaDietetica: {
    patronAlimentarioHabitual?: string;
    registroComidasRecientes?: string[];
    preferenciasYAversiones?: string;
  };
  alergiasEIncompatibilidades: {
    alergias: string[];
    incompatibilidades: string[];
  };
  exploracionFisica: {
    pesoKg: number;
    tallaCm: number;
    imc: number;
    clasificacionImc?: string;
    perimetroCinturaCm?: number;
    tensionArterial?: string;
    frecuenciaCardiacaLpm?: number;
    fechaRegistro?: string;
  };
  pruebasComplementarias: {
    analiticaSangre?: {
      glucosaBasalMgDl?: number;
      hbA1cPct?: number;
      colesterolTotalMgDl?: number;
      hdlMgDl?: number;
      ldlMgDl?: number;
      trigliceridosMgDl?: number;
      vitaminaD25OHNgMl?: number;
    };
    fechaInforme?: string;
  };
  diagnosticoNutricional: string;
  dietaAsignada?: {
    dietaId: string;
    nombreDieta: string;
    fechaAsignacion: string;
    observacionesClinicas?: string;
    activa?: boolean;
  };
  registroEvolucion: RegistroEvolucionItem[];
}

export type HistoriaClinicaPaciente = Paciente;

export interface ResultadoEvaluacionDieta {
  dieta: DietaPredisenada;
  score: number; // 0 - 100
  nivelIdoneidad: 'Alta Idoneidad' | 'Idoneidad Moderada' | 'Contraindicada';
  conflictosDetectados: string[];
  beneficiosIdentificados: string[];
  justificacion: string;
  contraindicacionesDetectadas?: string[];
  alertasAlergiasEIncompatibilidades?: string[];
  puntosPositivos?: string[];
  justificacionMedica?: string;
  suplementacionRecomendada?: string[];
  ajustesPropuestos?: string[];
}

export type DecisionEngineEvaluation = ResultadoEvaluacionDieta;

export interface DoctorProfile {
  id: string;
  nombre: string;
  email: string;
  avatarUrl?: string;
  matricula: string;
  especialidad: string;
  centroMedico: string;
  isGoogleAuthenticated: boolean;
  ultimoAcceso: string;
}

export type ActiveTab = 
  | 'catalogos' 
  | 'historia_clinica' 
  | 'asignacion_tratamiento';

export type CatalogSubTab =
  | 'alimentos'
  | 'nutrientes'
  | 'vitaminas'
  | 'dietas'
  | 'enfermedades';



