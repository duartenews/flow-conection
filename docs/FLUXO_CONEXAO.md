# Documentação do Fluxo de Conexão WhatsApp Business

Este documento descreve o fluxo completo de conexão do WhatsApp Business com a plataforma. Cada etapa possui um identificador único (`StepId`) que é usado para navegação e rastreamento.

**IMPORTANTE**: Este documento descreve EXATAMENTE o que o usuário vê na tela, incluindo todos os slides, imagens, botões e textos completos.

---

## 📋 Visão Geral do Fluxo

O processo de conexão é dividido em **3 estágios principais** + **etapas finais de conexão**:

1. **Estágio 1**: Verificação do tipo de WhatsApp
2. **Estágio 2**: Verificação de dispositivos disponíveis
3. **Estágio 3**: Verificação de tráfego pago e acesso ao Meta
4. **Etapas Finais**: Dentro do sistema, verificação de abas e conexão
5. **Modelos de Conexão**: Dois fluxos diferentes do Facebook (Modelo 1 e Modelo 2)

### Barra de Progresso
- Fixa no topo da tela
- Começa em 0% no primeiro step
- Cada novo step adiciona 40% do espaço restante
- Animação suave de transição

---

## 🔷 ESTÁGIO 1: Tipo de WhatsApp

### `stage_1_whatsapp_type` - Qual WhatsApp você usa?

**O que o usuário vê na tela**:
- Título: "O número de WhatsApp que você gostaria de conectar está em um:"
- Duas opções em cards:
  1. **WhatsApp Business** (com logo do WA Business)
     - Subtítulo: "Versão profissional"
     - Bolinha de seleção à direita
  2. **WhatsApp Comum** (com ícone verde do WhatsApp)
     - Subtítulo: "Versão pessoal"
     - Bolinha de seleção à direita

**Fluxo de navegação**:
- ✅ Clicar em **WhatsApp Business** → Avança para `stage_2_devices`
- ⚠️ Clicar em **WhatsApp Comum** → Vai para `stage_1_migrate_warning`

**Contexto para suporte**: O usuário está no início do processo, escolhendo qual tipo de WhatsApp possui.

---

### `stage_1_migrate_warning` - Aviso de Migração Necessária

**O que o usuário vê na tela**:
- Ícone de alerta amarelo grande (⚠️) em círculo amarelo
- Título: "Necessário Migrar para Business"
- Texto: "Para usar nosso sistema, você **precisa** estar utilizando o WhatsApp Business (profissional). Por favor, ao migrar para o WhatsApp Business (profissional) certifique-se de que suas conversas estão sendo migradas juntas."
- Botão: "Voltar" (cinza escuro)

**Fluxo de navegação**:
- Clicar em "Voltar" → Retorna para `stage_1_whatsapp_type`

**Ação necessária pelo usuário**:
1. Fazer backup das conversas do WhatsApp Normal
2. Migrar para WhatsApp Business
3. Voltar e reiniciar o processo escolhendo WhatsApp Business

**Contexto para suporte**: O usuário não possui WhatsApp Business e precisa migrar. Pode ter dúvidas sobre:
- Como fazer backup
- Como migrar mantendo conversas
- Diferença entre as versões

---

## 🔷 ESTÁGIO 2: Dispositivos Disponíveis

### `stage_2_devices` - O que você tem em mãos agora?

**O que o usuário vê na tela**:
- Título: "Quais dispositivos você tem disponível agora?"
- Grid com 3 opções (checkboxes):
  1. 💻 **Computador** (card clicável)
  2. 📱 **Celular** (card clicável)
  3. � (rotacionado) **Tablet / iPad** (card largura dupla)
- Botão "Continuar" (desabilitado até selecionar pelo menos um)
- Cards mudam de cor quando selecionados (borda preta + fundo cinza claro)

**Fluxo baseado nas escolhas**:
- ❌ **Sem computador** (não marcou computador) → `stage_2_no_computer`
- ✅ **Computador**, ❌ **Celular** (só computador):
  - Se marcou **tablet** → `stage_2_tablet_check`
  - Se não marcou tablet → `stage_2_computer_no_mobile`
- ✅ **Computador**, ✅ **Celular ou Tablet** → `stage_2_os_selection`

**Contexto para suporte**: O usuário está verificando seus dispositivos. Computador é OBRIGATÓRIO para a conexão (exigência do Facebook).

---

### `stage_2_no_computer` - Computador é Obrigatório

**O que o usuário vê na tela**:
- Card vermelho claro com borda vermelha
- Título vermelho: "Computador é Obrigatório"
- Texto: "Para realizar a configuração inicial com segurança e estabilidade, **o Facebook exige** o uso de um computador ou notebook."
- 3 botões:
  1. 💻 **"Agora consegui um computador"** (preto, destaque)
  2. **"Não tenho aqui agora, mas vou arranjar"** (branco com borda)
  3. **"Não tenho computador, nem aqui agora e nem terei depois."** (branco com borda)
- Link "Voltar" (cinza, sublinhado)

**Fluxo de navegação**:
- Opções 1 e 2 → Marca computador como disponível e volta para `stage_2_devices`
- Opção 3 → Vai para `stage_2_no_computer_support`
- Link "Voltar" → Retorna para `stage_2_devices`

**Contexto para suporte**: O usuário não tem computador disponível. A conexão requer computador por exigência técnica do Facebook. Alternativas são muito limitadas.

---

### `stage_2_no_computer_support` - Redirecionamento para Suporte

**O que o usuário vê na tela**:
- Card branco com ícone 💬
- Título: "Nesse caso te ajudaremos com isso."
- Texto: "Fale que não possui computador para nosso suporte que providenciaremos o mais rápido possível um especialista pra te ajudar."
- Contador: "Você será redirecionado automaticamente em 10 segundos..."
- Botão grande: **"Abrir Chat de Suporte Agora"** (preto)
- Link "Voltar" (cinza, sublinhado)

**Comportamento automático**:
- Após 10 segundos, redireciona automaticamente para WhatsApp de suporte
- URL: `https://wa.me/5511975211053?text=Eu%20preciso%20de%20ajuda...`

**Fluxo de navegação**:
- Clicar no botão ou aguardar 10s → Abre WhatsApp de suporte
- Link "Voltar" → Retorna para `stage_2_no_computer`

**Contexto para suporte**: O usuário confirmou que não tem e não terá computador. Precisa de atendimento especial pois a conexão padrão é impossível.

---

### `stage_2_computer_no_mobile` - Cadê o celular?

**O que o usuário vê na tela**:
- Título: "É preciso que você esteja com o aparelho que está o WhatsApp Business (profissional) em mãos para continuar a conexão."
- 2 botões:
  1. **"Estou com o aparelho que está o WhatsApp Business (profissional) agora."** (preto, destaque)
  2. **"Realmente não estou com ele agora"** (branco, borda tracejada)
- Se clicar no botão 2, aparece alerta amarelo pulsante:
  - "⚠️ Por favor, busque o aparelho com o WhatsApp Business (profissional) com o número que deseja conectar para continuar."
- Link "Voltar" (cinza, sublinhado)

**Fluxo de navegação**:
- Botão 1 → Marca celular como disponível e vai para `stage_2_os_selection`
- Botão 2 → Mostra alerta (não avança)
- Link "Voltar" → Retorna para `stage_2_devices`

**Contexto para suporte**: O usuário tem computador mas não está com o celular onde o WhatsApp Business está instalado. Precisa buscar o aparelho.

