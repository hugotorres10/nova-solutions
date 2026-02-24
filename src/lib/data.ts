// ═══════════════════════════════════════════
// NOVA SOLUTIONS — BUSINESS DATA MODELS
// ═══════════════════════════════════════════

export type Company = {
  id: string;
  name: string;
  sector: string;
  icon: string;
  color: string;
  model: string;
  active: boolean;
};

export type DataPoint = {
  data: string;
  derivedAction: string;
};

export type MagicAction = {
  trigger: string;
  action: string;
  authority: string;
  approved?: boolean;
  enabled: boolean;
};

export type Integration = {
  id: string;
  name: string;
  icon: string;
  type: string;
  perCompany: boolean;
  refresh: string;
  connectionMethod: string;
  dataPoints: DataPoint[];
  derivedKPIs: string[];
  magicActions: MagicAction[];
  connected: boolean;
  enabled: boolean;
};

export type Alert = {
  id: string;
  type: "urgent" | "important" | "info" | "success";
  title: string;
  message: string;
  integration: string;
  company: string;
  timestamp: Date;
  read: boolean;
};

export type AdminUser = {
  id: string;
  name: string;
  email: string;
  role: "admin" | "manager" | "viewer";
  avatar: string;
  lastActive: Date;
};

export const COMPANIES: Company[] = [
  {
    id: "alpha",
    name: "Empresa Alpha",
    sector: "Technology & SaaS",
    icon: "\uD83C\uDFE2",
    color: "#00D4AA",
    model: "SaaS / Recorrente",
    active: true,
  },
  {
    id: "beta",
    name: "Empresa Beta",
    sector: "Engineering & Construction",
    icon: "\uD83C\uDFD7\uFE0F",
    color: "#448AFF",
    model: "Projetos / Contratos",
    active: true,
  },
  {
    id: "gamma",
    name: "Empresa Gamma",
    sector: "Innovation & Consulting",
    icon: "\uD83D\uDE80",
    color: "#E040FB",
    model: "Servi\u00E7os / Consultoria",
    active: true,
  },
];

