import {
  Paciente,
  DietaPredisenada,
  EnfermedadNutricional,
  Alimento,
  ResultadoEvaluacionDieta,
} from '../types';

/**
 * Normaliza cadenas de texto para comparaciones insensibles a mayúsculas y acentos
 */
function normalizeText(text: string): string {
  if (!text) return '';
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
}

/**
 * Calcula la tasa metabólica basal (TMB) y gasto energético total (GET) con Mifflin-St Jeor
 */
export function calculateBiometrics(paciente: Paciente): {
  tmbKcal: number;
  getKcal: number;
  imc: number;
  clasificacion: string;
} {
  const peso = paciente.exploracionFisica?.pesoKg || (paciente as any).antropometria?.pesoKg || 70;
  const talla = paciente.exploracionFisica?.tallaCm || (paciente as any).antropometria?.tallaCm || 170;
  const imc =
    paciente.exploracionFisica?.imc ||
    (paciente as any).antropometria?.imc ||
    parseFloat((peso / ((talla / 100) * (talla / 100))).toFixed(1));

  let edad = 40;
  if (paciente.datosPersonales?.fechaNacimiento) {
    const birthYear = new Date(paciente.datosPersonales.fechaNacimiento).getFullYear();
    const currentYear = new Date().getFullYear();
    if (!isNaN(birthYear) && birthYear > 1900) {
      edad = currentYear - birthYear;
    }
  }

  const isMale = paciente.datosPersonales?.sexo === 'Masculino';
  // Fórmula Mifflin-St Jeor
  let tmb = 10 * peso + 6.25 * talla - 5 * edad + (isMale ? 5 : -161);
  tmb = Math.round(tmb);
  const get = Math.round(tmb * 1.4); // Factor de actividad moderada

  let clasificacion = 'Normopeso';
  if (imc < 18.5) clasificacion = 'Bajo peso';
  else if (imc >= 30) clasificacion = 'Obesidad';
  else if (imc >= 25) clasificacion = 'Sobrepeso';

  return {
    tmbKcal: tmb,
    getKcal: get,
    imc,
    clasificacion,
  };
}

/**
 * Motor de Apoyo a la Toma de Decisiones Clínicas (RF7)
 * Cruza la historia clínica completa del paciente con los catálogos de dietas,
 * patologías, alimentos y alérgenos para emitir una prescripción guiada por evidencia.
 */