---

### `stage_2_tablet_check` - WhatsApp no Tablet?

**O que o usuário vê na tela**:
- Título: "O WhatsApp Business (profissional) que você quer conectar está neste Tablet/iPad?"
- 2 botões:
  1. **"Sim, uso o WhatsApp Business (profissional) nesse tablet/ipad."** (preto, destaque)
  2. **"Na verdade o aparelho que está com o WhatsApp Business (profissional) não está comigo agora."** (branco com borda)
- Link "Voltar" (cinza, sublinhado)

**Fluxo de navegação**:
- Botão 1 → Avança para `stage_2_os_selection`
- Botão 2 → Vai para `stage_2_computer_no_mobile`
- Link "Voltar" → Retorna para `stage_2_devices`

**Contexto para suporte**: O usuário está verificando se pode usar o tablet ao invés do celular. Tablets também podem ter WhatsApp Business.

---

### `stage_2_os_selection` - Configuração do Ambiente

**O que o usuário vê na tela**:

**Se tem computador**:
- Pergunta 1: "Qual o sistema do seu computador?" (ou "1. Qual o sistema..." se tem celular também)
- 2 cards clicáveis lado a lado:
  - 🍎 **Mac / Apple** (com ícone Apple)
  - 🪟 **Windows** (com ícone Windows)
- Card selecionado fica com borda preta e fundo cinza

**Se tem celular ou tablet**:
- Pergunta 2: "O aparelho **onde está** o WhatsApp Business que deseja conectar é um:" (ou "2. O aparelho..." se tem computador também)
- 2 cards clicáveis lado a lado:
  - 🤖 **Android** (com ícone Android)
  - 🍎 **iPhone** (com ícone Apple)
- Card selecionado fica com borda preta e fundo cinza

**Botão final**:
- "Continuar" (desabilitado até selecionar todos os sistemas necessários)
- Texto de ajuda: "Selecione os sistemas para continuar" (se não selecionou tudo)
- Link "Voltar" não é exibido aqui

**Fluxo de navegação**:
- Após selecionar todos os sistemas → `stage_3_traffic_check`

**Dados salvos**:
- `devices.computerType`: 'mac' ou 'windows'
- `devices.mobileType`: 'iphone' ou 'android'

**Contexto para suporte**: O usuário está selecionando seus sistemas operacionais. Isso personaliza as instruções de QR Code e verificação de abas mais adiante.

---

## 🔷 ESTÁGIO 3: Tráfego Pago e Meta

### `stage_3_traffic_check` - Sobre Tráfego Pago

**O que o usuário vê na tela**:
- Título: "Aperfeiçoando o melhor caminho para sua conexão..."
- Pergunta: "Você roda tráfego pago **direcionado para o número que você deseja conectar**?"
- 4 cards clicáveis (botões grandes com título e subtítulo):

1. **"Sim, mas não para esse número que desejo conectar"**
   - Subtítulo: "Faço anúncios para outro número"
   - Borda cinza clara

2. **"Sim, faço anúncios para este número que desejo conectar"**
   - Subtítulo: "Os anúncios são direcionados para esse número específico"
   - Borda cinza, fundo cinza claro (destaque)

3. **"Já fiz para esse número, mas hoje não faço mais"**
   - Subtítulo: "Rodei anúncios no passado para este número"
   - Borda cinza clara

4. **"Não rodo tráfego pago para nenhum número"**
   - Subtítulo: "Não faço anúncios"
   - Borda cinza clara

- Link "Voltar" (cinza, sublinhado)

**Fluxo de navegação**:
- Opção 1 (outro número) → Salva `runs_ads: 'false_other_number'` → `stage_3_any_facebook`
- Opção 2 (sim, para este) → Salva `runs_ads: 'true'` → `stage_3_traffic_source`
- Opção 3 (já fiz) → Salva `runs_ads: 'used_to_run'` → `stage_3_traffic_source`
- Opção 4 (não faço) → Salva `runs_ads: 'false'` → `stage_3_any_facebook`
- Link "Voltar" → Retorna para `stage_2_os_selection`

**Contexto para suporte**: O usuário está informando se faz anúncios pagos. Isso determina se pode usar qualquer Facebook ou precisa de uma conta específica. Perguntas comuns:
- "O que é tráfego pago?"
- "Impulsionamento do Instagram conta?"
- "Anúncios antigos ainda contam?"

---

### `stage_3_traffic_source` - Como você roda seus anúncios?

**O que o usuário vê na tela**:
- Título: "Como você roda/rodava seus anúncios?"
- 2 cards clicáveis grandes:

1. **"Impulsionar/turbinar do Instagram"**
   - Subtítulo: "Apenas clico no botão 'Turbinar' ou 'Impulsionar' direto no app"
   - Borda cinza clara

2. **"Gerenciador de Anúncios Facebook (Meta)"**
   - Subtítulo: "Uso o painel profissional do Facebook/Meta"
   - Borda cinza clara

- Link "Voltar" (cinza, sublinhado)

**Fluxo de navegação**:
- Opção 1 (Instagram) → Salva `ad_platform: 'instagram_boost'` → `stage_3_any_facebook`
- Opção 2 (Meta Ads) → Salva `ad_platform: 'meta_business'` → `stage_3_meta_access_check`
- Link "Voltar" → Retorna para `stage_3_traffic_check`

**Contexto para suporte**: O usuário faz anúncios e estamos identificando qual plataforma usa. Quem usa Gerenciador de Anúncios PRECISA usar a conta correta do Meta. Perguntas comuns:
- "Qual é a diferença?"
- "Eu uso os dois, qual devo escolher?"

---

### `stage_3_any_facebook` - Qualquer Facebook Serve

**O que o usuário vê na tela**:
- Card verde claro com borda verde
- Título verde: "Você pode usar **qualquer conta do Facebook** para fazer a conexão, entenda:"
- Texto: "Não precisa ser a conta oficial da clínica. Pode ser seu perfil pessoal ou qualquer outro. Ninguém verá qual perfil foi usado para conectar."
- Botão grande: **"Entendi, vamos conectar"** (preto, destaque)
- Link "Voltar" (cinza, sublinhado)

**Fluxo de navegação**:
- Botão "Entendi" → `step_inside_system`
- Link "Voltar" → Retorna para `stage_3_traffic_check`

**Contexto para suporte**: O usuário descobriu que pode usar qualquer Facebook. Pode ter dúvidas:
- "Posso usar minha conta pessoal?"
- "Não vai aparecer meu nome em nada?"
- "E se eu sair dessa conta depois?"

---

### `stage_3_meta_access_check` - Conta Obrigatória

**O que o usuário vê na tela**:
- Título: "Então você precisa ter acesso a essa conta de Facebook/Meta Ads para continuar. Entenda:"
- Texto: "Como você já vinculou esse número a um Facebook/Meta Ads, você precisa entrar **obrigatoriamente** com a conta do Facebook que administra esses anúncios."
- 3 cards clicáveis:

1. **"Tenho acesso a essa conta"**
   - Preto com texto branco (destaque)

2. **"Não sei se tenho acesso a essa conta"**
   - Branco com borda cinza

3. **"Não tenho acesso, com certeza"**
   - Branco com borda cinza
   - Tem subtítulo adicional

- Link "Voltar" (cinza, sublinhado)