export const INTEGRATIONS: Integration[] = [
  {
    id: "gmail",
    name: "Gmail / Google Workspace",
    icon: "\uD83D\uDCE7",
    type: "API",
    perCompany: true,
    refresh: "1 min",
    connectionMethod:
      "Google Workspace API (OAuth 2.0) \u2014 1 conex\u00E3o por conta de empresa",
    connected: true,
    enabled: true,
    dataPoints: [
      {
        data: "Emails recebidos (remetente, assunto, corpo, anexos)",
        derivedAction:
          "Classificar por urg\u00EAncia: \uD83D\uDD34 Urgente / \uD83D\uDFE1 Importante / \uD83D\uDFE2 Info / \u26AA Spam",
      },
      {
        data: "Emails n\u00E3o respondidos h\u00E1 >24h",
        derivedAction: "Gerar alerta + rascunho de Magic Reply",
      },
      {
        data: "Emails de clientes do CRM (cross-reference)",
        derivedAction:
          "Priorizar automaticamente \u2014 cliente ativo = urg\u00EAncia +1 n\u00EDvel",
      },
      {
        data: "Emails com palavras-chave (proposta, contrato, urgente, pagamento, reclama\u00E7\u00E3o)",
        derivedAction: "Flag autom\u00E1tico + notifica\u00E7\u00E3o push",
      },
      {
        data: "Volume de emails/dia e tempo m\u00E9dio de resposta",
        derivedAction: "KPI: Tempo de Resposta M\u00E9dio (horas)",
      },
      {
        data: "Threads em andamento sem fechamento",
        derivedAction:
          "Follow-up autom\u00E1tico sugerido ap\u00F3s 3 dias",
      },
    ],
    derivedKPIs: [
      "Emails n\u00E3o respondidos (por empresa)",
      "Tempo m\u00E9dio de resposta (por empresa)",
      "Emails urgentes pendentes",
      "Volume di\u00E1rio de emails",
    ],
    magicActions: [
      {
        trigger: "Email urgente recebido",
        action:
          "\u26A1 Magic Reply \u2014 rascunho de resposta pronto para aprovar e enviar",
        authority: "Voc\u00EA aprova",
        enabled: true,
      },
      {
        trigger: "Email sem resposta h\u00E1 3+ dias",
        action:
          "\u26A1 Magic Reply \u2014 follow-up gentil rascunhado",
        authority: "Voc\u00EA aprova",
        enabled: true,
      },
      {
        trigger: "Email com proposta/contrato",
        action:
          "\u26A1 Magic Action \u2014 extrair valores, datas, termos e criar resumo executivo",
        authority: "Autom\u00E1tico (resumo)",
        enabled: true,
      },
      {
        trigger: "Reclama\u00E7\u00E3o de cliente detectada",
        action:
          "\uD83D\uDD34 Alerta imediato + contexto do cliente do CRM + sugest\u00E3o de resposta",
        authority: "Voc\u00EA aprova resposta",
        enabled: true,
      },
    ],
  },
  {
    id: "outlook",
    name: "Outlook / Microsoft 365",
    icon: "\uD83D\uDCE8",
    type: "API",
    perCompany: true,
    refresh: "1 min",
    connectionMethod:
      "Microsoft Graph API (OAuth 2.0) \u2014 se alguma empresa usa M365 ao inv\u00E9s de Google",
    connected: false,
    enabled: true,
    dataPoints: [
      {
        data: "Mesmos data points do Gmail \u2014 emails, threads, urg\u00EAncia",
        derivedAction:
          "Mesma l\u00F3gica de classifica\u00E7\u00E3o e Magic Reply",
      },
      {
        data: "Integra\u00E7\u00E3o com Teams se usado",
        derivedAction: "Mensagens e calls do Teams centralizados",
      },
    ],
    derivedKPIs: [
      "Unificado com Gmail no dashboard (total cross-platform)",
    ],
    magicActions: [
      {
        trigger: "Mesmos do Gmail",
        action:
          "Mesmo fluxo \u2014 Magic Reply funciona igual",
        authority: "Voc\u00EA aprova",
        enabled: true,
      },
    ],
  },
  {
    id: "calendar",
    name: "Google Calendar",
    icon: "\uD83D\uDCC5",
    type: "API",
    perCompany: true,
    refresh: "5 min",
    connectionMethod:
      "Google Calendar API (OAuth 2.0) \u2014 1 calend\u00E1rio por empresa + pessoal",
    connected: true,
    enabled: true,
    dataPoints: [
      {
        data: "Todos os eventos: t\u00EDtulo, hor\u00E1rio, dura\u00E7\u00E3o, participantes, link de video call",
        derivedAction:
          "Timeline do dia no dashboard \u2014 mostrar agenda consolidada das 3 empresas",
      },
      {
        data: "Reuni\u00F5es com participantes externos (clientes, parceiros)",
        derivedAction:
          "30 min antes: gerar Briefing autom\u00E1tico com perfil + hist\u00F3rico + talking points",
      },
      {
        data: "Conflitos de hor\u00E1rio entre empresas",
        derivedAction:
          "\uD83D\uDD34 Alerta imediato: 'Reuni\u00E3o Empresa Alpha 14h conflita com Empresa Beta 14:30'",
      },
      {
        data: "Blocos livres (gaps entre reuni\u00F5es)",
        derivedAction:
          "Sugerir deep work, follow-ups pendentes, ou descanso dependendo do HRV",
      },
      {
        data: "Reuni\u00F5es recorrentes (dailies, weeklies, 1:1s)",
        derivedAction:
          "Identificar padr\u00E3o e sugerir prepara\u00E7\u00E3o autom\u00E1tica",
      },
      {
        data: "Reuni\u00F5es canceladas/remarcadas",
        derivedAction:
          "Atualizar timeline + sugerir uso do tempo liberado",
      },
    ],
    derivedKPIs: [
      "Reuni\u00F5es hoje / esta semana (por empresa)",
      "Pr\u00F3xima reuni\u00E3o (countdown)",
      "Horas em reuni\u00E3o/semana (por empresa + total)",
      "% do tempo em reuni\u00E3o vs. deep work",
      "Conflitos de agenda detectados",
    ],
    magicActions: [
      {
        trigger: "30 min antes de reuni\u00E3o com externo",
        action:
          "\u26A1 Magic Action \u2014 Briefing: quem \u00E9 a pessoa, empresa, hist\u00F3rico, pipeline, \u00FAltima intera\u00E7\u00E3o, talking points",
        authority: "Autom\u00E1tico (gera briefing)",
        enabled: true,
      },
      {
        trigger: "Conflito de hor\u00E1rio detectado",
        action:
          "\uD83D\uDD34 Alerta + sugest\u00E3o de qual remarcar (baseado em prioridade)",
        authority: "Voc\u00EA decide",
        enabled: true,
      },
      {
        trigger: "Reuni\u00E3o termina",
        action:
          "\u26A1 Magic Action \u2014 'Como foi a reuni\u00E3o? Registrar notas ou gravar resumo por voz'",
        authority: "Voc\u00EA decide interagir ou n\u00E3o",
        enabled: true,
      },
      {
        trigger: "Dia com >5h de reuni\u00E3o",
        action:
          "\uD83D\uDFE1 Alerta: 'Dia pesado \u2014 5.5h de reuni\u00E3o. Blocos de foco restantes: 14:30-15:30 e 16:00-17:00'",
        authority: "Autom\u00E1tico (informativo)",
        enabled: true,
      },
    ],
  },
  {
    id: "crm",
    name: "CRM (Pipedrive / HubSpot / Salesforce)",
    icon: "\uD83C\uDFAF",
    type: "API",
    perCompany: true,
    refresh: "5 min",
    connectionMethod:
      "API nativa de cada CRM (Pipedrive API, HubSpot API, etc.) \u2014 1 inst\u00E2ncia por empresa",
    connected: true,
    enabled: true,
    dataPoints: [
      {
        data: "Deals abertos: nome, valor, est\u00E1gio, probabilidade, owner, \u00FAltima atividade",
        derivedAction:
          "Pipeline visual por empresa + pipeline consolidado",
      },
      {
        data: "Deals movidos de est\u00E1gio (ex: proposta \u2192 negocia\u00E7\u00E3o)",
        derivedAction:
          "Notifica\u00E7\u00E3o: 'Deal TechCorp (\u20AC200K) avan\u00E7ou para Negocia\u00E7\u00E3o'",
      },
      {
        data: "Deals parados >7 dias no mesmo est\u00E1gio",
        derivedAction:
          "\uD83D\uDFE1 Alerta: 'Deal X parado h\u00E1 9 dias em Proposta \u2014 follow-up?'",
      },
      {
        data: "Deals perdidos (motivo, quando, por quem)",
        derivedAction:
          "An\u00E1lise de padr\u00E3o de perda + sugest\u00F5es",
      },
      {
        data: "Deals ganhos (valor, ciclo, quem fechou)",
        derivedAction:
          "\uD83D\uDFE2 Celebrar + atualizar receita + KPI de convers\u00E3o",
      },
      {
        data: "Contatos: nome, empresa, cargo, email, telefone, notas, hist\u00F3rico",
        derivedAction:
          "Base para Briefings de reuni\u00E3o e CRM pessoal",
      },
      {
        data: "Atividades: calls, emails, notas registradas no CRM",
        derivedAction: "Detectar contatos sem atividade (ghosted)",
      },
      {
        data: "Valor total do pipeline por est\u00E1gio",
        derivedAction: "Funnel chart no dashboard",
      },
      {
        data: "Taxa de convers\u00E3o (won/total) por per\u00EDodo",
        derivedAction: "KPI + tend\u00EAncia",
      },
      {
        data: "Ciclo m\u00E9dio de venda (dias do lead ao close)",
        derivedAction: "KPI + comparativo por empresa",
      },
    ],
    derivedKPIs: [
      "Pipeline total (\u20AC) por empresa + consolidado",
      "N\u00BA de deals abertos por empresa",
      "Taxa de convers\u00E3o (\u00FAltimos 30/60/90 dias)",
      "Ciclo m\u00E9dio de venda (dias)",
      "Deals parados >7 dias",
      "Revenue forecast (pipeline \u00D7 probabilidade)",
      "Deals ganhos este m\u00EAs (\u20AC)",
      "Deals perdidos este m\u00EAs (\u20AC)",
    ],
    magicActions: [
      {
        trigger: "Deal parado >7 dias",
        action:
          "\u26A1 Magic Reply \u2014 follow-up para o contato do deal, personalizado com contexto",
        authority: "Voc\u00EA aprova",
        enabled: true,
      },
      {
        trigger: "Deal ganho",
        action:
          "\uD83D\uDFE2 Atualizar receita projetada + notificar AGENT::CFO + sugerir post de celebra\u00E7\u00E3o",
        authority:
          "Autom\u00E1tico (registro) + Voc\u00EA aprova (post)",
        enabled: true,
      },
      {
        trigger: "Deal perdido",
        action:
          "\u26A1 Magic Action \u2014 an\u00E1lise: por que perdeu? Padr\u00E3o? Sugest\u00F5es para pr\u00F3ximos deals",
        authority: "Autom\u00E1tico (an\u00E1lise)",
        enabled: true,
      },
      {
        trigger: "Novo lead cadastrado",
        action:
          "\u26A1 Magic Action \u2014 pesquisar empresa/pessoa no LinkedIn + Brave, enriquecer perfil",
        authority: "Autom\u00E1tico (enriquecimento)",
        enabled: true,
      },
      {
        trigger: "Pipeline abaixo da meta mensal (forecast)",
        action:
          "\uD83D\uDD34 Alerta: 'Pipeline Empresa Alpha em 62% da meta. Faltam \u20AC80K. Sugest\u00E3o: reativar 5 leads frios'",
        authority: "Autom\u00E1tico (alerta)",
        enabled: true,
      },
    ],
  },
  {
    id: "project",
    name: "Trello / Asana / Monday + Notion",
    icon: "\uD83D\uDCCB",
    type: "API",
    perCompany: true,
    refresh: "5 min",
    connectionMethod:
      "API de cada tool (Asana API, Trello API, Notion API) \u2014 por empresa",
    connected: true,
    enabled: true,
    dataPoints: [
      {
        data: "Projetos ativos: nome, status, deadline, % completado, respons\u00E1veis",
        derivedAction:
          "Lista de projetos por empresa com status no dashboard",
      },
      {
        data: "Tasks atrasadas (deadline vencido + n\u00E3o conclu\u00EDda)",
        derivedAction:
          "\uD83D\uDD34 Alerta: 'Task X atrasada 3 dias \u2014 respons\u00E1vel: Jo\u00E3o'",
      },
      {
        data: "Tasks completadas hoje/semana",
        derivedAction: "KPI de produtividade + tend\u00EAncia",
      },
      {
        data: "Tasks assignadas a VOC\u00CA",
        derivedAction:
          "Priorizar na lista do dia com Eisenhower",
      },
      {
        data: "Milestones/entregas da semana",
        derivedAction:
          "Highlight na agenda: 'Entrega Projeto Y sexta-feira'",
      },
      {
        data: "Coment\u00E1rios e atualiza\u00E7\u00F5es recentes",
        derivedAction:
          "Feed de atividade \u2014 filtrar o que precisa de a\u00E7\u00E3o sua",
      },
      {
        data: "Documentos do Notion: wikis, specs, atas de reuni\u00E3o",
        derivedAction:
          "Base de conhecimento para Briefings e contexto",
      },
    ],
    derivedKPIs: [
      "Projetos ativos (por empresa + total)",
      "Tasks atrasadas (por empresa + total)",
      "Tasks completadas/semana",
      "Pr\u00F3xima entrega/milestone",
      "Velocidade do time (tasks completadas/semana)",
      "% de projetos no prazo vs. atrasados",
    ],
    magicActions: [
      {
        trigger: "Task atrasada >2 dias",
        action:
          "\uD83D\uDFE1 Alerta + sugest\u00E3o: cobrar respons\u00E1vel ou remarcar deadline",
        authority: "Voc\u00EA decide",
        enabled: true,
      },
      {
        trigger: "Milestone esta semana",
        action:
          "\u26A1 Magic Action \u2014 status check: tudo no caminho? Riscos? Bloqueios?",
        authority: "Autom\u00E1tico (an\u00E1lise)",
        enabled: true,
      },
      {
        trigger: "Projeto sem atividade >5 dias",
        action:
          "\uD83D\uDFE1 Alerta: 'Projeto Z sem updates h\u00E1 6 dias \u2014 perguntar ao time?'",
        authority: "Voc\u00EA decide",
        enabled: true,
      },
      {
        trigger: "Todas as tasks da sprint completadas",
        action:
          "\uD83D\uDFE2 Celebrar + gerar retrospectiva sugerida",
        authority: "Autom\u00E1tico + Voc\u00EA aprova retro",
        enabled: true,
      },
    ],
  },
  {
    id: "payments",
    name: "Stripe / Plataforma de Pagamento",
    icon: "\uD83D\uDCB3",
    type: "API + Webhooks",
    perCompany: true,
    refresh: "Real-time (webhook) + 15 min",
    connectionMethod:
      "Stripe API + Webhooks \u2014 1 conta por empresa",
    connected: true,
    enabled: true,
    dataPoints: [
      {
        data: "MRR (Monthly Recurring Revenue) \u2014 para empresa SaaS",
        derivedAction:
          "KPI principal da empresa SaaS no dashboard",
      },
      {
        data: "Novas assinaturas / churn / upgrades / downgrades",
        derivedAction:
          "KPI: Net Revenue Retention + alertas de churn",
      },
      {
        data: "Cobran\u00E7as falhadas (cart\u00E3o recusado, expirado)",
        derivedAction:
          "\uD83D\uDD34 Alerta: '\u20AC3.200 em cobran\u00E7as falhadas \u2014 4 clientes. Dunning autom\u00E1tico ativo?'",
      },
      {
        data: "Invoices pagas / pendentes / vencidas",
        derivedAction:
          "Fluxo de caixa projetado + alertas de inadimpl\u00EAncia",
      },
      {
        data: "Receita do dia / semana / m\u00EAs (tempo real)",
        derivedAction:
          "Receita live no dashboard, atualizada a cada transa\u00E7\u00E3o",
      },
      {
        data: "Ticket m\u00E9dio e LTV",
        derivedAction:
          "KPI: quanto cada cliente vale ao longo do tempo",
      },
      {
        data: "Refunds / disputes",
        derivedAction:
          "\uD83D\uDD34 Alerta imediato + sugerir a\u00E7\u00E3o",
      },
    ],
    derivedKPIs: [
      "MRR por empresa (SaaS)",
      "Receita do m\u00EAs (todas as empresas consolidado)",
      "Receita recorrente vs. pontual (mix)",
      "Churn rate mensal",
      "Net Revenue Retention",
      "Cobran\u00E7as falhadas pendentes (\u20AC)",
      "Invoices vencidas (\u20AC + n\u00BA)",
      "Ticket m\u00E9dio por empresa",
    ],
    magicActions: [
      {
        trigger: "Cobran\u00E7a falhou",
        action:
          "\u26A1 Magic Reply \u2014 email de dunning personalizado para o cliente",
        authority: "Voc\u00EA aprova",
        enabled: true,
      },
      {
        trigger: "Churn detectado (cancelamento)",
        action:
          "\uD83D\uDD34 Alerta + perfil do cliente + sugest\u00E3o de reten\u00E7\u00E3o",
        authority: "Voc\u00EA decide a\u00E7\u00E3o",
        enabled: true,
      },
      {
        trigger: "MRR caiu >5% no m\u00EAs",
        action:
          "\uD83D\uDD34 An\u00E1lise: quais clientes sa\u00EDram, motivos, impacto projetado, a\u00E7\u00F5es sugeridas",
        authority:
          "Autom\u00E1tico (an\u00E1lise) + Voc\u00EA decide a\u00E7\u00F5es",
        enabled: true,
      },
      {
        trigger: "Nova assinatura de alto valor",
        action:
          "\uD83D\uDFE2 Notifica\u00E7\u00E3o + sugerir onboarding priorit\u00E1rio",
        authority: "Autom\u00E1tico",
        enabled: true,
      },
      {
        trigger: "Invoice vencida >15 dias",
        action:
          "\u26A1 Magic Reply \u2014 cobran\u00E7a educada + op\u00E7\u00E3o de parcelamento",
        authority: "Voc\u00EA aprova",
        enabled: true,
      },
    ],
  },
  {
    id: "erp",
    name: "Sistema Pr\u00F3prio / ERP",
    icon: "\uD83C\uDFED",
    type: "API / DB",
    perCompany: true,
    refresh: "15 min",
    connectionMethod:
      "API do ERP ou conex\u00E3o direta ao banco de dados (read-only)",
    connected: false,
    enabled: true,
    dataPoints: [
      {
        data: "Faturamento mensal detalhado (notas fiscais emitidas)",
        derivedAction:
          "Receita REAL (n\u00E3o projetada) por empresa por m\u00EAs",
      },
      {
        data: "Despesas operacionais (folha, fornecedores, custos)",
        derivedAction: "Margem de lucro por empresa",
      },
      {
        data: "Contas a pagar / contas a receber",
        derivedAction:
          "Fluxo de caixa projetado + alertas de vencimento",
      },
      {
        data: "Notas fiscais emitidas e recebidas",
        derivedAction: "Controle fiscal autom\u00E1tico",
      },
      {
        data: "Estoque / invent\u00E1rio (se aplic\u00E1vel)",
        derivedAction: "Alerta de estoque baixo",
      },
      {
        data: "Clientes ativos / inativos",
        derivedAction: "KPI + churn de clientes por empresa",
      },
    ],
    derivedKPIs: [
      "Faturamento mensal real (por empresa)",
      "Despesas operacionais (por empresa)",
      "Lucro operacional (por empresa)",
      "Margem de lucro %",
      "Contas a receber vencidas (\u20AC)",
      "Contas a pagar pr\u00F3ximos 30 dias (\u20AC)",
      "N\u00BA de clientes ativos (por empresa)",
    ],
    magicActions: [
      {
        trigger: "Conta a pagar vence em 3 dias",
        action:
          "\uD83D\uDFE1 Lembrete: 'Fornecedor X \u2014 \u20AC12K vence dia 26'",
        authority: "Autom\u00E1tico (lembrete)",
        enabled: true,
      },
      {
        trigger: "Conta a receber vencida >10 dias",
        action:
          "\u26A1 Magic Reply \u2014 cobran\u00E7a ao cliente devedor",
        authority: "Voc\u00EA aprova",
        enabled: true,
      },
      {
        trigger: "Margem abaixo do target",
        action:
          "\uD83D\uDD34 An\u00E1lise: o que est\u00E1 pesando? Sugest\u00F5es de corte ou renegocia\u00E7\u00E3o",
        authority: "Autom\u00E1tico (an\u00E1lise)",
        enabled: true,
      },
    ],
  },
  {
    id: "sheets",
    name: "Google Sheets / Excel",
    icon: "\uD83D\uDCCA",
    type: "API / Sync",
    perCompany: true,
    refresh: "30 min",
    connectionMethod:
      "Google Sheets API (para GSheets) + OneDrive API (para Excel)",
    connected: true,
    enabled: true,
    dataPoints: [
      {
        data: "KPIs customizados que o time atualiza em planilhas",
        derivedAction:
          "Sincronizar KPIs de planilha \u2192 dashboard automaticamente",
      },
      {
        data: "Relat\u00F3rios semanais/mensais que s\u00F3cios preenchem",
        derivedAction:
          "Consolidar no status semanal das 3 empresas",
      },
      {
        data: "OKRs / metas trimestrais",
        derivedAction: "Tracking de progresso vs. meta",
      },
      {
        data: "Budget vs. Realizado",
        derivedAction:
          "Varia\u00E7\u00E3o or\u00E7ament\u00E1ria por empresa",
      },
    ],
    derivedKPIs: [
      "Customizado por planilha (configur\u00E1vel)",
      "OKR progress % por empresa",
      "Budget vs. Realizado gap",
    ],
    magicActions: [
      {
        trigger:
          "KPI atualizado na planilha com varia\u00E7\u00E3o >10%",
        action:
          "\uD83D\uDFE1 Alerta: 'KPI X da Empresa Alpha caiu 12% \u2014 ver detalhes'",
        authority: "Autom\u00E1tico (alerta)",
        enabled: true,
      },
      {
        trigger: "OKR abaixo de 50% com <30 dias restantes",
        action:
          "\uD83D\uDD34 Alerta: 'OKR Y em risco \u2014 42% completado, 25 dias restantes'",
        authority: "Autom\u00E1tico (alerta)",
        enabled: true,
      },
    ],
  },
  {
    id: "whatsapp",
    name: "WhatsApp Business",
    icon: "\uD83D\uDCAC",
    type: "API",
    perCompany: true,
    refresh: "2 min",
    connectionMethod:
      "WhatsApp Business API (Meta Cloud API) ou integra\u00E7\u00E3o via Twilio",
    connected: true,
    enabled: true,
    dataPoints: [
      {
        data: "Mensagens de clientes (novo pedido, d\u00FAvida, reclama\u00E7\u00E3o)",
        derivedAction:
          "Classificar por tipo + urg\u00EAncia + cross-ref com CRM",
      },
      {
        data: "Mensagens de s\u00F3cios (decis\u00E3o, update, pergunta)",
        derivedAction:
          "Priorizar como \uD83D\uDFE1 Importante \u2014 contexto do projeto/empresa",
      },
      {
        data: "Grupos de empresa (atualiza\u00E7\u00F5es, discuss\u00F5es)",
        derivedAction:
          "Resumo di\u00E1rio: 'Grupo Empresa Alpha: 23 mensagens, 3 decis\u00F5es pendentes'",
      },
      {
        data: "Mensagens n\u00E3o respondidas h\u00E1 >4h",
        derivedAction:
          "Alerta: 'Cliente Y esperando resposta h\u00E1 5h no WhatsApp'",
      },
    ],
    derivedKPIs: [
      "Mensagens n\u00E3o respondidas (por empresa)",
      "Tempo m\u00E9dio de resposta WhatsApp",
      "Volume de mensagens/dia (por empresa)",
    ],
    magicActions: [
      {
        trigger: "Mensagem de cliente com palavra urgente",
        action:
          "\uD83D\uDD34 Alerta push + contexto do CRM + sugest\u00E3o de resposta",
        authority: "Voc\u00EA aprova",
        enabled: true,
      },
      {
        trigger: "Resumo di\u00E1rio de grupos",
        action:
          "\u26A1 Magic Action \u2014 resumo: decis\u00F5es, pend\u00EAncias, temas discutidos",
        authority: "Autom\u00E1tico (resumo)",
        enabled: true,
      },
    ],
  },
  {
    id: "videocall",
    name: "Zoom / Google Meet",
    icon: "\uD83D\uDCF9",
    type: "API",
    perCompany: false,
    refresh: "Evento (webhook)",
    connectionMethod:
      "Zoom API + Google Meet (via Calendar API). Grava\u00E7\u00F5es + transcri\u00E7\u00F5es autom\u00E1ticas.",
    connected: false,
    enabled: true,
    dataPoints: [
      {
        data: "Grava\u00E7\u00E3o de reuni\u00E3o (se habilitada)",
        derivedAction:
          "Transcri\u00E7\u00E3o autom\u00E1tica + resumo + action items extra\u00EDdos",
      },
      {
        data: "Participantes e dura\u00E7\u00E3o",
        derivedAction:
          "Log: quem participou, quanto tempo, de qual empresa",
      },
      {
        data: "Horas em video call/semana",
        derivedAction:
          "KPI: tempo em calls (separar por empresa)",
      },
    ],
    derivedKPIs: [
      "Horas em video call/semana",
      "Reuni\u00F5es gravadas vs. n\u00E3o gravadas",
    ],
    magicActions: [
      {
        trigger: "Reuni\u00E3o gravada finaliza",
        action:
          "\u26A1 Magic Action \u2014 gerar: resumo executivo + action items + decis\u00F5es + follow-ups",
        authority: "Autom\u00E1tico (resumo)",
        enabled: true,
      },
      {
        trigger: "Action item detectado na transcri\u00E7\u00E3o",
        action:
          "\u26A1 Magic Action \u2014 criar task no Asana/Trello com assignee e deadline",
        authority: "Voc\u00EA aprova cada task",
        enabled: true,
      },
    ],
  },
  {
    id: "news",
    name: "Not\u00EDcias Externas / Concorr\u00EAncia",
    icon: "\uD83D\uDCF0",
    type: "RSS + Web Scraping",
    perCompany: true,
    refresh: "30 min",
    connectionMethod:
      "Brave Search API + RSS feeds de portais do setor + Google Alerts",
    connected: true,
    enabled: true,
    dataPoints: [
      {
        data: "Not\u00EDcias sobre concorrentes diretos (3-5 por empresa)",
        derivedAction: "Resumo + an\u00E1lise de impacto",
      },
      {
        data: "Not\u00EDcias do setor/ind\u00FAstria de cada empresa",
        derivedAction:
          "Briefing semanal de mercado por empresa",
      },
      {
        data: "Regulamenta\u00E7\u00F5es / leis novas que afetam os neg\u00F3cios",
        derivedAction:
          "\uD83D\uDFE1 Alerta: 'Nova regulamenta\u00E7\u00E3o de privacidade \u2014 impacto em Empresa Alpha?'",
      },
      {
        data: "Tend\u00EAncias de mercado (funding, M&A, expans\u00F5es)",
        derivedAction: "Oportunidades e amea\u00E7as detectadas",
      },
      {
        data: "Men\u00E7\u00F5es das suas empresas na m\u00EDdia",
        derivedAction: "Alerta de PR: positivo ou negativo",
      },
    ],
    derivedKPIs: [
      "Not\u00EDcias relevantes/semana (por setor)",
      "Movimentos de concorrentes detectados",
      "Men\u00E7\u00F5es das suas empresas na m\u00EDdia",
    ],
    magicActions: [
      {
        trigger: "Concorrente lan\u00E7a produto/feature",
        action:
          "\u26A1 Magic Action \u2014 an\u00E1lise competitiva: o que lan\u00E7aram, como afeta, sugest\u00E3o de rea\u00E7\u00E3o",
        authority: "Autom\u00E1tico (an\u00E1lise)",
        enabled: true,
      },
      {
        trigger: "Men\u00E7\u00E3o da sua empresa na m\u00EDdia",
        action:
          "\uD83D\uDFE1 Alerta: positiva (celebrar / reshare) ou negativa (crisis management)",
        authority:
          "Autom\u00E1tico (alerta) + Voc\u00EA decide a\u00E7\u00E3o",
        enabled: true,
      },
      {
        trigger: "Oportunidade de mercado detectada",
        action:
          "\u26A1 Magic Action \u2014 briefing: tamanho da oportunidade, fit com suas empresas, pr\u00F3ximos passos sugeridos",
        authority: "Autom\u00E1tico (an\u00E1lise)",
        enabled: true,
      },
    ],
  },
];

