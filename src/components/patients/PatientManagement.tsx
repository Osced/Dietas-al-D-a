import React, { useState } from 'react';
import {
  Paciente,
  DietaPredisenada,
  EnfermedadNutricional,
  Alimento,
} from '../../types';
import { Badge } from '../common/Badge';
import { Modal } from '../common/Modal';
import {
  Users,
  Search,
  Plus,
  Edit2,
  Trash2,
  Calendar,
  AlertOctagon,
  HeartPulse,
  Activity,
  Compass,
  FileText,
  Weight,
  Sparkles,
  ClipboardList,
} from 'lucide-react';

interface PatientManagementProps {
  patients: Paciente[];
  diets: DietaPredisenada[];
  diseases: EnfermedadNutricional[];
  foods: Alimento[];
  onAddPatient: (patient: Omit<Paciente, 'id'>) => void;
  onUpdatePatient: (patient: Paciente) => void;
  onDeletePatient: (id: string) => void;
  onSelectForClinicalDecision: (patient: Paciente) => void;
}

export const PatientManagement: React.FC<PatientManagementProps> = ({
  patients,
  diets,
  foods,
  onAddPatient,
  onUpdatePatient,
  onDeletePatient,
  onSelectForClinicalDecision,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(
    patients.length > 0 ? patients[0].id : null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPatient, setEditingPatient] = useState<Paciente | null>(null);
  const [activeHistoryTab, setActiveHistoryTab] = useState<
    'resumen' | 'biometria' | 'antecedentes' | 'dietetica' | 'evolucion'
  >('resumen');

  // Form states
  const [nombre, setNombre] = useState('');
  const [apellidos, setApellidos] = useState('');
  const [fechaNacimiento, setFechaNacimiento] = useState('');
  const [sexo, setSexo] = useState<'Masculino' | 'Femenino' | 'Otro'>('Masculino');
  const [telefono, setTelefono] = useState('');
  const [email, setEmail] = useState('');
  const [documento, setDocumento] = useState('');
  const [antecedentesFamiliaresInput, setAntecedentesFamiliaresInput] = useState('');
  const [antecedentesPatologicosInput, setAntecedentesPatologicosInput] = useState('');
  const [habitosToxicos, setHabitosToxicos] = useState('');
  const [patronAlimentario, setPatronAlimentario] = useState('');
  const [alergiasInput, setAlergiasInput] = useState('');
  const [incompatibilidadesInput, setIncompatibilidadesInput] = useState('');
  const [pesoKg, setPesoKg] = useState(70);
  const [tallaCm, setTallaCm] = useState(170);
  const [perimetroCinturaCm, setPerimetroCinturaCm] = useState(85);
  const [tensionArterial, setTensionArterial] = useState('120/80');
  const [frecuenciaCardiaca, setFrecuenciaCardiaca] = useState(70);
  const [glucosaBasal, setGlucosaBasal] = useState(90);
  const [hbA1c, setHbA1c] = useState(5.4);
  const [colesterolTotal, setColesterolTotal] = useState(190);
  const [hdl, setHdl] = useState(50);
  const [ldl, setLdl] = useState(115);
  const [trigliceridos, setTrigliceridos] = useState(120);
  const [vitaminaD, setVitaminaD] = useState(32);
  const [diagnosticoNutricional, setDiagnosticoNutricional] = useState('');
  const [dietaAsignadaId, setDietaAsignadaId] = useState('');
  const [observacionesDieta, setObservacionesDieta] = useState('');

  const selectedPatient =
    patients.find((p) => p.id === selectedPatientId) || patients[0] || null;

  const openAddModal = () => {
    setEditingPatient(null);
    setNombre('');
    setApellidos('');
    setFechaNacimiento('1985-05-15');
    setSexo('Masculino');
    setTelefono('+34 600 000 000');
    setEmail('paciente@clinica.es');
    setDocumento('12345678X');
    setAntecedentesFamiliaresInput('Diabetes Mellitus tipo 2 en rama paterna');
    setAntecedentesPatologicosInput('Dislipidemia moderada');
    setHabitosToxicos('No fumador, consumo esporádico de vino');
    setPatronAlimentario('3 ingestas al día, baja ingesta de vegetales frescos');
    setAlergiasInput('');
    setIncompatibilidadesInput('Gluten moderado');
    setPesoKg(75);
    setTallaCm(172);
    setPerimetroCinturaCm(88);
    setTensionArterial('125/80 mmHg');
    setFrecuenciaCardiaca(72);
    setGlucosaBasal(95);
    setHbA1c(5.6);
    setColesterolTotal(210);
    setHdl(48);
    setLdl(135);
    setTrigliceridos(135);
    setVitaminaD(28);
    setDiagnosticoNutricional('Sobrepeso grado I con riesgo cardiovascular leve y patrón aterogénico incipiente.');
    setDietaAsignadaId(diets.length > 0 ? diets[0].id : '');
    setObservacionesDieta('Priorizar consumo de grasas monoinsaturadas y pescados grasos.');
    setIsModalOpen(true);
  };

  const openEditModal = (patient: Paciente) => {
    setEditingPatient(patient);
    setNombre(patient.datosPersonales.nombre);
    setApellidos(patient.datosPersonales.apellidos);
    setFechaNacimiento(patient.datosPersonales.fechaNacimiento);
    setSexo(patient.datosPersonales.sexo);
    setTelefono(patient.datosPersonales.telefono || '');
    setEmail(patient.datosPersonales.email || '');
    setDocumento(patient.datosPersonales.documentoIdentidad || '');
    setAntecedentesFamiliaresInput((patient.antecedentesFamiliares || []).join('\n'));
    setAntecedentesPatologicosInput((patient.antecedentesPatologicosPersonales || []).join('\n'));
    setHabitosToxicos(patient.habitosToxicos || '');
    setPatronAlimentario(patient.historiaDietetica.patronAlimentarioHabitual || '');
    setAlergiasInput((patient.alergiasEIncompatibilidades.alergias || []).join(', '));
    setIncompatibilidadesInput((patient.alergiasEIncompatibilidades.incompatibilidades || []).join(', '));
    setPesoKg(patient.exploracionFisica.pesoKg);
    setTallaCm(patient.exploracionFisica.tallaCm);
    setPerimetroCinturaCm(patient.exploracionFisica.perimetroCinturaCm || 85);
    setTensionArterial(patient.exploracionFisica.tensionArterial || '120/80');
    setFrecuenciaCardiaca(patient.exploracionFisica.frecuenciaCardiacaLpm || 70);
    setGlucosaBasal(patient.pruebasComplementarias.analiticaSangre?.glucosaBasalMgDl || 90);
    setHbA1c(patient.pruebasComplementarias.analiticaSangre?.hbA1cPct || 5.4);
    setColesterolTotal(patient.pruebasComplementarias.analiticaSangre?.colesterolTotalMgDl || 190);
    setHdl(patient.pruebasComplementarias.analiticaSangre?.hdlMgDl || 50);
    setLdl(patient.pruebasComplementarias.analiticaSangre?.ldlMgDl || 115);
    setTrigliceridos(patient.pruebasComplementarias.analiticaSangre?.trigliceridosMgDl || 120);
    setVitaminaD(patient.pruebasComplementarias.analiticaSangre?.vitaminaD25OHNgMl || 30);
    setDiagnosticoNutricional(patient.diagnosticoNutricional);
    setDietaAsignadaId(patient.dietaAsignada?.dietaId || '');
    setObservacionesDieta(patient.dietaAsignada?.observacionesClinicas || '');
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const alturaM = tallaCm / 100;
    const imc = Number((pesoKg / (alturaM * alturaM)).toFixed(1));

    const antecedentesFamiliares = antecedentesFamiliaresInput
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);
    const antecedentesPatologicosPersonales = antecedentesPatologicosInput
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);
    const alergias = alergiasInput
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    const incompatibilidades = incompatibilidadesInput
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const assignedDietObj = diets.find((d) => d.id === dietaAsignadaId);

    const payload = {
      datosPersonales: {
        nombre,
        apellidos,
        fechaNacimiento,
        sexo,
        telefono,
        email,
        documentoIdentidad: documento,
      },
      antecedentesFamiliares,
      antecedentesPatologicosPersonales,
      habitosToxicos,
      historiaDietetica: {
        patronAlimentarioHabitual: patronAlimentario,
        preferenciasYAversiones: 'Pescados azules, frutos secos, vegetales de hoja verde.',
      },
      alergiasEIncompatibilidades: {
        alergias,
        incompatibilidades,
      },
      exploracionFisica: {
        pesoKg: Number(pesoKg),
        tallaCm: Number(tallaCm),
        imc,
        perimetroCinturaCm: Number(perimetroCinturaCm),
        tensionArterial,
        frecuenciaCardiaca: Number(frecuenciaCardiaca),
      },
      pruebasComplementarias: {
        fechaInforme: new Date().toISOString().split('T')[0],
        analiticaSangre: {
          glucosaBasalMgDl: Number(glucosaBasal),
          hbA1cPct: Number(hbA1c),
          colesterolTotalMgDl: Number(colesterolTotal),
          hdlMgDl: Number(hdl),
          ldlMgDl: Number(ldl),
          trigliceridosMgDl: Number(trigliceridos),
          vitaminaD25OHNgMl: Number(vitaminaD),
        },
      },
      diagnosticoNutricional,
      dietaAsignada: assignedDietObj
        ? {
            dietaId: assignedDietObj.id,
            nombreDieta: assignedDietObj.nombre,
            fechaAsignacion: new Date().toISOString().split('T')[0],
            observacionesClinicas: observacionesDieta,
            activa: true,
          }
        : undefined,
      registroEvolucion: editingPatient?.registroEvolucion || [
        {
          fecha: new Date().toISOString().split('T')[0],
          pesoKg: Number(pesoKg),
          imc,
          observacionesMedicas: 'Consulta inicial y apertura de historia clínica.',
          adherenciaDieta: 'Buena',
        },
      ],
    };

    if (editingPatient) {
      onUpdatePatient({ ...payload, id: editingPatient.id });
    } else {
      onAddPatient(payload);
    }
    setIsModalOpen(false);
  };

  const filteredPatients = patients.filter((p) => {
    const full = `${p.datosPersonales.nombre} ${p.datosPersonales.apellidos}`.toLowerCase();
    const doc = (p.datosPersonales.documentoIdentidad || '').toLowerCase();
    const diag = p.diagnosticoNutricional.toLowerCase();
    const term = searchTerm.toLowerCase();
    return full.includes(term) || doc.includes(term) || diag.includes(term);
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              Análisis de Historia Clínica
            </h2>
            <Badge variant="cyan" size="sm">
              RF6
            </Badge>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Registro biométrico, antecedentes patológicos, historia dietética, analítica bioquímica y seguimiento evolutivo.
          </p>
        </div>

        <button
          id="btn-add-patient"
          onClick={openAddModal}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-sm transition active:scale-95 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Nuevo Paciente</span>
        </button>
      </div>

      {/* Main Dual-Column Clinical Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Patient List (4 cols) */}
        <div className="lg:col-span-4 space-y-3">
          {/* Search box */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar paciente por nombre o DNI..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-500 shadow-sm"
            />
          </div>

          {/* List items */}
          <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
            {filteredPatients.map((p) => {
              const isSelected = selectedPatient?.id === p.id;
              const imc = p.exploracionFisica.imc;
              return (
                <div
                  key={p.id}
                  id={`patient-item-${p.id}`}
                  onClick={() => setSelectedPatientId(p.id)}
                  className={`p-3.5 rounded-2xl border transition cursor-pointer text-left ${
                    isSelected
                      ? 'bg-emerald-50/70 border-emerald-500 shadow-sm ring-1 ring-emerald-500'
                      : 'bg-white border-slate-200 hover:bg-slate-50 hover:border-slate-300 shadow-sm'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 leading-tight">
                        {p.datosPersonales.nombre} {p.datosPersonales.apellidos}
                      </h4>
                      <p className="text-[10px] text-slate-500 font-mono mt-0.5">
                        {p.datosPersonales.sexo} • {p.datosPersonales.documentoIdentidad || 'Sin DNI'}
                      </p>
                    </div>

                    <span
                      className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
                        imc >= 30
                          ? 'bg-rose-100 text-rose-700'
                          : imc >= 25
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-emerald-100 text-emerald-700'
                      }`}
                    >
                      IMC {imc}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-600 mt-2 line-clamp-1">
                    {p.diagnosticoNutricional}
                  </p>

                  <div className="flex items-center justify-between gap-2 mt-2 pt-2 border-t border-slate-100 text-[10px] text-slate-500">
                    <span className="truncate max-w-[150px]">
                      Dieta: {p.dietaAsignada ? p.dietaAsignada.nombreDieta : 'Sin asignar'}
                    </span>
                    {p.alergiasEIncompatibilidades.alergias.length > 0 && (
                      <span className="text-rose-600 font-semibold">
                        {p.alergiasEIncompatibilidades.alergias.length} Alergia(s)
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Full Clinical History Viewer (8 cols) */}
        <div className="lg:col-span-8">
          {selectedPatient ? (
            <div className="rounded-2xl bg-white border border-slate-200 shadow-sm p-5 sm:p-6 space-y-5">
              {/* Patient Header Banner */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-100 border border-emerald-200 flex items-center justify-center font-bold text-emerald-800 text-base shadow-sm">
                    {selectedPatient.datosPersonales.nombre[0]}
                    {selectedPatient.datosPersonales.apellidos[0]}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base sm:text-lg font-bold text-slate-900">
                        {selectedPatient.datosPersonales.nombre} {selectedPatient.datosPersonales.apellidos}
                      </h3>
                      <Badge variant="slate" size="sm">
                        {selectedPatient.datosPersonales.sexo}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-slate-500 mt-0.5">
                      <span>DNI: {selectedPatient.datosPersonales.documentoIdentidad}</span>
                      <span>•</span>
                      <span>Nacimiento: {selectedPatient.datosPersonales.fechaNacimiento}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto">
                  <button
                    id="btn-prescribe-engine"
                    onClick={() => onSelectForClinicalDecision(selectedPatient)}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-sm transition active:scale-95"
                    title="Ejecutar motor de soporte a la decisión clínica para este paciente"
                  >
                    <Compass className="w-4 h-4 text-white" />
                    <span>Asignar Tratamiento</span>
                  </button>

                  <button
                    onClick={() => openEditModal(selectedPatient)}
                    className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 transition"
                    title="Editar historia clínica"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => {
                      if (
                        confirm(
                          `¿Eliminar a ${selectedPatient.datosPersonales.nombre} y toda su historia clínica?`
                        )
                      ) {
                        onDeletePatient(selectedPatient.id);
                        setSelectedPatientId(null);
                      }
                    }}
                    className="p-2 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition"
                    title="Eliminar paciente"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Navigation Sub-Tabs */}
              <div className="flex items-center gap-1.5 border-b border-slate-100 pb-2 overflow-x-auto">
                {(
                  [
                    { id: 'resumen', label: 'Resumen & Diagnóstico', icon: <FileText className="w-3.5 h-3.5" /> },
                    { id: 'biometria', label: 'Exploración & Analítica', icon: <HeartPulse className="w-3.5 h-3.5" /> },
                    { id: 'antecedentes', label: 'Antecedentes & Hábitos', icon: <Activity className="w-3.5 h-3.5" /> },
                    { id: 'dietetica', label: 'Alergias & Dieta', icon: <AlertOctagon className="w-3.5 h-3.5" /> },
                    { id: 'evolucion', label: 'Evolución Clínica', icon: <ClipboardList className="w-3.5 h-3.5" /> },
                  ] as const
                ).map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveHistoryTab(tab.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                      activeHistoryTab === tab.id
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    {tab.icon}
                    <span>{tab.label}</span>
                  </button>
                ))}
              </div>

              {/* Sub-Tab 1: Resumen & Diagnostico */}
              {activeHistoryTab === 'resumen' && (
                <div className="space-y-4">
                  {/* Nutritional Diagnosis Box */}
                  <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-1.5">
                    <span className="text-[10px] uppercase font-bold text-emerald-800 tracking-wider flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                      Diagnóstico Nutricional Médico
                    </span>
                    <p className="text-sm font-semibold text-slate-900 leading-relaxed">
                      {selectedPatient.diagnosticoNutricional}
                    </p>
                  </div>

                  {/* Assigned Diet Card */}
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase font-bold text-cyan-800 tracking-wider">
                        Pauta Dietoterapéutica Asignada
                      </span>
                      {selectedPatient.dietaAsignada?.fechaAsignacion && (
                        <span className="text-[11px] font-mono text-slate-500">
                          Desde: {selectedPatient.dietaAsignada.fechaAsignacion}
                        </span>
                      )}
                    </div>

                    {selectedPatient.dietaAsignada ? (
                      <div>
                        <h4 className="text-sm font-bold text-slate-900">
                          {selectedPatient.dietaAsignada.nombreDieta}
                        </h4>
                        <p className="text-xs text-slate-600 mt-1">
                          {selectedPatient.dietaAsignada.observacionesClinicas || 'Sin observaciones adicionales.'}
                        </p>
                      </div>
                    ) : (
                      <div className="py-2 text-center">
                        <p className="text-xs text-slate-500">
                          No hay pauta dietoterápica asignada actualmente.
                        </p>
                        <button
                          onClick={() => onSelectForClinicalDecision(selectedPatient)}
                          className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-xs font-semibold text-white shadow-sm"
                        >
                          <Compass className="w-3.5 h-3.5" />
                          Asignar Tratamiento con Motor Clínico
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Quick Biomarkers Summary */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                      <span className="text-[10px] text-slate-500 uppercase">IMC Actual</span>
                      <p className="text-base font-bold font-mono text-emerald-700 mt-0.5">
                        {selectedPatient.exploracionFisica.imc}
                      </p>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                      <span className="text-[10px] text-slate-500 uppercase">Glucosa Basal</span>
                      <p className="text-base font-bold font-mono text-cyan-700 mt-0.5">
                        {selectedPatient.pruebasComplementarias.analiticaSangre?.glucosaBasalMgDl || '—'} mg/dL
                      </p>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                      <span className="text-[10px] text-slate-500 uppercase">HbA1c</span>
                      <p className="text-base font-bold font-mono text-amber-700 mt-0.5">
                        {selectedPatient.pruebasComplementarias.analiticaSangre?.hbA1cPct || '—'} %
                      </p>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                      <span className="text-[10px] text-slate-500 uppercase">Colesterol LDL</span>
                      <p className="text-base font-bold font-mono text-rose-700 mt-0.5">
                        {selectedPatient.pruebasComplementarias.analiticaSangre?.ldlMgDl || '—'} mg/dL
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Sub-Tab 2: Biometría & Exploración */}
              {activeHistoryTab === 'biometria' && (
                <div className="space-y-4">
                  {/* Physical Examination */}
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                    <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                      <Weight className="w-4 h-4 text-emerald-600" />
                      Antropometría y Exploración Física
                    </h4>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                      <div>
                        <span className="text-slate-500 block text-[11px]">Peso:</span>
                        <span className="font-bold text-slate-900 font-mono text-sm">
                          {selectedPatient.exploracionFisica.pesoKg} kg
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[11px]">Talla:</span>
                        <span className="font-bold text-slate-900 font-mono text-sm">
                          {selectedPatient.exploracionFisica.tallaCm} cm
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[11px]">Perímetro Cintura:</span>
                        <span className="font-bold text-slate-900 font-mono text-sm">
                          {selectedPatient.exploracionFisica.perimetroCinturaCm || '—'} cm
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[11px]">Tensión Arterial:</span>
                        <span className="font-bold text-slate-900 font-mono text-sm">
                          {selectedPatient.exploracionFisica.tensionArterial || '120/80'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Complementary Bloodwork */}
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                        <HeartPulse className="w-4 h-4 text-cyan-600" />
                        Pruebas Complementarias (Analítica de Sangre)
                      </h4>
                      <span className="text-[11px] font-mono text-slate-500">
                        Fecha: {selectedPatient.pruebasComplementarias.fechaInforme}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                      <div className="p-2.5 rounded-xl bg-white border border-slate-200">
                        <span className="text-slate-500 block text-[10px]">Glucosa Basal</span>
                        <span className="font-bold text-slate-900 font-mono">
                          {selectedPatient.pruebasComplementarias.analiticaSangre?.glucosaBasalMgDl} mg/dL
                        </span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-white border border-slate-200">
                        <span className="text-slate-500 block text-[10px]">HbA1c</span>
                        <span className="font-bold text-amber-700 font-mono">
                          {selectedPatient.pruebasComplementarias.analiticaSangre?.hbA1cPct} %
                        </span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-white border border-slate-200">
                        <span className="text-slate-500 block text-[10px]">Colesterol Total</span>
                        <span className="font-bold text-slate-900 font-mono">
                          {selectedPatient.pruebasComplementarias.analiticaSangre?.colesterolTotalMgDl} mg/dL
                        </span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-white border border-slate-200">
                        <span className="text-slate-500 block text-[10px]">Triglicéridos</span>
                        <span className="font-bold text-slate-900 font-mono">
                          {selectedPatient.pruebasComplementarias.analiticaSangre?.trigliceridosMgDl} mg/dL
                        </span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-white border border-slate-200">
                        <span className="text-slate-500 block text-[10px]">HDL / LDL</span>
                        <span className="font-bold text-cyan-700 font-mono">
                          {selectedPatient.pruebasComplementarias.analiticaSangre?.hdlMgDl} / {selectedPatient.pruebasComplementarias.analiticaSangre?.ldlMgDl}
                        </span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-white border border-slate-200">
                        <span className="text-slate-500 block text-[10px]">Vitamina 25-OH-D</span>
                        <span className="font-bold text-emerald-700 font-mono">
                          {selectedPatient.pruebasComplementarias.analiticaSangre?.vitaminaD25OHNgMl} ng/mL
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Sub-Tab 3: Antecedentes */}
              {activeHistoryTab === 'antecedentes' && (
                <div className="space-y-3 text-xs">
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                    <h4 className="font-bold text-slate-700 uppercase tracking-wider text-[11px]">
                      Antecedentes Familiares de Relevancia
                    </h4>
                    <ul className="space-y-1">
                      {selectedPatient.antecedentesFamiliares.map((ant, idx) => (
                        <li key={idx} className="text-slate-600 flex items-start gap-2">
                          <span className="text-emerald-600 font-bold">•</span>
                          <span>{ant}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                    <h4 className="font-bold text-slate-700 uppercase tracking-wider text-[11px]">
                      Antecedentes Patológicos Personales
                    </h4>
                    <ul className="space-y-1">
                      {selectedPatient.antecedentesPatologicosPersonales.map((ant, idx) => (
                        <li key={idx} className="text-slate-600 flex items-start gap-2">
                          <span className="text-cyan-600 font-bold">•</span>
                          <span>{ant}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                    <h4 className="font-bold text-slate-700 uppercase tracking-wider text-[11px]">
                      Hábitos Tóxicos & Estilo de Vida
                    </h4>
                    <p className="text-slate-600">{selectedPatient.habitosToxicos || 'Sin toxicomanías reseñadas.'}</p>
                  </div>
                </div>
              )}

              {/* Sub-Tab 4: Alergias & Dieta */}
              {activeHistoryTab === 'dietetica' && (
                <div className="space-y-4 text-xs">
                  {/* Allergies and incompatibilities */}
                  <div className="p-4 rounded-2xl bg-rose-50/70 border border-rose-200 space-y-2">
                    <h4 className="text-[11px] font-bold text-rose-800 uppercase tracking-wider flex items-center gap-1.5">
                      <AlertOctagon className="w-4 h-4 text-rose-600" />
                      Alergias e Incompatibilidades Alimentarias
                    </h4>
                    <div className="space-y-2">
                      <div>
                        <span className="text-[11px] font-semibold text-slate-700 block mb-1">
                          Alergias IgE / Severas:
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {selectedPatient.alergiasEIncompatibilidades.alergias.length > 0 ? (
                            selectedPatient.alergiasEIncompatibilidades.alergias.map((al, idx) => (
                              <Badge key={idx} variant="rose" size="sm">
                                {al}
                              </Badge>
                            ))
                          ) : (
                            <span className="text-slate-500">Sin alergias conocidas</span>
                          )}
                        </div>
                      </div>

                      <div>
                        <span className="text-[11px] font-semibold text-slate-700 block mb-1">
                          Incompatibilidades / Intolerancias:
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {selectedPatient.alergiasEIncompatibilidades.incompatibilidades.length > 0 ? (
                            selectedPatient.alergiasEIncompatibilidades.incompatibilidades.map((inc, idx) => (
                              <Badge key={idx} variant="amber" size="sm">
                                {inc}
                              </Badge>
                            ))
                          ) : (
                            <span className="text-slate-500">Sin intolerancias descritas</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Dietary history */}
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                    <h4 className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                      Historia Dietética Habitual
                    </h4>
                    <p className="text-slate-600">
                      <strong className="text-slate-800">Patrón habitual:</strong> {selectedPatient.historiaDietetica.patronAlimentarioHabitual}
                    </p>
                    <p className="text-slate-600">
                      <strong className="text-slate-800">Preferencias y aversiones:</strong> {selectedPatient.historiaDietetica.preferenciasYAversiones}
                    </p>
                  </div>
                </div>
              )}

              {/* Sub-Tab 5: Evolución Clínica */}
              {activeHistoryTab === 'evolucion' && (
                <div className="space-y-3 text-xs">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Consultas de Seguimiento y Evolución
                    </h4>
                    <span className="text-[11px] text-slate-500 font-mono">
                      {selectedPatient.registroEvolucion?.length || 0} registro(s)
                    </span>
                  </div>

                  <div className="space-y-2">
                    {selectedPatient.registroEvolucion && selectedPatient.registroEvolucion.length > 0 ? (
                      selectedPatient.registroEvolucion.map((ev, idx) => (
                        <div
                          key={idx}
                          className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5"
                        >
                          <div className="flex items-center justify-between text-[11px]">
                            <span className="font-bold text-emerald-700 flex items-center gap-1">
                              <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                              {ev.fecha}
                            </span>
                            <span className="font-mono text-slate-600">
                              Peso: <strong className="text-slate-800">{ev.pesoKg} kg</strong> (IMC {ev.imc})
                            </span>
                            <Badge variant={ev.adherenciaDieta === 'Excelente' || ev.adherenciaDieta === 'Buena' ? 'emerald' : 'amber'} size="sm">
                              Adherencia: {ev.adherenciaDieta}
                            </Badge>
                          </div>
                          <p className="text-slate-600 text-xs">{ev.observacionesMedicas}</p>
                        </div>
                      ))
                    ) : (
                      <p className="text-slate-400 text-center py-4">
                        Sin visitas de seguimiento registradas aún.
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="p-12 text-center rounded-2xl bg-white border border-slate-200 shadow-sm">
              <Users className="w-12 h-12 text-slate-400 mx-auto mb-3" />
              <p className="text-sm font-semibold text-slate-700">
                Selecciona un paciente para abrir su historia clínica completa.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Modal Add / Edit Patient */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingPatient ? 'Editar Historia Clínica de Paciente' : 'Apertura de Historia Clínica'}
        subtitle="Registro exhaustivo conforme a los requerimientos de nutrición médica (RF6)"
        icon={<Users className="w-5 h-5" />}
        maxWidth="4xl"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Personal data */}
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              1. Datos Personales & Filiación
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs text-slate-600 mb-1">Nombre</label>
                <input
                  type="text"
                  required
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-xl bg-white border border-slate-300 text-slate-900 text-xs focus:border-emerald-600"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-600 mb-1">Apellidos</label>
                <input
                  type="text"
                  required
                  value={apellidos}
                  onChange={(e) => setApellidos(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-xl bg-white border border-slate-300 text-slate-900 text-xs focus:border-emerald-600"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-600 mb-1">Documento de Identidad / DNI</label>
                <input
                  type="text"
                  value={documento}
                  onChange={(e) => setDocumento(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-xl bg-white border border-slate-300 text-slate-900 text-xs focus:border-emerald-600"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs text-slate-600 mb-1">Fecha de Nacimiento</label>
                <input
                  type="date"
                  required
                  value={fechaNacimiento}
                  onChange={(e) => setFechaNacimiento(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-xl bg-white border border-slate-300 text-slate-900 text-xs focus:border-emerald-600"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-600 mb-1">Sexo Biológico</label>
                <select
                  value={sexo}
                  onChange={(e) => setSexo(e.target.value as 'Masculino' | 'Femenino' | 'Otro')}
                  className="w-full px-3 py-1.5 rounded-xl bg-white border border-slate-300 text-slate-900 text-xs focus:border-emerald-600"
                >
                  <option value="Masculino">Masculino</option>
                  <option value="Femenino">Femenino</option>
                  <option value="Otro">Otro</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-slate-600 mb-1">Teléfono de Contacto</label>
                <input
                  type="text"
                  value={telefono}
                  onChange={(e) => setTelefono(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-xl bg-white border border-slate-300 text-slate-900 text-xs focus:border-emerald-600"
                />
              </div>
            </div>
          </div>

          {/* Antropometría y exploración física */}
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              2. Exploración Física & Biometría
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="block text-xs text-slate-600 mb-1">Peso (kg)</label>
                <input
                  type="number"
                  step="0.1"
                  required
                  value={pesoKg}
                  onChange={(e) => setPesoKg(Number(e.target.value))}
                  className="w-full px-3 py-1.5 rounded-xl bg-white border border-slate-300 text-slate-900 text-xs font-mono focus:border-emerald-600"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-600 mb-1">Talla (cm)</label>
                <input
                  type="number"
                  required
                  value={tallaCm}
                  onChange={(e) => setTallaCm(Number(e.target.value))}
                  className="w-full px-3 py-1.5 rounded-xl bg-white border border-slate-300 text-slate-900 text-xs font-mono focus:border-emerald-600"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-600 mb-1">Perímetro Cintura (cm)</label>
                <input
                  type="number"
                  value={perimetroCinturaCm}
                  onChange={(e) => setPerimetroCinturaCm(Number(e.target.value))}
                  className="w-full px-3 py-1.5 rounded-xl bg-white border border-slate-300 text-slate-900 text-xs font-mono focus:border-emerald-600"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-600 mb-1">Tensión Arterial (mmHg)</label>
                <input
                  type="text"
                  value={tensionArterial}
                  onChange={(e) => setTensionArterial(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-xl bg-white border border-slate-300 text-slate-900 text-xs font-mono focus:border-emerald-600"
                  placeholder="120/80"
                />
              </div>
            </div>
          </div>

          {/* Pruebas complementarias analítica */}
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              3. Pruebas Complementarias (Analítica de Sangre)
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="block text-xs text-slate-600 mb-1">Glucosa Basal (mg/dL)</label>
                <input
                  type="number"
                  value={glucosaBasal}
                  onChange={(e) => setGlucosaBasal(Number(e.target.value))}
                  className="w-full px-3 py-1.5 rounded-xl bg-white border border-slate-300 text-slate-900 text-xs font-mono focus:border-emerald-600"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-600 mb-1">HbA1c (%)</label>
                <input
                  type="number"
                  step="0.1"
                  value={hbA1c}
                  onChange={(e) => setHbA1c(Number(e.target.value))}
                  className="w-full px-3 py-1.5 rounded-xl bg-white border border-slate-300 text-slate-900 text-xs font-mono focus:border-emerald-600"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-600 mb-1">Colesterol Total (mg/dL)</label>
                <input
                  type="number"
                  value={colesterolTotal}
                  onChange={(e) => setColesterolTotal(Number(e.target.value))}
                  className="w-full px-3 py-1.5 rounded-xl bg-white border border-slate-300 text-slate-900 text-xs font-mono focus:border-emerald-600"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-600 mb-1">Triglicéridos (mg/dL)</label>
                <input
                  type="number"
                  value={trigliceridos}
                  onChange={(e) => setTrigliceridos(Number(e.target.value))}
                  className="w-full px-3 py-1.5 rounded-xl bg-white border border-slate-300 text-slate-900 text-xs font-mono focus:border-emerald-600"
                />
              </div>
            </div>
          </div>

          {/* Alergias e Incompatibilidades */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-rose-700 mb-1">
                Alergias Alimentarias (separadas por coma)
              </label>
              <input
                type="text"
                value={alergiasInput}
                onChange={(e) => setAlergiasInput(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 text-xs focus:border-rose-600"
                placeholder="ej. Marisco, Frutos secos, Huevo"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-amber-700 mb-1">
                Incompatibilidades / Intolerancias (separadas por coma)
              </label>
              <input
                type="text"
                value={incompatibilidadesInput}
                onChange={(e) => setIncompatibilidadesInput(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 text-xs focus:border-amber-600"
                placeholder="ej. Lactosa, Fructosa, Histamina"
              />
            </div>
          </div>

          {/* Diagnosis & Assigned diet */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Diagnóstico Nutricional
            </label>
            <textarea
              rows={2}
              required
              value={diagnosticoNutricional}
              onChange={(e) => setDiagnosticoNutricional(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 text-xs focus:outline-none focus:border-emerald-600"
              placeholder="Juicio clínico nutricional, objetivos prioritarios..."
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Dieta Asignada
              </label>
              <select
                value={dietaAsignadaId}
                onChange={(e) => setDietaAsignadaId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 text-xs focus:outline-none focus:border-emerald-600"
              >
                <option value="">-- Sin pauta asignada --</option>
                {diets.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.nombre} ({d.aporteCalorico})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Observaciones de la Dieta
              </label>
              <input
                type="text"
                value={observacionesDieta}
                onChange={(e) => setObservacionesDieta(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 text-xs focus:outline-none focus:border-emerald-600"
                placeholder="Pautas específicas o ajustes calóricos"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-sm transition active:scale-95"
            >
              {editingPatient ? 'Guardar Cambios Clínicos' : 'Crear Historia Clínica'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