**Fluxo de navegação**:
- Opção 1 (tenho) → Salva `meta_access: 'has_access'` → `step_inside_system`
- Opção 2 (não sei) → Salva `meta_access: 'uncertain'` → `stage_3_meta_access_uncertain`
- Opção 3 (não tenho) → `stage_3_meta_lost_access`
- Link "Voltar" → Retorna para `stage_3_traffic_source`

**Contexto para suporte**: O usuário usa Meta Ads e precisa confirmar se tem acesso à conta correta. É OBRIGATÓRIO usar a conta que administra os anúncios. Problemas comuns:
- Gestor de tráfego saiu
- Perdeu acesso à conta
- Não sabe qual conta gerencia os ads

---

### `stage_3_meta_access_uncertain` - Incerteza sobre Conta

**O que o usuário vê na tela**:
- Card azul claro grande com borda azul
- Ícone: ✓ (check grande)
- Título azul: "Certo, teste com a sua conta principal do Facebook"
- Texto azul: "Se não funcionar com ela, você poderá tentar entrar com outra conta posteriormente."
- Botão azul grande: **"Entendi, continuar"**
- Link "Voltar" (cinza, sublinhado)

**Fluxo de navegação**:
- Botão "Entendi" → `step_inside_system`
- Link "Voltar" → Retorna para `stage_3_meta_access_check`

**Contexto para suporte**: O usuário não tem certeza de qual conta tem acesso ao Meta Ads. Vamos deixar ele tentar com a conta principal.

---

### `stage_3_meta_lost_access` - Acesso Perdido

**O que o usuário vê na tela**:
- Título: "Acesso Perdido"
- Card cinza com borda cinza (dica):
  - "💡 Essa conta pertence ao seu Gestor de Tráfego?"
  - "Entre em contato com ele para recuperar o acesso."
- 2 cards clicáveis:

1. **"Consegui a conta de volta"**
   - Branco com borda cinza

2. **"Acredito que perdi essa conta do Facebook para sempre"**
   - Branco com borda cinza
   - Subtítulo: "Ainda há esperança. Veja o que você pode fazer."

- Link "Voltar" (cinza, sublinhado)

**Fluxo de navegação**:
- Opção 1 (consegui) → `step_inside_system`
- Opção 2 (perdi) → `stage_3_meta_lost_access_options`
- Link "Voltar" → Retorna para `stage_3_meta_access_check`

**Contexto para suporte**: O usuário perdeu acesso à conta do Meta que gerencia os anúncios. Situação complexa que pode requerer suporte avançado. Causas comuns:
- Gestor de tráfego antigo
- Conta hackeada/bloqueada
- Empresa terceirizada

---

### `stage_3_meta_lost_access_options` - Opções de Recuperação

**O que o usuário vê na tela**:
- Título: "Ainda Há Esperança!"
- Card cinza grande com 2 seções:

**Tentativa 1 (Simples)**:
- Título: "Tentativa 1 (Simples):"
- Texto: "Tentar conectar com outro Facebook mesmo assim. Pode dar erro, mas se der, nós te ajudaremos lá na frente."

**Linha divisória**

**Tentativa 2 (Avançada)**:
- Título: "Tentativa 2 (Avançada):"
- Texto: "Para desvincular esse número do seu Facebook que não tem mais acesso você deve:"
- Lista numerada:
  1. Migrar o número que deseja conectar do aplicativo **WhatsApp Business (profissional)** para um **WhatsApp Comum (pessoal)**. Ao fazer essa migração certifique-se de importar suas conversas, para que não perca nada.
  2. Esperar algumas horas
  3. Voltar esse número que estará no WhatsApp Comum (pessoal) para um aplicativo de **WhatsApp Business (profissional)**. E fazer a conexão sem se preocupar com qual conta de Facebook deve entrar.
- Box cinza: "💡 **Resultado:** Isso 'desvincula' o número da conta perdida do Facebook à força. E o torna livre para conectar em qualquer conta de Facebook."

**2 botões grandes**:
1. **"Vou tentar conectar com outra conta por enquanto..."** (preto)
2. **"Fiz o caminho de migrar meu número..."** (branco com borda preta)

- Link "Voltar" (cinza, sublinhado)

**Fluxo de navegação**:
- Botão 1 → Salva `lost_access_strategy: 'try_anyway'` → `step_inside_system`
- Botão 2 → `step_inside_system`
- Link "Voltar" → Retorna para `stage_3_meta_lost_access`

**Contexto para suporte**: O usuário está tentando desvincular o número de uma conta Meta antiga através de migração. Processo técnico que pode dar errado. Importante orientar sobre backup completo.

---

### `stage_3_meta_lost_access_path_2` - Caminho da Migração (DEPRECATED)

**Nota**: Esta etapa existe no código mas não é mais usada no fluxo atual. Foi substituída por `stage_3_meta_lost_access_options` que já contém as instruções de migração.

---

## 🔷 ETAPAS FINAIS: Dentro do Sistema e Conexão

### `step_inside_system` - Dentro do Sistema SecretáriaPlus

**O que o usuário vê na tela**:
- Logo do SecretáriaPlus no topo (invertido em branco)
- Título: "Dentro do Sistema"
- Subtítulo: "no menu lateral clique em Conexão WhatsApp"

**3 cards sequenciais (não são slides, todos visíveis ao mesmo tempo)**:

**Card 1**:
- Subtítulo: "Dentro do sistema SecretáriaPlus > Conexão WhatsApp"
- Título: "1. Clique em 'Conectar WhatsApp...'"
- **Imagem**: `/1.png` (mostra o botão no sistema)

**Card 2**:
- Subtítulo: "Dentro do sistema SecretáriaPlus > Conexão WhatsApp"
- Título: "2. Leia e clique em continuar:"
- **Imagem**: `/2.png` (tela de instruções)

**Card 3**:
- Subtítulo: "Dentro do sistema SecretáriaPlus > Conexão WhatsApp"
- Título: "3. Leia os pontos de atenção e clique em continuar:"
- **Imagem**: `/3.png` (tela com avisos)

**Botão único ao final**:
- **"Continuar"** (preto, destaque)

**Fluxo de navegação**:
- Botão "Continuar" → Decide baseado no sistema do computador:
  - Se Mac → `step_check_tabs_mac`
  - Se Windows → `step_check_tabs_windows`

**Contexto para suporte**: O usuário está navegando no sistema SecretáriaPlus antes de iniciar a conexão. Problemas comuns:
- Não encontra o menu de Conexão WhatsApp
- Imagens não carregam
- Não entende as instruções

---

### `step_check_tabs_mac` - Verificação de Abas no Mac

**O que o usuário vê na tela**:
- Ícone Apple grande
- Título: "No Macbook, feche as guias do Facebook"
- Link para trocar: "Na verdade agora estou em um Windows/outro" (sublinhado)

**Seção 1 - Guias superiores**:
- Subtítulo: "Feche todas as guias do Facebook antes de clicar no botão verde de conectar:"
- Texto: "Na parte superior do navegador, verifique se já não tem uma guia de conexão aberta:"
- **Imagem**: `/close-all.png` (mostra guias do navegador abertas)

**Seção 2 - Específico do Mac**:
- Texto: "Olha também na parte inferior da sua tela clicando com o botão direito (sem mouse: dois dedos ao mesmo tempo) em cima do navegador, e você pode encontrar guias de conexão do Facebook, abra uma por uma e feche-as:"
- **Imagem**: `/close-mac.png` (mostra dock do Mac com navegador)