// Computed stats
export const STATS = {
  totalIntegrations: INTEGRATIONS.length,
  totalConnections:
    INTEGRATIONS.filter((i) => i.perCompany).length * 3 +
    INTEGRATIONS.filter((i) => !i.perCompany).length,
  totalDataPoints: INTEGRATIONS.reduce(
    (a, i) => a + i.dataPoints.length,
    0,
  ),
  totalKPIs: INTEGRATIONS.reduce(
    (a, i) => a + i.derivedKPIs.length,
    0,
  ),
  totalMagicActions: INTEGRATIONS.reduce(
    (a, i) => a + i.magicActions.length,
    0,
  ),
};

// Mock alerts for demo
export const MOCK_ALERTS: Alert[] = [
  {
    id: "1",
    type: "urgent",
    title: "Cobran\u00E7a falhada",
    message:
      "\u20AC3.200 em cobran\u00E7as falhadas \u2014 4 clientes Empresa Alpha",
    integration: "payments",
    company: "alpha",
    timestamp: new Date(Date.now() - 1000 * 60 * 15),
    read: false,
  },
  {
    id: "2",
    type: "important",
    title: "Deal parado",
    message:
      "Deal TechCorp (\u20AC200K) parado h\u00E1 9 dias em Proposta",
    integration: "crm",
    company: "beta",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
    read: false,
  },
  {
    id: "3",
    type: "info",
    title: "Briefing pronto",
    message:
      "Briefing para reuni\u00E3o com InnoTech \u00E0s 14:30 est\u00E1 pronto",
    integration: "calendar",
    company: "gamma",
    timestamp: new Date(Date.now() - 1000 * 60 * 30),
    read: true,
  },
  {
    id: "4",
    type: "success",
    title: "Deal ganho!",
    message:
      "Empresa Beta fechou contrato de \u20AC150K com BuildCorp",
    integration: "crm",
    company: "beta",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4),
    read: true,
  },
  {
    id: "5",
    type: "urgent",
    title: "Email urgente",
    message:
      "CEO da ClientMax aguarda resposta h\u00E1 26h",
    integration: "gmail",
    company: "alpha",
    timestamp: new Date(Date.now() - 1000 * 60 * 45),
    read: false,
  },
  {
    id: "6",
    type: "important",
    title: "Task atrasada",
    message:
      "Entrega do m\u00F3dulo API atrasada 3 dias \u2014 respons\u00E1vel: Jo\u00E3o",
    integration: "project",
    company: "alpha",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6),
    read: false,
  },
  {
    id: "7",
    type: "info",
    title: "Concorrente",
    message:
      "TechRival lan\u00E7ou nova feature de analytics \u2014 an\u00E1lise dispon\u00EDvel",
    integration: "news",
    company: "alpha",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8),
    read: true,
  },
  {
    id: "8",
    type: "success",
    title: "MRR +8%",
    message:
      "MRR da Empresa Alpha subiu 8% vs m\u00EAs anterior",
    integration: "payments",
    company: "alpha",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 12),
    read: true,
  },
];

// Mock KPI data for charts
export const MOCK_KPI_DATA = {
  mrr: {
    current: 48500,
    previous: 44900,
    trend: "up" as const,
    change: 8.0,
  },
  pipeline: {
    current: 620000,
    previous: 580000,
    trend: "up" as const,
    change: 6.9,
  },
  emailResponseTime: {
    current: 2.3,
    previous: 3.1,
    trend: "down" as const,
    change: -25.8,
  },
  openDeals: {
    current: 34,
    previous: 29,
    trend: "up" as const,
    change: 17.2,
  },
  tasksCompleted: {
    current: 47,
    previous: 42,
    trend: "up" as const,
    change: 11.9,
  },
  churnRate: {
    current: 2.1,
    previous: 2.8,
    trend: "down" as const,
    change: -25.0,
  },
  conversionRate: {
    current: 32,
    previous: 28,
    trend: "up" as const,
    change: 14.3,
  },
  activeClients: {
    current: 156,
    previous: 148,
    trend: "up" as const,
    change: 5.4,
  },
};
