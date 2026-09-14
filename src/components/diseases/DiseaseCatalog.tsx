import React, { useState } from 'react';
import { EnfermedadNutricional } from '../../types';
import { Badge } from '../common/Badge';
import { Modal } from '../common/Modal';
import {
  Activity,
  Search,
  Plus,
  Edit2,
  Trash2,
  Stethoscope,
  Target,
  AlertTriangle,
  Sparkles,
  GitFork,
} from 'lucide-react';

interface DiseaseCatalogProps {
  diseases: EnfermedadNutricional[];
  onAddDisease: (disease: Omit<EnfermedadNutricional, 'id'>) => void;
  onUpdateDisease: (disease: EnfermedadNutricional) => void;
  onDeleteDisease: (id: string) => void;
}

export const DiseaseCatalog: React.FC<DiseaseCatalogProps> = ({
  diseases,
  onAddDisease,
  onUpdateDisease,
  onDeleteDisease,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDisease, setEditingDisease] = useState<EnfermedadNutricional | null>(null);

  // Form states
  const [nombre, setNombre] = useState('');
  const [causas, setCausas] = useState('');
  const [diagnosis, setDiagnosis] = useState('');
  const [diagnosticosDiferencialesInput, setDiagnosticosDiferencialesInput] = useState('');
  const [tratamiento, setTratamiento] = useState('');
  const [objetivoTratamiento, setObjetivoTratamiento] = useState('');
  const [alimentosContraindicadosInput, setAlimentosContraindicadosInput] = useState('');
  const [nutrientesRecomendadosInput, setNutrientesRecomendadosInput] = useState('');

  const openAddModal = () => {
    setEditingDisease(null);
    setNombre('');
    setCausas('Etiología multifactorial con base genética y factores epigenéticos dietéticos.');
    setDiagnosis('Criterios diagnósticos analíticos y clínicos.');
    setDiagnosticosDiferencialesInput('Patología A a descartar, Patología B secundaria');
    setTratamiento('Terapia médica nutricional, ejercicio de resistencia y monitorización periódica.');
    setObjetivoTratamiento('Normalización de biomarcadores plasmáticos y prevención de comorbilidades.');
    setAlimentosContraindicadosInput('Azúcares refinados, Alimentos ultraprocesados');
    setNutrientesRecomendadosInput('Omega-3 EPA/DHA, Magnesio, Fibra soluble');
    setIsModalOpen(true);
  };

  const openEditModal = (disease: EnfermedadNutricional) => {
    setEditingDisease(disease);
    setNombre(disease.nombre);
    setCausas(disease.causas);
    setDiagnosis(disease.diagnosis);
    setDiagnosticosDiferencialesInput((disease.diagnosticosDiferenciales || []).join(', '));
    setTratamiento(disease.tratamiento);
    setObjetivoTratamiento(disease.objetivoTratamiento);
    setAlimentosContraindicadosInput((disease.alimentosContraindicados || []).join(', '));
    setNutrientesRecomendadosInput((disease.nutrientesRecomendados || []).join(', '));
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const diagnosticosDiferenciales = diagnosticosDiferencialesInput
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    const alimentosContraindicados = alimentosContraindicadosInput
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    const nutrientesRecomendados = nutrientesRecomendadosInput
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const payload = {
      nombre,
      causas,
      diagnosis,
      diagnosticosDiferenciales,
      tratamiento,
      objetivoTratamiento,
      alimentosContraindicados,
      nutrientesRecomendados,
    };

    if (editingDisease) {
      onUpdateDisease({ ...payload, id: editingDisease.id });
    } else {
      onAddDisease(payload);
    }
    setIsModalOpen(false);
  };

  const filteredDiseases = diseases.filter((d) => {
    return (
      d.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.causas.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.diagnosis.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.tratamiento.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              Catálogo de Patologías & Enfermedades Nutricionales
            </h2>
            <Badge variant="rose" size="sm">
              RF5
            </Badge>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Etiología patológica, criterios de diagnosis diferencial, abordaje dietoterápico y objetivos.
          </p>
        </div>

        <button
          id="btn-add-disease"
          onClick={openAddModal}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-sm transition active:scale-95 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Añadir Patología</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-sm">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar por patología, criterios de diagnóstico, etiología o tratamiento..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:bg-white"
          />
        </div>
      </div>

      {/* Grid of Diseases */}
      <div className="space-y-4">
        {filteredDiseases.map((disease) => (
          <div
            key={disease.id}
            id={`disease-card-${disease.id}`}
            className="rounded-2xl bg-white border border-slate-200 p-5 hover:border-rose-300 hover:shadow-md transition shadow-sm space-y-4 group"
          >
            {/* Header */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600 flex-shrink-0 mt-0.5">
                  <Activity className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 group-hover:text-rose-700 transition">
                    {disease.nombre}
                  </h3>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    <strong className="text-slate-700 font-semibold">Causas & Etiología:</strong> {disease.causas}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1 flex-shrink-0">
                <button
                  onClick={() => openEditModal(disease)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
                  title="Editar patología"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => {
                    if (confirm(`¿Eliminar ${disease.nombre} del catálogo?`)) {
                      onDeleteDisease(disease.id);
                    }
                  }}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                  title="Eliminar patología"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Diagnosis & Differentials */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-cyan-50/50 border border-cyan-200 space-y-1">
                <p className="text-[10px] uppercase font-bold text-cyan-800 tracking-wider flex items-center gap-1.5">
                  <Stethoscope className="w-3 h-3 text-cyan-600" />
                  Criterios de Diagnosis Clínica y Laboratorial
                </p>
                <p className="text-xs text-slate-700 leading-relaxed">
                  {disease.diagnosis}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-purple-50/50 border border-purple-200 space-y-1">
                <p className="text-[10px] uppercase font-bold text-purple-800 tracking-wider flex items-center gap-1.5">
                  <GitFork className="w-3 h-3 text-purple-600" />
                  Diagnósticos Diferenciales a Descartar
                </p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {disease.diagnosticosDiferenciales.map((diff, i) => (
                    <span
                      key={i}
                      className="text-[11px] px-2 py-0.5 rounded bg-white text-purple-800 border border-purple-200 font-medium"
                    >
                      {diff}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Treatment & Objectives */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-emerald-50/60 border border-emerald-200 space-y-1">
                <p className="text-[10px] uppercase font-bold text-emerald-800 tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3 text-emerald-600" />
                  Tratamiento Dietoterápico
                </p>
                <p className="text-xs text-emerald-950 leading-relaxed">
                  {disease.tratamiento}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-cyan-50/60 border border-cyan-200 space-y-1">
                <p className="text-[10px] uppercase font-bold text-cyan-800 tracking-wider flex items-center gap-1.5">
                  <Target className="w-3 h-3 text-cyan-600" />
                  Objetivo del Tratamiento
                </p>
                <p className="text-xs text-cyan-950 leading-relaxed">
                  {disease.objetivoTratamiento}
                </p>
              </div>
            </div>

            {/* Contraindicated foods & Recommended nutrients */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1">
              <div className="p-2.5 rounded-xl bg-rose-50/60 border border-rose-200">
                <span className="text-[10px] uppercase font-bold text-rose-700 flex items-center gap-1 mb-1">
                  <AlertTriangle className="w-3 h-3 text-rose-500" />
                  Alimentos Contraindicados
                </span>
                <div className="flex flex-wrap gap-1">
                  {disease.alimentosContraindicados.map((item, i) => (
                    <span
                      key={i}
                      className="text-[11px] px-2 py-0.5 rounded bg-white text-rose-700 border border-rose-200 font-medium"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] uppercase font-bold text-slate-600 flex items-center gap-1 mb-1">
                  <Sparkles className="w-3 h-3 text-emerald-600" />
                  Nutrientes Clave Recomendados
                </span>
                <div className="flex flex-wrap gap-1">
                  {disease.nutrientesRecomendados.map((nutr, i) => (
                    <span
                      key={i}
                      className="text-[11px] px-2 py-0.5 rounded bg-white text-slate-700 border border-slate-200 font-medium"
                    >
                      {nutr}
                    </span>
                  ))}
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
        title={editingDisease ? 'Editar Enfermedad Nutricional' : 'Añadir Enfermedad Nutricional'}
        subtitle="Registro clínico según requisitos RF5 para cruce diagnóstico"
        icon={<Activity className="w-5 h-5" />}
        maxWidth="3xl"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Nombre de la Enfermedad Nutricional
            </label>
            <input
              type="text"
              required
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs focus:outline-none focus:border-emerald-600 focus:bg-white"
              placeholder="ej. Diabetes Mellitus Tipo 2 y Síndrome Metabólico"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Causas y Fisiopatología
            </label>
            <textarea
              rows={2}
              required
              value={causas}
              onChange={(e) => setCausas(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs focus:outline-none focus:border-emerald-600 focus:bg-white"
              placeholder="Etiología, factores genéticos y ambientales..."
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Diagnosis (Criterios clínicos y laboratoriales)
            </label>
            <textarea
              rows={2}
              required
              value={diagnosis}
              onChange={(e) => setDiagnosis(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs focus:outline-none focus:border-emerald-600 focus:bg-white"
              placeholder="Valores analíticos de corte (HbA1c, glucemia, serología, biopsia)..."
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Diagnósticos Diferenciales (separados por coma)
            </label>
            <input
              type="text"
              required
              value={diagnosticosDiferencialesInput}
              onChange={(e) => setDiagnosticosDiferencialesInput(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs focus:outline-none focus:border-emerald-600 focus:bg-white"
              placeholder="ej. Diabetes LADA, Síndrome de Cushing, Hemocromatosis"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Tratamiento Nutricional y Coadyuvante
              </label>
              <textarea
                rows={3}
                required
                value={tratamiento}
                onChange={(e) => setTratamiento(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs focus:outline-none focus:border-emerald-600 focus:bg-white"
                placeholder="Abordaje dietoterápico y estilo de vida..."
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Objetivo del Tratamiento
              </label>
              <textarea
                rows={3}
                required
                value={objetivoTratamiento}
                onChange={(e) => setObjetivoTratamiento(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs focus:outline-none focus:border-emerald-600 focus:bg-white"
                placeholder="Metas clínicas cuantificables (ej. HbA1c < 6.5%, PA < 130/80)..."
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-rose-700 mb-1">
                Alimentos Contraindicados (separados por coma)
              </label>
              <input
                type="text"
                value={alimentosContraindicadosInput}
                onChange={(e) => setAlimentosContraindicadosInput(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs focus:outline-none focus:border-emerald-600 focus:bg-white"
                placeholder="ej. Azúcares libres, Harinas refinadas, Grasas trans"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-emerald-700 mb-1">
                Nutrientes Recomendados (separados por coma)
              </label>
              <input
                type="text"
                value={nutrientesRecomendadosInput}
                onChange={(e) => setNutrientesRecomendadosInput(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs focus:outline-none focus:border-emerald-600 focus:bg-white"
                placeholder="ej. Omega-3 EPA/DHA, Magnesio, Fibra soluble"
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
              {editingDisease ? 'Guardar Cambios' : 'Registrar Patología'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
