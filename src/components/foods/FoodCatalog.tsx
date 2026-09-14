import React, { useState } from 'react';
import { Alimento, OrigenAlimento } from '../../types';
import { Badge } from '../common/Badge';
import { Modal } from '../common/Modal';
import {
  Apple,
  Search,
  Plus,
  Edit2,
  Trash2,
  AlertTriangle,
  Sparkles,
} from 'lucide-react';

interface FoodCatalogProps {
  foods: Alimento[];
  onAddFood: (food: Omit<Alimento, 'id'>) => void;
  onUpdateFood: (food: Alimento) => void;
  onDeleteFood: (id: string) => void;
}

export const FoodCatalog: React.FC<FoodCatalogProps> = ({
  foods,
  onAddFood,
  onUpdateFood,
  onDeleteFood,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrigen, setSelectedOrigen] = useState<string>('todos');
  const [selectedCategory, setSelectedCategory] = useState<string>('todas');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFood, setEditingFood] = useState<Alimento | null>(null);

  // Form states
  const [nombre, setNombre] = useState('');
  const [definicion, setDefinicion] = useState('');
  const [origen, setOrigen] = useState<OrigenAlimento>('Vegetal');
  const [funcionalidadPrincipal, setFuncionalidadPrincipal] = useState('');
  const [alergenosInput, setAlergenosInput] = useState('');
  const [categoria, setCategoria] = useState('');
  const [calorias100g, setCalorias100g] = useState(150);
  const [proteinas, setProteinas] = useState(10);
  const [grasas, setGrasas] = useState(5);
  const [carbohidratos, setCarbohidratos] = useState(15);
  const [fibra, setFibra] = useState(3);
  const [micronutrientesInput, setMicronutrientesInput] = useState('');
  const [indiceGlucemico, setIndiceGlucemico] = useState<'Bajo' | 'Medio' | 'Alto'>('Bajo');

  const openAddModal = () => {
    setEditingFood(null);
    setNombre('');
    setDefinicion('');
    setOrigen('Vegetal');
    setFuncionalidadPrincipal('');
    setAlergenosInput('');
    setCategoria('Verduras y Frutas');
    setCalorias100g(100);
    setProteinas(5);
    setGrasas(2);
    setCarbohidratos(15);
    setFibra(3);
    setMicronutrientesInput('Vitamina C, Magnesio');
    setIndiceGlucemico('Bajo');
    setIsModalOpen(true);
  };

  const openEditModal = (food: Alimento) => {
    setEditingFood(food);
    setNombre(food.nombre);
    setDefinicion(food.definicion);
    setOrigen(food.origen);
    setFuncionalidadPrincipal(food.funcionalidadPrincipal);
    setAlergenosInput((food.alergenos || []).join(', '));
    setCategoria(food.categoria || 'General');
    setCalorias100g(food.calorias100g || 0);
    setProteinas(food.macronutrientes?.proteinas || 0);
    setGrasas(food.macronutrientes?.grasas || 0);
    setCarbohidratos(food.macronutrientes?.carbohidratos || 0);
    setFibra(food.macronutrientes?.fibra || 0);
    setMicronutrientesInput((food.micronutrientesClave || []).join(', '));
    setIndiceGlucemico(food.indiceGlucemico || 'Bajo');
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const alergenos = alergenosInput
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    const micronutrientesClave = micronutrientesInput
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const foodData = {
      nombre,
      definicion,
      origen,
      funcionalidadPrincipal,
      alergenos,
      categoria,
      calorias100g,
      macronutrientes: {
        proteinas,
        grasas,
        carbohidratos,
        fibra,
      },
      micronutrientesClave,
      indiceGlucemico,
    };

    if (editingFood) {
      onUpdateFood({ ...foodData, id: editingFood.id });
    } else {
      onAddFood(foodData);
    }
    setIsModalOpen(false);
  };

  const origins: OrigenAlimento[] = ['Vegetal', 'Animal', 'Marino', 'Mineral', 'Fúngico'];
  const categories = Array.from(new Set(foods.map((f) => f.categoria || 'General')));

  const filteredFoods = foods.filter((food) => {
    const matchesSearch =
      food.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      food.funcionalidadPrincipal.toLowerCase().includes(searchTerm.toLowerCase()) ||
      food.definicion.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesOrigen = selectedOrigen === 'todos' || food.origen === selectedOrigen;
    const matchesCategory = selectedCategory === 'todas' || food.categoria === selectedCategory;
    return matchesSearch && matchesOrigen && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              Catálogo Terapéutico de Alimentos
            </h2>
            <Badge variant="cyan" size="sm">
              RF1
            </Badge>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Registro bromatológico con definición, origen biológico, funcionalidad y perfil de alérgenos.
          </p>
        </div>

        <button
          id="btn-add-food"
          onClick={openAddModal}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-sm transition active:scale-95 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Añadir Alimento</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 bg-white p-3.5 rounded-2xl border border-slate-200 shadow-sm">
        <div className="sm:col-span-5 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar por nombre, nutriente o funcionalidad..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:bg-white"
          />
        </div>

        <div className="sm:col-span-4 flex gap-2">
          <select
            value={selectedOrigen}
            onChange={(e) => setSelectedOrigen(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 focus:outline-none focus:border-emerald-500 focus:bg-white"
          >
            <option value="todos">Todos los orígenes</option>
            {origins.map((orig) => (
              <option key={orig} value={orig}>
                Origen {orig}
              </option>
            ))}
          </select>
        </div>

        <div className="sm:col-span-3">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 focus:outline-none focus:border-emerald-500 focus:bg-white"
          >
            <option value="todas">Todas las categorías</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Grid of Foods */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredFoods.map((food) => (
          <div
            key={food.id}
            id={`food-card-${food.id}`}
            className="flex flex-col justify-between rounded-2xl bg-white border border-slate-200 p-5 hover:border-emerald-300 hover:shadow-md transition shadow-sm group"
          >
            <div className="space-y-3">
              {/* Header */}
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 group-hover:text-emerald-700 transition">
                    {food.nombre}
                  </h3>
                  <div className="flex items-center gap-1.5 mt-1">
                    <Badge variant={food.origen === 'Marino' ? 'cyan' : food.origen === 'Vegetal' ? 'emerald' : 'purple'} size="sm">
                      {food.origen}
                    </Badge>
                    <span className="text-[11px] text-slate-500 font-mono">
                      {food.categoria}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => openEditModal(food)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
                    title="Editar alimento"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(`¿Eliminar ${food.nombre} del catálogo clínico?`)) {
                        onDeleteFood(food.id);
                      }
                    }}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                    title="Eliminar alimento"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Definition */}
              <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                {food.definicion}
              </p>

              {/* Main Functionality */}
              <div className="p-2.5 rounded-xl bg-emerald-50/70 border border-emerald-200">
                <p className="text-[10px] uppercase font-bold text-emerald-800 tracking-wider flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-emerald-600" />
                  Funcionalidad Principal
                </p>
                <p className="text-xs text-emerald-950 mt-0.5 leading-snug">
                  {food.funcionalidadPrincipal}
                </p>
              </div>

              {/* Macros bar */}
              <div className="grid grid-cols-4 gap-1 p-2 rounded-xl bg-slate-50 border border-slate-200 text-center font-mono text-[11px]">
                <div>
                  <span className="block text-[9px] text-slate-500 uppercase">Kcal</span>
                  <span className="font-bold text-amber-700">{food.calorias100g}</span>
                </div>
                <div>
                  <span className="block text-[9px] text-slate-500 uppercase">Prot</span>
                  <span className="font-bold text-cyan-700">{food.macronutrientes.proteinas}g</span>
                </div>
                <div>
                  <span className="block text-[9px] text-slate-500 uppercase">Grasa</span>
                  <span className="font-bold text-rose-700">{food.macronutrientes.grasas}g</span>
                </div>
                <div>
                  <span className="block text-[9px] text-slate-500 uppercase">Carb</span>
                  <span className="font-bold text-emerald-700">{food.macronutrientes.carbohidratos}g</span>
                </div>
              </div>

              {/* Allergens warning */}
              {food.alergenos && food.alergenos.length > 0 && (
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-[10px] text-rose-600 flex items-center gap-1 font-semibold">
                    <AlertTriangle className="w-3 h-3 text-rose-500" />
                    Alérgenos:
                  </span>
                  {food.alergenos.map((al) => (
                    <Badge key={al} variant="rose" size="sm">
                      {al}
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* Micronutrients pills */}
            {food.micronutrientesClave && food.micronutrientesClave.length > 0 && (
              <div className="pt-3 mt-3 border-t border-slate-100 flex items-center gap-1 flex-wrap">
                <span className="text-[10px] text-slate-400 font-medium">Clave:</span>
                {food.micronutrientesClave.map((m) => (
                  <span
                    key={m}
                    className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200 font-mono"
                  >
                    {m}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Modal Add / Edit */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingFood ? 'Editar Alimento Terapéutico' : 'Añadir Nuevo Alimento'}
        subtitle="Registro para inclusión en catálogos y dietas prediseñadas"
        icon={<Apple className="w-5 h-5" />}
        maxWidth="2xl"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Nombre del Alimento
              </label>
              <input
                type="text"
                required
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs focus:outline-none focus:border-emerald-600 focus:bg-white"
                placeholder="ej. Salmón Salvaje de Alaska"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Origen Biológico
              </label>
              <select
                value={origen}
                onChange={(e) => setOrigen(e.target.value as OrigenAlimento)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs focus:outline-none focus:border-emerald-600 focus:bg-white"
              >
                {origins.map((o) => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Definición y Características Clínicas
            </label>
            <textarea
              rows={2}
              required
              value={definicion}
              onChange={(e) => setDefinicion(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs focus:outline-none focus:border-emerald-600 focus:bg-white"
              placeholder="Descripción nutricional, parte comestible, procesado o estado natural..."
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Funcionalidad Principal en el Organismo
            </label>
            <input
              type="text"
              required
              value={funcionalidadPrincipal}
              onChange={(e) => setFuncionalidadPrincipal(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs focus:outline-none focus:border-emerald-600 focus:bg-white"
              placeholder="ej. Cardioprotector, fuente de EPA/DHA y optimizador endotelial..."
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Categoría / Grupo Bromatológico
              </label>
              <input
                type="text"
                required
                value={categoria}
                onChange={(e) => setCategoria(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs focus:outline-none focus:border-emerald-600 focus:bg-white"
                placeholder="ej. Pescados y Mariscos"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Alérgenos (separados por coma)
              </label>
              <input
                type="text"
                value={alergenosInput}
                onChange={(e) => setAlergenosInput(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs focus:outline-none focus:border-emerald-600 focus:bg-white"
                placeholder="ej. Pescado, Crustáceos, Gluten..."
              />
            </div>
          </div>

          {/* Macros inputs */}
          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <p className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">
              Aporte por 100g de porción comestible
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              <div>
                <label className="block text-[10px] text-slate-500">Calorías (kcal)</label>
                <input
                  type="number"
                  value={calorias100g}
                  onChange={(e) => setCalorias100g(Number(e.target.value))}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-slate-300 text-xs font-mono text-slate-800 focus:border-emerald-600"
                />
              </div>
              <div>
                <label className="block text-[10px] text-slate-500">Proteínas (g)</label>
                <input
                  type="number"
                  step="0.1"
                  value={proteinas}
                  onChange={(e) => setProteinas(Number(e.target.value))}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-slate-300 text-xs font-mono text-slate-800 focus:border-emerald-600"
                />
              </div>
              <div>
                <label className="block text-[10px] text-slate-500">Grasas (g)</label>
                <input
                  type="number"
                  step="0.1"
                  value={grasas}
                  onChange={(e) => setGrasas(Number(e.target.value))}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-slate-300 text-xs font-mono text-slate-800 focus:border-emerald-600"
                />
              </div>
              <div>
                <label className="block text-[10px] text-slate-500">Carbohidratos (g)</label>
                <input
                  type="number"
                  step="0.1"
                  value={carbohidratos}
                  onChange={(e) => setCarbohidratos(Number(e.target.value))}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-slate-300 text-xs font-mono text-slate-800 focus:border-emerald-600"
                />
              </div>
              <div>
                <label className="block text-[10px] text-slate-500">Fibra (g)</label>
                <input
                  type="number"
                  step="0.1"
                  value={fibra}
                  onChange={(e) => setFibra(Number(e.target.value))}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-slate-300 text-xs font-mono text-slate-800 focus:border-emerald-600"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Micronutrientes Clave (separados por coma)
              </label>
              <input
                type="text"
                value={micronutrientesInput}
                onChange={(e) => setMicronutrientesInput(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs focus:outline-none focus:border-emerald-600 focus:bg-white"
                placeholder="ej. Vitamina D3, Selenio, Potasio"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Índice Glucémico
              </label>
              <select
                value={indiceGlucemico}
                onChange={(e) => setIndiceGlucemico(e.target.value as 'Bajo' | 'Medio' | 'Alto')}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs focus:outline-none focus:border-emerald-600 focus:bg-white"
              >
                <option value="Bajo">Bajo (&le; 55)</option>
                <option value="Medio">Medio (56 - 69)</option>
                <option value="Alto">Alto (&ge; 70)</option>
              </select>
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
              {editingFood ? 'Guardar Modificaciones' : 'Registrar Alimento'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
