import {
  Alimento,
  Nutriente,
  VitaminaMineral,
  DietaPredisenada,
  EnfermedadNutricional,
  Paciente,
  DoctorProfile,
} from '../types';
import {
  INITIAL_DOCTOR,
  INITIAL_FOODS,
  INITIAL_NUTRIENTS,
  INITIAL_VITAMINS_MINERALS,
  INITIAL_DIETS,
  INITIAL_DISEASES,
  INITIAL_PATIENTS,
} from '../data/mockData';

const KEYS = {
  DOCTOR: 'dietas_al_dia_doctor',
  FOODS: 'dietas_al_dia_foods',
  NUTRIENTS: 'dietas_al_dia_nutrients',
  VITAMINS: 'dietas_al_dia_vitamins',
  DIETS: 'dietas_al_dia_diets',
  DISEASES: 'dietas_al_dia_diseases',
  PATIENTS: 'dietas_al_dia_patients',
  AUTH_TOKEN: 'dietas_al_dia_auth',
};

function getFromStorage<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(key);
    if (!item) return fallback;
    return JSON.parse(item);
  } catch (e) {
    console.warn(`Error reading ${key} from storage, using fallback:`, e);
    return fallback;
  }
}

function saveToStorage<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error(`Error saving ${key} to storage:`, e);
  }
}

