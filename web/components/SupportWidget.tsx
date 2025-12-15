'use client';

/* eslint-disable @next/next/no-img-element */

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';

const ACCEPTED_FILE_TYPES = [
  'image/png',
  'image/jpeg',
  'image/webp',
  'image/heic',
  'audio/mpeg',
  'audio/wav',
  'audio/webm',
  'audio/mp4',
];

const MAX_FILES = 5;

// Timers configuráveis
const BOT_TYPING_INDICATOR_DELAY_MS = 2000; // delay para mostrar animação "digitando..." do bot
const TYPING_GRACE_MS = 6000; // janela para detectar que a pessoa começou a digitar
const USER_IDLE_TIMEOUT_MS = 60000; // espera antes de mandar a resposta se ela não envia nada

// Mensagens de "aguardando digitação" - todas as variantes são equivalentes
const TYPING_PROMPT_VARIANTS = [
  'Eu vi que você está digitando, vou aguardar você...',
  'Pode falar, vi que está digitando...',
  'vou esperar você mandar o que está digitando, mas estou por aqui.',
  'Pode mandar mais detalhes se quiser, vou aguardar.',
  'vi que você está digitando né... vou esperar você concluir que ai te ajudo melhor',
];

// Mapeamento de StepId para nome amigável
const STEP_NAMES: Record<string, string> = {
  'stage_1_whatsapp_type': 'Seleção do Tipo de WhatsApp',
  'stage_1_migrate_warning': 'Aviso de Migração para Business',
  'stage_2_devices': 'Seleção de Dispositivos',
  'stage_2_no_computer': 'Aviso: Computador Obrigatório',
  'stage_2_no_computer_support': 'Suporte: Sem Computador',
  'stage_2_computer_no_mobile': 'Aviso: Celular Necessário',
  'stage_2_tablet_check': 'Verificação de WhatsApp no Tablet',
  'stage_2_os_selection': 'Seleção de Sistema Operacional',
  'stage_3_traffic_check': 'Verificação de Tráfego Pago',
  'stage_3_traffic_source': 'Fonte de Anúncios',
  'stage_3_any_facebook': 'Info: Qualquer Facebook Serve',
  'stage_3_meta_access_check': 'Verificação de Acesso ao Meta',
  'stage_3_meta_access_uncertain': 'Incerteza sobre Conta Meta',
  'stage_3_meta_lost_access': 'Orientação: Acesso Perdido',
  'stage_3_meta_lost_access_options': 'Opções: Acesso Perdido',
  'stage_3_meta_lost_access_path_2': 'Processo de Migração',
  'step_inside_system': 'Dentro do Sistema',
  'step_check_taebs_mac': 'Verificação de Abas (Mac)',
  'step_check_tabs_windows': 'Verificação de Abas (Windows)',
  'step_connection_start': 'Início da Conexão',
  'step_model_1': 'Conexão - Modelo 1',
  'step_model_2': 'Conexão - Modelo 2',
  'step_model_2_sim': 'Modelo 2 - Confirmação',
  'step_model_2_nao_iphone': 'Modelo 2 - iPhone',
  'step_model_2_nao_android': 'Modelo 2 - Android',
  'step_model_2_novo_numero': 'Modelo 2 - Novo Número',
  'step_model_2_fuso': 'Modelo 2 - Fuso Horário',
  'step_model_2_conclusao': 'Modelo 2 - Conclusão',
  'step_celebration': 'Conexão Concluída',
};

const getStepDisplayName = (stepId?: string): string => {
  if (!stepId) return 'Etapa não identificada';
  return STEP_NAMES[stepId] || stepId;
};

type ChatMessage = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  imageUrls?: string[];
  audioUrl?: string;
};

type UploadStatus = 'idle' | 'sending' | 'success' | 'error';

interface SupportWidgetProps {
  currentStep?: string;
  journeyContext?: string;
}

function AudioPlayer({ audioUrl, isUserMessage }: { audioUrl: string; isUserMessage: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <audio
        controls
        src={audioUrl}
        className="flex-1 h-10 max-w-[220px]"
        style={{
          filter: isUserMessage ? 'invert(1) brightness(1.5)' : 'none',
        }}
      />
      <svg
        className={`w-5 h-5 shrink-0 ${isUserMessage ? 'text-white/80' : 'text-gray-500'}`}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 3a4 4 0 0 0-4 4v4a4 4 0 0 0 8 0V7a4 4 0 0 0-4-4Z" />
        <path d="M19 11v1a7 7 0 0 1-14 0v-1" />
        <path d="M12 19v3" />
      </svg>
    </div>
  );
}

