"use client";

import React, { useState, useEffect, ReactNode } from 'react';

// --- Types ---

type StepId =
  // Stage 1
  | 'stage_1_whatsapp_type'
  | 'stage_1_migrate_warning'

  // Stage 2
  | 'stage_2_devices'
  | 'stage_2_no_computer'
  | 'stage_2_no_computer_support'
  | 'stage_2_computer_no_mobile'
  | 'stage_2_tablet_check'
  | 'stage_2_os_selection'

  // Stage 3
  | 'stage_3_traffic_check'
  | 'stage_3_traffic_source'
  | 'stage_3_any_facebook'
  | 'stage_3_meta_access_check'
  | 'stage_3_meta_access_uncertain'
  | 'stage_3_meta_lost_access'
  | 'stage_3_meta_lost_access_options'
  | 'stage_3_meta_lost_access_path_2'

  // Existing Connection Steps
  | 'step_inside_system'
  | 'step_check_tabs_mac'
  | 'step_check_tabs_windows'
  | 'step_connection_start'
  | 'step_model_1'
  | 'step_model_2'

  // Model 2 Branching Paths
  | 'step_model_2_sim'
  | 'step_model_2_nao_iphone'
  | 'step_model_2_nao_android'
  | 'step_model_2_novo_numero'
  | 'step_model_2_fuso'
  | 'step_model_2_conclusao';

type DeviceState = {
  computer: boolean;
  computerType?: 'mac' | 'windows';
  mobile: boolean;
  mobileType?: 'iphone' | 'android';
  tablet: boolean;
};

// --- Components ---

const WhatsAppBusinessIcon = () => (
  <img
    src="https://d1yjjnpx0p53s8.cloudfront.net/styles/logo-original-577x577/s3/032025/logo_whatsapp_business_mar2025_pd-01_1.png?qAYqarqvmykXVFDTPg2ceTtauvnouyAc&itok=hrGxxtSh"
    alt="WhatsApp Business"
    className="w-10 h-10 object-contain"
    style={{
      width: '50px',
      height: '50px',
      marginLeft: '-5px'
    }}
  />
);

const WhatsAppCommonIcon = () => (
  // Simple FontAwesome-like SVG representation
  <svg className="w-10 h-10 text-green-500" fill="currentColor" viewBox="0 0 448 512">
    <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z" />
  </svg>
);

// --- Icons ---

const AppleIcon = () => (
  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 384 512">
    <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 52.3-11.4 69.5-34.3z" />
  </svg>
);

const WindowsIcon = () => (
  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 448 512">
    <path d="M0 93.7l183.6-25.3v177.4H0V93.7zm0 324.6l183.6 25.3V268.4H0v149.9zm203.8 28L448 480V268.4H203.8v177.9zm0-380.6v180.1H448V32L203.8 65.7z" />
  </svg>
);

const AndroidIcon = () => (
  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 576 512">
    <path d="M420.55,301.93a24,24,0,1,1,24-24,24,24,0,0,1-24,24m-265.1,0a24,24,0,1,1,24-24,24,24,0,0,1-24,24m273.7-144.48,47.94-83a10,10,0,1,0-17.36-10l-48.53,84.07a219.04,219.04,0,0,0-246.4,0l-48.53-84.07a10,10,0,1,0-17.36,10l47.94,83C64.53,202.22,8.24,285.55,0,384H576c-8.24-98.45-64.54-181.78-146.85-226.55" />
  </svg>
);


// --- Desktop Design System Helpers ---

type StageLayoutOptions = {
  width?: 'sm' | 'md' | 'lg' | 'xl';
  padding?: 'snug' | 'roomy' | 'airy';
  align?: 'start' | 'center';
};

const stageOneSteps: StepId[] = ['stage_1_whatsapp_type', 'stage_1_migrate_warning'];
const stageTwoSteps: StepId[] = [
  'stage_2_devices',
  'stage_2_no_computer',
  'stage_2_no_computer_support',
  'stage_2_computer_no_mobile',
  'stage_2_tablet_check',
  'stage_2_os_selection',
];
const stageThreeSteps: StepId[] = [
  'stage_3_traffic_check',
  'stage_3_traffic_source',
  'stage_3_any_facebook',
  'stage_3_meta_access_check',
  'stage_3_meta_access_uncertain',
  'stage_3_meta_lost_access',
  'stage_3_meta_lost_access_options',
  'stage_3_meta_lost_access_path_2',
];
const guidedSteps: StepId[] = [
  'step_inside_system',
  'step_check_tabs_mac',
  'step_check_tabs_windows',
  'step_connection_start',
  'step_model_1',
  'step_model_2',
  'step_model_2_sim',
  'step_model_2_nao_iphone',
  'step_model_2_nao_android',
  'step_model_2_novo_numero',
  'step_model_2_fuso',
  'step_model_2_conclusao',
];

type StageMeta = {
  id: string;
  title: string;
  description: string;
  icon: string;
  steps: StepId[];
};

const WIZARD_STAGES: StageMeta[] = [
  {
    id: 'stage-whatsapp',
    title: 'Tipo de WhatsApp',
    description: 'Validamos se o seu número está no aplicativo correto antes da conexão.',
    icon: '💬',
    steps: stageOneSteps,
  },
  {
    id: 'stage-devices',
    title: 'Ambiente e dispositivos',
    description: 'Garantimos que você tem computador, celular e sistemas prontos para conectar.',
    icon: '🖥️',
    steps: stageTwoSteps,
  },
  {
    id: 'stage-traffic',
    title: 'Tráfego e Meta',
    description: 'Checamos regras de anúncios e acessos ao Facebook/Meta Ads.',
    icon: '📣',
    steps: stageThreeSteps,
  },
  {
    id: 'stage-connect',
    title: 'Conexão guiada',
    description: 'Mostramos telas reais e cada clique para finalizar o processo.',
    icon: '🟢',
    steps: guidedSteps,
  },
];

const STEP_LAYOUT: Partial<Record<StepId, StageLayoutOptions>> = {};

const assignLayout = (steps: StepId[], layout: StageLayoutOptions) => {
  steps.forEach(step => {
    STEP_LAYOUT[step] = layout;
  });
};

assignLayout(stageOneSteps, { width: 'xl', padding: 'airy', align: 'start' });
assignLayout(stageTwoSteps, { width: 'xl', padding: 'roomy', align: 'start' });
assignLayout(stageThreeSteps, { width: 'lg', padding: 'roomy', align: 'center' });
assignLayout(guidedSteps, { width: 'xl', padding: 'airy', align: 'center' });

const compactDeviceSteps: StepId[] = [
  'stage_2_no_computer',
  'stage_2_no_computer_support',
  'stage_2_computer_no_mobile',
  'stage_2_tablet_check',
];

assignLayout(compactDeviceSteps, { width: 'sm', padding: 'snug', align: 'center' });

const DEFAULT_LAYOUT: StageLayoutOptions = { width: 'lg', padding: 'roomy', align: 'start' };

type StageSurfaceProps = StageLayoutOptions & { children: ReactNode };

const StageSurface = ({ children, width = 'md', padding = 'roomy', align = 'start' }: StageSurfaceProps) => {
  const widthMap: Record<NonNullable<StageLayoutOptions['width']>, string> = {
    sm: 'max-w-xl',
    md: 'max-w-2xl',
    lg: 'max-w-3xl',
    xl: 'max-w-4xl',
  };

  const paddingMap: Record<NonNullable<StageLayoutOptions['padding']>, string> = {
    snug: 'py-6',
    roomy: 'py-8',
    airy: 'py-12',
  };

  const alignment = align === 'center' ? 'text-center' : 'text-left';

  return (
    <div className={`animate-fadeIn w-full ${widthMap[width]} mx-auto ${paddingMap[padding]} ${alignment}`}>
      {children}
    </div>
  );
};

// --- Main Component ---

