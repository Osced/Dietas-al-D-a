import React, { useState } from 'react';
import { Nutriente, TipoNutriente } from '../../types';
import { Badge } from '../common/Badge';
import { Modal } from '../common/Modal';
import {
  Atom,
  Search,
  Plus,
  Edit2,
  Trash2,
  ShieldAlert,
  Sparkles,
  UtensilsCrossed,
} from 'lucide-react';

interface NutrientCatalogProps {
  nutrients: Nutriente[];
  onAddNutrient: (nutrient: Omit<Nutriente, 'id'>) => void;
  onUpdateNutrient: (nutrient: Nutriente) => void;
  onDeleteNutrient: (id: string) => void;
}

export const NutrientCatalog: React.FC<NutrientCatalogProps> = ({
  nutrients,
  onAddNutrient,
  onUpdateNutrient,
  onDeleteNutrient,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('todos');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNutrient, setEditingNutrient] = useState<Nutriente | null>(null);

  // Form states
  const [nombre, setNombre] = useState('');
  const [definicion, setDefinicion] = useState('');
  const [funcionalidad, setFuncionalidad] = useState('');
  const [tipo, setTipo] = useState<TipoNutriente>('Macronutriente');
  const [subtipo, setSubtipo] = useState('');
  const [enfermedadesInput, setEnfermedadesInput] = useState('');
  const [fuentesInput, setFuentesInput] = useState('');

  const openAddModal = () => {
    setEditingNutrient(null);
    setNombre('');
    setDefinicion('');
    setFuncionalidad('');
    setTipo('Macronutriente');
    setSubtipo('Ácido Graso Poliinsaturado');
    setEnfermedadesInput('Enfermedades cardiovasculares, Deterioro cognitivo');
    setFuentesInput('Salmón Salvaje, Nueces, Aceite de oliva');
    setIsModalOpen(true);
  };

  const openEditModal = (nutrient: Nutriente) => {
    setEditingNutrient(nutrient);
    setNombre(nutrient.nombre);
    setDefinicion(nutrient.definicion);
    setFuncionalidad(nutrient.funcionalidad);
    setTipo(nutrient.tipo);
    setSubtipo(nutrient.subtipo);
    setEnfermedadesInput((nutrient.enfermedadesPorDeficit || []).join(', '));
    setFuentesInput((nutrient.fuentesAlimentarias || []).join(', '));
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const enfermedadesPorDeficit = enfermedadesInput
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    const fuentesAlimentarias = fuentesInput
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const payload = {
      nombre,
      definicion,
      funcionalidad,
      tipo,
      subtipo,
      enfermedadesPorDeficit,
      fuentesAlimentarias,
    };

    if (editingNutrient) {
      onUpdateNutrient({ ...payload, id: editingNutrient.id });
    } else {
      onAddNutrient(payload);
    }
    setIsModalOpen(false);
  };

  const filteredNutrients = nutrients.filter((n) => {
    const matchesSearch =
      n.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      n.funcionalidad.toLowerCase().includes(searchTerm.toLowerCase()) ||
      n.subtipo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      n.definicion.toLowerCase().includes(searchTerm.toLowerCase()) ||
      n.enfermedadesPorDeficit.some((d) => d.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesType = selectedType === 'todos' || n.tipo === selectedType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              Catálogo de Nutrientes & Principios Activos
            </h2>
            <Badge variant="purple" size="sm">
              RF2
            </Badge>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Definición bioquímica, funciones metabólicas, enfermedades por déficit y fuentes dietéticas.
          </p>
        </div>

        <button
          id="btn-add-nutrient"
          onClick={openAddModal}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-sm transition active:scale-95 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Añadir Nutriente</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 bg-white p-3.5 rounded-2xl border border-slate-200 shadow-sm">
        <div className="sm:col-span-8 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar nutriente por nombre, funcionalidad o patología por déficit..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:bg-white"
          />
        </div>

        <div className="sm:col-span-4">
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 focus:outline-none focus:border-emerald-500 focus:bg-white"
          >
            <option value="todos">Todos los tipos</option>
            <option value="Macronutriente">Macronutrientes</option>
            <option value="Micronutriente">Micronutrientes</option>
            <option value="Compuesto Bioactivo">Compuestos Bioactivos</option>
          </select>
        </div>
      </div>

      {/* Nutrients Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredNutrients.map((nutrient) => (
          <div
            key={nutrient.id}
            id={`nutrient-card-${nutrient.id}`}
            className="rounded-2xl bg-white border border-slate-200 p-5 hover:border-cyan-300 hover:shadow-md transition shadow-sm space-y-3.5 group"
          >
            {/* Header */}
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-slate-900 group-hover:text-cyan-700 transition">
                    {nutrient.nombre}
                  </h3>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <Badge
                    variant={
                      nutrient.tipo === 'Macronutriente'
                        ? 'cyan'
                        : nutrient.tipo === 'Compuesto Bioactivo'
                        ? 'purple'
                        : 'emerald'
                    }
                    size="sm"
                  >
                    {nutrient.tipo}
                  </Badge>
                  <span className="text-[11px] font-mono text-slate-500">
                    {nutrient.subtipo}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => openEditModal(nutrient)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
                  title="Editar nutriente"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => {
                    if (confirm(`¿Eliminar ${nutrient.nombre} del registro?`)) {
                      onDeleteNutrient(nutrient.id);
                    }
                  }}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                  title="Eliminar nutriente"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Definition */}
            <p className="text-xs text-slate-600 leading-relaxed">
              {nutrient.definicion}
            </p>

            {/* Functionality */}
            <div className="p-3 rounded-xl bg-cyan-50/70 border border-cyan-200">
              <p className="text-[10px] uppercase font-bold text-cyan-800 tracking-wider flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-cyan-600" />
                Funcionalidad Celular & Fisiológica
              </p>
              <p className="text-xs text-cyan-950 mt-1 leading-snug">
                {nutrient.funcionalidad}
              </p>
            </div>

            {/* Deficiency diseases */}
            <div className="p-3 rounded-xl bg-rose-50/60 border border-rose-200 space-y-1.5">
              <p className="text-[10px] uppercase font-bold text-rose-700 tracking-wider flex items-center gap-1">
                <ShieldAlert className="w-3 h-3 text-rose-500" />
                Enfermedades o Manifestaciones por Déficit
              </p>
              <div className="flex flex-wrap gap-1">
                {nutrient.enfermedadesPorDeficit.map((enf) => (
                  <span
                    key={enf}
                    className="text-[11px] px-2 py-0.5 rounded-md bg-white text-rose-700 border border-rose-200 font-medium"
                  >
                    {enf}
                  </span>
                ))}
              </div>
            </div>

            {/* Food sources */}
            <div className="space-y-1">
              <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wider flex items-center gap-1">
                <UtensilsCrossed className="w-3 h-3 text-emerald-600" />
                Fuentes Alimentarias Principales
              </p>
              <div className="flex flex-wrap gap-1.5">
                {nutrient.fuentesAlimentarias.map((src) => (
                  <span
                    key={src}
                    className="text-[11px] px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200"
                  >
                    {src}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Add / Edit */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingNutrient ? 'Editar Nutriente Bioquímico' : 'Añadir Nuevo Nutriente'}
        subtitle="Registro de micronutrientes, macronutrientes y factores bioactivos"
        icon={<Atom className="w-5 h-5" />}
        maxWidth="2xl"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Nombre del Nutriente
              </label>
              <input
                type="text"
                required
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs focus:outline-none focus:border-emerald-600 focus:bg-white"
                placeholder="ej. Ácido Docosahexaenoico (DHA)"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Tipo Fisiológico
              </label>
              <select
                value={tipo}
                onChange={(e) => setTipo(e.target.value as TipoNutriente)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs focus:outline-none focus:border-emerald-600 focus:bg-white"
              >
                <option value="Macronutriente">Macronutriente</option>
                <option value="Micronutriente">Micronutriente</option>
                <option value="Compuesto Bioactivo">Compuesto Bioactivo</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Subtipo o Familia Química
            </label>
            <input
              type="text"
              required
              value={subtipo}
              onChange={(e) => setSubtipo(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs focus:outline-none focus:border-emerald-600 focus:bg-white"
              placeholder="ej. Ácido Graso Poliinsaturado Omega-3 / Péptido / Polifenol"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Definición y Estructura
            </label>
            <textarea
              rows={2}
              required
              value={definicion}
              onChange={(e) => setDefinicion(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs focus:outline-none focus:border-emerald-600 focus:bg-white"
              placeholder="Propiedades bioquímicas, absorción y transporte plasmático..."
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Funcionalidad en el Organismo
            </label>
            <textarea
              rows={2}
              required
              value={funcionalidad}
              onChange={(e) => setFuncionalidad(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs focus:outline-none focus:border-emerald-600 focus:bg-white"
              placeholder="Efecto metabólico, dianas celulares, modulación inflamatoria..."
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Enfermedades por Déficit (separadas por coma)
            </label>
            <input
              type="text"
              required
              value={enfermedadesInput}
              onChange={(e) => setEnfermedadesInput(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs focus:outline-none focus:border-emerald-600 focus:bg-white"
              placeholder="ej. Dislipidemia aterogénica, Deterioro cognitivo leve..."
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Fuentes Alimentarias Principales (separadas por coma)
            </label>
            <input
              type="text"
              required
              value={fuentesInput}
              onChange={(e) => setFuentesInput(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs focus:outline-none focus:border-emerald-600 focus:bg-white"
              placeholder="ej. Salmón Salvaje de Alaska, Nueces de Nogal, AOVE..."
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
              {editingNutrient ? 'Guardar Cambios' : 'Registrar Nutriente'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