**Aviso Amarelo Importante**:
- Ícone: ⚠️
- Título: "**Observação:**"
- Texto: "É necessário que você feche todas as guias de conexão do Facebook, e apenas depois de fechar tudo clique novamente no botão verde para iniciar em uma nova guia de conexão, com a certeza de que é a única aberta."
- Texto adicional: "**Importante:** Em todos os casos que precise reiniciar o fluxo de conexão, lembre-se de fechar novamente todas as guias do Facebook."

**Botão final**:
- **"Fiz isso, continuar"** (preto, destaque)
- Link "Voltar" (cinza, sublinhado)

**Fluxo de navegação**:
- Link de troca → `step_check_tabs_windows`
- Botão "Fiz isso" → `step_connection_start`
- Link "Voltar" → Retorna para `step_inside_system`

**Contexto para suporte**: O usuário Mac precisa fechar abas abertas do Facebook. Problema crítico: múltiplas abas causam erro na conexão. Mac tem localização específica de abas no dock.

---

### `step_check_tabs_windows` - Verificação de Abas no Windows

**O que o usuário vê na tela**:
- Ícone Windows grande
- Título: "No Windows, feche as guias do Facebook"
- Link para trocar: "Na verdade agora estou em um Macbook" (sublinhado)

**Seção 1 - Guias superiores**:
- Subtítulo: "Feche todas as guias do Facebook antes de clicar no botão verde de conectar:"
- Texto: "Na parte superior do navegador, verifique se já não tem uma guia de conexão aberta:"
- **Imagem**: `/close-all.png` (mesma imagem do Mac - guias do navegador)

**Seção 2 - Específico do Windows**:
- Texto: "Na parte inferior da tela do seu computador, você colocando o mouse por cima do navegador pode encontrar outras guias do Facebook. Feche-as também:"
- **Imagem**: `/close-wind.jpg` (mostra barra de tarefas do Windows)

**Aviso Amarelo Importante**:
- (Mesmo texto do Mac)
- Ícone: ⚠️
- "**Observação:**" + textos idênticos ao Mac

**Botão final**:
- **"Fiz isso, continuar"** (preto, destaque)
- Link "Voltar" (cinza, sublinhado)

**Fluxo de navegação**:
- Link de troca → `step_check_tabs_mac`
- Botão "Fiz isso" → `step_connection_start`
- Link "Voltar" → Retorna para `step_inside_system`

**Contexto para suporte**: O usuário Windows precisa fechar abas abertas do Facebook. Problema crítico: múltiplas abas causam erro na conexão. Windows mostra abas ao passar mouse na barra de tarefas.

---

### `step_connection_start` - Hora de Conectar

**O que o usuário vê na tela**:
- Título: "Hora de Conectar"

**Seção 1 - Botão Verde**:
- Texto: "Com todas as guias do Facebook fechadas"
- Título: "No sistema, clique no botão verde: Conectar WhatsApp Business"
- **Imagem**: `/4.png` (mostra o botão verde no sistema)

**Divisória visual**

**Seção 2 - Escolha do Modelo**:
- Texto: "Abrirá uma tela de conexão do Facebook"
- Título: "Qual dos dois modelos de tela aparece para você:"

**2 cards clicáveis grandes (um abaixo do outro no mobile)**:

**Card Modelo 1**:
- **Imagem clicável**: `/mod-1.png` (tela do Facebook modelo 1)
- Texto abaixo: "Clique aqui se abriu esse modelo"
- Ao passar mouse: borda preta + sombra

**Card Modelo 2**:
- **Imagem clicável**: `/mod-2.png` (tela do Facebook modelo 2)
- Texto abaixo: "Clique aqui se abriu esse modelo"
- Ao passar mouse: borda preta + sombra

**Fluxo de navegação**:
- Clicar na imagem Modelo 1 → `step_model_1` (slide 0)
- Clicar na imagem Modelo 2 → `step_model_2` (slide 0)

**Contexto para suporte**: O usuário está na etapa crítica de conexão. Esta é a parte onde podem ocorrer mais erros:
- Facebook não abre
- Aparece tela diferente dos modelos
- QR Code não aparece
- Erros de permissão
- Problemas com abas duplicadas

---

## � MODELO 1: Fluxo de Conexão do Facebook (Versão Antiga)

### `step_model_1` - Modelo 1 (3 Slides)

**Navegação**: Sistema de slides com indicadores de progresso (bolinhas) e botões "Próxima etapa"/"Voltar etapa anterior"

---

#### **SLIDE 1: Clique em Começar**

**O que o usuário vê**:
- Subtítulo: "Passo 1"
- Título: "Clique em Começar"
- **Imagem**: `/mod-1.1.png` (tela do Facebook com botão "Começar")
- Indicadores: ● ○ ○
- Botão: **"Próxima etapa"** (preto)

---

#### **SLIDE 2: Crie/Selecione o portfólio correto**

**O que o usuário vê**:
- Subtítulo: "Passo 2"
- Título: "Crie/Selecione o portfólio correto"
- **Imagem**: `/mod-1.2.png` (tela de criação/seleção de portfólio)
- **Box cinza com dicas detalhadas**:
  - Título: "**Se tiver dificuldade, chame a pessoa que gerencia seu tráfego pago para te ajudar:**"
  - Texto: "Se você já roda tráfego pago dentro do Facebook, você precisa escolher o portfólio/BM em que seu número já está vinculado. Se não possui nenhum portfólio você pode criar um do 0."
  - Lista com bullets:
    - **Nome da empresa:** escreva o nome da sua clínica.
    - **Email:** Insira seu melhor email.
    - **Site:** use seu website ou link do Instagram (deve iniciar com "https://")
    - **País:** escolha por último o país onde você estará atendendo.
- Indicadores: ○ ● ○
- Botões: **"Próxima etapa"** (preto) / "Voltar etapa anterior" (cinza)

---

#### **SLIDE 3: Conecte seu app WhatsApp Business existente**

**O que o usuário vê**:
- Subtítulo: "Passo 3"
- Título: "Conecte seu app WhatsApp Business existente"
- **Imagem**: `/mod-1.3.png` (opções de conexão)
- Texto: "Selecione a opção: **Conecte seu app WhatsApp Business existente**."
- Indicadores: ○ ○ ●
- Botões: **"Continuar para inserir número"** (preto) / "Voltar etapa anterior" (cinza)
- Link adicional: "Voltar para escolha de modelo"

**Fluxo de navegação especial**:
- Ao clicar em "Continuar para inserir número":
  - Define `cameFromModel1 = true`
  - Vai para `step_model_2` no **slide 3** (pula os slides 0, 1 e 2 do Modelo 2)
  - Isso cria um fluxo híbrido Modelo 1 → Modelo 2

**Contexto para suporte**: Usuário do Modelo 1 precisa criar ou selecionar portfólio Business Manager. Problemas comuns:
- Não sabe qual portfólio escolher
- Erro ao criar novo portfólio
- Campos de URL não aceitam o link
- Não encontra a opção "Conecte app existente"

---

## 🔷 MODELO 2: Fluxo de Conexão do Facebook (Versão Nova)

### `step_model_2` - Modelo 2 (6 Slides)

**Navegação**: Sistema de slides com indicadores de progresso (bolinhas) e botões de navegação

**IMPORTANTE**: Se o usuário veio do Modelo 1 (`cameFromModel1 = true`), ele começa no **Slide 3** (Passo 4) e pula para o **Slide 5** (Passo 6) quando avançar, pulando o Slide 4.

---

#### **SLIDE 0: Clique em Continuar**