export default function ConnectionWizardPage() {
  const [currentStep, setCurrentStep] = useState<StepId>('stage_1_whatsapp_type');
  const [devices, setDevices] = useState<DeviceState>({
    computer: false,
    tablet: false,
    mobile: false,
  });
  const [showMobileWarning, setShowMobileWarning] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [receivedMessage, setReceivedMessage] = useState<boolean | null>(null);
  const [cameFromModel1, setCameFromModel1] = useState(false);
  const [stepHistory, setStepHistory] = useState<StepId[]>(['stage_1_whatsapp_type']);

  // Calculate progress: starts at 0% on first step, then each step adds 40% of remaining space
  const calculateProgress = () => {
    const uniqueSteps = Array.from(new Set(stepHistory));
    // First step shows 0%
    if (uniqueSteps.length <= 1) return 0;
    
    let progress = 0;
    // Start from index 1 (second step) since first step is 0%
    for (let i = 1; i < uniqueSteps.length; i++) {
      const remaining = 100 - progress;
      progress += remaining * 0.4;
    }
    return Math.min(progress, 100);
  };

  // Helpers to persist choices
  // Using a simple ref or state for quick access in session
  const saveChoice = (key: string, value: string) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(`wizard_${key}`, value);
    }
  };

  const goToStep = (step: StepId, initialSlide: number = 0) => {
    setCurrentStep(step);
    setCurrentSlide(initialSlide);
    setStepHistory(prev => [...prev, step]);
    window.scrollTo(0, 0);
  };

  const nextSlide = () => {
    setCurrentSlide(prev => prev + 1);
    window.scrollTo(0, 0);
  };

  const prevSlide = () => {
    setCurrentSlide(prev => prev - 1);
    window.scrollTo(0, 0);
  };

  const handleDeviceChange = (device: keyof DeviceState) => {
    setDevices(prev => ({ ...prev, [device]: !prev[device] }));
  };

  // Auto-redirect for no-computer support page
  useEffect(() => {
    if (currentStep === 'stage_2_no_computer_support') {
      const timer = setTimeout(() => {
        window.location.href = 'https://wa.me/5511975211053?text=Eu%20preciso%20de%20ajuda%2C%20porque%20eu%20n%C3%A3o%20possuo%20um%20computador%20para%20a%20conex%C3%A3o.';
      }, 10000);
      return () => clearTimeout(timer);
    }
  }, [currentStep]);

  // --- Step Rendering ---

  const renderStepBody = (): ReactNode => {
    switch (currentStep) {

      // --- STAGE 1: WhatsApp Type ---

      case 'stage_1_whatsapp_type':
        return (
          <div className="space-y-8">
            <p className="text-xl sm:text-2xl text-gray-600 text-center">
              O número de WhatsApp que você gostaria de conectar está em um:
            </p>

            <div className="grid gap-4 max-w-md mx-auto">
              <button
                onClick={() => goToStep('stage_2_devices')}
                className="flex items-center gap-4 p-6 border border-gray-200 rounded-lg hover:border-gray-900 transition-all text-left group"
              >
                <WhatsAppBusinessIcon />
                <div className="flex-1">
                  <div className="text-xl sm:text-2xl font-medium text-gray-900">WhatsApp Business</div>
                  <div className="text-base sm:text-lg text-gray-500">Versão profissional</div>
                </div>
                <div className="w-5 h-5 rounded-full border-2 border-gray-300 group-hover:border-gray-900 group-hover:bg-gray-900 transition-all" />
              </button>

              <button
                onClick={() => goToStep('stage_1_migrate_warning')}
                className="flex items-center gap-4 p-6 border border-gray-200 rounded-lg hover:border-gray-400 transition-all text-left group"
              >
                <WhatsAppCommonIcon />
                <div className="flex-1">
                  <div className="text-xl sm:text-2xl font-medium text-gray-900">WhatsApp Comum</div>
                  <div className="text-base sm:text-lg text-gray-500">Versão pessoal</div>
                </div>
                <div className="w-5 h-5 rounded-full border-2 border-gray-300 group-hover:border-gray-400 transition-all" />
              </button>
            </div>
          </div>
        );

      case 'stage_1_migrate_warning':
        return (
          <div className="space-y-8 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-yellow-50 border border-yellow-200">
              <svg className="w-10 h-10 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            
            <div className="space-y-4">
              <h2 className="text-2xl sm:text-3xl font-medium text-gray-900">Necessário Migrar para Business</h2>
              <p className="text-xl sm:text-2xl text-gray-600 max-w-lg mx-auto">
                Para usar nosso sistema, você <strong>precisa</strong> estar utilizando o WhatsApp Business (profissional).
                Por favor, ao migrar para o WhatsApp Business (profissional) certifique-se de que suas conversas estão sendo migradas juntas.
              </p>
            </div>

            <button
              onClick={() => goToStep('stage_1_whatsapp_type')}
              className="px-8 py-3 bg-gray-900 text-white text-lg sm:text-xl rounded-lg hover:bg-gray-800 transition-colors"
            >
              Voltar
            </button>
          </div>
        );

      // --- STAGE 2: Devices ---

      case 'stage_2_devices':
        return (
          <div className="space-y-8">
            <p className="text-xl sm:text-2xl text-gray-600 text-center">
              Quais dispositivos você tem disponível agora?
            </p>

            <div className="space-y-6 max-w-md mx-auto">
              <div className="grid grid-cols-2 gap-4">
                <label className={`relative flex flex-col items-center p-6 border rounded-lg cursor-pointer transition-all ${
                  devices.computer ? 'border-gray-900 bg-gray-50' : 'border-gray-200 hover:border-gray-400'
                }`}>
                  <input
                    type="checkbox"
                    className="absolute opacity-0"
                    checked={devices.computer}
                    onChange={() => handleDeviceChange('computer')}
                  />
                  <div className="text-4xl mb-3">💻</div>
                  <span className="text-lg sm:text-xl font-medium text-gray-900 text-center">Computador</span>
                </label>

                <label className={`relative flex flex-col items-center p-6 border rounded-lg cursor-pointer transition-all ${
                  devices.mobile ? 'border-gray-900 bg-gray-50' : 'border-gray-200 hover:border-gray-400'
                }`}>
                  <input
                    type="checkbox"
                    className="absolute opacity-0"
                    checked={devices.mobile}
                    onChange={() => handleDeviceChange('mobile')}
                  />
                  <div className="text-4xl mb-3">📱</div>
                  <span className="text-lg sm:text-xl font-medium text-gray-900">Celular</span>
                </label>

                <label className={`relative flex flex-col items-center p-6 border rounded-lg cursor-pointer transition-all col-span-2 ${
                  devices.tablet ? 'border-gray-900 bg-gray-50' : 'border-gray-200 hover:border-gray-400'
                }`}>
                  <input
                    type="checkbox"
                    className="absolute opacity-0"
                    checked={devices.tablet}
                    onChange={() => handleDeviceChange('tablet')}
                  />
                  <div className="text-4xl mb-3 rotate-90">📱</div>
                  <span className="text-lg sm:text-xl font-medium text-gray-900">Tablet / iPad</span>
                </label>
              </div>

              <button
                onClick={() => {
                  if (!devices.computer) {
                    goToStep('stage_2_no_computer');
                  } else if (!devices.mobile) {
                    if (devices.tablet) {
                      goToStep('stage_2_tablet_check');
                    } else {
                      goToStep('stage_2_computer_no_mobile');
                    }
                  } else {
                    goToStep('stage_2_os_selection');
                  }
                }}
                disabled={!devices.computer && !devices.mobile && !devices.tablet}
                className="w-full px-6 py-3 bg-gray-900 text-white text-lg sm:text-xl rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                Continuar
              </button>
            </div>
          </div>
        );

      case 'stage_2_os_selection':
        return (
          <div className="space-y-8 max-w-md mx-auto">
            {devices.computer && (
              <div className="space-y-4">
                <p className="text-xl sm:text-2xl text-gray-600 text-center">
                  {devices.mobile || devices.tablet ? '1. ' : ''}Qual o sistema do seu computador?
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => setDevices(prev => ({ ...prev, computerType: 'mac' }))}
                    className={`flex flex-col items-center gap-3 p-6 border rounded-lg transition-all ${
                      devices.computerType === 'mac'
                        ? 'border-gray-900 bg-gray-50'
                        : 'border-gray-200 hover:border-gray-400'
                    }`}
                  >
                    <AppleIcon />
                    <span className="text-lg sm:text-xl font-medium">Mac / Apple</span>
                  </button>
                  <button
                    onClick={() => setDevices(prev => ({ ...prev, computerType: 'windows' }))}
                    className={`flex flex-col items-center gap-3 p-6 border rounded-lg transition-all ${
                      devices.computerType === 'windows'
                        ? 'border-gray-900 bg-gray-50'
                        : 'border-gray-200 hover:border-gray-400'
                    }`}
                  >
                    <WindowsIcon />
                    <span className="text-lg sm:text-xl font-medium">Windows</span>
                  </button>
                </div>
              </div>
            )}

            {(devices.mobile || devices.tablet) && (
              <div className="space-y-4">
                <p className="text-xl sm:text-2xl text-gray-600 text-center">
                  {devices.computer ? '2. ' : ''}O aparelho <strong>onde está</strong> o WhatsApp Business é um:
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => setDevices(prev => ({ ...prev, mobileType: 'android' }))}
                    className={`flex flex-col items-center gap-3 p-6 border rounded-lg transition-all ${
                      devices.mobileType === 'android'
                        ? 'border-gray-900 bg-gray-50'
                        : 'border-gray-200 hover:border-gray-400'
                    }`}
                  >
                    <AndroidIcon />
                    <span className="text-lg sm:text-xl font-medium">Android</span>
                  </button>
                  <button
                    onClick={() => setDevices(prev => ({ ...prev, mobileType: 'iphone' }))}
                    className={`flex flex-col items-center gap-3 p-6 border rounded-lg transition-all ${
                      devices.mobileType === 'iphone'
                        ? 'border-gray-900 bg-gray-50'
                        : 'border-gray-200 hover:border-gray-400'
                    }`}
                  >
                    <AppleIcon />
                    <span className="text-lg sm:text-xl font-medium">iPhone</span>
                  </button>
                </div>
              </div>
            )}

            <button
              onClick={() => goToStep('stage_3_traffic_check')}
              disabled={(devices.computer && !devices.computerType) || ((devices.mobile || devices.tablet) && !devices.mobileType)}
              className="w-full px-6 py-3 bg-gray-900 text-white text-lg sm:text-xl rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              Continuar
            </button>
            {((devices.computer && !devices.computerType) || ((devices.mobile || devices.tablet) && !devices.mobileType)) && (
              <p className="text-base sm:text-lg text-gray-400 text-center">Selecione os sistemas para continuar</p>
            )}
          </div>
        );

      case 'stage_2_no_computer':
        return (
          <div className="space-y-4 text-center animate-fadeIn max-w-xl mx-auto">
            <div className="bg-red-50 p-5 rounded-2xl border border-red-100">
              <h3 className="text-xl sm:text-2xl font-bold text-red-900 mb-3">Computador é Obrigatório</h3>
              <p className="text-red-700 mb-5 text-lg sm:text-xl">
                Para realizar a configuração inicial com segurança e estabilidade, <strong>o Facebook exige</strong> o uso de um computador ou notebook.
              </p>

              <div className="space-y-2">
                <button
                  onClick={() => {
                    setDevices(prev => ({ ...prev, computer: true }));
                    goToStep('stage_2_devices');
                  }}
                  className="w-full py-3 bg-gray-900 text-white font-bold rounded-xl hover:bg-gray-800 transition-colors shadow-sm flex items-center justify-center gap-2 text-lg sm:text-xl"
                >
                  💻 Agora consegui um computador
                </button>

                <button
                  onClick={() => {
                    setDevices(prev => ({ ...prev, computer: true }));
                    goToStep('stage_2_devices');
                  }}
                  className="w-full py-3 bg-white text-gray-700 font-medium rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors text-lg sm:text-xl"
                >
                  Não tenho aqui agora, mas vou arranjar
                </button>

                <button
                  onClick={() => goToStep('stage_2_no_computer_support')}
                  className="w-full py-3 bg-white text-gray-600 font-medium rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors text-lg sm:text-xl"
                >
                  Não tenho computador, nem aqui agora e nem terei depois.
                </button>
              </div>
            </div>
            <button onClick={() => goToStep('stage_2_devices')} className="text-gray-500 hover:text-gray-800 underline text-base sm:text-lg">Voltar</button>
          </div>
        );

      case 'stage_2_no_computer_support':
        return (
          <div className="space-y-4 text-center animate-fadeIn max-w-xl mx-auto">
            <div className="bg-white p-5 rounded-2xl border-2 border-gray-200">
              <div className="text-4xl mb-3">💬</div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">Nesse caso te ajudaremos com isso.</h2>
              <p className="text-gray-600 mb-4 text-lg sm:text-xl">
                Fale que não possui computador para nosso suporte que providenciaremos o mais rápido possível um especialista pra te ajudar.
              </p>
              <p className="text-base sm:text-lg text-gray-500 mb-4">
                Você será redirecionado automaticamente em 10 segundos...
              </p>
              <a
                href="https://wa.me/5511975211053?text=Eu%20preciso%20de%20ajuda%2C%20porque%20eu%20n%C3%A3o%20possuo%20um%20computador%20para%20a%20conex%C3%A3o."
                className="inline-block w-full py-3 bg-gray-900 text-white font-bold rounded-xl hover:bg-gray-800 transition-colors text-lg sm:text-xl"
              >
                Abrir Chat de Suporte Agora
              </a>
            </div>
            <button onClick={() => goToStep('stage_2_no_computer')} className="text-gray-500 hover:text-gray-800 underline text-base sm:text-lg">Voltar</button>
          </div>
        );

      case 'stage_2_computer_no_mobile':
        return (
          <div className="space-y-4 text-center animate-fadeIn max-w-xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">É preciso que você esteja com o aparelho que está o WhatsApp Business (profissional) em mãos para continuar a conexão.</h2>
            <div className="grid gap-2 pt-3">
              <button
                onClick={() => {
                  setDevices(prev => ({ ...prev, mobile: true }));
                  goToStep('stage_2_os_selection');
                }}
                className="w-full py-3 bg-gray-900 text-white font-bold rounded-xl hover:bg-gray-800 transition-colors text-lg sm:text-xl"
              >
                Estou com o aparelho que está o WhatsApp Business (profissional) agora.
              </button>
              <button
                onClick={() => setShowMobileWarning(true)}
                className="w-full py-3 bg-white text-gray-700 border-2 border-dashed border-gray-300 font-bold rounded-xl hover:bg-gray-50 transition-colors text-lg sm:text-xl"
              >
                Realmente não estou com ele agora
              </button>
              {showMobileWarning && (
                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-xl text-yellow-800 text-base sm:text-lg animate-pulse">
                  ⚠️ Por favor, busque o aparelho com o WhatsApp Business (profissional) com o número que deseja conectar para continuar.
                </div>
              )}
            </div>
            <button onClick={() => goToStep('stage_2_devices')} className="text-gray-500 hover:text-gray-800 underline mt-3 text-base sm:text-lg">Voltar</button>
          </div>
        );

      case 'stage_2_tablet_check':
        return (
          <div className="space-y-4 text-center animate-fadeIn max-w-xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">O WhatsApp Business (profissional) que você quer conectar está neste Tablet/iPad?</h2>
            <div className="grid gap-2 pt-3">
              <button
                onClick={() => goToStep('stage_2_os_selection')}
                className="w-full py-3 bg-gray-900 text-white font-bold rounded-xl hover:bg-gray-800 transition-colors shadow-sm text-lg sm:text-xl"
              >
                Sim, uso o WhatsApp Business (profissional) nesse tablet/ipad.
              </button>
              <button
                onClick={() => goToStep('stage_2_computer_no_mobile')}
                className="w-full py-3 bg-white text-gray-700 border border-gray-300 font-bold rounded-xl hover:bg-gray-50 transition-colors text-lg sm:text-xl"
              >
                Na verdade o aparelho que está com o WhatsApp Business (profissional) não está comigo agora.
              </button>
            </div>
            <button onClick={() => goToStep('stage_2_devices')} className="text-gray-500 hover:text-gray-800 underline mt-3 text-base sm:text-lg">Voltar</button>
          </div>
        );


      // --- STAGE 3: Traffic & Meta Logic ---

      case 'stage_3_traffic_check':
        return (
          <div className="space-y-5 animate-fadeIn max-w-xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center">Aperfeiçoando o melhor caminho para sua conexão...</h2>
            <p className="text-xl sm:text-2xl text-gray-600 text-center">
              Você roda tráfego pago <strong>direcionado para o número que você deseja conectar</strong>?
            </p>

            <div className="space-y-3">
              <button
                onClick={() => {
                  saveChoice('runs_ads', 'false_other_number');
                  goToStep('stage_3_any_facebook');
                }}
                className="w-full p-4 border-2 border-gray-100 bg-white rounded-xl text-left hover:border-gray-400 hover:bg-gray-50 transition-all group"
              >
                <span className="block text-lg sm:text-xl font-bold text-gray-900 mb-1">Sim, mas <strong>não</strong> para esse número que desejo conectar</span>
                <span className="text-gray-600 text-base sm:text-lg">Faço anúncios para outro número</span>
              </button>

              <button
                onClick={() => {
                  saveChoice('runs_ads', 'true');
                  goToStep('stage_3_traffic_source');
                }}
                className="w-full p-4 border-2 border-gray-200 bg-gray-50 rounded-xl text-left hover:border-gray-900 hover:bg-gray-100 transition-all group"
              >
                <span className="block text-lg sm:text-xl font-bold text-gray-900 mb-1">Sim, faço anúncios para este número que desejo conectar</span>
                <span className="text-gray-600 text-base sm:text-lg">Os anúncios são direcionados para esse número específico</span>
              </button>

              <button
                onClick={() => {
                  saveChoice('runs_ads', 'used_to_run');
                  goToStep('stage_3_traffic_source');
                }}
                className="w-full p-4 border-2 border-gray-100 bg-white rounded-xl text-left hover:border-gray-400 hover:bg-gray-50 transition-all group"
              >
                <span className="block text-lg sm:text-xl font-bold text-gray-900 mb-1">Já fiz para esse número, mas hoje não faço mais</span>
                <span className="text-gray-600 text-base sm:text-lg">Rodei anúncios no passado para este número</span>
              </button>

              <button
                onClick={() => {
                  saveChoice('runs_ads', 'false');
                  goToStep('stage_3_any_facebook');
                }}
                className="w-full p-4 border-2 border-gray-100 bg-white rounded-xl text-left hover:border-gray-400 hover:bg-gray-50 transition-all group"
              >
                <span className="block text-lg sm:text-xl font-bold text-gray-900 mb-1">Não rodo tráfego pago para nenhum número</span>
                <span className="text-gray-600 text-base sm:text-lg">Não faço anúncios</span>
              </button>
            </div>
            <button onClick={() => goToStep('stage_2_os_selection')} className="block mx-auto text-gray-500 hover:text-gray-800 underline mt-4 text-base sm:text-lg">Voltar</button>
          </div>
        );

      case 'stage_3_traffic_source':
        return (
          <div className="space-y-5 animate-fadeIn max-w-xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center">Como você roda/rodava seus anúncios?</h2>

            <div className="space-y-3">
              <button
                onClick={() => {
                  saveChoice('ad_platform', 'instagram_boost');
                  goToStep('stage_3_any_facebook');
                }}
                className="w-full p-4 border-2 border-gray-100 bg-white rounded-xl text-left hover:border-gray-900 hover:bg-gray-50 transition-all"
              >
                <span className="font-bold text-gray-900 text-lg sm:text-xl">Impulsionar/turbinar do Instagram</span>
                <p className="text-base sm:text-lg text-gray-500 mt-1">Apenas clico no botão "Turbinar" ou "Impulsionar" direto no app</p>
              </button>

              <button
                onClick={() => {
                  saveChoice('ad_platform', 'meta_business');
                  goToStep('stage_3_meta_access_check');
                }}
                className="w-full p-4 border-2 border-gray-100 bg-white rounded-xl text-left hover:border-gray-900 hover:bg-gray-50 transition-all"
              >
                <span className="font-bold text-gray-900 text-lg sm:text-xl">Gerenciador de Anúncios Facebook (Meta)</span>
                <p className="text-base sm:text-lg text-gray-500 mt-1">Uso o painel profissional do Facebook/Meta</p>
              </button>
            </div>
            <button onClick={() => goToStep('stage_3_traffic_check')} className="block mx-auto text-gray-500 hover:text-gray-800 underline mt-4 text-base sm:text-lg">Voltar</button>
          </div>
        );

      case 'stage_3_any_facebook':
        return (
          <div className="space-y-4 text-center animate-fadeIn max-w-xl mx-auto">
            <div className="bg-gray-50 p-4 rounded-2xl border border-green-100 mb-4">
              <h3 className="text-xl sm:text-2xl font-bold text-green-900 mb-2">Você pode usar <strong>qualquer conta do Facebook</strong> para fazer a conexão, entenda:</h3>
              <p className="text-gray-900 mt-2 text-base sm:text-lg">
                Não precisa ser a conta oficial da clínica. Pode ser seu perfil pessoal ou qualquer outro.
                Ninguém verá qual perfil foi usado para conectar.
              </p>
            </div>
            <button
              onClick={() => goToStep('step_inside_system')}
              className="w-full py-3 bg-gray-900 text-white font-bold rounded-xl hover:bg-gray-800 transition-colors shadow-lg text-lg sm:text-xl"
            >
              Entendi, vamos conectar
            </button>
            <button onClick={() => goToStep('stage_3_traffic_check')} className="text-gray-500 hover:text-gray-800 underline text-base sm:text-lg">Voltar</button>
          </div>
        );

      case 'stage_3_meta_access_check':
        return (
          <div className="space-y-5 animate-fadeIn max-w-xl mx-auto">
            <div className="text-center">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Então você precisa ter acesso a essa conta de Facebook/Meta Ads para continuar. Entenda:</h2>
              <p className="text-gray-600 text-lg sm:text-xl">
                Como você já vinculou esse número a um Facebook/Meta Ads, você precisa entrar <strong>obrigatoriamente</strong> com a conta do Facebook que administra esses anúncios.
              </p>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => {
                  saveChoice('meta_access', 'has_access');
                  goToStep('step_inside_system');
                }}
                className="w-full p-4 bg-gray-900 text-white rounded-xl text-left hover:bg-gray-800 transition-all font-bold text-lg sm:text-xl"
              >
                Tenho acesso a essa conta
              </button>

              <button
                onClick={() => {
                  saveChoice('meta_access', 'uncertain');
                  goToStep('stage_3_meta_access_uncertain');
                }}
                className="w-full p-4 border-2 border-gray-200 bg-white rounded-xl text-left hover:border-gray-400 hover:bg-gray-50 transition-all text-lg sm:text-xl"
              >
                Não sei se tenho acesso a essa conta
              </button>

              <button
                onClick={() => goToStep('stage_3_meta_lost_access')}
                className="w-full p-4 border-2 border-gray-200 bg-white rounded-xl text-left hover:border-gray-900 hover:bg-gray-50 transition-all"
              >
                <span className="font-bold text-gray-900 text-lg sm:text-xl">Não tenho acesso, com certeza</span>

              </button>
            </div>
            <button onClick={() => goToStep('stage_3_traffic_source')} className="block mx-auto text-gray-500 hover:text-gray-800 underline mt-4 text-base sm:text-lg">Voltar</button>
          </div>
        );

      case 'stage_3_meta_access_uncertain':
        return (
          <div className="space-y-6 text-center animate-fadeIn max-w-xl mx-auto">
            <div className="bg-blue-50 p-8 rounded-2xl border-2 border-blue-100">
              <div className="text-5xl mb-4">✓</div>
              <h2 className="text-2xl sm:text-3xl font-bold text-blue-900 mb-4">Certo, teste com a sua conta principal do Facebook</h2>
              <p className="text-lg sm:text-xl text-blue-800">
                Se não funcionar com ela, você poderá tentar entrar com outra conta posteriormente.
              </p>
            </div>
            <button
              onClick={() => goToStep('step_inside_system')}
              className="w-full py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors shadow-lg text-lg sm:text-xl"
            >
              Entendi, continuar
            </button>
            <button onClick={() => goToStep('stage_3_meta_access_check')} className="text-gray-500 hover:text-gray-800 underline text-base sm:text-lg">Voltar</button>
          </div>
        );

      case 'stage_3_meta_lost_access':
        return (
          <div className="space-y-4 animate-fadeIn max-w-2xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center">Acesso Perdido</h2>

            <div className="bg-gray-50 p-4 rounded-xl border-l-4 border-gray-400 text-left">
              <p className="font-semibold text-gray-900 mb-1 text-lg sm:text-xl">💡 Essa conta pertence ao seu Gestor de Tráfego?</p>
              <p className="text-base sm:text-lg text-gray-700">Entre em contato com ele para recuperar o acesso.</p>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => goToStep('step_inside_system')}
                className="w-full p-4 border-2 border-gray-200 bg-white rounded-xl text-left hover:border-gray-900 hover:bg-gray-50 transition-all"
              >
                <span className="font-bold text-gray-900 text-lg sm:text-xl">Consegui a conta de volta</span>
              </button>

              <button
                onClick={() => goToStep('stage_3_meta_lost_access_options')}
                className="w-full p-4 border-2 border-gray-200 bg-white rounded-xl text-left hover:border-gray-900 hover:bg-gray-50 transition-all"
              >
                <span className="font-bold text-gray-900 text-lg sm:text-xl">Acredito que perdi essa conta do Facebook para sempre</span>
                <p className="text-base sm:text-lg text-gray-600 mt-1">Ainda há esperança. Veja o que você pode fazer.</p>
              </button>
            </div>
            <button onClick={() => goToStep('stage_3_meta_access_check')} className="block mx-auto text-gray-500 hover:text-gray-800 underline mt-4 text-base sm:text-lg">Voltar</button>
          </div>
        );

      case 'stage_3_meta_lost_access_options':
        return (
          <div className="space-y-4 animate-fadeIn max-w-2xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 text-left">Ainda Há Esperança!</h2>

            <div className="bg-gray-50 p-4 rounded-xl space-y-4 text-gray-700 text-base sm:text-lg text-left">
              <div>
                <h3 className="font-bold text-xl sm:text-2xl text-gray-900 mb-2 text-left">Tentativa 1 (Simples):</h3>
                <p className="text-left">Tentar conectar com outro Facebook mesmo assim. Pode dar erro, mas se der, nós te ajudaremos lá na frente.</p>
              </div>

              <hr className="border-gray-200" />

              <div>
                <h3 className="font-bold text-xl sm:text-2xl text-gray-900 mb-2 text-left">Tentativa 2 (Avançada):</h3>
                <p className="mb-2 text-left">Para desvincular esse número do seu Facebook que não tem mais acesso você deve:</p>
                <ol className="list-decimal pl-4 space-y-1 text-base sm:text-lg text-left">
                  <li>Migrar o número que deseja conectar do aplicativo <strong>WhatsApp Business (profissional)</strong> para um <strong>WhatsApp Comum (pessoal)</strong>. Ao fazer essa migração certifique-se de importar suas conversas, para que não perca nada.</li>
                  <li>Esperar algumas horas</li>
                  <li>Voltar esse número que estará no WhatsApp Comum (pessoal) para um aplicativo de <strong>WhatsApp Business (profissional)</strong>. E fazer a conexão sem se preocupar com qual conta de Facebook deve entrar.</li>
                </ol>
                <div className="bg-gray-100 p-3 rounded-lg border border-gray-300 mt-3">
                  <p className="text-gray-800 text-base sm:text-lg text-left"><strong>💡 Resultado:</strong> Isso "desvincula" o número da conta perdida do Facebook à força. E o torna livre para conectar em qualquer conta de Facebook.</p>
                </div>
              </div>
            </div>

            <div className="grid gap-2">
              <button
                onClick={() => {
                  saveChoice('lost_access_strategy', 'try_anyway');
                  goToStep('step_inside_system');
                }}
                className="w-full p-3 bg-gray-900 text-white rounded-xl font-bold hover:bg-gray-800 text-base sm:text-lg"
              >
                Vou tentar conectar com outra conta por enquanto, só pra tirar a prova de que realmente não é a conta que perdi
              </button>

              <button
                onClick={() => goToStep('step_inside_system')}
                className="w-full p-3 border-2 border-gray-900 bg-white rounded-xl font-bold hover:bg-gray-50 text-base sm:text-lg"
              >
                Fiz o caminho de migrar meu número do WhatsApp Business (profissional) para o WhatsApp Comum (pessoal) e já voltei ele para o WhatsApp Business (profissional) novamente
              </button>
            </div>
            <button onClick={() => goToStep('stage_3_meta_lost_access')} className="block mx-auto text-gray-500 hover:text-gray-800 underline text-base sm:text-lg">Voltar</button>
          </div>
        );

      case 'stage_3_meta_lost_access_path_2':
        return (
          <div className="space-y-5 animate-fadeIn max-w-xl mx-auto text-center">
            <div className="bg-gray-50 p-5 rounded-2xl border-2 border-gray-200">
              <div className="text-4xl mb-3">✅</div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">Ótimo! Migração Concluída</h2>
              <p className="text-gray-600 mb-4 text-lg sm:text-xl">
                Agora seu número está livre para conectar em qualquer conta de Facebook. Vamos prosseguir com a conexão!
              </p>
              <button
                onClick={() => goToStep('step_inside_system')}
                className="w-full p-3 bg-gray-900 text-white rounded-xl font-bold hover:bg-gray-800 text-lg sm:text-xl"
              >
                Continuar para Conectar
              </button>
            </div>
            <button onClick={() => goToStep('stage_3_meta_lost_access_options')} className="text-gray-500 hover:text-gray-800 underline text-base sm:text-lg">Voltar</button>
          </div>
        );

      case 'step_inside_system':
        const slides = [
          {
            image: '/1.png',
            title: '1. Clique em "Conectar WhatsApp..."',
            subtitle: 'Dentro do sistema SecretáriaPlus > Conexão WhatsApp'
          },
          {
            image: '/2.png',
            title: '2. Leia e clique em continuar:',
            subtitle: 'Dentro do sistema SecretáriaPlus > Conexão WhatsApp'
          },
          {
            image: '/3.png',
            title: '3. Leia os pontos de atenção e clique em continuar:',
            subtitle: 'Dentro do sistema SecretáriaPlus > Conexão WhatsApp'
          }
        ];

        return (

          <div className="space-y-6 text-center animate-fadeIn max-w-2xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Dentro do Sistema</h2>
            <p className="text-xl sm:text-2xl text-gray-600">no menu lateral clique em Conexão WhatsApp</p>

            {/* Steps List */}
            <div className="space-y-4">
              {slides.map((slide, index) => (
                <div key={index} className="bg-white rounded-xl border-2 border-gray-200 overflow-hidden p-4">
                  {/* Subtitle */}
                  <p className="text-base sm:text-lg text-gray-600 mb-2">{slide.subtitle}</p>

                  {/* Title */}
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3">{slide.title}</h3>

                  {/* Image */}
                  <div className="bg-gray-100 rounded-lg overflow-hidden">
                    <img
                      src={slide.image}
                      alt={slide.title}
                      className="w-full h-auto lg:max-h-96 object-contain"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                        (e.target as HTMLImageElement).parentElement!.innerHTML = '<div class="flex items-center justify-center p-4"><span class="text-gray-500 text-base">📷 Imagem: ' + slide.image + '</span></div>';
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Navigation button */}
            <div className="grid gap-2 pt-2">
              <button
                onClick={() => {
                  goToStep(devices.computerType === 'mac' ? 'step_check_tabs_mac' : 'step_check_tabs_windows');
                }}
                className="w-full py-3 bg-gray-900 text-white font-bold rounded-xl hover:bg-gray-800 transition-colors shadow-lg text-lg sm:text-xl"
              >
                Continuar
              </button>
            </div>
          </div>
        );

      case 'step_check_tabs_mac':
        return (
          <div className="space-y-4 text-center animate-fadeIn max-w-2xl mx-auto">
            <div className="flex flex-col items-center justify-center gap-1 mb-4">
              <AppleIcon />
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Feche as guias do Facebook (Macbook)</h2>
            </div>

            <button
              onClick={() => goToStep('step_check_tabs_windows')}
              className="text-base sm:text-lg text-gray-700 underline hover:text-gray-900"
            >
              Na verdade agora estou em um Windows/outro
            </button>

            {/* Shared image - close all tabs */}
            <div className="space-y-2 text-left">
              <h3 className="text-lg sm:text-xl font-bold text-gray-900">Feche todas as guias do Facebook antes de clicar no botão verde de conectar:</h3>
              <p className="text-base sm:text-lg text-gray-600">Na parte superior do navegador, verifique se já não tem uma guia de conexão aberta:</p>
              <div className="bg-gray-100 rounded-lg overflow-hidden">
                <img
                  src="/close-all.png"
                  alt="Fechar guias do Facebook"
                  className="w-full h-auto lg:max-h-96 object-contain"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                    (e.target as HTMLImageElement).parentElement!.innerHTML = '<div class="flex items-center justify-center p-4"><span class="text-gray-500 text-base sm:text-lg">📷 Imagem: /close-all.png</span></div>';
                  }}
                />
              </div>
            </div>

            {/* Mac-specific image */}
            <div className="space-y-2 text-left">
              <p className="text-base sm:text-lg text-gray-600">Olha também na parte inferior da sua tela clicando com o botão direito (sem mouse: dois dedos ao mesmo tempo) em cima do navegador, e você pode encontrar guias de conexão do Facebook, abra uma por uma e feche-as:</p>
              <div className="bg-gray-100 rounded-lg overflow-hidden">
                <img
                  src="/close-mac.png"
                  alt="Verificar guias no Mac"
                  className="w-full h-auto lg:max-h-96 object-contain"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                    (e.target as HTMLImageElement).parentElement!.innerHTML = '<div class="flex items-center justify-center p-4"><span class="text-gray-500 text-base sm:text-lg">📷 Imagem: /close-mac.png</span></div>';
                  }}
                />
              </div>
            </div>

            {/* Shared warning */}
            <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-200 text-left">
              <div className="flex items-start gap-3">
                <div className="text-2xl shrink-0">⚠️</div>
                <div className="space-y-2">
                  <p className="text-yellow-900 text-base sm:text-lg font-medium">
                    <strong>Observação:</strong> É necessário que você feche todas as guias de conexão do Facebook, e apenas depois de fechar tudo clique novamente no botão verde para iniciar em uma nova guia de conexão, com a certeza de que é a única aberta.
                  </p>
                  <p className="text-yellow-800 text-base sm:text-lg">
                    <strong>Importante:</strong> Em todos os casos que precise reiniciar o fluxo de conexão, lembre-se de fechar novamente todas as guias do Facebook.
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={() => goToStep('step_connection_start')}
              className="w-full py-3 bg-gray-900 text-white font-bold rounded-xl hover:bg-gray-800 transition-colors shadow-lg px-6 text-lg sm:text-xl"
            >
              Fiz isso, continuar
            </button>
            <button onClick={() => goToStep('step_inside_system')} className="text-gray-500 hover:text-gray-800 underline text-base sm:text-lg">Voltar</button>
          </div>
        );

      case 'step_check_tabs_windows':
        return (
          <div className="space-y-4 text-center animate-fadeIn max-w-2xl mx-auto">
            <div className="flex flex-col items-center justify-center gap-1 mb-4">
              <WindowsIcon />
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Feche as guias do Facebook (Windows/Outro)</h2>
            </div>

            <button
              onClick={() => goToStep('step_check_tabs_mac')}
              className="text-base sm:text-lg text-gray-700 underline hover:text-gray-900"
            >
              Na verdade agora estou em um Macbook
            </button>

            {/* Shared image - close all tabs */}
            <div className="space-y-2 text-left">
              <h3 className="text-lg sm:text-xl font-bold text-gray-900">Feche todas as guias do Facebook antes de clicar no botão verde de conectar:</h3>
              <p className="text-base sm:text-lg text-gray-600">Na parte superior do navegador, verifique se já não tem uma guia de conexão aberta:</p>
              <div className="bg-gray-100 rounded-lg overflow-hidden">
                <img
                  src="/close-all.png"
                  alt="Fechar guias do Facebook"
                  className="w-full h-auto lg:max-h-96 object-contain"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                    (e.target as HTMLImageElement).parentElement!.innerHTML = '<div class="flex items-center justify-center p-4"><span class="text-gray-500 text-base sm:text-lg">📷 Imagem: /close-all.png</span></div>';
                  }}
                />
              </div>
            </div>

            {/* Windows-specific image */}
            <div className="space-y-2 text-left">
              <p className="text-base sm:text-lg text-gray-600">Na parte inferior da tela do seu computador, você colocando o mouse por cima do navegador pode encontrar outras guias do Facebook. Feche-as também:</p>
              <div className="bg-gray-100 rounded-lg overflow-hidden">
                <img
                  src="/close-wind.jpg"
                  alt="Verificar guias no Windows"
                  className="w-full h-auto lg:max-h-96 object-contain"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                    (e.target as HTMLImageElement).parentElement!.innerHTML = '<div class="flex items-center justify-center p-4"><span class="text-gray-500 text-base sm:text-lg">📷 Imagem: /close-wind.jpg</span></div>';
                  }}
                />
              </div>
            </div>

            {/* Shared warning */}
            <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-200 text-left">
              <div className="flex items-start gap-3">
                <div className="text-2xl shrink-0">⚠️</div>
                <div className="space-y-2">
                  <p className="text-yellow-900 text-base sm:text-lg font-medium">
                    <strong>Observação:</strong> É necessário que você feche todas as guias de conexão do Facebook, e apenas depois de fechar tudo clique novamente no botão verde para iniciar em uma nova guia de conexão, com a certeza de que é a única aberta.
                  </p>
                  <p className="text-yellow-800 text-base sm:text-lg">
                    <strong>Importante:</strong> Em todos os casos que precise reiniciar o fluxo de conexão, lembre-se de fechar novamente todas as guias do Facebook.
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={() => goToStep('step_connection_start')}
              className="w-full py-3 bg-gray-900 text-white font-bold rounded-xl hover:bg-gray-800 transition-colors shadow-lg px-6 text-lg sm:text-xl"
            >
              fiz isso, continuar
            </button>
            <button onClick={() => goToStep('step_inside_system')} className="text-gray-500 hover:text-gray-800 underline text-base sm:text-lg">Voltar</button>
          </div>
        );

      case 'step_connection_start':
        return (
          <div className="space-y-5 animate-fadeIn max-w-2xl mx-auto py-4 px-2">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center">Hora de Conectar</h2>

            {/* First section - Click green button */}
            <div className="space-y-3">
              <p className="text-base sm:text-lg text-gray-600 text-center">Com todas as guias do Facebook fechadas</p>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 text-center">No sistema, clique no botão verde: Conectar WhatsApp Business</h3>
              <div className="bg-gray-100 rounded-lg overflow-hidden">
                <img
                  src="/4.png"
                  alt="Botão verde de conectar"
                  className="w-full h-auto lg:max-h-96 object-contain"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                    (e.target as HTMLImageElement).parentElement!.innerHTML = '<div class="flex items-center justify-center p-4"><span class="text-gray-500 text-base sm:text-lg">📷 Imagem: /4.png</span></div>';
                  }}
                />
              </div>
            </div>

            {/* Second section - Model comparison */}
            <div className="relative py-2">
              <div className="absolute inset-0 flex items-center" aria-hidden="true">
                <div className="w-full border-t border-gray-300"></div>
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-base sm:text-lg text-gray-600 text-center">Abrirá uma tela de conexão do Facebook</p>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 text-center mb-4">Qual dos dois modelos de tela aparece para você:</h3>

              {/* Model comparison - Vertical stack - Clickable images only */}
              <div className="grid grid-cols-1 gap-4 max-w-md mx-auto">
                <button 
                  onClick={() => goToStep('step_model_1')}
                  className="w-full group"
                >
                  <div className="bg-white rounded-xl overflow-hidden border-2 border-gray-300 hover:border-gray-900 hover:shadow-xl transition-all cursor-pointer p-3">
                    <div className="w-[90%] mx-auto">
                      <img
                        src="/mod-1.png"
                        alt="Modelo 1"
                        className="w-full h-auto object-contain"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                          (e.target as HTMLImageElement).parentElement!.innerHTML = '<div class="flex items-center justify-center p-4"><span class="text-gray-500 text-base sm:text-lg">📷 mod-1.png</span></div>';
                        }}
                      />
                    </div>
                    <p className="text-center text-base sm:text-lg text-gray-500 group-hover:text-gray-900 font-medium mt-2">Clique aqui se abriu esse modelo</p>
                  </div>
                </button>
                <button 
                  onClick={() => goToStep('step_model_2')}
                  className="w-full group"
                >
                  <div className="bg-white rounded-xl overflow-hidden border-2 border-gray-300 hover:border-gray-900 hover:shadow-xl transition-all cursor-pointer p-3">
                    <div className="w-[90%] mx-auto">
                      <img
                        src="/mod-2.png"
                        alt="Modelo 2"
                        className="w-full h-auto object-contain"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                          (e.target as HTMLImageElement).parentElement!.innerHTML = '<div class="flex items-center justify-center p-4"><span class="text-gray-500 text-base sm:text-lg">📷 mod-2.png</span></div>';
                        }}
                      />
                    </div>
                    <p className="text-center text-base sm:text-lg text-gray-500 group-hover:text-gray-900 font-medium mt-2">Clique aqui se abriu esse modelo</p>
                  </div>
                </button>
              </div>
            </div>
          </div>
        );

      case 'step_model_1': {
        const model1Slides = [
          {
            image: '/mod-1.1.png',
            title: 'Clique em Começar',
            subtitle: 'Passo 1'
          },
          {
            image: '/mod-1.2.png',
            title: 'Crie/Selecione o portfólio correto',
            subtitle: 'Passo 2',
            description: (
              <div className="space-y-2 text-left text-base sm:text-lg leading-snug text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-100">
                <p><strong>Se tiver dificuldade, chame a pessoa que gerencia seu tráfego pago para te ajudar:</strong></p>
                <p>Se você já roda tráfego pago dentro do Facebook, você precisa escolher o portfólio/BM em que seu número já está vinculado. Se não possui nenhum portfólio você pode criar um do 0.</p>
                <ul className="list-disc pl-4 space-y-0.5">
                  <li><strong>Nome da empresa:</strong> escreva o nome da sua clínica.</li>
                  <li><strong>Email:</strong> Insira seu melhor email.</li>
                  <li><strong>Site:</strong> use seu website ou link do Instagram (deve iniciar com "https://")</li>
                  <li><strong>País:</strong> escolha por último o país onde você estará atendendo.</li>
                </ul>
              </div>
            )
          },
          {
            image: '/mod-1.3.png',
            title: 'Conecte seu app WhatsApp Business existente',
            subtitle: 'Passo 3',
            description: (
              <p className="text-gray-600 text-center text-lg sm:text-xl">
                Selecione a opção: <strong>Conecte seu app WhatsApp Business existente</strong>.
              </p>
            )
          }
        ];

        return (
          <div className="w-full text-center animate-fadeIn max-w-2xl lg:max-w-4xl mx-auto">
            <div className="w-full py-3">
              <p className="text-base sm:text-lg text-gray-500 font-bold tracking-wider uppercase mb-1">{model1Slides[currentSlide].subtitle}</p>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">{model1Slides[currentSlide].title}</h3>

              <div className="rounded-lg overflow-hidden mb-4 bg-gray-50 border border-gray-100 max-w-md lg:max-w-lg mx-auto p-3">
                <div className="w-[90%] mx-auto">
                  <img
                    src={model1Slides[currentSlide].image}
                    alt={model1Slides[currentSlide].title}
                    className="w-full h-auto lg:max-h-96 object-contain"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                      (e.target as HTMLImageElement).parentElement!.innerHTML = '<div class="flex items-center justify-center p-4"><span class="text-gray-500 text-base sm:text-lg">📷 Imagem: ' + model1Slides[currentSlide].image + '</span></div>';
                    }}
                  />
                </div>
              </div>

              {model1Slides[currentSlide].description && model1Slides[currentSlide].description}

              <div className="flex justify-center gap-2 my-5">
                {model1Slides.map((_, index) => (
                  <div key={index} className={`w-2 h-2 rounded-full transition-colors ${index === currentSlide ? 'bg-gray-900' : 'bg-gray-300'}`} />
                ))}
              </div>

              <div className="grid gap-2">
                <button
                  onClick={() => {
                    if (currentSlide < model1Slides.length - 1) {
                      nextSlide();
                    } else {
                      setCameFromModel1(true);
                      goToStep('step_model_2', 3);
                    }
                  }}
                  className="w-full py-3 bg-gray-900 text-white font-bold rounded-xl hover:bg-gray-800 transition-colors shadow-lg text-lg sm:text-xl"
                >
                  {currentSlide < model1Slides.length - 1 ? 'Próxima etapa' : 'Continuar para inserir número'}
                </button>
                {currentSlide > 0 && (
                  <button onClick={() => prevSlide()} className="w-full py-2 text-gray-500 hover:text-gray-800 font-medium transition-colors text-base sm:text-lg">Voltar etapa anterior</button>
                )}
              </div>
            </div>
            <button onClick={() => goToStep('step_connection_start')} className="text-gray-500 hover:text-gray-800 underline text-base sm:text-lg mt-3">Voltar para escolha de modelo</button>
          </div>
        );
      }

      case 'step_model_2': {
        const model2Slides = [
          {
            image: '/mod-2.0.png',
            title: 'Clique em Continuar',
            subtitle: 'Passo 1',
            description: null
          },
          {
            image: '/mod-2.1.png',
            title: 'Crie/Selecione o portfólio correto',
            subtitle: 'Passo 2',
            description: (
              <div className="space-y-2 text-left text-base sm:text-lg leading-snug text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-100">
                <p><strong>Nesse momento se tiver dificuldade, e achar que for necessário chame a pessoa que gerencia seu tráfego pago, ou mesmo seu cônjuge, para te ajudar:</strong></p>
                <p>Se você já roda tráfego pago dentro do Facebook, você precisa escolher o portfólio/BM em que seu número já está vinculado. Se você não possui nenhum portfólio você pode criar um do 0.</p>

                <div className="mt-2 bg-white p-2 rounded-lg border border-gray-200">
                  <h4 className="font-bold text-gray-800 mb-1">Dicas de apoio:</h4>
                  <ul className="space-y-1 list-disc pl-4">
                    <li><strong>Nome da empresa:</strong> escreva o nome da sua clínica. O nome da empresa não será público, então não precisa gastar muito tempo pensando em como colocar isso da melhor forma.</li>
                    <li><strong>Email:</strong> Insira seu melhor email.</li>
                    <li><strong>Site ou perfil comercial:</strong> nesse campo conforme você digita o Facebook fica tentando validar se o link existe ou não, isso pode acabar atrapalhando sua digitação, então certifique de que não ficou faltando nenhuma letra no caminho, porque pode ser considerado um link inválido por esse motivo. A ideia é você adicionar seu website, e se não possuir um você pode usar o link que direciona para seu Instagram. Exemplo: <code>https://instagram.com/seunomedeusarioaqui/</code> (a única regra é que o link deve se iniciar com "https://")</li>
                    <li><strong>País:</strong> escolha por último o país onde você estará atendendo.</li>
                  </ul>
                </div>
              </div>
            )
          },
          {
            image: '/mod-2.2.png',
            title: 'Selecione seu número ou vá em Conectar um app do WhatsApp Business',
            subtitle: 'Passo 3',
            description: (
              <div className="text-left text-lg sm:text-xl text-gray-600 space-y-3">
                <p>Veja se seu número está já listado nas opções que surgirão para selecioná-lo, caso não esteja clique em: <strong>“Conectar um app do WhatsApp Business”</strong></p>
                <div className="bg-red-50 border border-red-200 p-3 rounded-lg text-red-800 font-medium">
                  Importante: nesse caso NÃO clique em: "criar uma conta do WhatsApp Business"
                </div>
              </div>
            )
          },
          {
            image: '/num-num.png',
            title: 'Inserindo o Número',
            subtitle: 'Passo 4',
            description: (
              <p className="text-gray-600 text-base sm:text-lg text-left">
                Aqui você deve selecionar o país do seu número, e basta digitar no pesquisar <strong>“55”</strong> ou <strong>“BR”</strong> que facilitará, em seguida você deve digitar o número que você deseja conectar com DDD.
              </p>
            )
          },
          {
            image: '/qr-code-new0.png',
            secondaryImage: '/mod2-new0.png',
            title: 'O que você vê agora?',
            subtitle: 'Passo 5',
            description: (
              <div className="space-y-8">
                <button
                  onClick={() => setCurrentSlide(5)}
                  className="w-full p-4 rounded-lg border-2 border-gray-200 hover:border-gray-900 hover:bg-gray-50 transition-all"
                >
                  <p className="font-bold text-gray-800 text-base mb-2">1. Vejo um QR Code</p>
                  <div className="rounded-lg overflow-hidden bg-white">
                    <img src="/qr-code-new0.png" alt="QR Code" className="w-full h-auto lg:max-h-96 object-contain" />
                  </div>
                </button>
                
                <button
                  onClick={() => goToStep('step_model_2_novo_numero')}
                  className="w-full p-4 rounded-lg border-2 border-gray-200 hover:border-gray-900 hover:bg-gray-50 transition-all"
                >
                  <p className="font-bold text-gray-800 text-base mb-2">2. Vejo essa tela para adicionar número</p>
                  <div className="rounded-lg overflow-hidden bg-white">
                    <img src="/mod2-new0.png" alt="Tela adicionar número" className="w-full h-auto lg:max-h-96 object-contain" />
                  </div>
                </button>
              </div>
            )
          },
          {
            image: '/facebook.png',
            // secondaryImage: '/facebook.png',
            title: 'Esse QR code não é o jeito comum de conexão que você está acostumado(a). Mas antes...',
            subtitle: 'Passo 6',
            description: (
              <div className="space-y-4">
                <p className="text-gray-600 text-lg sm:text-xl">
                  No número que você deseja conectar chegou uma mensagem do facebook?
                </p>

                <div className="flex gap-3 justify-center">
                  <button
                    onClick={() => goToStep('step_model_2_sim')}
                    className="px-4 py-2 rounded-lg font-bold transition-all bg-gray-100 text-gray-600 hover:bg-gray-200 hover:shadow-md text-lg sm:text-xl"
                  >
                    Sim, recebi
                  </button>
                  <button
                    onClick={() => goToStep(devices.mobileType === 'iphone' ? 'step_model_2_nao_iphone' : 'step_model_2_nao_android')}
                    className="px-4 py-2 rounded-lg font-bold transition-all bg-gray-100 text-gray-600 hover:bg-gray-200 hover:shadow-md text-lg sm:text-xl"
                  >
                    Não, não recebi
                  </button>
                </div>
              </div>
            )
          }
        ];

        return (
          <div className="w-full text-center animate-fadeIn max-w-2xl lg:max-w-5xl mx-auto">
            <div className="w-full py-3">
              <p className="text-base sm:text-lg text-gray-500 font-bold tracking-wider uppercase mb-1">{model2Slides[currentSlide].subtitle}</p>
              <h3 className="text-lg font-bold text-gray-900 mb-4">{model2Slides[currentSlide].title}</h3>

              {/* Image Container - 100% largura uma embaixo da outra */}
              {currentSlide !== 4 && (
                <div className="grid grid-cols-1 gap-4 mb-4 max-w-md mx-auto">
                  <div className="rounded-lg overflow-hidden bg-gray-50 border border-gray-100 p-3">
                    <div className="w-[90%] mx-auto">
                      <img
                        src={model2Slides[currentSlide].image}
                        alt={model2Slides[currentSlide].title}
                        className="w-full h-auto lg:max-h-96 object-contain"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                          (e.target as HTMLImageElement).parentElement!.innerHTML = '<div class="flex items-center justify-center p-4"><span class="text-gray-500 text-base sm:text-lg">📷 ' + model2Slides[currentSlide].image + '</span></div>';
                        }}
                      />
                    </div>
                  </div>
                  {'secondaryImage' in model2Slides[currentSlide] && (
                    <div className="rounded-lg overflow-hidden bg-gray-50 border border-gray-100 p-3">
                      <div className="w-[90%] mx-auto">
                        <img
                          // @ts-ignore - checking generic object property
                          src={model2Slides[currentSlide].secondaryImage}
                          alt={model2Slides[currentSlide].title + ' part 2'}
                          className="w-full h-auto lg:max-h-96 object-contain"
                          onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                          // @ts-ignore
                          (e.target as HTMLImageElement).parentElement!.innerHTML = '<div class="flex items-center justify-center p-4"><span class="text-gray-500 text-base sm:text-lg">📷 ' + model2Slides[currentSlide].secondaryImage + '</span></div>';
                        }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}

              {model2Slides[currentSlide].description}



              <div className="flex justify-center gap-2 my-5">
                {model2Slides.map((_, index) => (
                  <div key={index} className={`w-2 h-2 rounded-full transition-colors ${index === currentSlide ? 'bg-gray-900' : 'bg-gray-300'}`} />
                ))}
              </div>

              {currentSlide !== 4 && currentSlide !== 5 && (
                <div className="grid gap-2">
                  <button
                    onClick={() => {
                      if (currentSlide < model2Slides.length - 1) {
                        // Se veio do Modelo 1 e está no Passo 4 (index 3), pular para o Passo 6 (index 5)
                        if (cameFromModel1 && currentSlide === 3) {
                          setCurrentSlide(5);
                          window.scrollTo(0, 0);
                        } else {
                          nextSlide();
                        }
                      } else {
                        window.location.reload();
                      }
                    }}
                    className="w-full py-3 bg-gray-900 text-white font-bold rounded-xl hover:bg-gray-800 transition-colors shadow-lg text-lg sm:text-xl"
                  >
                    {currentSlide < model2Slides.length - 1 ? 'Próxima etapa' : 'Concluir'}
                  </button>
                  {currentSlide > 0 && (
                    <button onClick={() => prevSlide()} className="w-full py-2 text-gray-500 hover:text-gray-800 font-medium transition-colors text-base sm:text-lg">Voltar etapa anterior</button>
                  )}
                </div>
              )}
              {(currentSlide === 4 || currentSlide === 5) && (
                <div className="grid gap-2">
                  <button onClick={() => prevSlide()} className="w-full py-2 text-gray-500 hover:text-gray-800 font-medium transition-colors text-base sm:text-lg">Voltar etapa anterior</button>
                </div>
              )}
            </div>
            <button onClick={() => goToStep('step_connection_start')} className="text-gray-500 hover:text-gray-800 underline text-base sm:text-lg mt-3">Voltar para escolha de modelo</button>
          </div>
        );
      }
      case 'step_model_2_sim': {
        return (
          <div className="w-full text-center animate-fadeIn max-w-2xl mx-auto">
            <div className="w-full py-3">
              <p className="text-base sm:text-lg text-gray-500 font-bold tracking-wider uppercase mb-1">Sim - Recebi</p>
              <h3 className="text-lg font-bold text-gray-900 mb-4">Como ler o QR code</h3>
              
              {/* Sequência: Texto → Imagem → Texto → Imagem → Texto → Imagem */}
              <div className="space-y-6 max-w-md mx-auto">
                
                {/* Passo 1 */}
                <div className="space-y-3">
                  <div className="bg-gray-50 p-4 rounded-lg border border-blue-100 text-left">
                    <p className="text-gray-700 text-base sm:text-lg">
                      Essa mensagem do Facebook tem um botão <strong>1. Clicar em: Ler QR code</strong>
                    </p>
                  </div>
                  <div className="rounded-lg overflow-hidden bg-gray-50 border border-gray-100 p-3">
                    <img 
                      src="/facebook.png" 
                      alt="Mensagem do Facebook" 
                      className="w-full h-auto lg:max-h-96 object-contain"
                      onError={(e) => { 
                        (e.target as HTMLImageElement).style.display = 'none'; 
                        (e.target as HTMLImageElement).parentElement!.innerHTML = '<div class="flex items-center justify-center p-2"><span class="text-gray-500 text-base sm:text-lg">📷 facebook.png</span></div>'; 
                      }} 
                    />
                  </div>
                </div>

                {/* Passo 2 e 3 */}
                <div className="space-y-3">
                  <div className="bg-gray-50 p-4 rounded-lg border border-blue-100 text-left">
                    <p className="text-gray-700 text-base sm:text-lg">
                      Que te leva para uma página que deve estar em branco com um botão no final dela <strong>2. Clicar em: Escanear QR code</strong> e <strong>3. Clicar em: Compartilhar conversas</strong> que abrirá sua câmera e você poderá
                    </p>
                  </div>
                  <div className="rounded-lg overflow-hidden bg-gray-50 border border-gray-100 p-3">
                    <img 
                      src="/scan-qr.png" 
                      alt="Escanear QR Code" 
                      className="w-full h-auto lg:max-h-96 object-contain"
                      onError={(e) => { 
                        (e.target as HTMLImageElement).style.display = 'none'; 
                        (e.target as HTMLImageElement).parentElement!.innerHTML = '<div class="flex items-center justify-center p-2"><span class="text-gray-500 text-base sm:text-lg">📷 scan-qr.png</span></div>'; 
                      }} 
                    />
                  </div>
                </div>

                {/* Passo 4 */}
                <div className="space-y-3">
                  <div className="bg-gray-50 p-4 rounded-lg border border-blue-100 text-left">
                    <p className="text-gray-700 text-base sm:text-lg">
                      <strong>4. Ler o QR code</strong> para conexão.
                    </p>
                  </div>
                  <div className="rounded-lg overflow-hidden bg-gray-50 border border-gray-100 p-3">
                    <img 
                      src="/scan-qr2.png" 
                      alt="Ler QR Code" 
                      className="w-full h-auto lg:max-h-96 object-contain"
                      onError={(e) => { 
                        (e.target as HTMLImageElement).style.display = 'none'; 
                        (e.target as HTMLImageElement).parentElement!.innerHTML = '<div class="flex items-center justify-center p-2"><span class="text-gray-500 text-base sm:text-lg">📷 scan-qr2.png</span></div>'; 
                      }} 
                    />
                  </div>
                </div>

              </div>

              <div className="grid gap-2">
                <button
                  onClick={() => goToStep('step_model_2_fuso')}
                  className="w-full py-3 bg-gray-900 text-white font-bold rounded-xl hover:bg-gray-800 transition-colors shadow-lg text-lg sm:text-xl"
                >
                  Continuar
                </button>
                <button onClick={() => goToStep(cameFromModel1 ? 'step_model_1' : 'step_model_2')} className="w-full py-2 text-gray-500 hover:text-gray-800 font-medium transition-colors text-base sm:text-lg">
                  {cameFromModel1 ? 'Voltar para início do Modelo 1' : 'Voltar para seleção'}
                </button>
              </div>
            </div>
          </div>
        );
      }

      // --- Model 2 Branch: Não (iPhone) ---
      case 'step_model_2_nao_iphone': {
        const iphoneSlides = [
          {
            images: ['/iphone1.png', '/iphone2.png'],
            descriptions: [
              'No WhatsApp Business, vá em ⚙️ Configurações. Toque em 🔑 Conta > Plataforma do WhatsApp Business',
              'Clique em Conectar-se à Plataforma do WhatsApp Business'
            ],
            subtitle: 'Etapa 1 de 3'
          },
          {
            images: ['/iphone3.png', '/iphone4.png'],
            descriptions: [
              'Continue seguindo as instruções',
              'Selecione Compartilhar todas as conversas'
            ],
            subtitle: 'Etapa 2 de 3'
          },
          {
            images: ['/scan-qr2.png', '/iphone6.png'],
            descriptions: [
              'Escaneie o QR Code na próxima etapa.',
              'Continue o processo...'
            ],
            subtitle: 'Etapa 3 de 3'
          }
        ];

        return (
          <div className="w-full text-center animate-fadeIn max-w-2xl lg:max-w-5xl mx-auto">
            <div className="w-full py-3">
              {/* Header com ícone Apple */}
              <div className="flex items-center justify-center gap-2 mb-3">
                <AppleIcon />
                <div>
                  <p className="text-base sm:text-lg text-gray-500 font-bold tracking-wider uppercase">Não Recebi (iPhone)</p>
                  <h3 className="text-lg font-bold text-gray-900">Modo iPhone</h3>
                </div>
              </div>

              <p className="text-base sm:text-lg text-gray-500 font-bold mb-4">{iphoneSlides[currentSlide].subtitle}</p>

              <div className="mb-4">
                <button onClick={() => goToStep('step_model_2_nao_android')} className="text-base sm:text-lg text-gray-700 hover:text-gray-900 underline">Na verdade meu aparelho é Android</button>
              </div>

              {/* Grid de imagens - 100% largura */}
              <div className="grid grid-cols-1 gap-4 mb-4 max-w-md mx-auto">
                {iphoneSlides[currentSlide].images.map((image, index) => (
                  <div key={index} className="space-y-2">
                    <p className="text-base sm:text-lg text-gray-700 text-center px-1">
                      <strong>{iphoneSlides[currentSlide].descriptions[index]}</strong>
                    </p>
                    <div className="rounded-lg overflow-hidden bg-gray-50 border border-gray-100 p-2">
                      <div className="w-[90%] mx-auto">
                        <img 
                          src={image} 
                          alt={`iPhone Step ${index + 1}`}
                          className="w-full h-auto lg:max-h-80 object-contain"
                          onError={(e) => { 
                            (e.target as HTMLImageElement).style.display = 'none'; 
                            (e.target as HTMLImageElement).parentElement!.innerHTML = '<div class="flex items-center justify-center p-2"><span class="text-gray-500 text-base sm:text-lg">📷 ' + image + '</span></div>'; 
                          }} 
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Indicadores de progresso */}
              <div className="flex justify-center gap-2 my-4">
                {iphoneSlides.map((_, index) => (
                  <div key={index} className={`w-2 h-2 rounded-full transition-colors ${index === currentSlide ? 'bg-gray-900' : 'bg-gray-300'}`} />
                ))}
              </div>

              <div className="grid gap-2">
                {currentSlide < iphoneSlides.length - 1 ? (
                  <>
                    <button
                      onClick={() => nextSlide()}
                      className="w-full py-3 bg-gray-900 text-white font-bold rounded-xl hover:bg-gray-800 transition-colors shadow-lg text-lg sm:text-xl"
                    >
                      Próxima Etapa
                    </button>
                    {currentSlide > 0 && (
                      <button onClick={() => prevSlide()} className="w-full py-2 text-gray-500 hover:text-gray-800 font-medium transition-colors text-base sm:text-lg">Voltar etapa anterior</button>
                    )}
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => goToStep('step_model_2_fuso')}
                      className="w-full py-3 bg-gray-900 text-white font-bold rounded-xl hover:bg-gray-800 transition-colors shadow-lg text-lg sm:text-xl"
                    >
                      Continuar
                    </button>
                    <button onClick={() => prevSlide()} className="w-full py-2 text-gray-500 hover:text-gray-800 font-medium transition-colors text-base sm:text-lg">Voltar etapa anterior</button>
                  </>
                )}
                {currentSlide === 0 && (
                  <button onClick={() => goToStep(cameFromModel1 ? 'step_model_1' : 'step_model_2')} className="w-full py-2 text-gray-500 hover:text-gray-800 font-medium transition-colors text-base sm:text-lg">
                    {cameFromModel1 ? 'Voltar para início do Modelo 1' : 'Voltar para início do Modelo 2'}
                  </button>
                )}
              </div>
            </div>
          </div>
        );
      }

      // --- Model 2 Branch: Não (Android) ---
      case 'step_model_2_nao_android': {
        const androidSlides = [
          {
            images: ['/and-1.png', '/and-2.png'],
            descriptions: [
              'Abra o WhatsApp Business e toque nos ••• três pontinhos',
              'Vá em ⚙️ Configurações >'
            ],
            subtitle: 'Etapa 1 de 4'
          },
          {
            images: ['/and-3.png', '/and-a.png'],
            descriptions: [
              '🔑 Conta > Depois vá em Plataforma Comercial',
              'Clique em Plataforma Comercial'
            ],
            subtitle: 'Etapa 2 de 4'
          },
          {
            images: ['/iphone3.png', '/iphone4.png'],
            descriptions: [
              'Clique em Conectar-se à Plataforma Comercial',
              'Selecione Compartilhar todas as conversas'
            ],
            subtitle: 'Etapa 3 de 4'
          },
          {
            images: ['/scan-qr2.png', '/iphone6.png'],
            descriptions: [
              'Escaneie o QR Code na próxima etapa.',
              'Continue o processo...'
            ],
            subtitle: 'Etapa 4 de 4'
          }
        ];

        return (
          <div className="w-full text-center animate-fadeIn max-w-2xl lg:max-w-5xl mx-auto">
            <div className="w-full py-3">
              {/* Header com ícone Android */}
              <div className="flex items-center justify-center gap-2 mb-3">
                <AndroidIcon />
                <div>
                  <p className="text-base sm:text-lg text-gray-500 font-bold tracking-wider uppercase">Não Recebi (Android)</p>
                  <h3 className="text-lg font-bold text-gray-900">Modo Android</h3>
                </div>
              </div>

              <p className="text-base sm:text-lg text-gray-500 font-bold mb-4">{androidSlides[currentSlide].subtitle}</p>

              <div className="mb-4">
                <button onClick={() => goToStep('step_model_2_nao_iphone')} className="text-base sm:text-lg text-gray-700 hover:text-gray-900 underline">Na verdade meu aparelho é iPhone</button>
              </div>

              {/* Grid de imagens - 100% largura */}
              <div className="grid grid-cols-1 gap-4 mb-4 max-w-md mx-auto">
                {androidSlides[currentSlide].images.map((image, index) => (
                  <div key={index} className="space-y-2">
                    <p className="text-base sm:text-lg text-gray-700 text-center px-1">
                      <strong>{androidSlides[currentSlide].descriptions[index]}</strong>
                    </p>
                    <div className="rounded-lg overflow-hidden bg-gray-50 border border-gray-100 p-2">
                      <div className="w-[90%] mx-auto">
                        <img 
                          src={image} 
                          alt={`Android Step ${index + 1}`}
                          className="w-full h-auto lg:max-h-80 object-contain"
                          onError={(e) => { 
                            (e.target as HTMLImageElement).style.display = 'none'; 
                            (e.target as HTMLImageElement).parentElement!.innerHTML = '<div class="flex items-center justify-center p-2"><span class="text-gray-500 text-base sm:text-lg">📷 ' + image + '</span></div>'; 
                          }} 
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Indicadores de progresso */}
              <div className="flex justify-center gap-2 my-4">
                {androidSlides.map((_, index) => (
                  <div key={index} className={`w-2 h-2 rounded-full transition-colors ${index === currentSlide ? 'bg-gray-900' : 'bg-gray-300'}`} />
                ))}
              </div>

              <div className="grid gap-2">
                {currentSlide < androidSlides.length - 1 ? (
                  <>
                    <button
                      onClick={() => nextSlide()}
                      className="w-full py-3 bg-gray-900 text-white font-bold rounded-xl hover:bg-gray-800 transition-colors shadow-lg text-lg sm:text-xl"
                    >
                      Próxima Etapa
                    </button>
                    {currentSlide > 0 && (
                      <button onClick={() => prevSlide()} className="w-full py-3 text-gray-500 hover:text-gray-800 font-medium transition-colors">Voltar etapa anterior</button>
                    )}
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => goToStep('step_model_2_fuso')}
                      className="w-full py-4 bg-gray-900 text-white font-bold rounded-xl hover:bg-gray-800 transition-colors shadow-lg"
                    >
                      Continuar para Fuso Horário
                    </button>
                    <button onClick={() => prevSlide()} className="w-full py-3 text-gray-500 hover:text-gray-800 font-medium transition-colors">Voltar etapa anterior</button>
                  </>
                )}
                {currentSlide === 0 && (
                  <button onClick={() => goToStep(cameFromModel1 ? 'step_model_1' : 'step_model_2')} className="w-full py-3 text-gray-500 hover:text-gray-800 font-medium transition-colors">
                    {cameFromModel1 ? 'Voltar para início do Modelo 1' : 'Voltar para início do Modelo 2'}
                  </button>
                )}
              </div>
            </div>
          </div>
        );
      }

      // --- Model 2 Branch: Número Novo/Existente ---
      case 'step_model_2_novo_numero': {
        const novoNumeroSlides = [
          {
            images: ['/mod2-new1.png'],
            descriptions: [''],
            title: 'Selecione: Usar um número novo ou existente do WhatsApp',
            subtitle: 'Etapa 1 de 3'
          },
          {
            images: ['/mod2-new2.png', '/mod2-new3.png'],
            descriptions: ['Clique para selecionar seu número', 'Agora selecione seu número'],
            title: 'Selecione seu número',
            subtitle: 'Etapa 2 de 3'
          },
          {
            images: ['/mod2-new4.png'],
            descriptions: [''],
            title: 'Tela de Permissão: clique em "Confirmar"',
            subtitle: 'Etapa 3 de 3'
          }
        ];

        return (
          <div className="w-full text-center animate-fadeIn max-w-2xl lg:max-w-5xl mx-auto">
            <div className="w-full py-3">
              <p className="text-base sm:text-lg text-gray-500 font-bold tracking-wider uppercase mb-1">{novoNumeroSlides[currentSlide].subtitle}</p>
              <h3 className="text-lg font-bold text-gray-900 mb-4">{novoNumeroSlides[currentSlide].title}</h3>

              {/* Grid de imagens - 100% largura */}
              <div className="grid grid-cols-1 gap-4 mb-4 max-w-md mx-auto">
                {novoNumeroSlides[currentSlide].images.map((image, index) => (
                  <div key={index} className="space-y-2">
                    {novoNumeroSlides[currentSlide].descriptions[index] && (
                      <p className="text-base sm:text-lg text-gray-700 text-center px-1">
                        <strong>{novoNumeroSlides[currentSlide].descriptions[index]}</strong>
                      </p>
                    )}
                    <div className="rounded-lg overflow-hidden bg-gray-50 border border-gray-100 p-2">
                      <div className="w-[90%] mx-auto">
                        <img 
                          src={image} 
                          alt={`Step ${index + 1}`}
                          className="w-full h-auto lg:max-h-80 object-contain"
                          onError={(e) => { 
                            (e.target as HTMLImageElement).style.display = 'none'; 
                            (e.target as HTMLImageElement).parentElement!.innerHTML = '<div class="flex items-center justify-center p-2"><span class="text-gray-500 text-base sm:text-lg">📷 ' + image + '</span></div>'; 
                          }} 
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Indicadores de progresso */}
              <div className="flex justify-center gap-2 my-4">
                {novoNumeroSlides.map((_, index) => (
                  <div key={index} className={`w-2 h-2 rounded-full transition-colors ${index === currentSlide ? 'bg-gray-900' : 'bg-gray-300'}`} />
                ))}
              </div>

              <div className="grid gap-2">
                {currentSlide < novoNumeroSlides.length - 1 ? (
                  <>
                    <button
                      onClick={() => nextSlide()}
                      className="w-full py-3 bg-gray-900 text-white font-bold rounded-xl hover:bg-gray-800 transition-colors shadow-lg text-lg sm:text-xl"
                    >
                      Continuar
                    </button>
                    {currentSlide > 0 && (
                      <button onClick={() => prevSlide()} className="w-full py-3 text-gray-500 hover:text-gray-800 font-medium transition-colors">Voltar etapa anterior</button>
                    )}
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => {
                        setCurrentSlide(0);
                        goToStep('step_model_2_fuso');
                      }}
                      className="w-full py-4 bg-gray-900 text-white font-bold rounded-xl hover:bg-gray-800 transition-colors shadow-lg"
                    >
                      Continuar para Fuso Horário
                    </button>
                    <button onClick={() => prevSlide()} className="w-full py-3 text-gray-500 hover:text-gray-800 font-medium transition-colors">Voltar etapa anterior</button>
                  </>
                )}
                {currentSlide === 0 && (
                  <button onClick={() => {
                    if (cameFromModel1) {
                      goToStep('step_model_1');
                    } else {
                      goToStep('step_model_2', 4);
                    }
                  }} className="w-full py-3 text-gray-500 hover:text-gray-800 font-medium transition-colors">
                    {cameFromModel1 ? 'Voltar para início do Modelo 1' : 'Voltar para escolha anterior'}
                  </button>
                )}
              </div>
            </div>
          </div>
        );
      }

      // --- Model 2 Shared: Fuso Horário ---
      case 'step_model_2_fuso': {
        return (
          <div className="w-full text-center animate-fadeIn max-w-2xl mx-auto">
            <div className="w-full py-3">
              <p className="text-base sm:text-lg text-gray-500 font-bold tracking-wider uppercase mb-1">Passo 7</p>
              <h3 className="text-lg font-bold text-gray-900 mb-4">Fuso Horário</h3>
              <p className="text-gray-600 text-left mb-4 text-lg sm:text-xl">
                Após conectar, basta escolher o fuso horário, se estiver no horário de Brasília digite: <strong>São Paulo</strong> (será a opção América/São Paulo).
              </p>
              <div className="rounded-lg overflow-hidden mb-4 bg-gray-50 border border-gray-100 max-w-xs mx-auto">
                <img src="/fuso-horario.png" alt="Fuso Horário" className="w-full h-auto lg:max-h-96 object-contain" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; (e.target as HTMLImageElement).parentElement!.innerHTML = '<div class="flex items-center justify-center p-2"><span class="text-gray-500 text-base sm:text-lg">📷 /fuso-horario.png</span></div>'; }} />
              </div>
              <div className="grid gap-2 mt-5">
                <button onClick={() => goToStep('step_model_2_conclusao')} className="w-full py-3 bg-gray-900 text-white font-bold rounded-xl hover:bg-gray-800 transition-colors shadow-lg text-lg sm:text-xl">Próxima etapa</button>
                <button onClick={() => goToStep(cameFromModel1 ? 'step_model_1' : 'step_model_2')} className="w-full py-3 text-gray-500 hover:text-gray-800 font-medium transition-colors">
                  {cameFromModel1 ? 'Voltar (Reiniciar Modelo 1)' : 'Voltar (Reiniciar Modelo 2)'}
                </button>
              </div>
            </div>
          </div>
        );
      }

      // --- Model 2 Shared: Conclusão ---
      case 'step_model_2_conclusao': {
        return (
          <div className="w-full text-center animate-fadeIn max-w-2xl mx-auto">
            <div className="w-full py-3">
              <p className="text-base sm:text-lg text-gray-500 font-bold tracking-wider uppercase mb-1">Passo 8</p>
              <h3 className="text-lg font-bold text-gray-900 mb-4">Conclusão</h3>
              
              {/* Textos soltos */}
              <div className="space-y-3 mb-4">
                <div className="bg-orange-50 p-3 rounded-lg border border-orange-100">
                  <p className="text-gray-700 text-center text-lg sm:text-xl">
                    <strong>Importante:</strong> Para evitar problemas na conexão, ao clicar em "Concluir" não mexa em mais nada. Apenas aguarde até aparecer na tela do sistema que a conexão foi realizada. <strong>Não</strong> clique em outros botões do sistema e <strong>não</strong> atualize a página — o sistema fará isso automaticamente.
                  </p>
                </div>
                <p className="text-gray-700 text-center text-lg sm:text-xl">
                  Nesse momento basta apenas clicar em <strong>concluir</strong> e na tela do SecretáriaPlus, apenas aguarde.
                </p>
              </div>

              {/* Imagens - 100% largura */}
              <div className="grid grid-cols-1 gap-4 mb-4 max-w-md mx-auto">
                <div className="rounded-lg overflow-hidden bg-gray-50 border border-gray-100 p-2">
                  <div className="w-[90%] mx-auto">
                    <img 
                      src="/conectando.png" 
                      alt="Conectando" 
                      className="w-full h-auto lg:max-h-80 object-contain" 
                      onError={(e) => { 
                        (e.target as HTMLImageElement).style.display = 'none'; 
                        (e.target as HTMLImageElement).parentElement!.innerHTML = '<div class="flex items-center justify-center p-2"><span class="text-gray-500 text-base sm:text-lg">📷 /conectando.png</span></div>'; 
                      }} 
                    />
                  </div>
                </div>
                <div className="rounded-lg overflow-hidden bg-gray-50 border border-gray-100 p-2">
                  <div className="w-[90%] mx-auto">
                    <img 
                      src="/concluir.png" 
                      alt="Concluir" 
                      className="w-full h-auto lg:max-h-80 object-contain" 
                      onError={(e) => { 
                        (e.target as HTMLImageElement).style.display = 'none'; 
                        (e.target as HTMLImageElement).parentElement!.innerHTML = '<div class="flex items-center justify-center p-2"><span class="text-gray-500 text-base sm:text-lg">📷 /concluir.png</span></div>'; 
                      }} 
                    />
                  </div>
                </div>
              </div>
              <div className="grid gap-2 mt-5">
                <button onClick={() => window.location.reload()} className="w-full py-3 bg-gray-900 text-white font-bold rounded-xl hover:bg-gray-800 transition-colors shadow-lg text-lg sm:text-xl">Concluir</button>
                <button onClick={() => goToStep('step_model_2_fuso')} className="w-full py-3 text-gray-500 hover:text-gray-800 font-medium transition-colors">Voltar etapa anterior</button>
              </div>
            </div>
          </div>
        );
      }

      default:
        return <div>Etapa não implementada: {currentStep}</div>;
    }
  };

  const renderStepContent = () => {
    const layout = STEP_LAYOUT[currentStep] ?? DEFAULT_LAYOUT;
    return <StageSurface {...layout}>{renderStepBody()}</StageSurface>;
  };

  const stageIndex = WIZARD_STAGES.findIndex(stage => stage.steps.includes(currentStep));
  const safeStageIndex = stageIndex < 0 ? 0 : stageIndex;
  const activeStage = WIZARD_STAGES[safeStageIndex];

  // --- Main Render ---

  return (
    <div className="min-h-screen bg-white">
      {/* Progress bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-gray-100 z-50">
        <div 
          className="h-full bg-gray-900 transition-all duration-500 ease-out"
          style={{ width: `${calculateProgress()}%` }}
        />
      </div>

      <main className="mx-auto max-w-4xl px-6 pt-20 pb-32">
        {renderStepContent()}
      </main>
    </div>
  );
}
