import React, { useState } from 'react';
import { ActiveTab, DoctorProfile } from '../../types';
import { PWAInstallButton } from '../common/PWAInstallButton';
import {
  Stethoscope,
  BookOpen,
  Users,
  Compass,
  Menu,
  X,
  RotateCcw,
  UserCheck,
  ChevronDown,
} from 'lucide-react';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  doctor: DoctorProfile;
  onOpenDoctorModal: () => void;
  onResetData: () => void;
  patientCount: number;
  dietCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  doctor,
  onOpenDoctorModal,
  onResetData,
  patientCount,
  dietCount,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  // Grouped into three primary components as requested:
  // 1. Gestión catálogos (alimentos, nutrientes, vitaminas, dietas, enfermedades nutricionales)
  // 2. Análisis de historia clínica
  // 3. Asignación de tratamiento
  const navItems: {
    id: ActiveTab;
    label: string;
    icon: React.ReactNode;
    badge?: number | string;
    description?: string;
  }[] = [
    {
      id: 'catalogos',
      label: 'Gestión Catálogos',
      icon: <BookOpen className="w-4 h-4" />,
      badge: '5 catálogos',
      description: 'Alimentos, Nutrientes, Vitaminas, Dietas y Enfermedades',
    },
    {
      id: 'historia_clinica',
      label: 'Análisis de Historia Clínica',
      icon: <Users className="w-4 h-4" />,
      badge: patientCount,
      description: 'Expedientes, biometría, analíticas y evolución',
    },
    {
      id: 'asignacion_tratamiento',
      label: 'Asignación de Tratamiento',
      icon: <Compass className="w-4 h-4" />,
      badge: 'RF7',
      description: 'Motor de compatibilidad clínica y prescripción',
    },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/95 backdrop-blur-md shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 gap-3">
          {/* Logo & Clinical Title */}
          <div
            className="flex items-center gap-3 cursor-pointer flex-shrink-0"
            onClick={() => setActiveTab('asignacion_tratamiento')}
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-sm shadow-emerald-700/20">
              <Stethoscope className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-base tracking-tight text-slate-900">
                  Dietas al Día
                </span>
                <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold">
                  Clínico
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden sm:block">
                Nutrición Médica & Soporte Clínico
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1.5">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-tab-${item.id}`}
                  onClick={() => setActiveTab(item.id)}
                  className={`relative flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-transparent'
                  }`}
                  title={item.description}
                >
                  <span className={isActive ? 'text-emerald-700' : 'text-slate-500'}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                  {item.badge !== undefined && (
                    <span
                      className={`ml-0.5 text-[10px] px-1.5 py-0.2 rounded-full font-mono font-medium ${
                        isActive
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action Area */}
          <div className="flex items-center gap-2 sm:gap-3">
            <PWAInstallButton />

            {/* Doctor Profile Pill */}
            <div className="relative">
              <button
                id="btn-doctor-profile"
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-left transition"
              >
                <div className="w-7 h-7 rounded-lg bg-emerald-100 border border-emerald-200 flex items-center justify-center text-xs font-bold text-emerald-700">
                  <UserCheck className="w-4 h-4" />
                </div>
                <div className="hidden sm:block">
                  <p className="text-xs font-semibold text-slate-800 leading-tight truncate max-w-[130px]">
                    {doctor.nombre}
                  </p>
                  <p className="text-[10px] text-emerald-700 font-medium leading-none">
                    {doctor.matricula.split(' ')[0]}
                  </p>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
              </button>

              {/* User Dropdown */}
              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-white border border-slate-200 shadow-xl p-3 z-50 text-xs text-slate-700 space-y-2">
                  <div className="pb-2 border-b border-slate-100">
                    <p className="font-bold text-slate-900">{doctor.nombre}</p>
                    <p className="text-[11px] text-emerald-700">{doctor.email}</p>
                    <p className="text-[10px] text-slate-500 mt-1">{doctor.especialidad}</p>
                    <p className="text-[10px] text-slate-500">{doctor.centroMedico}</p>
                  </div>

                  <button
                    onClick={() => {
                      setUserDropdownOpen(false);
                      onOpenDoctorModal();
                    }}
                    className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-slate-50 text-slate-700 flex items-center gap-2 transition"
                  >
                    <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Cambiar / Editar Cuenta Google</span>
                  </button>

                  <button
                    onClick={() => {
                      setUserDropdownOpen(false);
                      if (confirm('¿Restaurar catálogos e historias clínicas a valores clínicos iniciales?')) {
                        onResetData();
                      }
                    }}
                    className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-rose-50 text-rose-600 flex items-center gap-2 transition"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Restablecer datos de muestra</span>
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Burger Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition"
              aria-label="Menú de navegación"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5 text-slate-700" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-3 border-t border-slate-100 space-y-1">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
                    isActive
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className={isActive ? 'text-emerald-700' : 'text-slate-500'}>
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full font-mono bg-slate-100 text-slate-600">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </header>
  );
};
