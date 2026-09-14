import React, { useState, useMemo } from 'react';
import {
  Paciente,
  DietaPredisenada,
  EnfermedadNutricional,
  Alimento,
  ResultadoEvaluacionDieta,
} from '../../types';
import { evaluateDietsForPatient, calculateBiometrics } from '../../services/clinicalEngine';
import { Badge } from '../common/Badge';
import { Modal } from '../common/Modal';
import {
  Compass,
  CheckCircle2,
  AlertTriangle,
  Flame,
  Printer,
  UserCheck,
  Stethoscope,
} from 'lucide-react';

interface DecisionEngineViewProps {
  patients: Paciente[];
  diets: DietaPredisenada[];
  diseases: EnfermedadNutricional[];
  foods: Alimento[];
  selectedPatientId?: string;
  onAssignDietToPatient: (patientId: string, dietId: string, observations: string) => void;
}

export const DecisionEngineView: React.FC<DecisionEngineViewProps> = ({
  patients,
  diets,
  diseases,
  foods,
  selectedPatientId: initialPatientId,
  onAssignDietToPatient,
}) => {
  const [currentPatientId, setCurrentPatientId] = useState<string>(
    initialPatientId || (patients.length > 0 ? patients[0].id : '')
  );
  const [selectedEvaluation, setSelectedEvaluation] = useState<ResultadoEvaluacionDieta | null>(
    null
  );
  const [prescriptionObservations, setPrescriptionObservations] = useState('');
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [showPrescribeConfirmModal, setShowPrescribeConfirmModal] = useState(false);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Selected Patient
  const patient = useMemo(() => {
    return patients.find((p) => p.id === currentPatientId) || patients[0] || null;
  }, [patients, currentPatientId]);

  // Run the Clinical Evaluation Engine
  const evaluations: ResultadoEvaluacionDieta[] = useMemo(() => {
    if (!patient) return [];
    return evaluateDietsForPatient(patient, diets, diseases, foods);
  }, [patient, diets, diseases, foods]);

  // Biometric calculation (TMB, GET, IMC)
  const biometrics = useMemo(() => {
    if (!patient) return null;
    return calculateBiometrics(patient);
  }, [patient]);

  const handleConfirmPrescription = () => {
    if (!patient || !selectedEvaluation) return;
    onAssignDietToPatient(
      patient.id,
      selectedEvaluation.dieta.id,
      prescriptionObservations || `Prescrita vía soporte a la decisión RF7 (Score: ${selectedEvaluation.score}%).`
    );
    setShowPrescribeConfirmModal(false);
    setSuccessToast(`Dieta "${selectedEvaluation.dieta.nombre}" asignada exitosamente a ${patient.datosPersonales.nombre}.`);
    setTimeout(() => setSuccessToast(null), 4000);
  };

  const openPrescribeModal = (ev: ResultadoEvaluacionDieta) => {
    setSelectedEvaluation(ev);
    setPrescriptionObservations(
      `Pauta terapéutica basada en compatibilidad clínica del ${ev.score}%. Indicada para ${ev.beneficiosIdentificados.join(', ')}.`
    );
    setShowPrescribeConfirmModal(true);
  };

  const handlePrintPlan = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <Compass className="w-5 h-5 text-emerald-600" />
              Asignación de Tratamiento
            </h2>
            <Badge variant="emerald" size="sm">
              RF7
            </Badge>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Cruce algorítmico de antecedentes, analítica bioquímica y alérgenos frente al catálogo dietoterápico para ranking de idoneidad.
          </p>
        </div>

        {/* Patient selector */}
        <div className="flex items-center gap-2">
          <label className="text-xs text-slate-600 whitespace-nowrap font-medium">
            Paciente a evaluar:
          </label>
          <select
            id="select-decision-patient"
            value={patient?.id || ''}
            onChange={(e) => setCurrentPatientId(e.target.value)}
            className="px-3 py-2 rounded-xl bg-white border border-slate-300 text-xs font-semibold text-slate-800 focus:outline-none focus:border-emerald-600 shadow-sm"
          >
            {patients.map((p) => (
              <option key={p.id} value={p.id}>
                {p.datosPersonales.nombre} {p.datosPersonales.apellidos} (IMC {p.exploracionFisica.imc})
              </option>
            ))}
          </select>
        </div>
      </div>

      {successToast && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-semibold flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>{successToast}</span>
          </div>
          <button
            onClick={() => setSuccessToast(null)}
            className="text-xs text-emerald-700 underline font-medium"
          >
            Cerrar
          </button>
        </div>
      )}

      {patient && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Patient Clinical Profile & Caloric Target (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            {/* Patient Clinical Summary Card */}
            <div className="rounded-2xl bg-white border border-slate-200 p-5 space-y-4 shadow-sm">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    {patient.datosPersonales.nombre} {patient.datosPersonales.apellidos}
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    {patient.datosPersonales.sexo} • {patient.datosPersonales.fechaNacimiento}
                  </p>
                </div>
                <Badge
                  variant={
                    patient.exploracionFisica.imc >= 30
                      ? 'rose'
                      : patient.exploracionFisica.imc >= 25
                      ? 'amber'
                      : 'emerald'
                  }
                  size="sm"
                >
                  IMC {patient.exploracionFisica.imc}
                </Badge>
              </div>

              {/* Nutritional Diagnosis */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-500 flex items-center gap-1">
                  <Stethoscope className="w-3.5 h-3.5 text-cyan-600" />
                  Diagnóstico Clínico Actual
                </span>
                <p className="text-xs font-semibold text-slate-800 leading-snug">
                  {patient.diagnosticoNutricional}
                </p>
              </div>

              {/* Critical Safety Checks: Allergies & Intolerances */}
              <div className="p-3 rounded-xl bg-rose-50/70 border border-rose-200 space-y-2">
                <span className="text-[10px] uppercase font-bold text-rose-800 flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                  Factores de Exclusión Crítica
                </span>
                <div className="space-y-1 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-600 block">Alergias IgE / Severas:</span>
                    <div className="flex flex-wrap gap-1 mt-0.5">
                      {patient.alergiasEIncompatibilidades.alergias.length > 0 ? (
                        patient.alergiasEIncompatibilidades.alergias.map((a) => (
                          <Badge key={a} variant="rose" size="sm">
                            {a}
                          </Badge>
                        ))
                      ) : (
                        <span className="text-[11px] text-slate-500">Ninguna reportada</span>
                      )}
                    </div>
                  </div>

                  <div className="pt-1">
                    <span className="text-[10px] text-slate-600 block">Incompatibilidades:</span>
                    <div className="flex flex-wrap gap-1 mt-0.5">
                      {patient.alergiasEIncompatibilidades.incompatibilidades.length > 0 ? (
                        patient.alergiasEIncompatibilidades.incompatibilidades.map((i) => (
                          <Badge key={i} variant="amber" size="sm">
                            {i}
                          </Badge>
                        ))
                      ) : (
                        <span className="text-[11px] text-slate-500">Ninguna reportada</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Metabolic & Caloric Calculator */}
              {biometrics && (
                <div className="p-3 rounded-xl bg-emerald-50/50 border border-emerald-200 space-y-2">
                  <span className="text-[10px] uppercase font-bold text-emerald-800 flex items-center gap-1">
                    <Flame className="w-3.5 h-3.5 text-emerald-600" />
                    Cálculo Metabólico (Mifflin-St Jeor)
                  </span>
                  <div className="grid grid-cols-2 gap-2 text-center text-xs">
                    <div className="p-2 rounded-lg bg-white border border-slate-200 shadow-2xs">
                      <span className="text-[10px] text-slate-500 block">TMB Basal</span>
                      <span className="font-mono font-bold text-slate-800 text-xs">
                        {biometrics.tmbKcal} kcal
                      </span>
                    </div>
                    <div className="p-2 rounded-lg bg-white border border-slate-200 shadow-2xs">
                      <span className="text-[10px] text-slate-500 block">GET Estimado</span>
                      <span className="font-mono font-bold text-emerald-700 text-xs">
                        {biometrics.getKcal} kcal
                      </span>
                    </div>
                  </div>
                  <p className="text-[10px] text-slate-500 text-center">
                    Gasto Energético Total con factor de actividad sedentario/moderado (x1.4).
                  </p>
                </div>
              )}

              {/* Current Assigned Diet Status */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1">
                  Pauta actualmente asignada:
                </span>
                {patient.dietaAsignada ? (
                  <div>
                    <span className="font-bold text-cyan-800">
                      {patient.dietaAsignada.nombreDieta}
                    </span>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Fecha: {patient.dietaAsignada.fechaAsignacion}
                    </p>
                  </div>
                ) : (
                  <span className="text-slate-400 italic">Sin pauta asignada</span>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Comparative Ranked Diets (8 cols) */}
          <div className="lg:col-span-8 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                  Clasificación de Idoneidad Terapéutica
                </h3>
                <p className="text-xs text-slate-500">
                  Ordenadas de mayor a menor compatibilidad clínica y seguridad toxicológica.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[11px] text-slate-500">
                  {evaluations.length} Dietas evaluadas
                </span>
              </div>
            </div>

            {/* Diet Evaluation Cards */}
            <div className="space-y-4">
              {evaluations.map((ev, index) => {
                const isContraindicated = ev.nivelIdoneidad === 'Contraindicada';
                const isHigh = ev.nivelIdoneidad === 'Alta Idoneidad';
                const isCurrentAssigned = patient.dietaAsignada?.dietaId === ev.dieta.id;

                return (
                  <div
                    key={ev.dieta.id}
                    id={`evaluation-card-${ev.dieta.id}`}
                    className={`rounded-2xl border p-5 transition shadow-sm ${
                      isContraindicated
                        ? 'bg-rose-50/40 border-rose-200'
                        : isHigh
                        ? 'bg-white border-emerald-300 ring-1 ring-emerald-200'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    {/* Header with Rank & Score */}
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-3 border-b border-slate-100">
                      <div className="flex items-start gap-3">
                        <div
                          className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold flex-shrink-0 ${
                            isContraindicated
                              ? 'bg-rose-100 text-rose-700 border border-rose-200'
                              : isHigh
                              ? 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                              : 'bg-amber-100 text-amber-700 border border-amber-200'
                          }`}
                        >
                          #{index + 1}
                        </div>
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="text-base font-bold text-slate-900">
                              {ev.dieta.nombre}
                            </h4>
                            {isCurrentAssigned && (
                              <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-cyan-50 text-cyan-800 border border-cyan-200">
                                Dieta Actual
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-500 mt-0.5">
                            {ev.dieta.aporteCalorico} • Vía {ev.dieta.viaAdministracion} • {ev.dieta.dosificacion}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 self-end sm:self-start">
                        {/* Score meter */}
                        <div className="text-right">
                          <div className="flex items-center gap-1.5 justify-end">
                            <span
                              className={`text-lg font-bold font-mono ${
                                isContraindicated
                                  ? 'text-rose-600'
                                  : isHigh
                                  ? 'text-emerald-600'
                                  : 'text-amber-600'
                              }`}
                            >
                              {ev.score}%
                            </span>
                          </div>
                          <Badge
                            variant={
                              isContraindicated
                                ? 'rose'
                                : isHigh
                                ? 'emerald'
                                : 'amber'
                            }
                            size="sm"
                          >
                            {ev.nivelIdoneidad}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    {/* Justification summary */}
                    <div className="mt-3">
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {ev.justificacion}
                      </p>
                    </div>

                    {/* Conflicts & Safety Alerts */}
                    {ev.conflictosDetectados.length > 0 && (
                      <div className="mt-3 p-3 rounded-xl bg-rose-50 border border-rose-200 space-y-1.5">
                        <span className="text-[10px] uppercase font-bold text-rose-800 flex items-center gap-1.5">
                          <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                          Alertas Críticas de Seguridad
                        </span>
                        <ul className="space-y-1">
                          {ev.conflictosDetectados.map((conf, idx) => (
                            <li key={idx} className="text-xs text-rose-800 flex items-start gap-1.5">
                              <span className="text-rose-600 font-bold">•</span>
                              <span>{conf}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Identified Benefits */}
                    {ev.beneficiosIdentificados.length > 0 && (
                      <div className="mt-3 p-3 rounded-xl bg-emerald-50 border border-emerald-200 space-y-1">
                        <span className="text-[10px] uppercase font-bold text-emerald-800 flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          Beneficios para el Perfil Clínico del Paciente
                        </span>
                        <div className="flex flex-wrap gap-1.5 mt-1">
                          {ev.beneficiosIdentificados.map((ben, idx) => (
                            <span
                              key={idx}
                              className="text-[11px] px-2 py-0.5 rounded-md bg-white text-emerald-800 border border-emerald-200 font-medium"
                            >
                              {ben}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Included Components */}
                    <div className="mt-3 pt-2 flex items-center justify-between gap-3 text-xs flex-wrap">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-[10px] text-slate-500 uppercase font-medium">
                          Alimentos Clave:
                        </span>
                        {ev.dieta.componentes.slice(0, 3).map((comp) => (
                          <span
                            key={comp}
                            className="text-[11px] px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-medium"
                          >
                            {comp}
                          </span>
                        ))}
                        {ev.dieta.componentes.length > 3 && (
                          <span className="text-[10px] text-slate-400">
                            +{ev.dieta.componentes.length - 3} más
                          </span>
                        )}
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setSelectedEvaluation(ev);
                            setShowPrintModal(true);
                          }}
                          className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium transition"
                          title="Ver e imprimir informe clínico"
                        >
                          <Printer className="w-3.5 h-3.5" />
                          <span>Informe</span>
                        </button>

                        <button
                          id={`btn-prescribe-${ev.dieta.id}`}
                          onClick={() => openPrescribeModal(ev)}
                          disabled={isContraindicated}
                          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl font-semibold text-xs transition active:scale-95 ${
                            isContraindicated
                              ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
                              : isCurrentAssigned
                              ? 'bg-cyan-600 hover:bg-cyan-700 text-white shadow-sm'
                              : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm'
                          }`}
                        >
                          <UserCheck className="w-3.5 h-3.5" />
                          <span>{isCurrentAssigned ? 'Actualizar Pauta' : 'Asignar al Paciente'}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Prescription Confirmation Modal */}
      <Modal
        isOpen={showPrescribeConfirmModal}
        onClose={() => setShowPrescribeConfirmModal(false)}
        title="Confirmar Prescripción Dietoterapéutica"
        subtitle="Asignación directa a la historia clínica del paciente"
        icon={<UserCheck className="w-5 h-5 text-emerald-600" />}
        maxWidth="lg"
      >
        {patient && selectedEvaluation && (
          <div className="space-y-4">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1 text-xs">
              <p>
                <strong className="text-slate-600">Paciente:</strong>{' '}
                <span className="text-slate-900 font-bold">
                  {patient.datosPersonales.nombre} {patient.datosPersonales.apellidos}
                </span>
              </p>
              <p>
                <strong className="text-slate-600">Dieta Prescrita:</strong>{' '}
                <span className="text-emerald-700 font-bold">
                  {selectedEvaluation.dieta.nombre}
                </span>
              </p>
              <p>
                <strong className="text-slate-600">Idoneidad Clínica:</strong>{' '}
                <span className="font-mono text-cyan-700 font-bold">
                  {selectedEvaluation.score}% ({selectedEvaluation.nivelIdoneidad})
                </span>
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Observaciones Médicas y Pauta Específica de Administración:
              </label>
              <textarea
                rows={3}
                value={prescriptionObservations}
                onChange={(e) => setPrescriptionObservations(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs focus:outline-none focus:border-emerald-600 focus:bg-white"
                placeholder="Instrucciones para el paciente, duración inicial, pauta de control analítico..."
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowPrescribeConfirmModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-medium hover:bg-slate-200 transition"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleConfirmPrescription}
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-sm transition active:scale-95"
              >
                Registrar en Historia Clínica
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Clinical Report / Print Modal */}
      <Modal
        isOpen={showPrintModal}
        onClose={() => setShowPrintModal(false)}
        title="Informe Clínico Dietoterapéutico Oficial"
        subtitle="Documento preparado para entrega al paciente o historia clínica hospitalaria"
        icon={<Printer className="w-5 h-5" />}
        maxWidth="2xl"
      >
        {patient && selectedEvaluation && (
          <div className="space-y-4 text-xs">
            {/* Printable Report Paper Simulator */}
            <div id="printable-report" className="p-6 rounded-2xl bg-white border border-slate-200 text-slate-900 space-y-4 shadow-sm font-sans">
              {/* Report Header */}
              <div className="flex items-start justify-between border-b-2 border-slate-900 pb-3">
                <div>
                  <h2 className="text-base font-bold uppercase tracking-wider text-slate-900">
                    Dietas al Día — Prescripción Nutricional
                  </h2>
                  <p className="text-[11px] text-slate-600">
                    Servicio de Nutrición Médica y Endocrinología Clínica
                  </p>
                </div>
                <div className="text-right text-[11px] text-slate-600">
                  <p className="font-bold text-slate-900">Fecha: {new Date().toLocaleDateString('es-ES')}</p>
                  <p>Documento Oficial</p>
                </div>
              </div>

              {/* Patient and Doctor info */}
              <div className="grid grid-cols-2 gap-3 p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-[11px]">
                <div>
                  <p className="font-bold text-slate-900">Paciente:</p>
                  <p className="text-slate-700">{patient.datosPersonales.nombre} {patient.datosPersonales.apellidos}</p>
                  <p className="text-slate-600">DNI: {patient.datosPersonales.documentoIdentidad || '—'}</p>
                  <p className="text-slate-600">IMC: {patient.exploracionFisica.imc} | Peso: {patient.exploracionFisica.pesoKg} kg</p>
                </div>
                <div>
                  <p className="font-bold text-slate-900">Diagnóstico:</p>
                  <p className="text-slate-700">{patient.diagnosticoNutricional}</p>
                  <p className="font-bold text-slate-900 mt-1">Alergias:</p>
                  <p className="text-slate-700">{patient.alergiasEIncompatibilidades.alergias.join(', ') || 'Sin alergias'}</p>
                </div>
              </div>

              {/* Diet Plan */}
              <div className="space-y-2">
                <h3 className="text-xs font-bold text-slate-900 uppercase border-b pb-1">
                  Pauta Dietoterapéutica: {selectedEvaluation.dieta.nombre}
                </h3>
                <p className="text-slate-700 leading-relaxed text-[11px]">
                  {selectedEvaluation.dieta.definicionTecnica}
                </p>

                <div className="grid grid-cols-3 gap-2 py-2 bg-slate-50 border border-slate-200 rounded-xl p-2 text-center text-[10px]">
                  <div>
                    <span className="text-slate-500 block">Aporte Calórico</span>
                    <strong className="text-slate-900">{selectedEvaluation.dieta.aporteCalorico}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Vía de Adm.</span>
                    <strong className="text-slate-900">{selectedEvaluation.dieta.viaAdministracion}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Duración</span>
                    <strong className="text-slate-900">{selectedEvaluation.dieta.duracion}</strong>
                  </div>
                </div>

                <div className="space-y-1 text-[11px] text-slate-700">
                  <p>
                    <strong className="text-slate-900">Dosificación & Horarios:</strong> {selectedEvaluation.dieta.dosificacion} — {selectedEvaluation.dieta.pauta}
                  </p>
                  <p>
                    <strong className="text-slate-900">Alimentos Recomendados:</strong> {selectedEvaluation.dieta.componentes.join(', ')}
                  </p>
                  {selectedEvaluation.dieta.suplementos && selectedEvaluation.dieta.suplementos.length > 0 && (
                    <p>
                      <strong className="text-slate-900">Suplementación:</strong> {selectedEvaluation.dieta.suplementos.join(', ')}
                    </p>
                  )}
                  <p>
                    <strong className="text-slate-900">Ingesta de líquidos y micronutrientes:</strong> {selectedEvaluation.dieta.ingestaNecesaria}
                  </p>
                </div>
              </div>

              {/* Signatures */}
              <div className="pt-6 mt-4 border-t border-slate-200 flex items-center justify-between text-[10px] text-slate-500">
                <div>
                  <p className="border-t border-slate-300 pt-1 w-44 text-center text-slate-600">
                    Firma del Médico Nutricionista
                  </p>
                </div>
                <div>
                  <p className="border-t border-slate-300 pt-1 w-44 text-center text-slate-600">
                    Conformidad del Paciente
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowPrintModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-medium hover:bg-slate-200 transition"
              >
                Cerrar
              </button>
              <button
                type="button"
                onClick={handlePrintPlan}
                className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-sm transition active:scale-95"
              >
                <Printer className="w-4 h-4" />
                <span>Imprimir / Guardar PDF</span>
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
