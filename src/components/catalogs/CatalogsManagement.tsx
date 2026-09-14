import React, { useState } from 'react';
import {
  Alimento,
  Nutriente,
  VitaminaMineral,
  DietaPredisenada,
  EnfermedadNutricional,
  CatalogSubTab,
} from '../../types';
import { FoodCatalog } from '../foods/FoodCatalog';
import { NutrientCatalog } from '../nutrients/NutrientCatalog';
import { VitaminCatalog } from '../vitamins/VitaminCatalog';
import { DietCatalog } from '../diets/DietCatalog';
import { DiseaseCatalog } from '../diseases/DiseaseCatalog';
import {
  Apple,
  Atom,
  Pill,
  Utensils,
  Activity,
  BookOpen,
} from 'lucide-react';

interface CatalogsManagementProps {
  foods: Alimento[];
  nutrients: Nutriente[];
  vitamins: VitaminaMineral[];
  diets: DietaPredisenada[];
  diseases: EnfermedadNutricional[];
  onAddFood: (food: Omit<Alimento, 'id'>) => void;
  onUpdateFood: (food: Alimento) => void;
  onDeleteFood: (id: string) => void;
  onAddNutrient: (nutrient: Omit<Nutriente, 'id'>) => void;
  onUpdateNutrient: (nutrient: Nutriente) => void;
  onDeleteNutrient: (id: string) => void;
  onAddVitamin: (vitamin: Omit<VitaminaMineral, 'id'>) => void;
  onUpdateVitamin: (vitamin: VitaminaMineral) => void;
  onDeleteVitamin: (id: string) => void;
  onAddDiet: (diet: Omit<DietaPredisenada, 'id'>) => void;
  onUpdateDiet: (diet: DietaPredisenada) => void;
  onDeleteDiet: (id: string) => void;
  onAddDisease: (disease: Omit<EnfermedadNutricional, 'id'>) => void;
  onUpdateDisease: (disease: EnfermedadNutricional) => void;
  onDeleteDisease: (id: string) => void;
  initialSubTab?: CatalogSubTab;
}

export const CatalogsManagement: React.FC<CatalogsManagementProps> = ({
  foods,
  nutrients,
  vitamins,
  diets,
  diseases,
  onAddFood,
  onUpdateFood,
  onDeleteFood,
  onAddNutrient,
  onUpdateNutrient,
  onDeleteNutrient,
  onAddVitamin,
  onUpdateVitamin,
  onDeleteVitamin,
  onAddDiet,
  onUpdateDiet,
  onDeleteDiet,
  onAddDisease,
  onUpdateDisease,
  onDeleteDisease,
  initialSubTab = 'alimentos',
}) => {
  const [subTab, setSubTab] = useState<CatalogSubTab>(initialSubTab);

  const subNavItems: {
    id: CatalogSubTab;
    label: string;
    description: string;
    icon: React.ReactNode;
    count: number;
    rfBadge: string;
  }[] = [
    {
      id: 'alimentos',
      label: 'Alimentos',
      description: 'Registro bromatológico y alérgenos',
      icon: <Apple className="w-4 h-4" />,
      count: foods.length,
      rfBadge: 'RF1',
    },
    {
      id: 'nutrientes',
      label: 'Nutrientes',
      description: 'Macro y micronutrientes funcionales',
      icon: <Atom className="w-4 h-4" />,
      count: nutrients.length,
      rfBadge: 'RF2',
    },
    {
      id: 'vitaminas',
      label: 'Vitaminas & Minerales',
      description: 'RDA, toxicidad y funciones metabólicas',
      icon: <Pill className="w-4 h-4" />,
      count: vitamins.length,
      rfBadge: 'RF3',
    },
    {
      id: 'dietas',
      label: 'Dietas Prediseñadas',
      description: 'Pautas terapéuticas y posología',
      icon: <Utensils className="w-4 h-4" />,
      count: diets.length,
      rfBadge: 'RF4',
    },
    {
      id: 'enfermedades',
      label: 'Enfermedades Nutricionales',
      description: 'Fisiopatología y dianas clínicas',
      icon: <Activity className="w-4 h-4" />,
      count: diseases.length,
      rfBadge: 'RF5',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Component Header in Light Style */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                  Gestión de Catálogos Terapéuticos
                </h1>
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                  5 Catálogos Clínicos
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                Bases de datos bromatológicas, biológicas, terapéuticas y posológicas para la práctica médica.
              </p>
            </div>
          </div>
        </div>

        {/* Sub-navigation Tabs */}
        <div className="pt-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
          {subNavItems.map((item) => {
            const isActive = subTab === item.id;
            return (
              <button
                key={item.id}
                id={`subnav-${item.id}`}
                onClick={() => setSubTab(item.id)}
                className={`flex flex-col p-3 rounded-xl text-left border transition text-xs ${
                  isActive
                    ? 'bg-emerald-50/80 border-emerald-300 text-emerald-950 shadow-sm'
                    : 'bg-slate-50/70 hover:bg-slate-100/90 border-slate-200 text-slate-700'
                }`}
              >
                <div className="flex items-center justify-between gap-1 mb-1.5">
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                      isActive
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : 'bg-white text-slate-600 border border-slate-200'
                    }`}
                  >
                    {item.icon}
                  </div>
                  <span
                    className={`text-[10px] font-mono px-1.5 py-0.2 rounded font-semibold ${
                      isActive
                        ? 'bg-emerald-200/80 text-emerald-900'
                        : 'bg-slate-200/70 text-slate-600'
                    }`}
                  >
                    {item.rfBadge}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 truncate">{item.label}</span>
                  <span className="text-[11px] font-semibold text-slate-500">
                    {item.count}
                  </span>
                </div>
                <p className="text-[10px] text-slate-500 line-clamp-1 mt-0.5">
                  {item.description}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Render Active Catalog */}
      <div className="transition-opacity duration-150">
        {subTab === 'alimentos' && (
          <FoodCatalog
            foods={foods}
            onAddFood={onAddFood}
            onUpdateFood={onUpdateFood}
            onDeleteFood={onDeleteFood}
          />
        )}

        {subTab === 'nutrientes' && (
          <NutrientCatalog
            nutrients={nutrients}
            onAddNutrient={onAddNutrient}
            onUpdateNutrient={onUpdateNutrient}
            onDeleteNutrient={onDeleteNutrient}
          />
        )}

        {subTab === 'vitaminas' && (
          <VitaminCatalog
            vitamins={vitamins}
            onAddVitamin={onAddVitamin}
            onUpdateVitamin={onUpdateVitamin}
            onDeleteVitamin={onDeleteVitamin}
          />
        )}

        {subTab === 'dietas' && (
          <DietCatalog
            diets={diets}
            foods={foods}
            onAddDiet={onAddDiet}
            onUpdateDiet={onUpdateDiet}
            onDeleteDiet={onDeleteDiet}
          />
        )}

        {subTab === 'enfermedades' && (
          <DiseaseCatalog
            diseases={diseases}
            onAddDisease={onAddDisease}
            onUpdateDisease={onUpdateDisease}
            onDeleteDisease={onDeleteDisease}
          />
        )}
      </div>
    </div>
  );
};