export const StorageService = {
  // Doctor profile & auth
  getDoctor(): DoctorProfile {
    return getFromStorage<DoctorProfile>(KEYS.DOCTOR, INITIAL_DOCTOR);
  },
  saveDoctor(doctor: DoctorProfile): void {
    saveToStorage(KEYS.DOCTOR, doctor);
  },
  getDoctorProfile(): DoctorProfile {
    return this.getDoctor();
  },
  saveDoctorProfile(doctor: DoctorProfile): void {
    this.saveDoctor(doctor);
  },
  isLoggedIn(): boolean {
    const doc = this.getDoctor();
    return Boolean(doc && doc.isGoogleAuthenticated);
  },
  logoutDoctor(): void {
    const current = this.getDoctor();
    this.saveDoctor({ ...current, isGoogleAuthenticated: false });
  },

  // Alimentos
  getFoods(): Alimento[] {
    return getFromStorage<Alimento[]>(KEYS.FOODS, INITIAL_FOODS);
  },
  saveFoods(foods: Alimento[]): void {
    saveToStorage(KEYS.FOODS, foods);
  },
  saveFood(food: Alimento): Alimento[] {
    const foods = this.getFoods();
    const index = foods.findIndex((f) => f.id === food.id);
    let updated: Alimento[];
    if (index >= 0) {
      updated = foods.map((f) => (f.id === food.id ? food : f));
    } else {
      updated = [food, ...foods];
    }
    this.saveFoods(updated);
    return updated;
  },
  addFood(food: Omit<Alimento, 'id'>): Alimento {
    const newFood: Alimento = { ...food, id: `alim-${Date.now()}` };
    this.saveFood(newFood);
    return newFood;
  },
  updateFood(updated: Alimento): void {
    this.saveFood(updated);
  },
  deleteFood(id: string): Alimento[] {
    const foods = this.getFoods().filter((f) => f.id !== id);
    this.saveFoods(foods);
    return foods;
  },

  // Nutrientes
  getNutrients(): Nutriente[] {
    return getFromStorage<Nutriente[]>(KEYS.NUTRIENTS, INITIAL_NUTRIENTS);
  },
  saveNutrients(nutrients: Nutriente[]): void {
    saveToStorage(KEYS.NUTRIENTS, nutrients);
  },
  saveNutrient(nutrient: Nutriente): Nutriente[] {
    const list = this.getNutrients();
    const index = list.findIndex((n) => n.id === nutrient.id);
    let updated: Nutriente[];
    if (index >= 0) {
      updated = list.map((n) => (n.id === nutrient.id ? nutrient : n));
    } else {
      updated = [nutrient, ...list];
    }
    this.saveNutrients(updated);
    return updated;
  },
  addNutrient(nutrient: Omit<Nutriente, 'id'>): Nutriente {
    const item: Nutriente = { ...nutrient, id: `nutr-${Date.now()}` };
    this.saveNutrient(item);
    return item;
  },
  updateNutrient(updated: Nutriente): void {
    this.saveNutrient(updated);
  },
  deleteNutrient(id: string): Nutriente[] {
    const list = this.getNutrients().filter((n) => n.id !== id);
    this.saveNutrients(list);
    return list;
  },

  // Vitaminas y Minerales
  getVitamins(): VitaminaMineral[] {
    return getFromStorage<VitaminaMineral[]>(KEYS.VITAMINS, INITIAL_VITAMINS_MINERALS);
  },
  saveVitamins(vitamins: VitaminaMineral[]): void {
    saveToStorage(KEYS.VITAMINS, vitamins);
  },
  saveVitamin(vitamin: VitaminaMineral): VitaminaMineral[] {
    const list = this.getVitamins();
    const index = list.findIndex((v) => v.id === vitamin.id);
    let updated: VitaminaMineral[];
    if (index >= 0) {
      updated = list.map((v) => (v.id === vitamin.id ? vitamin : v));
    } else {
      updated = [vitamin, ...list];
    }
    this.saveVitamins(updated);
    return updated;
  },
  addVitamin(vitamin: Omit<VitaminaMineral, 'id'>): VitaminaMineral {
    const item: VitaminaMineral = { ...vitamin, id: `vit-${Date.now()}` };
    this.saveVitamin(item);
    return item;
  },
  updateVitamin(updated: VitaminaMineral): void {
    this.saveVitamin(updated);
  },
  deleteVitamin(id: string): VitaminaMineral[] {
    const list = this.getVitamins().filter((v) => v.id !== id);
    this.saveVitamins(list);
    return list;
  },

  // Dietas Prediseñadas
  getDiets(): DietaPredisenada[] {
    return getFromStorage<DietaPredisenada[]>(KEYS.DIETS, INITIAL_DIETS);
  },
  saveDiets(diets: DietaPredisenada[]): void {
    saveToStorage(KEYS.DIETS, diets);
  },
  saveDiet(diet: DietaPredisenada): DietaPredisenada[] {
    const list = this.getDiets();
    const index = list.findIndex((d) => d.id === diet.id);
    let updated: DietaPredisenada[];
    if (index >= 0) {
      updated = list.map((d) => (d.id === diet.id ? diet : d));
    } else {
      updated = [diet, ...list];
    }
    this.saveDiets(updated);
    return updated;
  },
  addDiet(diet: Omit<DietaPredisenada, 'id'>): DietaPredisenada {
    const item: DietaPredisenada = { ...diet, id: `dieta-${Date.now()}` };
    this.saveDiet(item);
    return item;
  },
  updateDiet(updated: DietaPredisenada): void {
    this.saveDiet(updated);
  },
  deleteDiet(id: string): DietaPredisenada[] {
    const list = this.getDiets().filter((d) => d.id !== id);
    this.saveDiets(list);
    return list;
  },

  // Enfermedades Nutricionales
  getDiseases(): EnfermedadNutricional[] {
    return getFromStorage<EnfermedadNutricional[]>(KEYS.DISEASES, INITIAL_DISEASES);
  },
  saveDiseases(diseases: EnfermedadNutricional[]): void {
    saveToStorage(KEYS.DISEASES, diseases);
  },
  saveDisease(disease: EnfermedadNutricional): EnfermedadNutricional[] {
    const list = this.getDiseases();
    const index = list.findIndex((d) => d.id === disease.id);
    let updated: EnfermedadNutricional[];
    if (index >= 0) {
      updated = list.map((d) => (d.id === disease.id ? disease : d));
    } else {
      updated = [disease, ...list];
    }
    this.saveDiseases(updated);
    return updated;
  },
  addDisease(disease: Omit<EnfermedadNutricional, 'id'>): EnfermedadNutricional {
    const item: EnfermedadNutricional = { ...disease, id: `enf-${Date.now()}` };
    this.saveDisease(item);
    return item;
  },
  updateDisease(updated: EnfermedadNutricional): void {
    this.saveDisease(updated);
  },
  deleteDisease(id: string): EnfermedadNutricional[] {
    const list = this.getDiseases().filter((d) => d.id !== id);
    this.saveDiseases(list);
    return list;
  },

  // Pacientes (Historias Clínicas)
  getPatients(): Paciente[] {
    return getFromStorage<Paciente[]>(KEYS.PATIENTS, INITIAL_PATIENTS);
  },
  savePatients(patients: Paciente[]): void {
    saveToStorage(KEYS.PATIENTS, patients);
  },
  savePatient(patient: Paciente): Paciente[] {
    const list = this.getPatients();
    const index = list.findIndex((p) => p.id === patient.id);
    let updated: Paciente[];
    if (index >= 0) {
      updated = list.map((p) => (p.id === patient.id ? patient : p));
    } else {
      updated = [patient, ...list];
    }
    this.savePatients(updated);
    return updated;
  },
  addPatient(patient: Omit<Paciente, 'id'>): Paciente {
    const item: Paciente = { ...patient, id: `pac-${Date.now()}` };
    this.savePatient(item);
    return item;
  },
  updatePatient(updated: Paciente): void {
    this.savePatient(updated);
  },
  deletePatient(id: string): Paciente[] {
    const list = this.getPatients().filter((p) => p.id !== id);
    this.savePatients(list);
    return list;
  },

  // Reset to default baseline mock data
  resetToMockData(): void {
    localStorage.removeItem(KEYS.FOODS);
    localStorage.removeItem(KEYS.NUTRIENTS);
    localStorage.removeItem(KEYS.VITAMINS);
    localStorage.removeItem(KEYS.DIETS);
    localStorage.removeItem(KEYS.DISEASES);
    localStorage.removeItem(KEYS.PATIENTS);
    localStorage.removeItem(KEYS.DOCTOR);
  },
  resetToDefaults(): void {
    this.resetToMockData();
  },
};

export const storageService = StorageService;
