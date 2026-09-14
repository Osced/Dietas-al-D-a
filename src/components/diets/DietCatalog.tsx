import React, { useState } from 'react';
import { DietaPredisenada, ViaAdministracion, Alimento } from '../../types';
import { Badge } from '../common/Badge';
import { Modal } from '../common/Modal';
import {
  Utensils,
  Search,
  Plus,
  Edit2,
  Trash2,
  Clock,
  Pill,
  AlertTriangle,
  Activity,
} from 'lucide-react';

interface DietCatalogProps {
  diets: DietaPredisenada[];
  foods: Alimento[];
  onAddDiet: (diet: Omit<DietaPredisenada, 'id'>) => void;
  onUpdateDiet: (diet: DietaPredisenada) => void;
  onDeleteDiet: (id: string) => void;
  onSelectForPrescription?: (diet: DietaPredisenada) => void;
}

export const DietCatalog: React.FC<DietCatalogProps> = ({
  diets,
  foods,
  onAddDiet,
  onUpdateDiet,
  onDeleteDiet,
  onSelectForPrescription,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedVia, setSelectedVia] = useState<string>('todas');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDiet, setEditingDiet] = useState<DietaPredisenada | null>(null);

  // Form states
  const [nombre, setNombre] = useState('');
  const [objetivosInput, setObjetivosInput] = useState('');
  const [definicionTecnica, setDefinicionTecnica] = useState('');
  const [aporteCalorico, setAporteCalorico] = useState('');
  const [proteinasPct, setProteinasPct] = useState(20);
  const [grasasPct, setGrasasPct] = useState(35);
  const [carbohidratosPct, setCarbohidratosPct] = useState(45);
  const [componentesInput, setComponentesInput] = useState('');
  const [alimentosDesaconsejadosInput, setAlimentosDesaconsejadosInput] = useState('');
  const [ingestaNecesaria, setIngestaNecesaria] = useState('');
  const [viaAdministracion, setViaAdministracion] = useState<ViaAdministracion>('Oral');
  const [duracion, setDuracion] = useState('');
  const [dosificacion, setDosificacion] = useState('');
  const [pauta, setPauta] = useState('');
  const [suplementosInput, setSuplementosInput] = useState('');
  const [patologiasInput, setPatologiasInput] = useState('');
  const [contraindicacionesInput, setContraindicacionesInput] = useState('');

  const openAddModal = () => {
    setEditingDiet(null);
    setNombre('');
    setObjetivosInput('Optimización del perfil metabólico\nReducción de marcadores proinflamatorios\nControl ponderal');
    setDefinicionTecnica('Pauta dietoterapéutica diseñada para modular el metabolismo mitocondrial y la sensibilidad insulínica.');
    setAporteCalorico('1.800 - 2.000 kcal/día');
    setProteinasPct(20);
    setGrasasPct(35);
    setCarbohidratosPct(45);
    setComponentesInput('Salmón Salvaje de Alaska, Aceite de Oliva Virgen Extra (AOVE), Espinacas Baby Orgánicas, Quinoa Real');
    setAlimentosDesaconsejadosInput('Azúcares refinados, Harinas ultraprocesadas, Grasas trans');
    setIngestaNecesaria('Líquidos 35 ml/kg/día; Sodio < 2.000 mg/día; Fibra > 30 g/día');
    setViaAdministracion('Oral');
    setDuracion('12 semanas iniciales con evaluación analítica');
    setDosificacion('3 ingestas principales + 1 colación');
    setPauta('Desayuno 08:30, Comida 14:00, Cena 20:30');
    setSuplementosInput('Omega-3 EPA/DHA: 2g/día, Bisglicinato de Magnesio: 300mg, Vitamina D3: 2000 UI');
    setPatologiasInput('Diabetes Mellitus Tipo 2 y Síndrome Metabólico, Hipertensión Arterial');
    setContraindicacionesInput('Insuficiencia renal crónica avanzada sin ajuste');
    setIsModalOpen(true);
  };

  const openEditModal = (diet: DietaPredisenada) => {
    setEditingDiet(diet);
    setNombre(diet.nombre);
    setObjetivosInput((diet.objetivos || []).join('\n'));
    setDefinicionTecnica(diet.definicionTecnica);
    setAporteCalorico(diet.aporteCalorico);
    setProteinasPct(diet.distribucionMacros?.proteinasPct || 20);
    setGrasasPct(diet.distribucionMacros?.grasasPct || 35);
    setCarbohidratosPct(diet.distribucionMacros?.carbohidratosPct || 45);
    setComponentesInput((diet.componentes || []).join(', '));
    setAlimentosDesaconsejadosInput((diet.alimentosDesaconsejados || []).join(', '));
    setIngestaNecesaria(diet.ingestaNecesaria);
    setViaAdministracion(diet.viaAdministracion);
    setDuracion(diet.duracion);
    setDosificacion(diet.dosificacion);
    setPauta(diet.pauta);
    setSuplementosInput((diet.suplementos || []).join(', '));
    setPatologiasInput((diet.patologiasIndicadas || []).join(', '));
    setContraindicacionesInput((diet.contraindicaciones || []).join(', '));
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const objetivos = objetivosInput
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);
    const componentes = componentesInput
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    const alimentosDesaconsejados = alimentosDesaconsejadosInput
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    const suplementos = suplementosInput
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    const patologiasIndicadas = patologiasInput
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    const contraindicaciones = contraindicacionesInput
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const payload = {
      nombre,
      objetivos,
      definicionTecnica,
      aporteCalorico,
      distribucionMacros: {
        proteinasPct: Number(proteinasPct),
        grasasPct: Number(grasasPct),
        carbohidratosPct: Number(carbohidratosPct),
      },
      componentes,
      alimentosDesaconsejados,
      ingestaNecesaria,
      viaAdministracion,
      duracion,
      dosificacion,
      pauta,
      suplementos,
      patologiasIndicadas,
      contraindicaciones,
    };

    if (editingDiet) {
      onUpdateDiet({ ...payload, id: editingDiet.id });
    } else {
      onAddDiet(payload);
    }
    setIsModalOpen(false);
  };

  const vias: ViaAdministracion[] = ['Oral', 'Enteral', 'Sonda nasogástrica', 'Parenteral'];

  const filteredDiets = diets.filter((d) => {
    const matchesSearch =
      d.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.definicionTecnica.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.patologiasIndicadas.some((p) => p.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesVia = selectedVia === 'todas' || d.viaAdministracion === selectedVia;
    return matchesSearch && matchesVia;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              Catálogo de Dietas Prediseñadas
            </h2>
            <Badge variant="cyan" size="sm">
              RF4
            </Badge>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Pautas dietoterapéuticas clínicas: objetivos, aporte calórico, componentes, ingesta y posología.
          </p>
        </div>

        <button
          id="btn-add-diet"
          onClick={openAddModal}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-sm transition active:scale-95 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Crear Pauta Dietoterápica</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 bg-white p-3.5 rounded-2xl border border-slate-200 shadow-sm">
        <div className="sm:col-span-8 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar por nombre de dieta, patología o alimentos componentes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:bg-white"
          />
        </div>

        <div className="sm:col-span-4">
          <select
            value={selectedVia}
            onChange={(e) => setSelectedVia(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 focus:outline-none focus:border-emerald-500 focus:bg-white"
          >
            <option value="todas">Todas las vías de administración</option>
            {vias.map((v) => (
              <option key={v} value={v}>
                Vía {v}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Diets Grid */}
      <div className="space-y-4">
        {filteredDiets.map((diet) => (
          <div
            key={diet.id}
            id={`diet-card-${diet.id}`}
            className="rounded-2xl bg-white border border-slate-200 p-5 hover:border-emerald-300 hover:shadow-md transition shadow-sm space-y-4 group"
          >
            {/* Top row */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-base font-bold text-slate-900 group-hover:text-emerald-700 transition">
                    {diet.nombre}
                  </h3>
                  <Badge variant="cyan" size="sm">
                    Vía {diet.viaAdministracion}
                  </Badge>
                  <span className="text-xs font-mono text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 font-semibold">
                    {diet.aporteCalorico}
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed max-w-4xl">
                  {diet.definicionTecnica}
                </p>
              </div>

              <div className="flex items-center gap-1 self-end sm:self-start">
                <button
                  onClick={() => openEditModal(diet)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
                  title="Editar dieta"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    if (confirm(`¿Eliminar la dieta ${diet.nombre}?`)) {
                      onDeleteDiet(diet.id);
                    }
                  }}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                  title="Eliminar dieta"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Macro distribution split */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 p-3 rounded-xl bg-slate-50 border border-slate-200">
              <div className="flex items-center justify-between px-2">
                <span className="text-[11px] text-slate-500 font-medium">Proteínas:</span>
                <span className="text-xs font-bold font-mono text-cyan-700">
                  {diet.distribucionMacros.proteinasPct}%
                </span>
              </div>
              <div className="flex items-center justify-between px-2 sm:border-x sm:border-slate-200">
                <span className="text-[11px] text-slate-500 font-medium">Lípidos (Grasas):</span>
                <span className="text-xs font-bold font-mono text-rose-700">
                  {diet.distribucionMacros.grasasPct}%
                </span>
              </div>
              <div className="flex items-center justify-between px-2">
                <span className="text-[11px] text-slate-500 font-medium">Carbohidratos:</span>
                <span className="text-xs font-bold font-mono text-emerald-700">
                  {diet.distribucionMacros.carbohidratosPct}%
                </span>
              </div>
            </div>

            {/* Clinical Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              {/* Objectives */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                <p className="text-[10px] uppercase font-bold text-emerald-800 tracking-wider flex items-center gap-1.5">
                  <Activity className="w-3 h-3 text-emerald-600" />
                  Objetivos Terapéuticos
                </p>
                <ul className="space-y-1">
                  {diet.objetivos.map((obj, i) => (
                    <li key={i} className="text-slate-600 flex items-start gap-1.5 text-[11px]">
                      <span className="text-emerald-600 font-bold">•</span>
                      <span>{obj}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Dosing, schedule and duration */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <p className="text-[10px] uppercase font-bold text-cyan-800 tracking-wider flex items-center gap-1.5">
                  <Clock className="w-3 h-3 text-cyan-600" />
                  Pauta Horaria & Dosificación
                </p>
                <div className="space-y-1 text-[11px] text-slate-600">
                  <p>
                    <strong className="text-slate-800">Dosificación:</strong> {diet.dosificacion}
                  </p>
                  <p>
                    <strong className="text-slate-800">Pauta:</strong> {diet.pauta}
                  </p>
                  <p>
                    <strong className="text-slate-800">Duración:</strong> {diet.duracion}
                  </p>
                </div>
              </div>
            </div>

            {/* Components & Supplements */}
            <div className="space-y-2 text-xs">
              {/* Included Foods */}
              <div>
                <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-1.5 flex items-center gap-1">
                  <Utensils className="w-3 h-3 text-emerald-600" />
                  Alimentos Componentes de la Dieta
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {diet.componentes.map((comp) => (
                    <span
                      key={comp}
                      className="text-[11px] px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200 font-medium"
                    >
                      {comp}
                    </span>
                  ))}
                </div>
              </div>

              {/* Supplements */}
              {diet.suplementos && diet.suplementos.length > 0 && (
                <div className="pt-1">
                  <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-1.5 flex items-center gap-1">
                    <Pill className="w-3 h-3 text-cyan-600" />
                    Suplementación Clínica Recomendada
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {diet.suplementos.map((sup) => (
                      <span
                        key={sup}
                        className="text-[11px] px-2 py-0.5 rounded-md bg-cyan-50 text-cyan-800 border border-cyan-200 font-medium"
                      >
                        {sup}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Ingesta necesaria & Contraindications */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-[11px]">
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                  <strong className="text-slate-800 block mb-0.5">Ingesta Necesaria:</strong>
                  <span className="text-slate-600">{diet.ingestaNecesaria}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200">
                  <strong className="text-rose-700 block mb-0.5 flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3 text-rose-500" />
                    Contraindicaciones:
                  </strong>
                  <span className="text-rose-800">{diet.contraindicaciones.join(', ')}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Add / Edit */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingDiet ? 'Editar Pauta Dietoterapéutica' : 'Crear Pauta Dietoterapéutica'}
        subtitle="Definición integral según requisitos RF4 de nutrición médica"
        icon={<Utensils className="w-5 h-5" />}
        maxWidth="4xl"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Nombre de la Dieta Prediseñada
              </label>
              <input
                type="text"
                required
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs focus:outline-none focus:border-emerald-600 focus:bg-white"
                placeholder="ej. Dieta Mediterránea Cardioprotectora"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Vía de Administración
              </label>
              <select
                value={viaAdministracion}
                onChange={(e) => setViaAdministracion(e.target.value as ViaAdministracion)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs focus:outline-none focus:border-emerald-600 focus:bg-white"
              >
                {vias.map((v) => (
                  <option key={v} value={v}>
                    {v}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Definición Técnica & Fundamento Clínico
            </label>
            <textarea
              rows={2}
              required
              value={definicionTecnica}
              onChange={(e) => setDefinicionTecnica(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs focus:outline-none focus:border-emerald-600 focus:bg-white"
              placeholder="Fundamento fisiopatológico de la intervención nutricional..."
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-200">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Aporte Calórico
              </label>
              <input
                type="text"
                required
                value={aporteCalorico}
                onChange={(e) => setAporteCalorico(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-slate-300 text-xs font-mono text-slate-800"
                placeholder="1.800 - 2.000 kcal"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-cyan-700 mb-1">
                Proteínas (%)
              </label>
              <input
                type="number"
                value={proteinasPct}
                onChange={(e) => setProteinasPct(Number(e.target.value))}
                className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-slate-300 text-xs font-mono text-slate-800"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-rose-700 mb-1">
                Grasas / Lípidos (%)
              </label>
              <input
                type="number"
                value={grasasPct}
                onChange={(e) => setGrasasPct(Number(e.target.value))}
                className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-slate-300 text-xs font-mono text-slate-800"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-emerald-700 mb-1">
                Carbohidratos (%)
              </label>
              <input
                type="number"
                value={carbohidratosPct}
                onChange={(e) => setCarbohidratosPct(Number(e.target.value))}
                className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-slate-300 text-xs font-mono text-slate-800"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Alimentos Componentes de la Dieta (separados por coma)
            </label>
            <input
              type="text"
              required
              value={componentesInput}
              onChange={(e) => setComponentesInput(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs focus:outline-none focus:border-emerald-600 focus:bg-white"
              placeholder="ej. Salmón Salvaje de Alaska, AOVE, Espinacas Baby, Quinoa..."
            />
            <p className="text-[10px] text-slate-500 mt-1">
              Tip: Puedes usar alimentos registrados en el catálogo de alimentos para cruce de alérgenos.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Ingesta Necesaria (Líquidos, Sodio, Fibra, etc.)
              </label>
              <input
                type="text"
                required
                value={ingestaNecesaria}
                onChange={(e) => setIngestaNecesaria(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs focus:outline-none focus:border-emerald-600 focus:bg-white"
                placeholder="ej. Líquidos 35 ml/kg/día, Sodio < 1.500 mg/día"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Duración del Tratamiento
              </label>
              <input
                type="text"
                required
                value={duracion}
                onChange={(e) => setDuracion(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs focus:outline-none focus:border-emerald-600 focus:bg-white"
                placeholder="ej. 12 semanas con reevaluación clínica"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Dosificación (Número de tomas y distribución)
              </label>
              <input
                type="text"
                required
                value={dosificacion}
                onChange={(e) => setDosificacion(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs focus:outline-none focus:border-emerald-600 focus:bg-white"
                placeholder="ej. 3 comidas principales + 1 colación"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Pauta Horaria y Recomendaciones Culinarias
              </label>
              <input
                type="text"
                required
                value={pauta}
                onChange={(e) => setPauta(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs focus:outline-none focus:border-emerald-600 focus:bg-white"
                placeholder="ej. Desayuno 08:30, Comida 14:00, Cena 20:30"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Objetivos Clínicos (uno por línea)
            </label>
            <textarea
              rows={2}
              required
              value={objetivosInput}
              onChange={(e) => setObjetivosInput(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs focus:outline-none focus:border-emerald-600 focus:bg-white"
              placeholder="Escribe un objetivo por línea..."
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Suplementación Asociada (separada por coma)
              </label>
              <input
                type="text"
                value={suplementosInput}
                onChange={(e) => setSuplementosInput(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs focus:outline-none focus:border-emerald-600 focus:bg-white"
                placeholder="ej. Omega-3 2g, Bisglicinato de Magnesio 300mg"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Patologías Indicadas (separadas por coma)
              </label>
              <input
                type="text"
                value={patologiasInput}
                onChange={(e) => setPatologiasInput(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs focus:outline-none focus:border-emerald-600 focus:bg-white"
                placeholder="ej. Diabetes Mellitus Tipo 2, Hipertensión"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-rose-700 mb-1">
              Contraindicaciones (separadas por coma)
            </label>
            <input
              type="text"
              value={contraindicacionesInput}
              onChange={(e) => setContraindicacionesInput(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs focus:outline-none focus:border-emerald-600 focus:bg-white"
              placeholder="ej. Insuficiencia renal crónica avanzada, Cetoacidosis"
            />
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
              {editingDiet ? 'Guardar Cambios en Pauta' : 'Registrar Dieta'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
