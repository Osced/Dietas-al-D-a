import React, { useState } from 'react';
import { VitaminaMineral, ClasificacionVitaminaMineral } from '../../types';
import { Badge } from '../common/Badge';
import { Modal } from '../common/Modal';
import {
  Pill,
  Search,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  AlertOctagon,
  Scale,
} from 'lucide-react';

interface VitaminCatalogProps {
  vitamins: VitaminaMineral[];
  onAddVitamin: (vitamin: Omit<VitaminaMineral, 'id'>) => void;
  onUpdateVitamin: (vitamin: VitaminaMineral) => void;
  onDeleteVitamin: (id: string) => void;
}

export const VitaminCatalog: React.FC<VitaminCatalogProps> = ({
  vitamins,
  onAddVitamin,
  onUpdateVitamin,
  onDeleteVitamin,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClasificacion, setSelectedClasificacion] = useState<string>('todas');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<VitaminaMineral | null>(null);

  // Form states
  const [nombre, setNombre] = useState('');
  const [clasificacion, setClasificacion] = useState<ClasificacionVitaminaMineral>('Vitamina Liposoluble');
  const [funcionesInput, setFuncionesInput] = useState('');
  const [racionDieteticaRecomendada, setRacionDieteticaRecomendada] = useState('');
  const [fuentesInput, setFuentesInput] = useState('');
  const [sintomasDeficienciaInput, setSintomasDeficienciaInput] = useState('');
  const [limiteSuperiorSeguro, setLimiteSuperiorSeguro] = useState('');

  const openAddModal = () => {
    setEditingItem(null);
    setNombre('');
    setClasificacion('Vitamina Liposoluble');
    setFuncionesInput('Mineralización ósea, Modulación inmunitaria, Regulación génica');
    setRacionDieteticaRecomendada('1.000 - 2.000 UI/día en adultos');
    setFuentesInput('Exposición solar UVB, Pescados grasos, Huevos');
    setSintomasDeficienciaInput('Fatiga, Dolor óseo, Mayor susceptibilidad a infecciones');
    setLimiteSuperiorSeguro('4.000 UI/día');
    setIsModalOpen(true);
  };

  const openEditModal = (item: VitaminaMineral) => {
    setEditingItem(item);
    setNombre(item.nombre);
    setClasificacion(item.clasificacion);
    setFuncionesInput((item.funcionesAsociadas || []).join('\n'));
    setRacionDieteticaRecomendada(item.racionDieteticaRecomendada);
    setFuentesInput((item.fuentesPrincipales || []).join(', '));
    setSintomasDeficienciaInput((item.sintomasDeficiencia || []).join(', '));
    setLimiteSuperiorSeguro(item.limiteSuperiorSeguro || '');
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const funcionesAsociadas = funcionesInput
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);
    const fuentesPrincipales = fuentesInput
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    const sintomasDeficiencia = sintomasDeficienciaInput
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const payload = {
      nombre,
      clasificacion,
      funcionesAsociadas,
      racionDieteticaRecomendada,
      fuentesPrincipales,
      sintomasDeficiencia,
      limiteSuperiorSeguro,
    };

    if (editingItem) {
      onUpdateVitamin({ ...payload, id: editingItem.id });
    } else {
      onAddVitamin(payload);
    }
    setIsModalOpen(false);
  };

  const clasificaciones: ClasificacionVitaminaMineral[] = [
    'Vitamina Liposoluble',
    'Vitamina Hidrosoluble',
    'Macromineral',
    'Oligoelemento',
  ];

  const filteredItems = vitamins.filter((item) => {
    const matchesSearch =
      item.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.funcionesAsociadas.some((f) => f.toLowerCase().includes(searchTerm.toLowerCase())) ||
      item.sintomasDeficiencia.some((s) => s.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesClasif =
      selectedClasificacion === 'todas' || item.clasificacion === selectedClasificacion;
    return matchesSearch && matchesClasif;
  });

  return (
    <div className="space-y-6">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              Catálogo de Vitaminas & Minerales
            </h2>
            <Badge variant="amber" size="sm">
              RF3
            </Badge>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Funciones metabólicas asociadas, Ración Dietética Recomendada (RDA/DRI) y toxicidad máxima.
          </p>
        </div>

        <button
          id="btn-add-vitamin"
          onClick={openAddModal}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-sm transition active:scale-95 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Añadir Micronutriente</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 bg-white p-3.5 rounded-2xl border border-slate-200 shadow-sm">
        <div className="sm:col-span-8 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar por nombre, función biológica o síntoma..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:bg-white"
          />
        </div>

        <div className="sm:col-span-4">
          <select
            value={selectedClasificacion}
            onChange={(e) => setSelectedClasificacion(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 focus:outline-none focus:border-emerald-500 focus:bg-white"
          >
            <option value="todas">Todas las clasificaciones</option>
            {clasificaciones.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            id={`vitamin-card-${item.id}`}
            className="rounded-2xl bg-white border border-slate-200 p-5 hover:border-emerald-300 hover:shadow-md transition shadow-sm space-y-4 group"
          >
            {/* Header */}
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="text-base font-bold text-slate-900 group-hover:text-emerald-700 transition">
                  {item.nombre}
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  <Badge
                    variant={
                      item.clasificacion.includes('Liposoluble')
                        ? 'amber'
                        : item.clasificacion.includes('Hidrosoluble')
                        ? 'cyan'
                        : item.clasificacion === 'Macromineral'
                        ? 'emerald'
                        : 'purple'
                    }
                    size="sm"
                  >
                    {item.clasificacion}
                  </Badge>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => openEditModal(item)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
                  title="Editar"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => {
                    if (confirm(`¿Eliminar ${item.nombre}?`)) {
                      onDeleteVitamin(item.id);
                    }
                  }}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                  title="Eliminar"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* RDA / DRI Card */}
            <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200 flex items-start gap-2.5">
              <Scale className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-[10px] uppercase font-bold text-emerald-800 tracking-wider">
                  Ración Dietética Recomendada (RDA / DRI)
                </p>
                <p className="text-xs font-semibold text-emerald-950 mt-0.5">
                  {item.racionDieteticaRecomendada}
                </p>
                {item.limiteSuperiorSeguro && (
                  <p className="text-[11px] text-emerald-800 mt-1">
                    Límite Superior Seguro (UL): <strong>{item.limiteSuperiorSeguro}</strong>
                  </p>
                )}
              </div>
            </div>

            {/* Functions List */}
            <div className="space-y-1.5">
              <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                Funciones Fisiológicas y Clínicas
              </p>
              <ul className="space-y-1">
                {item.funcionesAsociadas.map((func, i) => (
                  <li key={i} className="text-xs text-slate-600 flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span>{func}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Deficiency symptoms */}
            <div className="p-2.5 rounded-xl bg-rose-50/60 border border-rose-200 space-y-1">
              <p className="text-[10px] uppercase font-bold text-rose-700 tracking-wider flex items-center gap-1">
                <AlertOctagon className="w-3 h-3 text-rose-500" />
                Manifestaciones de Deficiencia
              </p>
              <div className="flex flex-wrap gap-1">
                {item.sintomasDeficiencia.map((sin) => (
                  <span
                    key={sin}
                    className="text-[11px] px-2 py-0.5 rounded bg-white text-rose-700 border border-rose-200 font-medium"
                  >
                    {sin}
                  </span>
                ))}
              </div>
            </div>

            {/* Sources */}
            <div className="flex items-center gap-1.5 flex-wrap pt-1 text-[11px] text-slate-500">
              <span className="font-semibold text-slate-700">Fuentes:</span>
              {item.fuentesPrincipales.map((src) => (
                <span
                  key={src}
                  className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200"
                >
                  {src}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Modal Add / Edit */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingItem ? 'Editar Vitamina / Mineral' : 'Añadir Vitamina o Mineral'}
        subtitle="Registro de micronutrientes esenciales para dosificación clínica"
        icon={<Pill className="w-5 h-5" />}
        maxWidth="2xl"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Nombre del Micronutriente
              </label>
              <input
                type="text"
                required
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs focus:outline-none focus:border-emerald-600 focus:bg-white"
                placeholder="ej. Vitamina D3 (Colecalciferol)"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Clasificación Bioquímica
              </label>
              <select
                value={clasificacion}
                onChange={(e) => setClasificacion(e.target.value as ClasificacionVitaminaMineral)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs focus:outline-none focus:border-emerald-600 focus:bg-white"
              >
                {clasificaciones.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Ración Dietética Recomendada (RDA / DRI)
            </label>
            <input
              type="text"
              required
              value={racionDieteticaRecomendada}
              onChange={(e) => setRacionDieteticaRecomendada(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs focus:outline-none focus:border-emerald-600 focus:bg-white"
              placeholder="ej. 1.000 - 2.000 UI/día según 25-OH-D"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Funciones Fisiológicas (una por línea)
            </label>
            <textarea
              rows={3}
              required
              value={funcionesInput}
              onChange={(e) => setFuncionesInput(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs focus:outline-none focus:border-emerald-600 focus:bg-white"
              placeholder="Escribe una función por línea..."
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Fuentes Principales (separadas por coma)
              </label>
              <input
                type="text"
                required
                value={fuentesInput}
                onChange={(e) => setFuentesInput(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs focus:outline-none focus:border-emerald-600 focus:bg-white"
                placeholder="ej. Salmón, Yema de huevo, Exposición solar"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Límite Superior Seguro (UL)
              </label>
              <input
                type="text"
                value={limiteSuperiorSeguro}
                onChange={(e) => setLimiteSuperiorSeguro(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs focus:outline-none focus:border-emerald-600 focus:bg-white"
                placeholder="ej. 4.000 UI/día"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Síntomas o Signos de Deficiencia (separados por coma)
            </label>
            <input
              type="text"
              required
              value={sintomasDeficienciaInput}
              onChange={(e) => setSintomasDeficienciaInput(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs focus:outline-none focus:border-emerald-600 focus:bg-white"
              placeholder="ej. Fatiga crónica, Calambres musculares nocturnos, Astenia"
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
              {editingItem ? 'Guardar Cambios' : 'Registrar Micronutriente'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