**O que o usuário vê**:
- Subtítulo: "Passo 1"
- Título: "Clique em Continuar"
- **Imagem**: `/mod-2.0.png` (tela inicial com botão Continuar)
- Indicadores: ● ○ ○ ○ ○ ○
- Botão: **"Próxima etapa"** (preto)
- Link: "Voltar para escolha de modelo"

---

#### **SLIDE 1: Crie/Selecione o portfólio correto**

**O que o usuário vê**:
- Subtítulo: "Passo 2"
- Título: "Crie/Selecione o portfólio correto"
- **Imagem**: `/mod-2.1.png` (tela de portfólio)
- **Box cinza EXPANDIDO com dicas detalhadas**:
  - Título: "**Nesse momento se tiver dificuldade, e achar que for necessário chame a pessoa que gerencia seu tráfego pago, ou mesmo seu cônjuge, para te ajudar:**"
  - Texto: "Se você já roda tráfego pago dentro do Facebook, você precisa escolher o portfólio/BM em que seu número já está vinculado. Se você não possui nenhum portfólio você pode criar um do 0."
  - **Box branco interno "Dicas de apoio:"**:
    - **Nome da empresa:** escreva o nome da sua clínica. O nome da empresa não será público, então não precisa gastar muito tempo pensando em como colocar isso da melhor forma.
    - **Email:** Insira seu melhor email.
    - **Site ou perfil comercial:** nesse campo conforme você digita o Facebook fica tentando validar se o link existe ou não, isso pode acabar atrapalhando sua digitação, então certifique de que não ficou faltando nenhuma letra no caminho, porque pode ser considerado um link inválido por esse motivo. A ideia é você adicionar seu website, e se não possuir um você pode usar o link que direciona para seu Instagram. Exemplo: `https://instagram.com/seunomedeusarioaqui/` (a única regra é que o link deve se iniciar com "https://")
    - **País:** escolha por último o país onde você estará atendendo.
- Indicadores: ○ ● ○ ○ ○ ○
- Botões: **"Próxima etapa"** (preto) / "Voltar etapa anterior" (cinza)
- Link: "Voltar para escolha de modelo"

---

#### **SLIDE 2: Selecione seu número**

**O que o usuário vê**:
- Subtítulo: "Passo 3"
- Título: "Selecione seu número ou vá em Conectar um app do WhatsApp Business"
- **Imagem**: `/mod-2.2.png` (tela com números ou opção de conectar)
- Textos explicativos:
  - "Veja se seu número está já listado nas opções que surgirão para selecioná-lo, caso não esteja clique em: **'Conectar um app do WhatsApp Business'**"
  - **Box vermelho importante**: "Importante: nesse caso NÃO clique em: 'criar uma conta do WhatsApp Business'"
- Indicadores: ○ ○ ● ○ ○ ○
- Botões: **"Próxima etapa"** (preto) / "Voltar etapa anterior" (cinza)
- Link: "Voltar para escolha de modelo"

---

#### **SLIDE 3: Inserindo o Número**

**O que o usuário vê**:
- Subtítulo: "Passo 4"
- Título: "Inserindo o Número"
- **Imagem**: `/num-num.png` (tela de inserção de número)
- Texto: "Aqui você deve selecionar o país do seu número, e basta digitar no pesquisar **'55'** ou **'BR'** que facilitará, em seguida você deve digitar o número que você deseja conectar com DDD."
- Indicadores: ○ ○ ○ ● ○ ○
- Botões: **"Próxima etapa"** (preto) / "Voltar etapa anterior" (cinza)
- Link: "Voltar para escolha de modelo"

**Comportamento especial se veio do Modelo 1**:
- Ao clicar "Próxima etapa", pula direto para Slide 5 (não mostra Slide 4)

---

#### **SLIDE 4: O que você vê agora? (Bifurcação)**

**O que o usuário vê**:
- Subtítulo: "Passo 5"
- Título: "O que você vê agora?"
- **2 cards clicáveis grandes** (um abaixo do outro):

**Card 1 - QR Code**:
- Texto: "1. Vejo um QR Code"
- **Imagem**: `/qr-code-new0.png` (tela com QR Code)
- Card com borda ao passar mouse

**Card 2 - Adicionar Número**:
- Texto: "2. Vejo essa tela para adicionar número"
- **Imagem**: `/mod2-new0.png` (tela diferente)
- Card com borda ao passar mouse

- Indicadores: ○ ○ ○ ○ ● ○
- Botão apenas: "Voltar etapa anterior" (cinza)
- Link: "Voltar para escolha de modelo"

**Fluxo de navegação**:
- Clicar Card 1 (QR Code) → Avança para Slide 5
- Clicar Card 2 (Adicionar número) → Vai para `step_model_2_novo_numero`

---

#### **SLIDE 5: Mensagem do Facebook?**

**O que o usuário vê**:
- Subtítulo: "Passo 6"
- Título: "Esse QR code não é o jeito comum de conexão que você está acostumado(a). Mas antes..."
- **Imagem única no topo**: `/facebook.png` (mensagem do Facebook no WhatsApp)
- Pergunta: "No número que você deseja conectar chegou uma mensagem do facebook?"
- **2 botões lado a lado**:
  - **"Sim, recebi"** (cinza, hover)
  - **"Não, não recebi"** (cinza, hover)
- Indicadores: ○ ○ ○ ○ ○ ●
- Botão: "Voltar etapa anterior" (cinza)
- Link: "Voltar para escolha de modelo"

**Fluxo de navegação**:
- "Sim, recebi" → `step_model_2_sim`
- "Não, não recebi" → Decide baseado no tipo de celular:
  - Se iPhone → `step_model_2_nao_iphone`
  - Se Android → `step_model_2_nao_android`

**Contexto para suporte**: Bifurcação crítica. Se não recebeu mensagem do Facebook, precisa seguir caminho manual nas configurações do WhatsApp.

---

### `step_model_2_sim` - Recebeu Mensagem do Facebook

**O que o usuário vê na tela**:
- Subtítulo: "Sim - Recebi"
- Título: "Como ler o QR code"
- **Sequência vertical: Texto → Imagem → Texto → Imagem → Texto → Imagem**

**Passo 1**:
- Box cinza: "Essa mensagem do Facebook tem um botão **1. Clicar em: Ler QR code**"
- **Imagem**: `/facebook.png` (mensagem do Facebook)

**Passo 2 e 3**:
- Box cinza: "Que te leva para uma página que deve estar em branco com um botão no final dela **2. Clicar em: Escanear QR code** e **3. Clicar em: Compartilhar conversas** que abrirá sua câmera e você poderá"
- **Imagem**: `/scan-qr.png` (botão escanear)

**Passo 4**:
- Box cinza: "**4. Ler o QR code** para conexão."
- **Imagem**: `/scan-qr2.png` (câmera lendo QR)

**Botões finais**:
- **"Continuar"** (preto, destaque) → `step_model_2_fuso`
- Link: "Voltar para seleção" (ou "início do Modelo 1" se veio de lá)

**Contexto para suporte**: Caminho mais fácil. Usuário recebeu mensagem do Facebook e só precisa clicar nos botões. Problemas comuns:
- Mensagem não tem botão
- Botão não funciona
- Câmera não abre
- QR Code não é reconhecido

---

### `step_model_2_nao_iphone` - Sem Mensagem (iPhone)

**Sistema de slides**: 3 etapas com múltiplas imagens por etapa

