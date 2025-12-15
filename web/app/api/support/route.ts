import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import OpenAI from 'openai';

type UploadedFile = {
  id: string;
  mimeType: string;
  name: string;
};

type MessageContentPart =
  | { type: 'text'; text: string }
  | { type: 'image_file'; image_file: { file_id: string } };

const buildContentBlocks = (
  imageFiles: UploadedFile[],
  contact: string,
  message: string,
  audioNotes: string[],
) => {
  const combinedText = [
    `Contato: ${contact || 'não informado'}`,
    `Relato:\n${message}`,
    ...audioNotes,
  ]
    .filter(Boolean)
    .join('\n\n');

  const blocks: MessageContentPart[] = [
    {
      type: 'text',
      text: combinedText,
    },
    ...imageFiles.map<MessageContentPart>(file => ({
      type: 'image_file',
      image_file: { file_id: file.id },
    })),
  ];

  return blocks;
};

type TranscriptionResponse = string | { text?: string };

export async function POST(request: NextRequest) {
  try {
    if (!process.env.OPENAI_API_KEY || !process.env.OPENAI_ASSISTANT_ID) {
      return NextResponse.json(
        { error: 'Assistente não configurado corretamente.' },
        { status: 500 },
      );
    }

    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const formData = await request.formData();
    const contact = (formData.get('contact') as string | null)?.trim() ?? '';
    const message = (formData.get('message') as string | null)?.trim() ?? '';

    const fileFields = formData.getAll('files');
    const validFiles = fileFields.filter((entry): entry is File => entry instanceof File && entry.size > 0);

    // Permitir enviar só com áudio (sem texto) se houver arquivos
    if (!message && validFiles.length === 0) {
      return NextResponse.json(
        { error: 'Envie uma mensagem ou grave um áudio.' },
        { status: 400 },
      );
    }

    const imageUploads: UploadedFile[] = [];
    const audioNotes: string[] = [];

    for (const file of validFiles.slice(0, 5)) {
      const arrayBuffer = await file.arrayBuffer();
      const blob = new Blob([arrayBuffer], { type: file.type || 'application/octet-stream' });

      const fileForUpload = new File([blob], file.name || `anexo-${Date.now()}`, {
        type: file.type || 'application/octet-stream',
      });

      // Processar áudio: transcrever primeiro, não fazer upload (não suportado)
      if (file.type.startsWith('audio/')) {
        try {
          const transcription = (await openai.audio.transcriptions.create({
            file: fileForUpload,
            model: 'gpt-4o-mini-transcribe',
            response_format: 'text',
          })) as TranscriptionResponse;
          const transcriptText =
            typeof transcription === 'string' ? transcription : transcription.text ?? '';
          if (transcriptText) {
            audioNotes.push(`[Áudio transcrito]:\n${transcriptText}`);
          } else {
            audioNotes.push(`[Áudio enviado, mas não foi possível transcrever]`);
          }
        } catch (transcriptionError) {
          console.error('Erro ao transcrever áudio', transcriptionError);
          audioNotes.push(`[Áudio enviado, mas ocorreu erro na transcrição]`);
        }
        continue; // Não fazer upload do áudio
      }

      // Fazer upload apenas de imagens
      if (file.type.startsWith('image/')) {
        const uploaded = await openai.files.create({
          file: fileForUpload,
          purpose: 'assistants',
        });

        const uploadedMeta: UploadedFile = {
          id: uploaded.id,
          mimeType: file.type,
          name: file.name || uploaded.id,
        };

        imageUploads.push(uploadedMeta);
      }
    }

    const thread = await openai.beta.threads.create({
      messages: [
        {
          role: 'user',
          content: buildContentBlocks(imageUploads, contact, message, audioNotes),
        },
      ],
    });

    const run = await openai.beta.threads.runs.createAndPoll(thread.id, {
      assistant_id: process.env.OPENAI_ASSISTANT_ID,
    });

    if (run.status !== 'completed') {
      return NextResponse.json(
        {
          status: run.status,
          message: 'Recebemos seu pedido. Nossa equipe será notificada.',
          threadId: thread.id,
        },
        { status: 202 },
      );
    }

    const messages = await openai.beta.threads.messages.list(thread.id, {
      order: 'desc',
      limit: 1,
    });

    const reply =
      messages.data[0]?.content
        .map(part => {
          if (part.type === 'text') {
            return part.text.value;
          }
          return '';
        })
        .join('\n') ??
      'Recebemos seu pedido e retornaremos em breve.';

    return NextResponse.json({ reply, threadId: thread.id });
  } catch (error) {
    console.error('Erro ao enviar suporte', error);
    return NextResponse.json(
      { error: 'Não conseguimos registrar seu pedido agora. Tente novamente em instantes.' },
      { status: 500 },
    );
  }
}