function MarkdownContent({ content }: { content: string }) {
  return (
    <div className="markdown-content text-sm sm:text-lg leading-relaxed">
      <ReactMarkdown
        components={{
          h1: ({ children }) => (
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mt-4 mb-3 pb-2 border-b border-gray-200 first:mt-0">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mt-4 mb-2 first:mt-0">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-base sm:text-lg font-semibold text-gray-800 mt-3 mb-2 first:mt-0">
              {children}
            </h3>
          ),
          h4: ({ children }) => (
            <h4 className="text-sm sm:text-base font-semibold text-gray-800 mt-2 mb-1 first:mt-0">
              {children}
            </h4>
          ),
          p: ({ children }) => (
            <p className="text-sm sm:text-lg text-gray-800 mb-3 last:mb-0 leading-relaxed">
              {children}
            </p>
          ),
          ul: ({ children }) => (
            <ul className="my-3 space-y-2 pl-1">
              {children}
            </ul>
          ),
          ol: ({ children }) => {
            let counter = 0;
            return (
              <ol className="my-3 space-y-3 pl-1">
                {React.Children.map(children, (child) => {
                  if (React.isValidElement<{ children: React.ReactNode }>(child) && child.type === 'li') {
                    counter++;
                    return (
                      <li className="flex items-start gap-3 text-sm sm:text-lg text-gray-800">
                        <span className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold mt-0.5">
                          {counter}
                        </span>
                        <span className="flex-1">{child.props.children}</span>
                      </li>
                    );
                  }
                  return child;
                })}
              </ol>
            );
          },
          li: ({ children }) => (
            <li className="flex items-start gap-2 text-sm sm:text-lg text-gray-800">
              <span className="text-blue-500 mt-1.5 text-xs">●</span>
              <span className="flex-1">{children}</span>
            </li>
          ),
          strong: ({ children }) => (
            <strong className="font-semibold text-gray-900">{children}</strong>
          ),
          em: ({ children }) => (
            <em className="italic text-gray-700">{children}</em>
          ),
          a: ({ href, children }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline underline-offset-2 transition-colors"
            >
              {children}
            </a>
          ),
          code: ({ className, children }) => {
            const isInline = !className;
            if (isInline) {
              return (
                <code className="bg-gray-200 text-gray-800 px-1.5 py-0.5 rounded text-sm font-mono">
                  {children}
                </code>
              );
            }
            return (
              <code className="block bg-gray-800 text-gray-100 p-3 rounded-lg text-sm font-mono overflow-x-auto my-2">
                {children}
              </code>
            );
          },
          pre: ({ children }) => (
            <pre className="bg-gray-800 text-gray-100 p-4 rounded-lg overflow-x-auto my-3 text-sm">
              {children}
            </pre>
          ),
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-blue-400 bg-blue-50 pl-4 py-2 my-3 rounded-r-lg italic text-gray-700">
              {children}
            </blockquote>
          ),
          hr: () => (
            <hr className="my-4 border-t border-gray-300" />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}

const createWelcomeMessage = (): ChatMessage => ({
  id: 'welcome',
  role: 'assistant',
  content:
    'Oii, explica pra mim o que você ta vendo ou qual problema ta acontecendo, se quiser explicar por audio talvez seja mais facil expressar o que deseja, pode mandar foto/print do problema, fique a vontade!',
  timestamp: new Date(),
});

export function SupportWidget({ currentStep, journeyContext }: SupportWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([createWelcomeMessage()]);
  const [files, setFiles] = useState<File[]>([]);
  const [filePreviews, setFilePreviews] = useState<{ id: string; url: string | null }[]>([]);
  const [audioPreview, setAudioPreview] = useState<{ file: File; url: string } | null>(null);
  const [status, setStatus] = useState<UploadStatus>('idle');
  const [error, setError] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [photoPreview, setPhotoPreview] = useState<{ file: File; url: string } | null>(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [dragStartY, setDragStartY] = useState<number | null>(null);
  const [dragCurrentY, setDragCurrentY] = useState<number | null>(null);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const [showBotTyping, setShowBotTyping] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const cameraInputRef = useRef<HTMLInputElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const recordingTimerRef = useRef<NodeJS.Timeout | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // === REFS PARA LÓGICA DE DIGITAÇÃO ===
  const graceWindowTimerRef = useRef<NodeJS.Timeout | null>(null); // Timer de 6s
  const idleTimeoutTimerRef = useRef<NodeJS.Timeout | null>(null); // Timer de 60s
  const botTypingTimerRef = useRef<NodeJS.Timeout | null>(null); // Timer de 2s para animação do bot
  const idleAfterClearTimerRef = useRef<NodeJS.Timeout | null>(null); // Timer de 6s após apagar texto

  const pendingResponseRef = useRef<string | null>(null); // Resposta da API aguardando
  const isRequestInFlightRef = useRef(false); // Se há requisição em andamento
  const isWaitingForUserRef = useRef(false); // Se estamos no modo "aguardando usuário"
  const userTypedInSessionRef = useRef(false); // Se usuário digitou nesta sessão
  const firstTypingTimestampRef = useRef<number | null>(null); // Quando digitou o primeiro caractere
  const typingPromptSentRef = useRef(false); // Se já enviamos TYPING_PROMPT neste ciclo
  const responseCycleRef = useRef(0); // Incrementa a cada resposta do assistant
  const graceWindowAllowedRef = useRef(false); // Se é permitido reiniciar o timer de 6s (só uma vez por mensagem)

  const queuedMessagesRef = useRef<{ payload: string; files: File[] }[]>([]);
  const pendingRequestPayloadRef = useRef<string | null>(null);
  const pendingRequestFilesRef = useRef<File[]>([]);

  const stageContextRef = useRef<string | null>(null);
  const journeyContextRef = useRef<string | null>(null);

  const [audioDuration, setAudioDuration] = useState(0);
  const [audioProgress, setAudioProgress] = useState(0);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [audioVolume, setAudioVolume] = useState(1);

  // === FUNÇÕES AUXILIARES ===

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const captureStageContext = () => {
    if (!currentStep) {
      stageContextRef.current = null;
      journeyContextRef.current = journeyContext || null;
      return;
    }
    const friendly = getStepDisplayName(currentStep);
    stageContextRef.current = `${friendly} (${currentStep})`;
    journeyContextRef.current = journeyContext || null;
  };

  const withStageContext = (payload: string) => {
    const stage = stageContextRef.current;
    const journeyDetails = journeyContextRef.current;
    if (!stage) {
      return journeyDetails ? `${journeyDetails}\n\n${payload}` : payload;
    }
    const header = journeyDetails
      ? `Agora estou nessa etapa: ${stage}\nCaminho até agora:\n${journeyDetails}`
      : `Agora estou nessa etapa: ${stage}`;
    return `${header}\n\n${payload}`;
  };

  const resizeTextarea = () => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, 260)}px`;
  };

  const clearAudioPreview = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    if (audioPreview?.url) {
      URL.revokeObjectURL(audioPreview.url);
    }
    setAudioPreview(null);
    setAudioDuration(0);
    setAudioProgress(0);
    setIsAudioPlaying(false);
    setAudioVolume(1);
    setShowVolumeSlider(false);
  };

  // === FUNÇÕES DE CONTROLE DE TIMERS ===

  const clearAllTypingTimers = () => {
    if (graceWindowTimerRef.current) {
      clearTimeout(graceWindowTimerRef.current);
      graceWindowTimerRef.current = null;
    }
    if (idleTimeoutTimerRef.current) {
      clearTimeout(idleTimeoutTimerRef.current);
      idleTimeoutTimerRef.current = null;
    }
    if (botTypingTimerRef.current) {
      clearTimeout(botTypingTimerRef.current);
      botTypingTimerRef.current = null;
    }
    if (idleAfterClearTimerRef.current) {
      clearTimeout(idleAfterClearTimerRef.current);
      idleAfterClearTimerRef.current = null;
    }
    setShowBotTyping(false);
  };

  const resetTypingSession = () => {
    clearAllTypingTimers();
    pendingResponseRef.current = null;
    isWaitingForUserRef.current = false;
    userTypedInSessionRef.current = false;
    firstTypingTimestampRef.current = null;
    typingPromptSentRef.current = false;
    graceWindowAllowedRef.current = false;
    queuedMessagesRef.current = [];
  };

  // === LÓGICA PRINCIPAL DE DIGITAÇÃO ===

  /**
   * Envia a resposta do assistant para o chat
   */
  const sendAssistantMessage = (content: string) => {
    const sanitizedContent = content?.trim() || 'Recebemos sua solicitação.';
    const assistantMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'assistant',
      content: sanitizedContent,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, assistantMessage]);
    setShowBotTyping(false);

    // Reset para novo ciclo
    clearAllTypingTimers();
    pendingResponseRef.current = null;
    isWaitingForUserRef.current = false;
    userTypedInSessionRef.current = false;
    firstTypingTimestampRef.current = null;
    typingPromptSentRef.current = false;
    responseCycleRef.current += 1;

    console.log('✅ Resposta do assistant enviada, ciclo resetado');
  };

  /**
   * Mostra mensagem de "vou esperar você digitar"
   */
  const showTypingPrompt = () => {
    if (typingPromptSentRef.current) {
      console.log('⏭️ TYPING_PROMPT já enviada neste ciclo, ignorando');
      return;
    }

    console.log('💬 Mostrando TYPING_PROMPT');
    const promptMessage = TYPING_PROMPT_VARIANTS[Math.floor(Math.random() * TYPING_PROMPT_VARIANTS.length)];

    const typingMessage: ChatMessage = {
      id: `typing-${Date.now()}`,
      role: 'assistant',
      content: promptMessage,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, typingMessage]);
    typingPromptSentRef.current = true;
    setShowBotTyping(false);
  };

  /**
   * Chamado quando os 6s expiram
   */
  const onGraceWindowExpired = () => {
    console.log(`⏰ 6s expiraram. Usuário digitou? ${userTypedInSessionRef.current}`);
    
    // Não permitir mais reinício do timer de 6s após expirar
    graceWindowAllowedRef.current = false;

    if (userTypedInSessionRef.current) {
      // Usuário DIGITOU mas não enviou ainda
      if (pendingResponseRef.current) {
        // API já respondeu → mostrar TYPING_PROMPT
        showTypingPrompt();
      }
      // Se API não respondeu, queueAssistantResponse vai mostrar quando responder
    } else {
      // Usuário NÃO digitou em 6s → enviar resposta direto (se tiver)
      if (pendingResponseRef.current) {
        sendAssistantMessage(pendingResponseRef.current);
      }
    }
  };

  /**
   * Chamado quando os 60s expiram (desde o primeiro caractere)
   */
  const onIdleTimeoutExpired = () => {
    console.log('⏰ 60s expiraram desde o primeiro caractere');
    
    if (pendingResponseRef.current) {
      sendAssistantMessage(`Como não me enviou ainda, já vou adiantar:\n\n${pendingResponseRef.current}`);
    }
  };

  /**
   * Inicia a janela de 6s para verificar se usuário digita
   */
  const startGraceWindow = () => {
    // Limpar timer anterior se existir
    if (graceWindowTimerRef.current) {
      clearTimeout(graceWindowTimerRef.current);
    }

    isWaitingForUserRef.current = true;
    console.log('🚀 Iniciando janela de 6s');

    graceWindowTimerRef.current = setTimeout(() => {
      graceWindowTimerRef.current = null;
      onGraceWindowExpired();
    }, TYPING_GRACE_MS);
  };

  /**
   * Chamado quando a API retorna uma resposta
   */
  const queueAssistantResponse = (responseText: string) => {
    const normalizedResponse = responseText?.trim() || 'Recebemos sua solicitação.';
    console.log('📥 Resposta da API recebida');

    pendingResponseRef.current = normalizedResponse;

    // Se usuário já digitou E a janela de 6s já passou → mostrar TYPING_PROMPT agora
    if (userTypedInSessionRef.current && !graceWindowTimerRef.current) {
      console.log('📝 Usuário já digitou e 6s já passaram, mostrando TYPING_PROMPT');
      showTypingPrompt();
      return;
    }

    // Se usuário NÃO digitou E a janela de 6s já passou → enviar resposta
    if (!userTypedInSessionRef.current && !graceWindowTimerRef.current) {
      console.log('📤 Usuário não digitou e 6s já passaram, enviando resposta');
      sendAssistantMessage(normalizedResponse);
      return;
    }

    // Se ainda está na janela de 6s, não fazer nada (o timer vai resolver)
    console.log('⏳ Janela de 6s ainda ativa, aguardando...');
  };

  /**
   * Chamado quando o usuário começa a digitar
   */
  const handleTypingStart = () => {
    // Só detectar se estamos aguardando (requisição em andamento ou resposta pendente)
    if (!isRequestInFlightRef.current && !pendingResponseRef.current && !isWaitingForUserRef.current) {
      return;
    }

    // Limpar timer de "idle after clear" se existir
    if (idleAfterClearTimerRef.current) {
      clearTimeout(idleAfterClearTimerRef.current);
      idleAfterClearTimerRef.current = null;
    }

    console.log('⌨️ Usuário digitou');

    // PRIMEIRO caractere desta sessão?
    if (!userTypedInSessionRef.current) {
      userTypedInSessionRef.current = true;
      firstTypingTimestampRef.current = Date.now();
      console.log('🎯 Primeiro caractere detectado - iniciando timer de 60s');

      // Iniciar timer de 60s (só no primeiro caractere)
      if (idleTimeoutTimerRef.current) {
        clearTimeout(idleTimeoutTimerRef.current);
      }
      idleTimeoutTimerRef.current = setTimeout(() => {
        idleTimeoutTimerRef.current = null;
        onIdleTimeoutExpired();
      }, USER_IDLE_TIMEOUT_MS);
    }

    // NÃO reiniciar janela de 6s a cada caractere
    // O timer de 6s só é reiniciado quando o usuário ENVIA uma nova mensagem (em processUserSend)
  };

  /**
   * Chamado quando o usuário apaga todo o texto
   */
  const handleTextCleared = () => {
    if (!isWaitingForUserRef.current || !userTypedInSessionRef.current) {
      return;
    }

    console.log('🗑️ Usuário apagou todo o texto');

    // Limpar timer de idle anterior se existir
    if (idleAfterClearTimerRef.current) {
      clearTimeout(idleAfterClearTimerRef.current);
    }

    // Iniciar timer de 6s - se não voltar a digitar, envia a resposta
    idleAfterClearTimerRef.current = setTimeout(() => {
      idleAfterClearTimerRef.current = null;
      console.log('⏰ 6s após apagar texto sem digitar novamente');
      
      if (pendingResponseRef.current) {
        sendAssistantMessage(pendingResponseRef.current);
      }
    }, TYPING_GRACE_MS);
  };

  // === SUBMIT E API ===

  const submitSupportRequest = async (payloadText: string, attachments: File[]) => {
    if (isRequestInFlightRef.current) {
      console.log('📋 Requisição em andamento, acumulando mensagem na fila');
      queuedMessagesRef.current.push({ payload: payloadText, files: attachments });
      return;
    }

    isRequestInFlightRef.current = true;
    setStatus('sending');
    setError(null);

    pendingRequestPayloadRef.current = payloadText;
    pendingRequestFilesRef.current = attachments;

    try {
      const payload = new FormData();
      payload.append('message', payloadText);
      payload.append('contact', '');
      attachments.forEach(file => payload.append('files', file));

      const response = await fetch('/api/support', {
        method: 'POST',
        body: payload,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Não foi possível enviar sua solicitação.');
      }

      // Verificar se há mensagens acumuladas
      if (queuedMessagesRef.current.length > 0) {
        console.log(`📨 ${queuedMessagesRef.current.length} mensagem(ns) acumulada(s)`);
        
        let combinedPayload = payloadText;
        let combinedFiles = [...attachments];
        
        for (const queued of queuedMessagesRef.current) {
          combinedPayload += `\n\n[MENSAGEM ADICIONAL DO USUÁRIO]\n${queued.payload}`;
          combinedFiles = [...combinedFiles, ...queued.files].slice(0, MAX_FILES);
        }
        
        queuedMessagesRef.current = [];
        pendingRequestPayloadRef.current = combinedPayload;
        pendingRequestFilesRef.current = combinedFiles;
        
        isRequestInFlightRef.current = false;
        await submitSupportRequest(combinedPayload, combinedFiles);
        return;
      }

      const assistantResponse = data.reply || data.message || 'Recebemos sua solicitação.';
      queueAssistantResponse(assistantResponse);
      setStatus('success');
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'Erro inesperado.');
      setStatus('error');
    } finally {
      isRequestInFlightRef.current = false;
    }
  };

  const processUserSend = async (
    displayMessage: string, 
    outboundMessage: string, 
    filesToSend: File[], 
    imageUrls: string[] = [], 
    audioUrl?: string
  ) => {
    if (!stageContextRef.current) {
      captureStageContext();
    }

    const messageWithContext = withStageContext(outboundMessage);

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: displayMessage,
      timestamp: new Date(),
      imageUrls: imageUrls.length ? imageUrls : undefined,
      audioUrl: audioUrl,
    };

    setMessages(prev => [...prev, userMessage]);

    // Guardar estado anterior para verificar se precisa combinar mensagens
    const hadPendingResponse = Boolean(pendingResponseRef.current);
    const previousPayload = pendingRequestPayloadRef.current;
    const previousFiles = pendingRequestFilesRef.current;

    // RESET completo para novo ciclo
    clearAllTypingTimers();
    pendingResponseRef.current = null;
    userTypedInSessionRef.current = false;
    firstTypingTimestampRef.current = null;
    // NÃO resetar typingPromptSentRef aqui - só reseta quando assistant envia resposta real
    graceWindowAllowedRef.current = true; // Permitir reinício do timer de 6s para esta nova mensagem

    // Preparar payload
    let payloadForAssistant = messageWithContext;
    let filesForAssistant = filesToSend;

    if (hadPendingResponse && previousPayload) {
      payloadForAssistant = `${previousPayload}\n\n[MENSAGEM ADICIONAL DO USUÁRIO]\n${messageWithContext}`;
      const existingFiles = previousFiles || [];
      filesForAssistant = [...existingFiles, ...filesToSend].slice(0, MAX_FILES);
    }

    // Iniciar timer de 2s para animação do bot
    console.log('🤖 Animação "digitando..." aparecerá em 2s');
    botTypingTimerRef.current = setTimeout(() => {
      botTypingTimerRef.current = null;
      setShowBotTyping(true);
    }, BOT_TYPING_INDICATOR_DELAY_MS);

    // Iniciar janela de 6s para detectar se usuário vai digitar mais
    startGraceWindow();

    // Enviar para API
    await submitSupportRequest(payloadForAssistant, filesForAssistant);
    clearAudioPreview();
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const hasContent = message.trim() || files.length > 0;
    if (!hasContent) return;

    if (!stageContextRef.current) {
      captureStageContext();
    }

    const displayMessage = message.trim() || (files.length > 0 ? '🎤 Áudio enviado' : '');
    const outboundMessage = message.trim() || displayMessage || 'Mensagem com anexo';

    const imageUrls = files
      .filter(f => f.type.startsWith('image/'))
      .map(f => URL.createObjectURL(f));

    const filesToSend = [...files];
    setMessage('');
    setFiles([]);

    await processUserSend(displayMessage, outboundMessage, filesToSend, imageUrls);
  };

  // === EFFECTS ===

  useEffect(() => {
    if (audioPreview) {
      setAudioDuration(0);
      setAudioProgress(0);
      setIsAudioPlaying(false);
      setAudioVolume(1);
    }

    const previews = files.map((file, index) => {
      const isImage = file.type.startsWith('image/');
      const url = isImage ? URL.createObjectURL(file) : null;
      return {
        id: `${file.name}-${file.lastModified}-${file.size}-${index}`,
        url,
      };
    });

    setFilePreviews(previews);

    return () => {
      previews.forEach(preview => {
        if (preview.url) {
          URL.revokeObjectURL(preview.url);
        }
      });
    };
  }, [files, audioPreview]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    resizeTextarea();
  }, [message]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = audioVolume;
    }
  }, [audioVolume]);

  useEffect(() => {
    return () => {
      clearAudioPreview();
      resetTypingSession();
    };
  }, []);

  // === MODAL E CAMERA ===

  const closeModal = () => {
    setIsOpen(false);
    setStatus('idle');
    setError(null);
    stopRecording();
    setDragStartY(null);
    setDragCurrentY(null);
    closeCamera();
    if (photoPreview) {
      URL.revokeObjectURL(photoPreview.url);
      setPhotoPreview(null);
    }
    resetTypingSession();
    clearAudioPreview();
  };

  const resetChat = async () => {
    setMessages([createWelcomeMessage()]);
    captureStageContext();
    resetTypingSession();
    clearAudioPreview();
    setMessage('');
    setFiles([]);
    setStatus('idle');
    setError(null);

    if (currentStep) {
      setStatus('sending');
      
      const stepContext = `[Usuário reiniciou o suporte. Está na etapa: ${getStepDisplayName(currentStep)} (${currentStep})]\n\nUsuário solicitou começar do zero.`;

      try {
        const payload = new FormData();
        payload.append('message', stepContext);
        payload.append('contact', '');

        const response = await fetch('/api/support', {
          method: 'POST',
          body: payload,
        });

        const data = await response.json();

        if (response.ok) {
          const assistantMessage: ChatMessage = {
            id: Date.now().toString(),
            role: 'assistant',
            content: data.reply || 'Claro! Vamos começar do zero. Como posso te ajudar?',
            timestamp: new Date(),
          };

          setMessages(prev => [...prev, assistantMessage]);
        }
        setStatus('idle');
      } catch (err) {
        console.error(err);
        setStatus('idle');
      }
    }
  };

  const openCamera = async () => {
    try {
      handleTypingStart();
      
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'environment',
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        },
        audio: false 
      });
      
      setCameraStream(stream);
      setIsCameraOpen(true);
    } catch (err) {
      console.error('Erro ao acessar câmera', err);
      setError('Não foi possível acessar a câmera. Verifique as permissões.');
    }
  };

  useEffect(() => {
    if (isCameraOpen && cameraStream && videoRef.current) {
      videoRef.current.srcObject = cameraStream;
      videoRef.current.play().catch(err => {
        console.error('Erro ao iniciar vídeo:', err);
      });
    }
  }, [isCameraOpen, cameraStream]);

  const closeCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
    }
    setIsCameraOpen(false);
  };

  const takePicture = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    
    if (video.readyState !== video.HAVE_ENOUGH_DATA) {
      setError('Aguarde a câmera carregar...');
      return;
    }

    const context = canvas.getContext('2d');
    if (!context) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob((blob) => {
      if (blob) {
        const file = new File([blob], `foto-${Date.now()}.jpg`, { type: 'image/jpeg' });
        const url = URL.createObjectURL(blob);
        setPhotoPreview({ file, url });
        
        if (cameraStream) {
          cameraStream.getTracks().forEach(track => track.stop());
          setCameraStream(null);
        }
        setIsCameraOpen(false);
      } else {
        setError('Erro ao capturar foto. Tente novamente.');
      }
    }, 'image/jpeg', 0.95);
  };

  const confirmPhoto = async () => {
    if (!photoPreview) return;

    if (!stageContextRef.current) {
      captureStageContext();
    }

    const photoFile = photoPreview.file;
    const permanentUrl = URL.createObjectURL(photoFile);
    
    URL.revokeObjectURL(photoPreview.url);
    setPhotoPreview(null);

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: '📷 Foto do problema',
      timestamp: new Date(),
      imageUrls: [permanentUrl],
    };

    setMessages(prev => [...prev, userMessage]);

    const hadPendingResponse = Boolean(pendingResponseRef.current);
    const previousPayload = pendingRequestPayloadRef.current;
    const previousFiles = pendingRequestFilesRef.current;

    // Reset para novo ciclo
    clearAllTypingTimers();
    pendingResponseRef.current = null;
    userTypedInSessionRef.current = false;
    firstTypingTimestampRef.current = null;
    // NÃO resetar typingPromptSentRef aqui - só reseta quando assistant envia resposta real

    const basePayload = withStageContext('Foto do problema anexada');
    let payloadForAssistant = basePayload;
    let filesForAssistant: File[] = [photoFile];

    if (hadPendingResponse && previousPayload) {
      payloadForAssistant = `${previousPayload}\n\n[MENSAGEM ADICIONAL DO USUÁRIO]\n${basePayload}`;
      const existingFiles = previousFiles || [];
      filesForAssistant = [...existingFiles, photoFile].slice(0, MAX_FILES);
    }

    // Iniciar timers
    botTypingTimerRef.current = setTimeout(() => {
      botTypingTimerRef.current = null;
      setShowBotTyping(true);
    }, BOT_TYPING_INDICATOR_DELAY_MS);

    startGraceWindow();

    await submitSupportRequest(payloadForAssistant, filesForAssistant);
  };

  const retakePhoto = () => {
    if (photoPreview) {
      URL.revokeObjectURL(photoPreview.url);
      setPhotoPreview(null);
    }
    openCamera();
  };

  // === DRAG HANDLERS ===

  const handleDragStart = (e: React.TouchEvent | React.MouseEvent) => {
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    setDragStartY(clientY);
  };

  const handleDragMove = (e: React.TouchEvent | React.MouseEvent) => {
    if (dragStartY === null) return;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    const diff = clientY - dragStartY;
    if (diff > 0) {
      setDragCurrentY(diff);
    }
  };

  const handleDragEnd = () => {
    if (dragCurrentY !== null && dragCurrentY > 100) {
      closeModal();
    }
    setDragStartY(null);
    setDragCurrentY(null);
  };

  // === FILE HANDLERS ===

  const handleFiles = useCallback(
    (newFiles: FileList | File[]) => {
      const asArray = Array.from(newFiles);
      const sanitized = asArray.filter(file =>
        ACCEPTED_FILE_TYPES.some(type => file.type === type || file.type.startsWith(type.split('/')[0])),
      );
      setFiles(prev => {
        const combined = [...prev, ...sanitized];
        return combined.slice(0, MAX_FILES);
      });
      handleTypingStart();
    },
    [],
  );

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    event.stopPropagation();
    if (event.dataTransfer?.files?.length) {
      handleFiles(event.dataTransfer.files);
    }
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files?.length) {
      handleFiles(event.target.files);
      event.target.value = '';
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  // === RECORDING ===

  const resetRecordingState = () => {
    setIsRecording(false);
    chunksRef.current = [];
    setRecordingSeconds(0);
    if (recordingTimerRef.current) {
      clearInterval(recordingTimerRef.current);
      recordingTimerRef.current = null;
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      resetRecordingState();
    }
  };

  const startRecording = async () => {
    try {
      clearAudioPreview();
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;
      chunksRef.current = [];
      recorder.ondataavailable = event => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };
      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        const file = new File([blob], `suporte-audio-${Date.now()}.webm`, { type: 'audio/webm' });
        const url = URL.createObjectURL(blob);
        setAudioPreview({ file, url });
        chunksRef.current = [];
      };
      recorder.start();
      setIsRecording(true);
      handleTypingStart();
      recordingTimerRef.current = setInterval(() => {
        setRecordingSeconds(prev => prev + 1);
      }, 1000);
    } catch (err) {
      console.error('Erro ao capturar áudio', err);
      setError('Não foi possível acessar o microfone. Verifique as permissões.');
    }
  };

  const recordingLabel = useMemo(() => {
    const minutes = String(Math.floor(recordingSeconds / 60)).padStart(2, '0');
    const seconds = String(recordingSeconds % 60).padStart(2, '0');
    return `${minutes}:${seconds}`;
  }, [recordingSeconds]);

  useEffect(() => {
    return () => {
      stopRecording();
      closeCamera();
      resetTypingSession();
    };
  }, []);

  // === RENDER ===

  return (
    <>
      <button
        type="button"
        className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-[90%] max-w-md rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3 text-base sm:text-lg font-bold text-white shadow-2xl shadow-blue-500/30 hover:scale-[1.02] focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-300 transition-transform flex items-center justify-center gap-2"
        onClick={() => {
          captureStageContext();
          setIsOpen(true);
        }}
      >
        <span className="text-xl font-bold">?</span>
        Preciso de ajuda
      </button>

      {isOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/20"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              closeModal();
            }
          }}
        >
          <div 
            className="flex h-[97vh] w-full flex-col rounded-t-2xl bg-white shadow-2xl animate-slide-up"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            style={{
              transform: dragCurrentY ? `translateY(${dragCurrentY}px)` : 'none',
              transition: dragCurrentY === null ? 'transform 0.3s ease-out' : 'none'
            }}
          >
            {/* Drag Handle */}
            <div 
              className="flex justify-center py-2 cursor-grab active:cursor-grabbing"
              onTouchStart={handleDragStart}
              onTouchMove={handleDragMove}
              onTouchEnd={handleDragEnd}
              onMouseDown={handleDragStart}
              onMouseMove={handleDragMove}
              onMouseUp={handleDragEnd}
              onMouseLeave={handleDragEnd}
            >
              <div className="w-12 h-1 bg-gray-300 rounded-full"></div>
            </div>
            
            {/* Header */}
            <div 
              className="flex items-center justify-between border-b border-gray-200 px-6 py-3"
              onTouchStart={handleDragStart}
              onTouchMove={handleDragMove}
              onTouchEnd={handleDragEnd}
            >
              <div>
                <p className="text-base sm:text-lg font-semibold text-gray-900">Chat de Suporte</p>
                <p className="text-sm text-gray-500">Converse com nosso assistente</p>
              </div>
              
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  className="text-sm sm:text-lg font-semibold text-gray-500 hover:text-gray-900"
                  onClick={closeModal}
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
              {messages.length === 0 && (
                <div className="flex h-full items-center justify-center text-center">
                  <div>
                    <p className="text-base sm:text-lg font-semibold text-gray-900 mb-2">👋 Olá!</p>
                    <p className="text-sm sm:text-lg text-gray-600">
                      Como posso te ajudar hoje?
                    </p>
                  </div>
                </div>
              )}
              
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] sm:max-w-[75%] rounded-2xl px-4 py-3 ${
                      msg.role === 'user'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    {(msg.imageUrls || []).map((url, idx) => (
                      <img 
                        key={`${msg.id}-img-${idx}`}
                        src={url} 
                        alt="Foto enviada" 
                        className="rounded-lg mb-2 max-w-full h-auto"
                      />
                    ))}
                    {msg.audioUrl ? (
                      <AudioPlayer audioUrl={msg.audioUrl} isUserMessage={msg.role === 'user'} />
                    ) : msg.role === 'assistant' ? (
                      <MarkdownContent content={msg.content} />
                    ) : (
                      <p className="text-sm sm:text-lg whitespace-pre-line">{msg.content}</p>
                    )}
                    <p className={`text-xs mt-1 ${msg.role === 'user' ? 'text-blue-100' : 'text-gray-500'}`}>
                      {msg.timestamp.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))}
              
              {/* Animação de "digitando..." do bot */}
              {showBotTyping && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 rounded-2xl px-4 py-3">
                    <div className="flex space-x-2">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Camera Interface */}
            {isCameraOpen && (
              <div className="absolute inset-0 z-50 bg-black flex flex-col">
                <div className="relative flex-1 min-h-0">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    className="w-full h-full object-cover"
                  />
                  <canvas ref={canvasRef} className="hidden" />
                </div>
                
                <div className="flex-shrink-0 p-6 bg-black/80 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={closeCamera}
                    className="px-6 py-3 bg-gray-600 text-white rounded-full font-semibold hover:bg-gray-700 z-10"
                  >
                    Cancelar
                  </button>
                  
                  <button
                    type="button"
                    onClick={takePicture}
                    className="w-16 h-16 bg-white rounded-full border-4 border-gray-300 hover:bg-gray-100 transition-all flex items-center justify-center z-10"
                  >
                    <div className="w-12 h-12 bg-white rounded-full"></div>
                  </button>
                  
                  <div className="w-24"></div>
                </div>
              </div>
            )}

            {/* Photo Preview */}
            {photoPreview && (
              <div className="absolute inset-0 z-50 bg-black flex flex-col">
                <div className="relative flex-1 flex items-center justify-center p-4">
                  <img 
                    src={photoPreview.url} 
                    alt="Preview da foto" 
                    className="max-w-full max-h-full object-contain rounded-lg"
                  />
                </div>
                
                <div className="p-6 bg-black/90 flex flex-col items-center space-y-4">
                  <p className="text-white text-center text-lg font-medium">
                    É possível ver com clareza o problema?
                  </p>
                  
                  <div className="flex gap-4 w-full max-w-sm">
                    <button
                      type="button"
                      onClick={retakePhoto}
                      className="flex-1 px-6 py-3 bg-gray-600 text-white rounded-full font-semibold hover:bg-gray-700 transition-colors"
                    >
                      Não, tirar outra
                    </button>
                    
                    <button
                      type="button"
                      onClick={confirmPhoto}
                      className="flex-1 px-6 py-3 bg-green-600 text-white rounded-full font-semibold hover:bg-green-700 transition-colors"
                    >
                      Sim, enviar
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="mx-6 mb-2 rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">
                {error}
              </div>
            )}

            {/* Input Area */}
            <form onSubmit={handleSubmit} className="border-t border-gray-200 px-6 py-4 space-y-3">
              {files.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {files.map((file, index) => {
                    const preview = filePreviews.find(p => p.id.startsWith(`${file.name}-${file.lastModified}-${file.size}`));
                    return (
                      <div
                        key={`${file.name}-${index}`}
                        className="flex items-center gap-2 rounded-lg bg-gray-100 px-3 py-1 text-sm"
                      >
                        {preview?.url && (
                          <img
                            src={preview.url}
                            alt={file.name}
                            className="w-10 h-10 object-cover rounded-md border border-gray-200"
                          />
                        )}
                        <span className="truncate max-w-[140px]">{file.name}</span>
                        <button
                          type="button"
                          className="text-red-500 font-semibold"
                          onClick={() => removeFile(index)}
                        >
                          ✕
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}

              {audioPreview ? (
                <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center">
                  <audio
                    ref={audioRef}
                    src={audioPreview.url}
                    className="hidden"
                    onEnded={() => {
                      setIsAudioPlaying(false);
                      if (audioRef.current) {
                        setAudioProgress(audioRef.current.duration || audioProgress);
                      }
                    }}
                    onTimeUpdate={() => {
                      if (audioRef.current) {
                        setAudioProgress(audioRef.current.currentTime);
                      }
                    }}
                    onLoadedMetadata={() => {
                      if (audioRef.current) {
                        setAudioDuration(audioRef.current.duration || 0);
                      }
                    }}
                    onPlay={() => setIsAudioPlaying(true)}
                    onPause={() => setIsAudioPlaying(false)}
                  />
                  <div className="flex items-center gap-2 w-full flex-wrap sm:flex-nowrap">
                    <button
                      type="button"
                      onClick={() => clearAudioPreview()}
                      className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                    >
                      <svg
                        className="w-5 h-5 text-gray-700"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M3 6h18" />
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
                        <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                        <line x1="10" x2="10" y1="11" y2="17" />
                        <line x1="14" x2="14" y1="11" y2="17" />
                      </svg>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const audio = audioRef.current;
                        if (!audio) return;
                        if (isAudioPlaying) {
                          audio.pause();
                        } else {
                          audio.play();
                        }
                      }}
                      className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                    >
                      {isAudioPlaying ? (
                        <svg
                          className="w-5 h-5 text-gray-800"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M6 4h4v16H6zM14 4h4v16h-4z" />
                        </svg>
                      ) : (
                        <svg
                          className="w-5 h-5 text-gray-800"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M6 4l14 8-14 8z" />
                        </svg>
                      )}
                    </button>
                    
                    <div className="flex-1 min-w-0 flex items-center gap-2">
                      <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-600 transition-all"
                          style={{
                            width: audioDuration ? `${Math.min(100, (audioProgress / audioDuration) * 100)}%` : '0%',
                          }}
                        />
                      </div>
                      <span className="text-xs text-gray-600 tabular-nums min-w-[35px] text-right">
                        {Math.floor(audioProgress)}s
                      </span>
                    </div>
                    
                    <div className="relative flex items-center">
                      {showVolumeSlider && (
                        <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 bg-white rounded-lg shadow-lg p-3 border border-gray-200 z-20">
                          <span className="text-xs font-bold text-blue-600">{Math.round(audioVolume * 100)}%</span>
                          
                          <div 
                            className="relative w-6 h-28 cursor-pointer"
                            onClick={(e) => {
                              const rect = e.currentTarget.getBoundingClientRect();
                              const y = e.clientY - rect.top;
                              const percentage = 1 - (y / rect.height);
                              setAudioVolume(Math.max(0, Math.min(1, percentage)));
                            }}
                            onMouseDown={(e) => {
                              e.preventDefault();
                              const handleDrag = (moveEvent: MouseEvent) => {
                                const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
                                const y = moveEvent.clientY - rect.top;
                                const percentage = 1 - (y / rect.height);
                                setAudioVolume(Math.max(0, Math.min(1, percentage)));
                              };
                              const handleUp = () => {
                                document.removeEventListener('mousemove', handleDrag);
                                document.removeEventListener('mouseup', handleUp);
                              };
                              document.addEventListener('mousemove', handleDrag);
                              document.addEventListener('mouseup', handleUp);
                            }}
                            onTouchStart={(e) => {
                              e.preventDefault();
                              const handleTouchMove = (touchEvent: TouchEvent) => {
                                const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
                                const y = touchEvent.touches[0].clientY - rect.top;
                                const percentage = 1 - (y / rect.height);
                                setAudioVolume(Math.max(0, Math.min(1, percentage)));
                              };
                              const handleTouchEnd = () => {
                                document.removeEventListener('touchmove', handleTouchMove);
                                document.removeEventListener('touchend', handleTouchEnd);
                              };
                              document.addEventListener('touchmove', handleTouchMove);
                              document.addEventListener('touchend', handleTouchEnd);
                            }}
                          >
                            <div className="absolute left-1/2 -translate-x-1/2 w-3 h-full bg-gray-200 rounded-full overflow-hidden">
                              <div 
                                className="absolute bottom-0 w-full bg-blue-600 rounded-full transition-all"
                                style={{
                                  height: `${audioVolume * 100}%`
                                }}
                              />
                            </div>
                            
                            <div 
                              className="absolute left-1/2 -translate-x-1/2 w-5 h-5 bg-blue-600 rounded-full shadow-lg border-2 border-white transition-all"
                              style={{
                                bottom: `calc(${audioVolume * 100}% - 10px)`,
                              }}
                            />
                          </div>
                          
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setAudioVolume(audioVolume > 0 ? 0 : 1);
                            }}
                            className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"
                          >
                            {audioVolume === 0 ? (
                              <svg className="w-4 h-4 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M11 5 6 9H2v6h4l5 4z" />
                                <line x1="22" x2="16" y1="9" y2="15" />
                                <line x1="16" x2="22" y1="9" y2="15" />
                              </svg>
                            ) : (
                              <svg className="w-4 h-4 text-gray-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M11 5 6 9H2v6h4l5 4z" />
                                <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
                                <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                              </svg>
                            )}
                          </button>
                        </div>
                      )}
                      
                      <button
                        type="button"
                        onClick={() => setShowVolumeSlider(!showVolumeSlider)}
                        className={`flex h-10 w-10 items-center justify-center rounded-full transition-colors ${
                          showVolumeSlider ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                        }`}
                      >
                        {audioVolume === 0 ? (
                          <svg className="w-5 h-5 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M11 5 6 9H2v6h4l5 4z" />
                            <line x1="22" x2="16" y1="9" y2="15" />
                            <line x1="16" x2="22" y1="9" y2="15" />
                          </svg>
                        ) : audioVolume < 0.5 ? (
                          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M11 5 6 9H2v6h4l5 4z" />
                            <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                          </svg>
                        ) : (
                          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M11 5 6 9H2v6h4l5 4z" />
                            <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
                            <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                          </svg>
                        )}
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={async () => {
                        const file = audioPreview.file;
                        const permanentAudioUrl = audioPreview.url;
                        setAudioPreview(null);
                        setShowVolumeSlider(false);
                        await processUserSend('🎤 Áudio gravado', '🎤 Áudio gravado', [file], [], permanentAudioUrl);
                      }}
                      className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                    >
                      <span className="text-xl">➤</span>
                    </button>
                  </div>
                </div>
              ) : (
              <div className="flex w-full flex-wrap items-end gap-3 sm:flex-nowrap">
                <div className="flex items-center gap-2 shrink-0">
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept={ACCEPTED_FILE_TYPES.join(',')}
                    className="hidden"
                    onChange={onFileChange}
                  />
                  <input
                    ref={cameraInputRef}
                    type="file"
                    accept="image/*"
                    capture="environment"
                    className="hidden"
                    onChange={onFileChange}
                  />

                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                  >
                    <svg
                      className="w-5 h-5 text-gray-700"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M12 5v14" />
                      <path d="M5 12h14" />
                    </svg>
                  </button>
                </div>

                <div className="flex-1 min-w-0 flex items-end gap-2">
                  <textarea
                    ref={textareaRef}
                    value={message}
                    onChange={(event) => {
                      const newValue = event.target.value;
                      const previousValue = message;
                      setMessage(newValue);
                      resizeTextarea();
                      
                      if (newValue.length > 0) {
                        handleTypingStart();
                      } else if (previousValue.length > 0 && newValue.length === 0) {
                        handleTextCleared();
                      }
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSubmit(e);
                      }
                    }}
                    placeholder="Digite sua mensagem..."
                    className="flex-1 w-full resize-none rounded-2xl border border-gray-200 px-4 py-2 text-sm sm:text-lg text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none"
                    rows={1}
                    style={{ minWidth: '0', overflowY: 'auto', minHeight: '40px' }}
                  />

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => openCamera()}
                      className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                    >
                      <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </button>

                    <button
                      type="button"
                      onClick={isRecording ? stopRecording : startRecording}
                      className={`flex h-10 w-10 items-center justify-center rounded-full transition-colors ${
                        isRecording ? 'bg-red-100 hover:bg-red-200' : 'bg-gray-100 hover:bg-gray-200'
                      }`}
                    >
                      {isRecording ? (
                        <svg
                          className="w-5 h-5 text-red-700"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          aria-hidden="true"
                        >
                          <rect x="7" y="7" width="10" height="10" rx="2" />
                        </svg>
                      ) : (
                        <svg
                          className="w-5 h-5 text-gray-700"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          aria-hidden="true"
                        >
                          <path d="M12 3a4 4 0 0 0-4 4v4a4 4 0 0 0 8 0V7a4 4 0 0 0-4-4Z" />
                          <path d="M19 11v1a7 7 0 0 1-14 0v-1" />
                          <path d="M12 19v3" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                {(message.trim() || files.length > 0) && (
                  <button
                    type="submit"
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                  >
                    <span className="text-xl">➤</span>
                  </button>
                )}
              </div>
              )}

              {isRecording && (
                <p className="text-sm text-red-600 font-semibold">
                  🔴 Gravando {recordingLabel}
                </p>
              )}
            </form>
          </div>
        </div>
      )}
    </>
  );
}