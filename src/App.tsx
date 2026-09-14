import React, { useState, useEffect } from 'react';
import {
  ActiveTab,
  DoctorProfile,
  Alimento,
  Nutriente,
  VitaminaMineral,
  DietaPredisenada,
  EnfermedadNutricional,
  Paciente,
} from './types';
import { storageService } from './services/storage';
import { Navbar } from './components/layout/Navbar';
import { LoginModal } from './components/auth/LoginModal';
import { OfflineIndicator } from './components/common/OfflineIndicator';
import { CatalogsManagement } from './components/catalogs/CatalogsManagement';
import { PatientManagement } from './components/patients/PatientManagement';
import { DecisionEngineView } from './components/decision/DecisionEngineView';

export default function App() {
  // 3 primary functional groups as requested:
  // 1. 'catalogos' -> Gestión catálogos (alimentos, nutrientes, vitaminas, dietas, enfermedades nutricionales)
  // 2. 'historia_clinica' -> Análisis de historia clínica
  // 3. 'asignacion_tratamiento' -> Asignación de tratamiento
  const [activeTab, setActiveTab] = useState<ActiveTab>('catalogos');
  const [doctor, setDoctor] = useState<DoctorProfile>(() => storageService.getDoctorProfile());
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  // Entities state
  const [foods, setFoods] = useState<Alimento[]>(() => storageService.getFoods());
  const [nutrients, setNutrients] = useState<Nutriente[]>(() => storageService.getNutrients());
  const [vitamins, setVitamins] = useState<VitaminaMineral[]>(() => storageService.getVitamins());
  const [diets, setDiets] = useState<DietaPredisenada[]>(() => storageService.getDiets());
  const [diseases, setDiseases] = useState<EnfermedadNutricional[]>(() => storageService.getDiseases());
  const [patients, setPatients] = useState<Paciente[]>(() => storageService.getPatients());

  // Cross-view selection for decision engine
  const [selectedPatientForDecision, setSelectedPatientForDecision] = useState<string | undefined>(
    patients[0]?.id
  );

  // Requirement: "Qué pasa al cargar la app: Registro de usuario / solo usuarios registrados con cuenta google"
  useEffect(() => {
    if (!doctor.isGoogleAuthenticated) {
      setIsLoginModalOpen(true);
    }
  }, [doctor.isGoogleAuthenticated]);

  // Auth handler
  const handleLoginSuccess = (updatedDoctor: DoctorProfile) => {
    storageService.saveDoctorProfile(updatedDoctor);
    setDoctor(updatedDoctor);
    setIsLoginModalOpen(false);
  };

  // Reset database handler
  const handleResetData = () => {
    storageService.resetToMockData();
    setFoods(storageService.getFoods());
    setNutrients(storageService.getNutrients());
    setVitamins(storageService.getVitamins());
    setDiets(storageService.getDiets());
    setDiseases(storageService.getDiseases());
    setPatients(storageService.getPatients());
  };

  // RF1: Foods CRUD
  const handleAddFood = (foodData: Omit<Alimento, 'id'>) => {
    const newFood: Alimento = { ...foodData, id: `food-${Date.now()}` };
    const updated = storageService.saveFood(newFood);
    setFoods(updated);
  };

  const handleUpdateFood = (food: Alimento) => {
    const updated = storageService.saveFood(food);
    setFoods(updated);
  };

  const handleDeleteFood = (id: string) => {
    const updated = storageService.deleteFood(id);
    setFoods(updated);
  };

  // RF2: Nutrients CRUD
  const handleAddNutrient = (nutrientData: Omit<Nutriente, 'id'>) => {
    const newNutrient: Nutriente = { ...nutrientData, id: `nutr-${Date.now()}` };
    const updated = storageService.saveNutrient(newNutrient);
    setNutrients(updated);
  };

  const handleUpdateNutrient = (nutrient: Nutriente) => {
    const updated = storageService.saveNutrient(nutrient);
    setNutrients(updated);
  };

  const handleDeleteNutrient = (id: string) => {
    const updated = storageService.deleteNutrient(id);
    setNutrients(updated);
  };

  // RF3: Vitamins & Minerals CRUD
  const handleAddVitamin = (vitData: Omit<VitaminaMineral, 'id'>) => {
    const newVit: VitaminaMineral = { ...vitData, id: `vit-${Date.now()}` };
    const updated = storageService.saveVitamin(newVit);
    setVitamins(updated);
  };

  const handleUpdateVitamin = (vit: VitaminaMineral) => {
    const updated = storageService.saveVitamin(vit);
    setVitamins(updated);
  };

  const handleDeleteVitamin = (id: string) => {
    const updated = storageService.deleteVitamin(id);
    setVitamins(updated);
  };

  // RF4: Diets CRUD
  const handleAddDiet = (dietData: Omit<DietaPredisenada, 'id'>) => {
    const newDiet: DietaPredisenada = { ...dietData, id: `diet-${Date.now()}` };
    const updated = storageService.saveDiet(newDiet);
    setDiets(updated);
  };

  const handleUpdateDiet = (diet: DietaPredisenada) => {
    const updated = storageService.saveDiet(diet);
    setDiets(updated);
  };

  const handleDeleteDiet = (id: string) => {
    const updated = storageService.deleteDiet(id);
    setDiets(updated);
  };

  // RF5: Diseases CRUD
  const handleAddDisease = (disData: Omit<EnfermedadNutricional, 'id'>) => {
    const newDis: EnfermedadNutricional = { ...disData, id: `dis-${Date.now()}` };
    const updated = storageService.saveDisease(newDis);
    setDiseases(updated);
  };

  const handleUpdateDisease = (dis: EnfermedadNutricional) => {
    const updated = storageService.saveDisease(dis);
    setDiseases(updated);
  };

  const handleDeleteDisease = (id: string) => {
    const updated = storageService.deleteDisease(id);
    setDiseases(updated);
  };

  // RF6: Patients CRUD
  const handleAddPatient = (patientData: Omit<Paciente, 'id'>) => {
    const newPatient: Paciente = { ...patientData, id: `pac-${Date.now()}` };
    const updated = storageService.savePatient(newPatient);
    setPatients(updated);
    setSelectedPatientForDecision(newPatient.id);
  };

  const handleUpdatePatient = (patient: Paciente) => {
    const updated = storageService.savePatient(patient);
    setPatients(updated);
  };

  const handleDeletePatient = (id: string) => {
    const updated = storageService.deletePatient(id);
    setPatients(updated);
    if (selectedPatientForDecision === id && updated.length > 0) {
      setSelectedPatientForDecision(updated[0].id);
    }
  };

  // Navigation from Patient Card to Clinical Decision Engine
  const handleSelectForClinicalDecision = (patient: Paciente) => {
    setSelectedPatientForDecision(patient.id);
    setActiveTab('asignacion_tratamiento');
  };

  // RF7: Assign Diet to Patient
  const handleAssignDietToPatient = (patientId: string, dietId: string, observations: string) => {
    const targetPatient = patients.find((p) => p.id === patientId);
    const targetDiet = diets.find((d) => d.id === dietId);
    if (!targetPatient || !targetDiet) return;

    const updatedPatient: Paciente = {
      ...targetPatient,
      dietaAsignada: {
        dietaId: targetDiet.id,
        nombreDieta: targetDiet.nombre,
        fechaAsignacion: new Date().toISOString().split('T')[0],
        observacionesClinicas: observations,
        activa: true,
      },
      registroEvolucion: [
        {
          fecha: new Date().toISOString().split('T')[0],
          pesoKg: targetPatient.exploracionFisica.pesoKg,
          imc: targetPatient.exploracionFisica.imc,
          observacionesMedicas: `Asignación de pauta: ${targetDiet.nombre}. ${observations}`,
          adherenciaDieta: 'Buena',
        },
        ...(targetPatient.registroEvolucion || []),
      ],
    };

    const updatedPatients = storageService.savePatient(updatedPatient);
    setPatients(updatedPatients);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans selection:bg-emerald-500/20 selection:text-emerald-900">
      {/* Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        doctor={doctor}
        onOpenDoctorModal={() => setIsLoginModalOpen(true)}
        onResetData={handleResetData}
        patientCount={patients.length}
        dietCount={diets.length}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {/* Group 1: Gestión catálogos (alimentos, nutrientes, vitaminas, dietas, enfermedades nutricionales) */}
        {activeTab === 'catalogos' && (
          <CatalogsManagement
            foods={foods}
            nutrients={nutrients}
            vitamins={vitamins}
            diets={diets}
            diseases={diseases}
            onAddFood={handleAddFood}
            onUpdateFood={handleUpdateFood}
            onDeleteFood={handleDeleteFood}
            onAddNutrient={handleAddNutrient}
            onUpdateNutrient={handleUpdateNutrient}
            onDeleteNutrient={handleDeleteNutrient}
            onAddVitamin={handleAddVitamin}
            onUpdateVitamin={handleUpdateVitamin}
            onDeleteVitamin={handleDeleteVitamin}
            onAddDiet={handleAddDiet}
            onUpdateDiet={handleUpdateDiet}
            onDeleteDiet={handleDeleteDiet}
            onAddDisease={handleAddDisease}
            onUpdateDisease={handleUpdateDisease}
            onDeleteDisease={handleDeleteDisease}
          />
        )}

        {/* Group 2: Análisis de historia clínica */}
        {activeTab === 'historia_clinica' && (
          <PatientManagement
            patients={patients}
            diets={diets}
            diseases={diseases}
            foods={foods}
            onAddPatient={handleAddPatient}
            onUpdatePatient={handleUpdatePatient}
            onDeletePatient={handleDeletePatient}
            onSelectForClinicalDecision={handleSelectForClinicalDecision}
          />
        )}

        {/* Group 3: Asignación de tratamiento */}
        {activeTab === 'asignacion_tratamiento' && (
          <DecisionEngineView
            patients={patients}
            diets={diets}
            diseases={diseases}
            foods={foods}
            selectedPatientId={selectedPatientForDecision}
            onAssignDietToPatient={handleAssignDietToPatient}
          />
        )}
      </main>

      {/* Footer in Light Style */}
      <footer className="border-t border-slate-200 bg-white py-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="font-medium">
            Dietas al Día — Plataforma Clínica para Médicos Nutricionistas & Soporte Terapéutico
          </p>
          <p className="text-[11px] text-slate-400">
            PWA Progresiva con almacenamiento local cifrado y soporte sin conexión
          </p>
        </div>
      </footer>

      {/* Offline Status Toast */}
      <OfflineIndicator />

      {/* Google Login & Registration Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        currentDoctor={doctor}
        onLoginSuccess={handleLoginSuccess}
        isMandatoryInitial={!doctor.isGoogleAuthenticated}
      />
    </div>
  );
}