**O que o usuário vê no topo**:
- Ícone Apple grande
- Título: "No iPhone"
- Link de troca: "Na verdade meu aparelho é Android"
- Subtítulo variável por etapa

---

#### **Etapa 1 de 3**

**O que o usuário vê**:
- Descrição 1: "No WhatsApp Business, vá em ⚙️ Configurações. Toque em 🔑 Conta > Plataforma do WhatsApp Business"
- **Imagem**: `/iphone1.png`
- Descrição 2: "Clique em Conectar-se à Plataforma do WhatsApp Business"
- **Imagem**: `/iphone2.png`
- Indicadores: ● ○ ○
- Botão: **"Próxima Etapa"** (preto)
- Link: "Voltar para início do Modelo X"

---

#### **Etapa 2 de 3**

**O que o usuário vê**:
- Descrição 1: "Continue seguindo as instruções"
- **Imagem**: `/iphone3.png`
- Descrição 2: "Selecione Compartilhar todas as conversas"
- **Imagem**: `/iphone4.png`
- Indicadores: ○ ● ○
- Botões: **"Próxima Etapa"** (preto) / "Voltar etapa anterior" (cinza)

---

#### **Etapa 3 de 3**

**O que o usuário vê**:
- Descrição 1: "Escaneie o QR Code na próxima etapa."
- **Imagem**: `/scan-qr2.png`
- Descrição 2: "Continue o processo..."
- **Imagem**: `/iphone6.png`
- Indicadores: ○ ○ ●
- Botões: **"Continuar"** (preto) → `step_model_2_fuso` / "Voltar etapa anterior" (cinza)

**Contexto para suporte**: Caminho manual para iPhone. Usuário precisa navegar nas configurações do WhatsApp Business. Problemas comuns:
- Não encontra "Plataforma do WhatsApp Business" nas configurações
- Menu está em inglês
- Versão do WhatsApp desatualizada
- Não aparece opção de conectar

---

### `step_model_2_nao_android` - Sem Mensagem (Android)

**Sistema de slides**: 4 etapas com múltiplas imagens por etapa

**O que o usuário vê no topo**:
- Ícone Android grande
- Título: "No Android"
- Link de troca: "Na verdade meu aparelho é iPhone"
- Subtítulo variável por etapa

---

#### **Etapa 1 de 4**

**O que o usuário vê**:
- Descrição 1: "Abra o WhatsApp Business e toque nos ••• três pontinhos"
- **Imagem**: `/and-1.png`
- Descrição 2: "Vá em ⚙️ Configurações >"
- **Imagem**: `/and-2.png`
- Indicadores: ● ○ ○ ○
- Botão: **"Próxima Etapa"** (preto)
- Link: "Voltar para início do Modelo X"

---

#### **Etapa 2 de 4**

**O que o usuário vê**:
- Descrição 1: "Clique em 🔑 Conta"
- **Imagem**: `/and-3.png`
- Descrição 2: "Clique em Plataforma Comercial"
- **Imagem**: `/and-a.png`
- Indicadores: ○ ● ○ ○
- Botões: **"Próxima Etapa"** (preto) / "Voltar etapa anterior" (cinza)

---

#### **Etapa 3 de 4**

**O que o usuário vê**:
- Descrição 1: "Clique em Conectar-se à Plataforma Comercial"
- **Imagem**: `/iphone3.png` (reutiliza imagem do iPhone)
- Descrição 2: "Selecione Compartilhar todas as conversas"
- **Imagem**: `/iphone4.png` (reutiliza imagem do iPhone)
- Indicadores: ○ ○ ● ○
- Botões: **"Próxima Etapa"** (preto) / "Voltar etapa anterior" (cinza)

---

#### **Etapa 4 de 4**

**O que o usuário vê**:
- Descrição 1: "Escaneie o QR Code na próxima etapa."
- **Imagem**: `/scan-qr2.png`
- Descrição 2: "Continue o processo..."
- **Imagem**: `/iphone6.png`
- Indicadores: ○ ○ ○ ●
- Botões: **"Continuar para Fuso Horário"** (preto) → `step_model_2_fuso` / "Voltar etapa anterior" (cinza)

**Contexto para suporte**: Caminho manual para Android. Usuário precisa navegar nas configurações do WhatsApp Business. Problemas comuns:
- Não encontra "Plataforma Comercial" (nome diferente do iPhone)
- Menu está em inglês ("Business Platform")
- Três pontinhos não aparecem
- Versão do WhatsApp desatualizada

---

### `step_model_2_novo_numero` - Usar Número Novo/Existente

**Sistema de slides**: 3 etapas

**Quando aparece**: Usuário escolheu Card 2 no Slide 4 do Modelo 2 (viu tela de adicionar número em vez de QR Code)

---

#### **Etapa 1 de 3**

**O que o usuário vê**:
- Subtítulo: "Etapa 1 de 3"
- Título: "Selecione: Usar um número novo ou existente do WhatsApp"
- **Imagem**: `/mod2-new1.png`
- Indicadores: ● ○ ○
- Botão: **"Continuar"** (preto)
- Link: "Voltar para início do Modelo X"

---

#### **Etapa 2 de 3**

**O que o usuário vê**:
- Subtítulo: "Etapa 2 de 3"
- Título: "Selecione seu número"
- Descrição 1: "Clique para selecionar seu número"
- **Imagem**: `/mod2-new2.png`
- Descrição 2: "Agora selecione seu número"
- **Imagem**: `/mod2-new3.png`
- Indicadores: ○ ● ○
- Botões: **"Continuar"** (preto) / "Voltar etapa anterior" (cinza)

---

#### **Etapa 3 de 3**

**O que o usuário vê**:
- Subtítulo: "Etapa 3 de 3"
- Título: "Tela de Permissão: clique em 'Confirmar'"
- **Imagem**: `/mod2-new4.png`
- Indicadores: ○ ○ ●
- Botões: **"Continuar para Fuso Horário"** (preto) → `step_model_2_fuso` / "Voltar etapa anterior" (cinza)
- Link: "Voltar para escolha anterior"

**Contexto para suporte**: Fluxo alternativo quando Facebook pede para adicionar número manualmente. Menos comum, mas acontece. Problemas:
- Número não aparece na lista
- Erro de permissão
- Número já vinculado a outra conta

---

### `step_model_2_fuso` - Seleção de Fuso Horário

**O que o usuário vê na tela**:
- Subtítulo: "Passo 7"
- Título: "Fuso Horário"
- Texto: "Após conectar, basta escolher o fuso horário, se estiver no horário de Brasília digite: **São Paulo** (será a opção América/São Paulo)."
- **Imagem**: `/fuso-horario.png` (campo de seleção de fuso)
- Botão: **"Próxima etapa"** (preto, destaque) → `step_model_2_conclusao`
- Link: "Voltar (Reiniciar Modelo X)"

**Contexto para suporte**: Usuário precisa escolher fuso horário correto. Problemas comuns:
- Não sabe qual fuso escolher
- Múltiplas opções de São Paulo
- Busca não funciona

---

### `step_model_2_conclusao` - Conclusão da Conexão

**O que o usuário vê na tela**:
- Subtítulo: "Passo 8"
- Título: "Conclusão"

**Box laranja IMPORTANTE**:
- "**Importante:** Para evitar problemas na conexão, ao clicar em 'Concluir' não mexa em mais nada. Apenas aguarde até aparecer na tela do sistema que a conexão foi realizada. **Não** clique em outros botões do sistema e **não** atualize a página — o sistema fará isso automaticamente."