export function evaluateDietForPatient(
  paciente: Paciente,
  dieta: DietaPredisenada,
  enfermedades: EnfermedadNutricional[],
  alimentos: Alimento[]
): ResultadoEvaluacionDieta {
  let score = 55; // Base neutral score
  const conflictosDetectados: string[] = [];
  const beneficiosIdentificados: string[] = [];
  const contraindicacionesDetectadas: string[] = [];
  const alertasAlergiasEIncompatibilidades: string[] = [];
  const puntosPositivos: string[] = [];
  const suplementacionRecomendada: string[] = [...(dieta.suplementos || [])];
  const ajustesPropuestos: string[] = [];

  const rawAllergies =
    paciente.alergiasEIncompatibilidades?.alergias || (paciente as any).alergias || [];
  const rawIncompatibilities =
    paciente.alergiasEIncompatibilidades?.incompatibilidades ||
    (paciente as any).incompatibilidades ||
    [];
  const rawDiseases =
    paciente.antecedentesPatologicosPersonales ||
    (paciente as any).enfermedadesAsociadas ||
    [];

  const patientAllergies = rawAllergies.map(normalizeText);
  const patientIncompatibilities = rawIncompatibilities.map(normalizeText);
  const patientDiseases = rawDiseases.map(normalizeText);
  const patientDiag = normalizeText(paciente.diagnosticoNutricional || '');

  // 1. ANÁLISIS DE ALERGIAS E INCOMPATIBILIDADES FRENTE A COMPONENTES
  for (const compName of dieta.componentes || []) {
    const compNormalized = normalizeText(compName);
    const matchedFood = alimentos.find(
      (a) =>
        normalizeText(a.nombre) === compNormalized ||
        compNormalized.includes(normalizeText(a.nombre))
    );

    // Revisión de alérgenos del alimento
    if (matchedFood && matchedFood.alergenos) {
      for (const alergeno of matchedFood.alergenos) {
        const alergenoNorm = normalizeText(alergeno);
        for (const userAllergy of patientAllergies) {
          if (userAllergy.includes(alergenoNorm) || alergenoNorm.includes(userAllergy)) {
            const msg = `ALERTA CRÍTICA: La dieta incluye "${matchedFood.nombre}", que contiene "${alergeno}". Paciente con alergia registrada a: ${userAllergy}.`;
            conflictosDetectados.push(msg);
            alertasAlergiasEIncompatibilidades.push(msg);
            score -= 40;
          }
        }
      }
    }

    // Revisión directa de componentes contra alergias
    for (const allergy of patientAllergies) {
      if (allergy.length > 3 && compNormalized.includes(allergy)) {
        const msg = `ALERGIA DIRECTA: Componente "${compName}" entra en conflicto con alérgeno del paciente (${allergy}).`;
        conflictosDetectados.push(msg);
        alertasAlergiasEIncompatibilidades.push(msg);
        score -= 40;
      }
    }

    // Incompatibilidades digestivas
    for (const incomp of patientIncompatibilities) {
      const incompKeywords = incomp.split(/[\s,()]+/);
      for (const kw of incompKeywords) {
        if (kw.length >= 5 && compNormalized.includes(kw)) {
          const msg = `INCOMPATIBILIDAD DIGESTIVA: Componente "${compName}" puede desencadenar molestias por "${incomp}".`;
          conflictosDetectados.push(msg);
          alertasAlergiasEIncompatibilidades.push(msg);
          score -= 20;
        }
      }
    }
  }

  // 2. CRUCE CON ENFERMEDADES DEL PACIENTE VS PATOLOGÍAS INDICADAS DE LA DIETA
  let matchedIndicationsCount = 0;
  for (const patologiaIndicada of dieta.patologiasIndicadas || []) {
    const indNorm = normalizeText(patologiaIndicada);

    // Comparación contra antecedentes y diagnóstico del paciente
    const isDirectMatch =
      patientDiseases.some((pat) => indNorm.includes(pat) || pat.includes(indNorm)) ||
      (patientDiag && (indNorm.includes(patientDiag) || patientDiag.includes(indNorm))) ||
      (patientDiag.includes('diabetes') && indNorm.includes('diabetes')) ||
      (patientDiag.includes('hipertension') && indNorm.includes('hipertension')) ||
      (patientDiag.includes('celiac') && indNorm.includes('celiac')) ||
      (patientDiag.includes('sobrepeso') && indNorm.includes('calor')) ||
      (patientDiag.includes('obesidad') && indNorm.includes('calor'));

    if (isDirectMatch) {
      beneficiosIdentificados.push(`Indicación clínica prioritaria para: ${patologiaIndicada}`);
      puntosPositivos.push(`Indicación terapéutica prioritaria para: "${patologiaIndicada}".`);
      matchedIndicationsCount++;
      score += 25;
    }
  }

  // 3. VERIFICACIÓN DE CONTRAINDICACIONES FORMALES DE LA DIETA
  for (const contra of dieta.contraindicaciones || []) {
    const contraNorm = normalizeText(contra);
    for (const pat of patientDiseases) {
      if (
        contraNorm.includes(pat) ||
        (pat.includes('renal') && contraNorm.includes('renal')) ||
        (pat.includes('hepat') && contraNorm.includes('hepat'))
      ) {
        const msg = `CONTRAINDICACIÓN FORMAL: ${contra}`;
        conflictosDetectados.push(msg);
        contraindicacionesDetectadas.push(msg);
        score -= 45;
      }
    }
  }

  // 4. CRUCE CON EL CATÁLOGO DE ENFERMEDADES NUTRICIONALES
  for (const patName of [...rawDiseases, paciente.diagnosticoNutricional]) {
    if (!patName) continue;
    const diseaseObj = enfermedades.find(
      (e) =>
        normalizeText(e.nombre) === normalizeText(patName) ||
        normalizeText(patName).includes(normalizeText(e.nombre)) ||
        normalizeText(e.nombre).includes(normalizeText(patName))
    );

    if (diseaseObj) {
      for (const nutrRec of diseaseObj.nutrientesRecomendados || []) {
        beneficiosIdentificados.push(`Aporta dianas terapéuticas para ${diseaseObj.nombre} (${nutrRec}).`);
        puntosPositivos.push(`Aporta o favorece dianas terapéuticas de ${diseaseObj.nombre} (${nutrRec}).`);
        score += 5;
      }

      for (const desaconsejado of diseaseObj.alimentosContraindicados || []) {
        ajustesPropuestos.push(
          `Monitorear restricción estricta de "${desaconsejado}" acorde al protocolo de ${diseaseObj.nombre}.`
        );
      }
    }
  }

  // 5. AJUSTE BIOMÉTRICO (IMC)
  const imc = paciente.exploracionFisica?.imc || (paciente as any).antropometria?.imc || 22;
  if (imc >= 30) {
    if (dieta.distribucionMacros?.carbohidratosPct <= 40) {
      beneficiosIdentificados.push(`Distribución de macronutrientes controlada (${dieta.distribucionMacros.carbohidratosPct}% CHO) óptima para IMC ${imc}.`);
      puntosPositivos.push(`Perfil de macronutrientes optimizado (${dieta.distribucionMacros.carbohidratosPct}% CHO) favorable para índice IMC de ${imc} kg/m².`);
      score += 10;
    }
  }

  // Normalizar Score a rango 0 - 100
  let finalScore = Math.min(100, Math.max(10, score));

  // Determinación de nivel de idoneidad clínica
  let nivelIdoneidad: ResultadoEvaluacionDieta['nivelIdoneidad'] = 'Idoneidad Moderada';
  if (
    contraindicacionesDetectadas.length > 0 ||
    conflictosDetectados.some((c) => c.includes('ALERTA CRÍTICA') || c.includes('ALERGIA DIRECTA'))
  ) {
    nivelIdoneidad = 'Contraindicada';
    finalScore = Math.min(finalScore, 25);
  } else if (finalScore >= 75 && matchedIndicationsCount > 0) {
    nivelIdoneidad = 'Alta Idoneidad';
  } else if (finalScore < 50 || conflictosDetectados.length > 0) {
    nivelIdoneidad = 'Idoneidad Moderada';
  }

  // Justificación médica contextualizada
  let justificacion = '';
  if (nivelIdoneidad === 'Contraindicada') {
    justificacion = `Pauta desaconsejada. Presenta riesgos de seguridad clínica debido a concurrencia de alérgenos directos o patología restrictiva incompatible con la historia clínica.`;
  } else if (nivelIdoneidad === 'Alta Idoneidad') {
    justificacion = `Excelente concordancia clínico-nutricional. Responde directamente a las dianas terapéuticas del paciente (${paciente.diagnosticoNutricional || 'Nutrición clínica'}), con óptima biocompatibilidad de componentes y sinergia preventiva.`;
  } else {
    justificacion = `Pauta clínicamente viable con balance metabólico aceptable. Se recomienda pauta supervisada y ajuste de tolerancia para prevenir molestias digestivas.`;
  }

  return {
    dieta,
    score: finalScore,
    nivelIdoneidad,
    conflictosDetectados,
    beneficiosIdentificados,
    justificacion,
    contraindicacionesDetectadas,
    alertasAlergiasEIncompatibilidades,
    puntosPositivos,
    justificacionMedica: justificacion,
    suplementacionRecomendada,
    ajustesPropuestos,
  };
}

/**
 * Evalúa y rankea todas las dietas prediseñadas para un paciente dado
 */
export function rankDietsForPatient(
  paciente: Paciente,
  dietas: DietaPredisenada[],
  enfermedades: EnfermedadNutricional[],
  alimentos: Alimento[]
): ResultadoEvaluacionDieta[] {
  const evaluations = (dietas || []).map((d) =>
    evaluateDietForPatient(paciente, d, enfermedades, alimentos)
  );

  return evaluations.sort((a, b) => {
    if (a.nivelIdoneidad === 'Contraindicada' && b.nivelIdoneidad !== 'Contraindicada') return 1;
    if (b.nivelIdoneidad === 'Contraindicada' && a.nivelIdoneidad !== 'Contraindicada') return -1;
    return b.score - a.score;
  });
}

// Alias for ease of use
export const evaluateDietsForPatient = rankDietsForPatient;
