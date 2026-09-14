import React, { useState } from 'react';
import { DoctorProfile } from '../../types';
import { ShieldCheck, Stethoscope, Lock, Check, Sparkles, Building2, User } from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentDoctor: DoctorProfile;
  onLoginSuccess: (doctor: DoctorProfile) => void;
  isMandatoryInitial?: boolean;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  currentDoctor,
  onLoginSuccess,
  isMandatoryInitial = false,
}) => {
  const [googleStep, setGoogleStep] = useState<'prompt' | 'register' | 'account_select'>('prompt');
  const [selectedEmail, setSelectedEmail] = useState(currentDoctor.email || 'Osced14@gmail.com');
  const [nombre, setNombre] = useState(currentDoctor.nombre || 'Dr. Alejandro Morales S.');
  const [matricula, setMatricula] = useState(currentDoctor.matricula || 'MN-84920 (Colegio Médico)');
  const [especialidad, setEspecialidad] = useState(
    currentDoctor.especialidad || 'Medicina Nutricional y Enfermedades Metabólicas'
  );
  const [centroMedico, setCentroMedico] = useState(
    currentDoctor.centroMedico || 'Instituto de Longevidad y Salud Metabólica'
  );
  const [privacyAccepted, setPrivacyAccepted] = useState(true);

  if (!isOpen) return null;

  const handleGoogleSimulatedAuth = (email: string, name: string) => {
    setSelectedEmail(email);
    setNombre(name);
    setGoogleStep('register');
  };

  const handleCompleteRegistration = (e: React.FormEvent) => {
    e.preventDefault();
    if (!privacyAccepted) return;

    const updatedProfile: DoctorProfile = {
      id: currentDoctor.id || `doc-${Date.now()}`,
      nombre,
      email: selectedEmail,
      matricula,
      especialidad,
      centroMedico,
      isGoogleAuthenticated: true,
      avatarUrl: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(nombre)}&backgroundColor=059669`,
      ultimoAcceso: new Date().toISOString(),
    };

    onLoginSuccess(updatedProfile);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 overflow-y-auto">
      <div
        id="login-modal-card"
        className="w-full max-w-lg rounded-3xl bg-white border border-slate-200 shadow-2xl p-6 sm:p-8 text-slate-800 relative overflow-hidden"
      >
        {/* Subtle accent gradients */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-50 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-teal-50 rounded-full blur-3xl pointer-events-none" />

        {/* Brand header */}
        <div className="relative z-10 flex flex-col items-center text-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 p-0.5 shadow-md mb-3 flex items-center justify-center">
            <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center">
              <Stethoscope className="w-7 h-7 text-emerald-600" />
            </div>
          </div>

          <h2 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            Dietas al Día
            <span className="text-[10px] uppercase font-mono tracking-wider px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold">
              Pro Clínico
            </span>
          </h2>
          <p className="text-xs text-slate-500 mt-1 max-w-xs">
            Portal exclusivo para médicos nutricionistas colegiados. Autenticación restringida con Google Workspace / Gmail.
          </p>
        </div>

        {googleStep === 'prompt' && (
          <div className="relative z-10 space-y-4">
            <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Requisito de Seguridad Médica</span>
              </div>
              <p className="text-xs text-emerald-950/80 leading-relaxed">
                Para garantizar la confidencialidad de la historia clínica de los pacientes y las pautas terapéuticas, el acceso está reservado a facultativos verificados.
              </p>
            </div>

            {/* Google OAuth Button */}
            <button
              id="btn-google-login"
              onClick={() => setGoogleStep('account_select')}
              className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl bg-white hover:bg-slate-50 text-slate-700 font-semibold text-sm border border-slate-300 shadow-sm transition active:scale-[0.99]"
            >
              {/* Official Google 'G' vector */}
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.15z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.28 14.27A7.18 7.18 0 0 1 4.9 12c0-.79.14-1.57.38-2.27V6.58H1.25A11.97 11.97 0 0 0 0 12c0 1.92.45 3.74 1.25 5.42l4.03-3.15z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                />
              </svg>
              <span>Continuar con Cuenta Google</span>
            </button>

            <div className="flex items-center gap-2 justify-center text-[11px] text-slate-400 pt-2">
              <Lock className="w-3 h-3 text-slate-400" />
              <span>Cifrado de grado hospitalario & autenticación OAuth 2.0</span>
            </div>
          </div>
        )}

        {googleStep === 'account_select' && (
          <div className="relative z-10 space-y-4">
            <h3 className="text-sm font-semibold text-slate-800">
              Selecciona tu cuenta de Google médica:
            </h3>

            <div className="space-y-2">
              <button
                onClick={() =>
                  handleGoogleSimulatedAuth('Osced14@gmail.com', 'Dr. Alejandro Morales S.')
                }
                className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-emerald-50/60 border border-slate-200 hover:border-emerald-300 transition text-left group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-emerald-100 flex items-center justify-center text-sm font-bold text-emerald-800 border border-emerald-300">
                    O
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-900 group-hover:text-emerald-700 transition">
                      Osced14@gmail.com
                    </p>
                    <p className="text-[11px] text-slate-500">Dr. Alejandro Morales S. (Activa)</p>
                  </div>
                </div>
                <Sparkles className="w-4 h-4 text-emerald-600 opacity-0 group-hover:opacity-100 transition" />
              </button>

              <button
                onClick={() =>
                  handleGoogleSimulatedAuth('doctora.nutricion@clinica.es', 'Dra. María V. Soler')
                }
                className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-teal-50/60 border border-slate-200 hover:border-teal-300 text-left transition group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-teal-100 flex items-center justify-center text-sm font-bold text-teal-800 border border-teal-300">
                    M
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-900 group-hover:text-teal-700 transition">
                      doctora.nutricion@clinica.es
                    </p>
                    <p className="text-[11px] text-slate-500">Dra. María V. Soler (Nutrióloga)</p>
                  </div>
                </div>
              </button>
            </div>

            <button
              onClick={() => setGoogleStep('prompt')}
              className="text-xs text-slate-500 hover:text-slate-800 underline pt-1 block text-center w-full"
            >
              Volver atrás
            </button>
          </div>
        )}

        {googleStep === 'register' && (
          <form onSubmit={handleCompleteRegistration} className="relative z-10 space-y-3.5">
            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800">
              <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span className="truncate">Cuenta Google verificada: <strong>{selectedEmail}</strong></span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-emerald-600" />
                Nombre del Médico Nutricionista
              </label>
              <input
                type="text"
                required
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs focus:outline-none focus:border-emerald-600 focus:bg-white"
                placeholder="Dr. / Dra. Nombre y Apellidos"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  Matrícula Profesional
                </label>
                <input
                  type="text"
                  required
                  value={matricula}
                  onChange={(e) => setMatricula(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs focus:outline-none focus:border-emerald-600 focus:bg-white"
                  placeholder="MN-12345"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                  <Stethoscope className="w-3.5 h-3.5 text-emerald-600" />
                  Especialidad
                </label>
                <input
                  type="text"
                  required
                  value={especialidad}
                  onChange={(e) => setEspecialidad(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs focus:outline-none focus:border-emerald-600 focus:bg-white"
                  placeholder="Nutrición Clínica / Metabólica"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-emerald-600" />
                Centro Médico / Hospital / Gabinete
              </label>
              <input
                type="text"
                required
                value={centroMedico}
                onChange={(e) => setCentroMedico(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs focus:outline-none focus:border-emerald-600 focus:bg-white"
                placeholder="Hospital Clínico o Consulta Privada"
              />
            </div>

            <label className="flex items-start gap-2.5 pt-1 cursor-pointer">
              <input
                type="checkbox"
                checked={privacyAccepted}
                onChange={(e) => setPrivacyAccepted(e.target.checked)}
                className="mt-0.5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
              />
              <span className="text-[11px] text-slate-500 leading-snug">
                Declaro bajo juramento profesional mi condición de facultativo médico y acepto la normativa de secreto profesional y tratamiento de historias clínicas conforme a la legislación sanitaria.
              </span>
            </label>

            <div className="pt-2 flex items-center gap-3">
              {!isMandatoryInitial && (
                <button
                  type="button"
                  onClick={onClose}
                  className="w-1/3 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium transition"
                >
                  Cancelar
                </button>
              )}
              <button
                type="submit"
                disabled={!privacyAccepted}
                className={`flex-1 py-2.5 rounded-xl font-semibold text-xs transition ${
                  privacyAccepted
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-md active:scale-95'
                    : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                }`}
              >
                Completar Registro & Acceder a Dietas al Día
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