**Texto adicional**:
- "Nesse momento basta clicar em **concluir**, e na tela do SecretáriaPlus apenas aguarde."

**2 imagens grandes (uma abaixo da outra)**:
- **Imagem 1**: `/conectando.png` (tela de carregamento)
- **Imagem 2**: `/concluir.png` (botão concluir do Facebook)

**Botões finais**:
- **"Feito 🎉"** (preto, destaque) → `step_celebration`
- Link: "Voltar etapa anterior"

**Contexto para suporte**: Etapa final antes da celebração. CRÍTICO que o usuário não faça nada além de aguardar. Problemas comuns:
- Usuário clica em outros lugares e cancela a conexão
- Fecha a aba
- Atualiza a página
- Demora muito tempo e fica impaciente

---

### `step_celebration` - Conexão Concluída! 🎉

**O que o usuário vê na tela**:
- **Tela cheia branca**
- Ícone animado (bounce): 🎉 (tamanho gigante, posição fixa no topo)
- Título centralizado: "Parabéns!" (texto enorme, 4xl/6xl)
- Subtítulo: "Conexão realizada com sucesso!" (texto grande, xl/2xl)
- **Confetes automáticos** (canvas-confetti library):
  - Explosão inicial no centro (y: 0.7)
  - Confetes dos lados esquerdo e direito (200ms depois)
  - Segunda onda no centro (400ms depois)
  - Terceira onda dupla dos lados (1s depois)
  - Cores variadas e física realista

**Efeitos visuais**:
- Múltiplas rajadas de confetes com diferentes spreads (26°, 60°, 100°, 120°)
- Velocidades variadas (25 a 55)
- Decay e scalar variados para efeito realista
- Z-index 1000 (acima de tudo)
- Total de ~800 partículas de confete

**Comportamento**:
- Sem botões ou links
- Tela final de celebração
- Usuário pode fechar ou navegar pelo navegador
- Animação roda automaticamente ao montar componente

**Contexto para suporte**: Tela de sucesso! Conexão completada. Se chegou aqui, tudo funcionou perfeitamente.

---

## 📊 Diagrama de Fluxo Completo
                    INÍCIO
                       │
                       ▼
            ┌─────────────────────┐
            │ stage_1_whatsapp_type │
            └─────────────────────┘
                  │           │
          WA Business    WA Normal
                  │           │
                  ▼           ▼
       ┌──────────────┐  ┌──────────────────────┐
       │stage_2_devices│  │stage_1_migrate_warning │
       └──────────────┘  └──────────────────────┘
              │
              ▼
    ┌───────────────────────┐
    │ Verificações de        │
    │ dispositivos          │
    │ (computer, mobile,    │
    │  tablet, OS)          │
    └───────────────────────┘
              │
              ▼
    ┌───────────────────────┐
    │ Verificações de       │
    │ tráfego e Meta        │
    │ (ads, access)         │
    └───────────────────────┘
              │
              ▼
    ┌───────────────────────┐
    │  step_check_tabs      │
    └───────────────────────┘
              │
              ▼
    ┌───────────────────────┐
    │ step_connection_start │
    └───────────────────────┘
              │
              ▼
           CONEXÃO
