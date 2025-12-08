"use client";

import React, { useState, useEffect } from 'react';

// --- Types ---

type StepId =
  // Stage 1
  | 'stage_1_whatsapp_type'
  | 'stage_1_migrate_warning'

  // Stage 2
  | 'stage_2_devices'
  | 'stage_2_no_computer'
  | 'stage_2_computer_no_mobile'
  | 'stage_2_tablet_check'
  | 'stage_2_os_selection'

  // Stage 3
  | 'stage_3_traffic_check'
  | 'stage_3_traffic_source'
  | 'stage_3_any_facebook'
  | 'stage_3_meta_access_check'
  | 'stage_3_meta_lost_access'
  | 'stage_3_meta_lost_access_path_2'

  // Existing Connection Steps
  | 'step_check_tabs'
  | 'step_connection_start';

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

const NotebookIcon = () => (
  <span className="text-4xl leading-none">💻</span>
);

// --- Main Component ---

export default function ConnectionWizardPage() {
  const [currentStep, setCurrentStep] = useState<StepId>('stage_1_whatsapp_type');
  const [devices, setDevices] = useState<DeviceState>({
    computer: false,
    tablet: false,
    mobile: false,
  });

  // Helpers to persist choices
  // Using a simple ref or state for quick access in session
  const saveChoice = (key: string, value: string) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(`wizard_${key}`, value);
    }
  };

  const goToStep = (step: StepId) => {
    setCurrentStep(step);
    window.scrollTo(0, 0);
  };

  const handleDeviceChange = (device: keyof DeviceState) => {
    setDevices(prev => ({ ...prev, [device]: !prev[device] }));
  };

  // --- Step Rendering ---

  const renderStepContent = () => {
    switch (currentStep) {

      // --- STAGE 1: WhatsApp Type ---

      case 'stage_1_whatsapp_type':
        return (
          <div className="space-y-8 animate-fadeIn">
            <h2 className="text-2xl font-bold text-gray-900 text-center">Qual WhatsApp você usa?</h2>

            <div className="grid gap-4 max-w-lg mx-auto">
              {/* WhatsApp Business Option */}
              <button
                onClick={() => goToStep('stage_2_devices')}
                className="flex items-center p-6 border-2 rounded-xl hover:bg-blue-50 hover:border-blue-500 transition-all text-left bg-white shadow-sm group"
              >
                <div className="mr-6 shrink-0 group-hover:scale-110 transition-transform">
                  <WhatsAppBusinessIcon />
                </div>
                <div>
                  <span className="block text-lg font-bold text-gray-900">WhatsApp Business</span>
                  <span className="text-sm text-gray-500">Versão para empresas</span>
                </div>
                <div className="ml-auto">
                  <div className="w-6 h-6 rounded-full border-2 border-gray-300 group-hover:border-blue-500 group-hover:bg-blue-500 flex items-center justify-center">
                    <div className="w-2.5 h-2.5 bg-white rounded-full opacity-0 group-hover:opacity-100" />
                  </div>
                </div>
              </button>

              {/* WhatsApp Common Option */}
              <button
                onClick={() => goToStep('stage_1_migrate_warning')}
                className="flex items-center p-6 border-2 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all text-left bg-white shadow-sm group"
              >
                <div className="mr-6 shrink-0 group-hover:scale-110 transition-transform">
                  <WhatsAppCommonIcon />
                </div>
                <div>
                  <span className="block text-lg font-bold text-gray-900">WhatsApp Normal</span>
                  <span className="text-sm text-gray-500">Versão pessoal</span>
                </div>
                <div className="ml-auto">
                  <div className="w-6 h-6 rounded-full border-2 border-gray-300 group-hover:border-gray-500 flex items-center justify-center">
                  </div>
                </div>
              </button>
            </div>
          </div>
        );

      case 'stage_1_migrate_warning':
        return (
          <div className="space-y-6 text-center animate-fadeIn max-w-xl mx-auto">
            <div className="bg-yellow-100 inline-block p-4 rounded-full mb-4">
              <svg className="w-12 h-12 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Necessário Migrar para Business</h2>
            <p className="text-gray-600 text-lg">
              Para usar nosso sistema, você <strong>precisa</strong> estar utilizando o WhatsApp Business.
              Por favor, faça o backup das suas conversas e migre para a versão Business antes de continuar.
            </p>
            <div className="pt-6">
              <button
                onClick={() => goToStep('stage_1_whatsapp_type')}
                className="px-8 py-3 bg-gray-900 text-white rounded-lg font-bold hover:bg-black transition-colors"
              >
                Voltar
              </button>
            </div>
          </div>
        );

      // --- STAGE 2: Devices ---

      case 'stage_2_devices':
        return (
          <div className="space-y-8 animate-fadeIn max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 text-center">O que você tem em mãos agora?</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Computer Option */}
              <label className={`
                    relative flex flex-col items-center justify-center p-6 border-2 rounded-xl cursor-pointer transition-all
                    ${devices.computer
                  ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-500 ring-offset-2'
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'}
               `}>
                <input
                  type="checkbox"
                  className="absolute opacity-0 w-full h-full cursor-pointer"
                  checked={devices.computer}
                  onChange={() => handleDeviceChange('computer')}
                />
                <div className="mb-3"><NotebookIcon /></div>
                <span className="font-bold text-gray-900">Computador / Notebook</span>
              </label>

              {/* Mobile Option */}
              <label className={`
                    relative flex flex-col items-center justify-center p-6 border-2 rounded-xl cursor-pointer transition-all
                    ${devices.mobile
                  ? 'border-green-500 bg-green-50 ring-2 ring-green-500 ring-offset-2'
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'}
               `}>
                <input
                  type="checkbox"
                  className="absolute opacity-0 w-full h-full cursor-pointer"
                  checked={devices.mobile}
                  onChange={() => handleDeviceChange('mobile')}
                />
                <div className="mb-3 text-4xl">📱</div>
                <span className="font-bold text-gray-900">Celular</span>
              </label>

              {/* Tablet Option */}
              <label className={`
                    relative flex flex-col items-center justify-center p-6 border-2 rounded-xl cursor-pointer transition-all sm:col-span-2
                    ${devices.tablet
                  ? 'border-purple-500 bg-purple-50 ring-2 ring-purple-500 ring-offset-2'
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'}
               `}>
                <input
                  type="checkbox"
                  className="absolute opacity-0 w-full h-full cursor-pointer"
                  checked={devices.tablet}
                  onChange={() => handleDeviceChange('tablet')}
                />
                <div className="mb-3 text-4xl">📟</div>
                <span className="font-bold text-gray-900">Tablet / iPad</span>
              </label>
            </div>

            <div className="pt-6 text-center space-y-3">
              <button
                onClick={() => {
                  if (!devices.computer) {
                    goToStep('stage_2_no_computer');
                  } else if (!devices.mobile) {
                    // Computer YES, Mobile NO
                    if (devices.tablet) {
                      goToStep('stage_2_tablet_check');
                    } else {
                      goToStep('stage_2_computer_no_mobile');
                    }
                  } else {
                    // Computer YES, Mobile YES
                    goToStep('stage_2_os_selection');
                  }
                }}
                disabled={!devices.computer && !devices.mobile && !devices.tablet}
                className="w-full max-w-md px-8 py-4 bg-blue-600 text-white text-lg font-bold rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
              >
                Continuar
              </button>
            </div>
          </div>
        );

      case 'stage_2_os_selection':
        return (
          <div className="space-y-8 animate-fadeIn max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 text-center">Configuração do Ambiente</h2>

            {/* Computer OS */}
            {devices.computer && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-700 text-center">1. Qual o sistema do seu computador?</h3>
                <div className="grid grid-cols-2 gap-4 max-w-lg mx-auto">
                  <button
                    onClick={() => setDevices(prev => ({ ...prev, computerType: 'windows' }))}
                    className={`flex flex-col items-center p-4 border-2 rounded-xl transition-all ${devices.computerType === 'windows'
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:bg-gray-50 text-gray-600'
                      }`}
                  >
                    <div className="mb-2"><WindowsIcon /></div>
                    <span className="font-bold">Windows</span>
                  </button>
                  <button
                    onClick={() => setDevices(prev => ({ ...prev, computerType: 'mac' }))}
                    className={`flex flex-col items-center p-4 border-2 rounded-xl transition-all ${devices.computerType === 'mac'
                      ? 'border-gray-800 bg-gray-100 text-gray-900'
                      : 'border-gray-200 hover:bg-gray-50 text-gray-600'
                      }`}
                  >
                    <div className="mb-2"><AppleIcon /></div>
                    <span className="font-bold">Mac / Apple</span>
                  </button>
                </div>
              </div>
            )}

            {/* Mobile OS (Shown if Mobile or Tablet is selected) */}
            {(devices.mobile || devices.tablet) && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-700 text-center">
                  {devices.mobile && devices.tablet ? '2. Qual o sistema do seu celular/tablet com WhatsApp?' :
                    devices.mobile ? '2. Qual o sistema do seu celular com WhatsApp?' :
                      '2. Qual o sistema do seu tablet com WhatsApp?'}
                </h3>
                <div className="grid grid-cols-2 gap-4 max-w-lg mx-auto">
                  <button
                    onClick={() => setDevices(prev => ({ ...prev, mobileType: 'android' }))}
                    className={`flex flex-col items-center p-4 border-2 rounded-xl transition-all ${devices.mobileType === 'android'
                      ? 'border-green-500 bg-green-50 text-green-700'
                      : 'border-gray-200 hover:bg-gray-50 text-gray-600'
                      }`}
                  >
                    <div className="mb-2"><AndroidIcon /></div>
                    <span className="font-bold">Android</span>
                  </button>
                  <button
                    onClick={() => setDevices(prev => ({ ...prev, mobileType: 'iphone' }))}
                    className={`flex flex-col items-center p-4 border-2 rounded-xl transition-all ${devices.mobileType === 'iphone'
                      ? 'border-gray-800 bg-gray-100 text-gray-900'
                      : 'border-gray-200 hover:bg-gray-50 text-gray-600'
                      }`}
                  >
                    <div className="mb-2"><AppleIcon /></div>
                    <span className="font-bold">{devices.mobile ? 'iPhone' : 'iPad / iPhone'}</span>
                  </button>
                </div>
              </div>
            )}

            <div className="pt-6 text-center">
              <button
                onClick={() => goToStep('stage_3_traffic_check')}
                disabled={(devices.computer && !devices.computerType) || ((devices.mobile || devices.tablet) && !devices.mobileType)}
                className="w-full max-w-md px-8 py-4 bg-blue-600 text-white text-lg font-bold rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
              >
                Continuar
              </button>
              {((devices.computer && !devices.computerType) || ((devices.mobile || devices.tablet) && !devices.mobileType)) && (
                <p className="text-sm text-gray-400 mt-2">Selecione os sistemas para continuar</p>
              )}
            </div>
          </div>
        );

      case 'stage_2_no_computer':
        return (
          <div className="space-y-6 text-center animate-fadeIn max-w-xl mx-auto">
            <div className="bg-red-50 p-8 rounded-2xl border border-red-100">
              <h3 className="text-xl font-bold text-red-900 mb-4">Computador é Obrigatório</h3>
              <p className="text-red-700 mb-8">
                Para realizar a configuração inicial com segurança e estabilidade, o Facebook exige o uso de um computador ou notebook.
              </p>

              <div className="space-y-3">
                <button
                  onClick={() => {
                    setDevices(prev => ({ ...prev, computer: true }));
                    goToStep('stage_2_devices');
                  }}
                  className="w-full py-4 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 transition-colors shadow-sm flex items-center justify-center gap-2"
                >
                  <NotebookIcon />
                  Agora consegui um computador
                </button>

                <button
                  onClick={() => alert('Abrir chat de suporte')}
                  className="w-full py-4 bg-white text-gray-600 font-medium rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  Não tenho computador aqui agora e nem depois
                </button>
              </div>
            </div>
            <button onClick={() => goToStep('stage_2_devices')} className="text-gray-500 hover:text-gray-800 underline">Voltar</button>
          </div>
        );

      case 'stage_2_computer_no_mobile':
        return (
          <div className="space-y-6 text-center animate-fadeIn max-w-xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900">Cadê o celular?</h2>
            <p className="text-gray-600 text-lg">
              É preciso que você esteja com o celular onde está o WhatsApp Business em mãos para continuar a conexão.
            </p>
            <div className="grid gap-3 pt-4">
              <button
                onClick={() => {
                  setDevices(prev => ({ ...prev, mobile: true }));
                  goToStep('stage_3_traffic_check');
                }}
                className="w-full py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors"
              >
                Estou com o celular aqui
              </button>
              <button
                onClick={() => alert('Por favor, busque o celular para continuar.')} // Could redirect to a "waiting" state
                className="w-full py-4 bg-white text-gray-700 border-2 border-dashed border-gray-300 font-bold rounded-xl hover:bg-gray-50 transition-colors"
              >
                Realmente não estou com ele agora
              </button>
            </div>
            <button onClick={() => goToStep('stage_2_devices')} className="text-gray-500 hover:text-gray-800 underline mt-4">Voltar</button>
          </div>
        );

      case 'stage_2_tablet_check':
        return (
          <div className="space-y-6 text-center animate-fadeIn max-w-xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900">WhatsApp no Tablet?</h2>
            <p className="text-gray-600 text-lg">
              O número do WhatsApp Business que você quer conectar está vinculado e funcionando neste Tablet/iPad?
            </p>
            <div className="grid gap-3 pt-4">
              <button
                onClick={() => goToStep('stage_2_os_selection')}
                className="w-full py-4 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 transition-colors shadow-sm text-sm"
              >
                Sim, uso o WhatsApp Business nele
              </button>
              <button
                onClick={() => goToStep('stage_2_computer_no_mobile')}
                className="w-full py-4 bg-white text-gray-700 border border-gray-300 font-bold rounded-xl hover:bg-gray-50 transition-colors"
              >
                Na verdade não estou com meu celular aqui
              </button>
            </div>
            <button onClick={() => goToStep('stage_2_devices')} className="text-gray-500 hover:text-gray-800 underline mt-4">Voltar</button>
          </div>
        );


      // --- STAGE 3: Traffic & Meta Logic ---

      case 'stage_3_traffic_check':
        return (
          <div className="space-y-8 animate-fadeIn max-w-xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 text-center">Sobre Tráfego Pago</h2>
            <p className="text-lg text-gray-600 text-center">
              Você roda tráfego pago <strong>direcionado para o número que você deseja conectar</strong>?
            </p>

            <div className="space-y-4">
              <button
                onClick={() => {
                  saveChoice('runs_ads', 'true');
                  goToStep('stage_3_traffic_source');
                }}
                className="w-full p-5 border-2 border-blue-100 bg-blue-50 rounded-xl text-left hover:border-blue-500 hover:bg-blue-100 transition-all group"
              >
                <span className="block text-xl font-bold text-blue-900 mb-1">Sim</span>
                <span className="text-blue-700">Faço anúncios para este número</span>
              </button>

              <button
                onClick={() => {
                  saveChoice('runs_ads', 'false');
                  goToStep('stage_3_any_facebook');
                }}
                className="w-full p-5 border-2 border-gray-100 bg-white rounded-xl text-left hover:border-gray-400 hover:bg-gray-50 transition-all group"
              >
                <span className="block text-xl font-bold text-gray-900 mb-1">Não</span>
                <span className="text-gray-600">Não faço anúncios ou faço para outro número</span>
              </button>
            </div>
            <button onClick={() => goToStep('stage_2_devices')} className="block mx-auto text-gray-500 hover:text-gray-800 underline mt-6">Voltar</button>
          </div>
        );

      case 'stage_3_traffic_source':
        return (
          <div className="space-y-8 animate-fadeIn max-w-xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 text-center">Como você roda seus anúncios?</h2>

            <div className="space-y-4">
              <button
                onClick={() => {
                  saveChoice('ad_platform', 'instagram_boost');
                  goToStep('stage_3_any_facebook');
                }}
                className="w-full p-5 border-2 border-gray-100 bg-white rounded-xl text-left hover:border-purple-500 hover:bg-purple-50 transition-all"
              >
                <span className="font-bold text-gray-900">Impulsionar do Instagram</span>
                <p className="text-sm text-gray-500 mt-1">Apenas clico no botão "Turbinar" ou "Impulsionar" direto no app</p>
              </button>

              <button
                onClick={() => {
                  saveChoice('ad_platform', 'meta_business');
                  goToStep('stage_3_meta_access_check');
                }}
                className="w-full p-5 border-2 border-gray-100 bg-white rounded-xl text-left hover:border-blue-500 hover:bg-blue-50 transition-all"
              >
                <span className="font-bold text-gray-900">Gerenciador de Anúncios (Meta)</span>
                <p className="text-sm text-gray-500 mt-1">Uso o painel profissional do Facebook/Meta</p>
              </button>
            </div>
            <button onClick={() => goToStep('stage_3_traffic_check')} className="block mx-auto text-gray-500 hover:text-gray-800 underline mt-6">Voltar</button>
          </div>
        );

      case 'stage_3_any_facebook':
        return (
          <div className="space-y-6 text-center animate-fadeIn max-w-xl mx-auto">
            <div className="bg-green-50 p-6 rounded-2xl border border-green-100 mb-6">
              <h3 className="text-xl font-bold text-green-900 mb-2">Qualquer Facebook Serve!</h3>
              <p className="text-green-800">
                Você pode usar <strong>qualquer conta do Facebook</strong> para fazer a conexão.
              </p>
              <p className="text-green-800 mt-2 text-sm">
                Não precisa ser a conta oficial da clínica. Pode ser seu perfil pessoal ou qualquer outro.
                Ninguém verá qual perfil foi usado para conectar.
              </p>
            </div>
            <button
              onClick={() => goToStep('step_check_tabs')}
              className="w-full py-4 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 transition-colors shadow-lg"
            >
              Entendi, vamos conectar
            </button>
            <button onClick={() => goToStep('stage_3_traffic_check')} className="text-gray-500 hover:text-gray-800 underline">Voltar</button>
          </div>
        );

      case 'stage_3_meta_access_check':
        return (
          <div className="space-y-8 animate-fadeIn max-w-xl mx-auto">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Conta Obrigatória</h2>
              <p className="text-gray-600">
                Como você usa o Meta Ads, você precisa entrar <strong>obrigatoriamente</strong> com a conta do Facebook que administra esses anúncios.
              </p>
            </div>

            <div className="space-y-4">
              <button
                onClick={() => {
                  saveChoice('meta_access', 'has_access');
                  goToStep('step_check_tabs');
                }}
                className="w-full p-5 bg-blue-600 text-white rounded-xl text-left hover:bg-blue-700 transition-all font-bold"
              >
                Tenho acesso a essa conta
              </button>

              <button
                onClick={() => {
                  saveChoice('meta_access', 'uncertain');
                  // user implies they don't know if it's the right account
                  // user implies they don't know if it's the right account
                  goToStep('step_check_tabs');
                }}
                className="w-full p-5 border-2 border-gray-200 bg-white rounded-xl text-left hover:border-orange-400 hover:bg-orange-50 transition-all"
              >
                Não tenho certeza se é a conta certa
              </button>

              <button
                onClick={() => goToStep('stage_3_meta_lost_access')}
                className="w-full p-5 border-2 border-red-100 bg-red-50 rounded-xl text-left hover:border-red-400 hover:bg-red-100 transition-all"
              >
                <span className="font-bold text-red-900">Não tenho acesso</span>
                <span className="block text-sm text-red-700">Tenho certeza que está em uma conta perdida</span>
              </button>
            </div>
            <button onClick={() => goToStep('stage_3_traffic_source')} className="block mx-auto text-gray-500 hover:text-gray-800 underline mt-6">Voltar</button>
          </div>
        );

      case 'stage_3_meta_lost_access':
        return (
          <div className="space-y-6 animate-fadeIn max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 text-center">Acesso Perdido</h2>

            <div className="bg-gray-50 p-6 rounded-xl space-y-4 text-gray-700">
              <p><strong>1. Gestor de Tráfego:</strong> Se essa conta pertence a algum gestor, entre em contato com ele.</p>
              <hr className="border-gray-200" />
              <p><strong>2. Perdeu para sempre?</strong> Ainda há esperança. Aconselhamos:</p>

              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <strong>Tentativa 1 (Simples):</strong> Tentar conectar com outro Facebook. Pode dar erro, mas se der, nós te ajudamos lá na frente.
                </li>
                <li>
                  <strong>Tentativa 2 (Avançada):</strong> Migrar o número para WhatsApp Pessoal (fazendo backup), esperar algumas horas e voltar para o Business. Isso "desvincula" o número da conta antiga à força.
                </li>
              </ul>
            </div>

            <div className="grid gap-4">
              <button
                onClick={() => {
                  saveChoice('lost_access_strategy', 'try_anyway');
                  goToStep('step_check_tabs');
                }}
                className="w-full p-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700"
              >
                Vou tentar conectar com outra conta por enquanto
              </button>

              <button
                onClick={() => goToStep('stage_3_meta_lost_access_path_2')}
                className="w-full p-4 border-2 border-gray-300 text-gray-700 rounded-xl font-bold hover:border-gray-400 hover:bg-gray-50"
              >
                Vou ter que fazer o caminho 2 (Migração)
              </button>
            </div>
            <button onClick={() => goToStep('stage_3_meta_access_check')} className="block mx-auto text-gray-500 hover:text-gray-800 underline">Voltar</button>
          </div>
        );

      case 'stage_3_meta_lost_access_path_2':
        return (
          <div className="space-y-8 animate-fadeIn max-w-xl mx-auto text-center">
            <h2 className="text-2xl font-bold text-gray-900">Caminho da Migração</h2>
            <p className="text-gray-600">
              Ok, realize o processo de migração (backup para app pessoal e depois business).
              <br />
              Assim que concluir, me avise:
            </p>

            <div className="space-y-4">
              <button
                onClick={() => alert('Abrir chat de suporte')}
                className="w-full p-4 border border-red-200 text-red-700 bg-red-50 rounded-xl font-bold hover:bg-red-100"
              >
                Preciso de ajuda
              </button>
              <button
                onClick={() => goToStep('step_check_tabs')}
                className="w-full p-4 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700"
              >
                Concluí o processo e quero conectar
              </button>
            </div>
            <button onClick={() => goToStep('stage_3_meta_lost_access')} className="block mx-auto text-gray-500 hover:text-gray-800 underline">Voltar</button>
          </div>
        );

      case 'step_check_tabs':
        return (
          <div className="space-y-6 text-center animate-fadeIn max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900">Atenção às Guias Abertas</h2>

            <div className="bg-orange-50 p-6 rounded-2xl border border-orange-100 text-left">
              <div className="flex items-start gap-4">
                <div className="text-3xl shrink-0">⚠️</div>
                <div>
                  <h3 className="text-lg font-bold text-orange-900 mb-2">Verifique se há outras guias de conexão</h3>
                  <p className="text-orange-800 text-sm mb-4">
                    Ter múltiplas abas de conexão do Facebook abertas impede a integração. Feche-as antes de continuar.
                  </p>

                  <div className="bg-white/80 p-4 rounded-lg border border-orange-200 text-sm text-gray-700">
                    <strong>Como verificar no seu {devices.computerType === 'mac' ? 'Mac' : 'Windows'}:</strong>

                    {devices.computerType === 'mac' ? (
                      <ul className="list-disc pl-5 mt-2 space-y-1">
                        <li>Na parte superior do navegador, veja se já não tem uma guia de conexão do Facebook aberta. Se sim, feche-a. ❌</li>
                        <li>Ou clique com o <strong>botão direito</strong> no ícone do navegador na parte inferior para encontrar guias ocultas.</li>
                      </ul>
                    ) : (
                      <ul className="list-disc pl-5 mt-2 space-y-1">
                        <li>Na parte superior do navegador, verifique se já não tem uma guia de conexão aberta. ❌</li>
                        <li>Ou passe o mouse na barra de tarefas inferior para encontrar janelas abertas do navegador.</li>
                      </ul>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={() => goToStep('step_connection_start')}
              className="w-full py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors shadow-lg px-8"
            >
              Já verifiquei e fechei tudo, continuar
            </button>
          </div>
        );

      case 'step_connection_start':
        return (
          <div className="space-y-8 animate-fadeIn max-w-3xl mx-auto py-12">

            {/* Connection Header */}
            <div className="text-center space-y-4">
              <div className="bg-blue-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-12 h-12 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12c0 5.52 4.48 10 10 10s10-4.48 10-10c0-5.52-4.48-10-10-10zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-gray-900">Hora de Conectar</h2>
              <p className="text-gray-600">
                Clique no botão abaixo. Uma janela do Facebook se abrirá.
              </p>
              <button
                onClick={() => alert('Start Facebook SDK Login...')}
                className="w-full max-w-lg py-5 bg-[#1877F2] text-white text-xl font-bold rounded-xl hover:bg-[#166fe5] transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1 mx-auto block"
              >
                Conectar com Facebook
              </button>
            </div>

            {/* Guide Section */}
            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200 mt-12">
              <h3 className="text-xl font-bold text-gray-800 mb-6 text-center border-b pb-4">Guia: O que fazer na janela que abrir?</h3>

              <div className="grid md:grid-cols-2 gap-8">
                {/* Model 1 & 2 Explainer */}
                <div className="space-y-4">
                  <h4 className="font-bold text-gray-700 flex items-center gap-2">
                    <span>1. Identifique o Modelo</span>
                  </h4>
                  <p className="text-sm text-gray-600">
                    O Facebook pode mostrar telas diferentes. Identifique se você vê o <strong>Modelo 1</strong> (mais comum) ou <strong>Modelo 2</strong>.
                  </p>
                  <div className="text-xs bg-white p-3 rounded border text-gray-500">
                    <strong>Dica:</strong> Se pedir para criar portfólio, use o nome da sua clínica. Se pedir site, use seu Instagram (ex: https://instagram.com/suaclinica).
                  </div>
                </div>

                {/* QR Code Instructions (Dynamic) */}
                <div className="space-y-4">
                  <h4 className="font-bold text-gray-700 flex items-center gap-2">
                    {devices.mobileType === 'iphone' ? (
                      <svg className="w-6 h-6 text-gray-700" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M15.5 2c-.22 0-.44-.01-.66-.02-.85 1.17-2.18 2-3.84 2-2.83 0-5.12-2.29-5.12-5.12 0-2.25 1.46-4.16 3.5-4.83C11.3 2.63 10.03 2 8.5 2 5.46 2 3 4.46 3 7.5c0 2.61 1.8 4.8 4.2 5.39-.2.81-.3 1.66-.3 2.55 0 3.87 3.13 7 7 7 3.87 0 7-3.13 7-7 0-1.72-.62-3.3-1.65-4.54.02-.02.04-.04.06-.06.22-.22.4-.47.54-.75.1-.19.18-.39.25-.6.07-.2.12-.4.16-.6.04-.2.06-.4.06-.6 0-.55-.45-1-1-1zM15.5 20c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z" />
                      </svg>
                    ) : (
                      <svg className="w-6 h-6 text-gray-700" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M7 2v10h3v-2h4v2h3V2H7zm0 12v8h10v-8H7zm4 2h2v2h-2v-2z" />
                      </svg>
                    )}
                    <span>2. Como ler o QR Code no {devices.mobileType === 'iphone' ? 'iPhone' : 'Android'}</span>
                  </h4>

                  <div className="bg-white p-4 rounded-lg border border-gray-200 text-sm space-y-2">
                    <p className="font-semibold text-gray-900">Caminho no seu WhatsApp Business:</p>
                    {devices.mobileType === 'iphone' ? (
                      <div className="flex flex-col gap-2 text-gray-600">
                        <span>⚙️ Configurações</span>
                        <span>↓</span>
                        <span>🔑 Conta</span>
                        <span>↓</span>
                        <span>Plataforma do WhatsApp Business</span>
                        <span>↓</span>
                        <span>Conectar-se agora (Ler QR Code)</span>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-2 text-gray-600">
                        <span>••• Três pontinhos (canto superior)</span>
                        <span>↓</span>
                        <span>⚙️ Configurações</span>
                        <span>↓</span>
                        <span>🔑 Conta</span>
                        <span>↓</span>
                        <span>Plataforma Comercial</span>
                        <span>↓</span>
                        <span>Conectar-se agora (Ler QR Code)</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

          </div>
        );

      default:
        return <div>Etapa não implementada: {currentStep}</div>;
    }
  };

  // --- Main Render ---

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900">
      {/* Header - Simplified */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 h-20 flex items-center justify-center">
          <h1 className="text-xl font-bold text-gray-900">Configuração de Conexão</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-12">
        {renderStepContent()}
      </main>
    </div>
  );
}