```

---

## 🆘 Problemas Comuns por Etapa

| Etapa | Problemas Frequentes | Possíveis Causas |
|-------|---------------------|------------------|
| `stage_1_whatsapp_type` | Usuário não sabe qual versão tem | Confusão entre as versões, nunca verificou |
| `stage_1_migrate_warning` | Dúvidas sobre backup e migração | Medo de perder conversas, não sabe como fazer |
| `stage_2_devices` | Não tem computador disponível | Tentando conectar só pelo celular |
| `stage_2_no_computer` | Insistência em conectar sem PC | Não entende que é exigência do Facebook |
| `stage_2_os_selection` | Não sabe qual sistema tem | Usuário não técnico, não sabe identificar |
| `stage_3_traffic_check` | Não sabe se faz tráfego pago | Terceiro gerencia, não tem conhecimento |
| `stage_3_traffic_source` | Confunde impulsionar com Meta Ads | Diferença não é clara para usuário |
| `stage_3_meta_access_check` | Não tem acesso à conta Meta | Gestor antigo, conta perdida, hackeada |
| `stage_3_meta_lost_access` | Conta vinculada a gestor antigo | Mudança de gestor, fim de contrato |
| `step_inside_system` | Não encontra menu no sistema | Interface do sistema não familiar |
| `step_check_tabs_mac/windows` | Múltiplas abas causando erro | Usuário clica várias vezes no botão verde |
| `step_connection_start` | QR Code não aparece | Bloqueio de pop-up, abas duplicadas |
| `step_model_1` | Erro ao criar portfólio | Campos inválidos, URL mal formatada |
| `step_model_2` | Não aparece opção esperada | Facebook muda interface aleatoriamente |
| `step_model_2_sim` | Mensagem não tem botão | WhatsApp desatualizado |
| `step_model_2_nao_iphone` | Não acha configurações | Versão do app antiga, menu em inglês |
| `step_model_2_nao_android` | "Plataforma Comercial" não existe | WhatsApp Business não instalado corretamente |
| `step_model_2_novo_numero` | Número não aparece na lista | Número já vinculado, não reconhecido |
| `step_model_2_fuso` | Fuso horário errado | Escolhe primeiro resultado sem ler |
| `step_model_2_conclusao` | Conexão falha no final | Usuário clicou em outras coisas, atualizou página |

---

## 📱 Mapeamento Completo de StepId

| StepId | Nome Amigável | Categoria | Tem Slides? |
|--------|---------------|-----------|-------------|
| `stage_1_whatsapp_type` | Seleção do Tipo de WhatsApp | Estágio 1 | Não |
| `stage_1_migrate_warning` | Aviso de Migração para Business | Estágio 1 | Não |
| `stage_2_devices` | Seleção de Dispositivos | Estágio 2 | Não |
| `stage_2_no_computer` | Aviso: Computador Obrigatório | Estágio 2 | Não |
| `stage_2_no_computer_support` | Suporte: Sem Computador | Estágio 2 | Não |
| `stage_2_computer_no_mobile` | Aviso: Celular Necessário | Estágio 2 | Não |
| `stage_2_tablet_check` | Verificação de WhatsApp no Tablet | Estágio 2 | Não |
| `stage_2_os_selection` | Seleção de Sistema Operacional | Estágio 2 | Não |
| `stage_3_traffic_check` | Verificação de Tráfego Pago | Estágio 3 | Não |
| `stage_3_traffic_source` | Fonte de Anúncios | Estágio 3 | Não |
| `stage_3_any_facebook` | Info: Qualquer Facebook Serve | Estágio 3 | Não |
| `stage_3_meta_access_check` | Verificação de Acesso ao Meta | Estágio 3 | Não |
| `stage_3_meta_access_uncertain` | Incerteza sobre Conta Meta | Estágio 3 | Não |
| `stage_3_meta_lost_access` | Orientação: Acesso Perdido | Estágio 3 | Não |
| `stage_3_meta_lost_access_options` | Opções: Acesso Perdido | Estágio 3 | Não |
| `stage_3_meta_lost_access_path_2` | Processo de Migração (deprecated) | Estágio 3 | Não |
| `step_inside_system` | Dentro do Sistema | Etapas Finais | Não (3 cards fixos) |
| `step_check_tabs_mac` | Verificação de Abas (Mac) | Etapas Finais | Não |
| `step_check_tabs_windows` | Verificação de Abas (Windows) | Etapas Finais | Não |
| `step_connection_start` | Início da Conexão | Etapas Finais | Não |
| `step_model_1` | Conexão - Modelo 1 | Modelo 1 | Sim (3 slides) |
| `step_model_2` | Conexão - Modelo 2 | Modelo 2 | Sim (6 slides: 0-5) |
| `step_model_2_sim` | Modelo 2 - Confirmação | Modelo 2 | Não |
| `step_model_2_nao_iphone` | Modelo 2 - iPhone | Modelo 2 | Sim (3 etapas) |
| `step_model_2_nao_android` | Modelo 2 - Android | Modelo 2 | Sim (4 etapas) |
| `step_model_2_novo_numero` | Modelo 2 - Novo Número | Modelo 2 | Sim (3 etapas) |
| `step_model_2_fuso` | Modelo 2 - Fuso Horário | Modelo 2 | Não |
| `step_model_2_conclusao` | Modelo 2 - Conclusão | Modelo 2 | Não |
| `step_celebration` | Conexão Concluída | Final | Não |

---

## 🖼️ Lista Completa de Imagens Utilizadas

### Estágios 1-3
- Nenhuma imagem (apenas ícones SVG inline)

### Dentro do Sistema
- `/1.png` - Botão "Conectar WhatsApp" no sistema
- `/2.png` - Tela "Leia e clique em continuar"
- `/3.png` - Pontos de atenção

### Verificação de Abas
- `/close-all.png` - Guias abertas no navegador (usado em Mac e Windows)
- `/close-mac.png` - Dock do Mac com navegador
- `/close-wind.jpg` - Barra de tarefas do Windows

### Conexão Start
- `/4.png` - Botão verde "Conectar WhatsApp Business"
- `/mod-1.png` - Preview do Modelo 1
- `/mod-2.png` - Preview do Modelo 2

### Modelo 1
- `/mod-1.1.png` - Botão "Começar"
- `/mod-1.2.png` - Criar/selecionar portfólio
- `/mod-1.3.png` - "Conecte seu app existente"

### Modelo 2
- `/mod-2.0.png` - Botão "Continuar"
- `/mod-2.1.png` - Criar/selecionar portfólio
- `/mod-2.2.png` - Selecionar número
- `/num-num.png` - Inserir número com país
- `/qr-code-new0.png` - Tela com QR Code
- `/mod2-new0.png` - Tela adicionar número
- `/facebook.png` - Mensagem do Facebook no WhatsApp

### QR Code e Scan
- `/scan-qr.png` - Botão "Escanear QR code"
- `/scan-qr2.png` - Câmera lendo QR code

### iPhone
- `/iphone1.png` - Configurações → Conta
- `/iphone2.png` - Conectar à Plataforma
- `/iphone3.png` - Seguir instruções
- `/iphone4.png` - Compartilhar conversas
- `/iphone6.png` - Continuar processo

### Android
- `/and-1.png` - Três pontinhos
- `/and-2.png` - Menu Configurações
- `/and-3.png` - Conta
- `/and-a.png` - Plataforma Comercial

### Novo Número
- `/mod2-new1.png` - Usar número novo/existente
- `/mod2-new2.png` - Clicar para selecionar
- `/mod2-new3.png` - Selecione seu número
- `/mod2-new4.png` - Tela de permissão/confirmar

### Final
- `/fuso-horario.png` - Seletor de fuso horário
- `/conectando.png` - Tela de carregamento
- `/concluir.png` - Botão concluir do Facebook

**Total**: 32 imagens únicas

---

## 🔧 Funcionalidades Técnicas do Sistema

### Sistema de Navegação
- **`goToStep(step)`**: Navega para qualquer etapa
- **`nextSlide()`**: Avança para próximo slide dentro de uma etapa
- **`prevSlide()`**: Volta para slide anterior
- **`currentSlide`**: Índice do slide atual (0-based)
- **`stepHistory`**: Array com histórico de etapas visitadas
- **Barra de progresso**: Calculada dinamicamente (0% inicial, +40% do restante a cada step)

### Persistência de Dados (localStorage)
- `wizard_runs_ads`: 'true' | 'false' | 'used_to_run' | 'false_other_number'
- `wizard_ad_platform`: 'instagram_boost' | 'meta_business'
- `wizard_meta_access`: 'has_access' | 'uncertain'
- `wizard_lost_access_strategy`: 'try_anyway'

### Estados Mantidos
- `devices.computer`: boolean
- `devices.computerType`: 'mac' | 'windows'
- `devices.mobile`: boolean
- `devices.mobileType`: 'iphone' | 'android'
- `devices.tablet`: boolean
- `cameFromModel1`: boolean (controla fluxo híbrido)

### Debug Console (window)
- `window.goToStep('step_id')` - Pula para qualquer etapa
- `window.listSteps()` - Lista todas as 29 etapas disponíveis

### Layout Responsivo (StageSurface)
**Larguras**:
- `sm`: max-w-xl (576px)
- `md`: max-w-2xl (672px)
- `lg`: max-w-3xl (768px)
- `xl`: max-w-4xl (896px)

**Padding**:
- `snug`: py-6
- `roomy`: py-8
- `airy`: py-12

**Alinhamento**:
- `start`: text-left
- `center`: text-center

### Configurações por Etapa
```javascript
// Estágio 1: xl, airy, start
// Estágio 2 geral: xl, roomy, start
// Estágio 2 compact (warnings): sm, snug, center
// Estágio 3: lg, roomy, center
// Etapas finais: xl, airy, center
```

---

## 💬 Widget de Suporte - Funcionalidades

### Contexto Automático
- **`stageContextRef`**: Captura nome da etapa atual automaticamente
- **`withStageContext()`**: Adiciona contexto da etapa à mensagem do usuário
- Formato: "Agora estou nessa etapa: [Nome Amigável] ([StepId])"

### Sistema de Digitação Inteligente
- **`TYPING_GRACE_MS`**: 6000ms - janela para detectar que usuário começou a digitar
- **`USER_IDLE_BEFORE_RESPONSE_MS`**: 60000ms - timeout para resposta automática
- **`isTypingRef`**: Boolean se usuário está digitando
- **`typingWindowActiveRef`**: Boolean se está na janela de espera
- **`userTypedDuringWindowRef`**: Boolean se digitou durante a janela
- **`pendingResponseRef`**: String com resposta do assistente aguardando

**Mensagens de aguardando**:
- Primeira vez: "Eu vi que você está digitando, vou esperar..."
- Variantes: 5 mensagens diferentes randomizadas

### Mídia e Anexos
- **Áudio**: Recording com MediaRecorder API, preview com player nativo + ícone mic
- **Fotos**: Captura por câmera ou upload, preview antes de enviar
- **Múltiplas imagens**: Até 5 arquivos simultâneos
- **Tipos aceitos**: PNG, JPEG, WebP, HEIC, MP3, WAV, WebM, MP4

### Comportamento do Chat
- **Auto-scroll**: Sempre vai para o final ao adicionar mensagem
- **Reset de chat**: Limpa histórico mas envia contexto da etapa atual ao assistente
- **Alinhamento**: Usuário à direita (azul), Assistente à esquerda (cinza)
- **Timestamps**: Hora:Minuto em formato PT-BR

---

*Última atualização: Dezembro 14, 2025*
*Versão: 2.0 - Documentação Completa com Todos os Detalhes Visuais*
