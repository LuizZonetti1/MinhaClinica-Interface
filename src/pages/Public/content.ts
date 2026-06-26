export type PublicPageKey =
    | "funcionalidades"
    | "precos"
    | "integracoes"
    | "seguranca"
    | "ajuda"
    | "blog"
    | "suporte"
    | "sobre"
    | "contato"
    | "privacidade"
    | "termos";

export interface PublicPageSection {
    iconKey: string;
    title: string;
    text: string;
}

export interface PublicPageContent {
    heroIconKey: string;
    accentColor: string;
    accentBg: string;
    tag: string;
    title: string;
    description: string;
    sections: ReadonlyArray<PublicPageSection>;
    cta?: { label: string; to: string };
}

export const PUBLIC_PAGES: Readonly<Record<PublicPageKey, PublicPageContent>> = {
    funcionalidades: {
        heroIconKey: "Sparkles",
        accentColor: "#2563EB",
        accentBg: "#DBEAFE",
        tag: "Produto",
        title: "Funcionalidades",
        description:
            "Tudo que sua clínica precisa para operar com eficiência — de agendamentos a prontuários, dashboards e controle de equipe — em uma única plataforma.",
        sections: [
            {
                iconKey: "Calendar",
                title: "Agendamento inteligente",
                text: "Gerencie horários de toda a equipe, reduza conflitos e envie confirmações automáticas. Acompanhe cancelamentos e reagendamentos em tempo real.",
            },
            {
                iconKey: "Users",
                title: "Gestão de pacientes",
                text: "Prontuário eletrônico centralizado com histórico completo de consultas, exames e documentos clínicos — acessível de qualquer dispositivo.",
            },
            {
                iconKey: "BarChart3",
                title: "Dashboards por perfil",
                text: "Cada profissional visualiza indicadores, agenda e atalhos adaptados à sua função. Admin, recepção, médico e paciente têm painéis próprios.",
            },
            {
                iconKey: "FileText",
                title: "Documentos clínicos",
                text: "Emita e armazene receitas, atestados, laudos e declarações diretamente na plataforma, com rastreabilidade e acesso seguro.",
            },
            {
                iconKey: "Bell",
                title: "Notificações automáticas",
                text: "Lembretes de consulta, alertas de aniversário e comunicações internas para manter pacientes e equipe sempre informados.",
            },
            {
                iconKey: "Shield",
                title: "Controle de acesso",
                text: "Permissões granulares por perfil garantem que cada usuário visualize somente o que é necessário para sua função.",
            },
        ],
        cta: { label: "Cadastrar minha clínica", to: "/clinica/registro/inicial" },
    },

    precos: {
        heroIconKey: "Tag",
        accentColor: "#9333EA",
        accentBg: "#F3E8FF",
        tag: "Produto",
        title: "Preços",
        description:
            "Nossos planos são dimensionados pelo tamanho e necessidades da sua clínica. Entre em contato para receber uma proposta personalizada sem compromisso.",
        sections: [
            {
                iconKey: "Building2",
                title: "Plano Clínica",
                text: "Ideal para clínicas com múltiplos profissionais e recepção. Inclui todos os módulos: agenda, prontuário, documentos, notificações e relatórios.",
            },
            {
                iconKey: "Stethoscope",
                title: "Plano Consultório",
                text: "Para profissionais autônomos que precisam de controle de agenda, histórico de pacientes e emissão de documentos de forma simples.",
            },
            {
                iconKey: "CheckCircle",
                title: "Implantação assistida",
                text: "Todas as contratações incluem onboarding assistido para garantir que sua equipe esteja operando com confiança desde o primeiro dia.",
            },
            {
                iconKey: "Sparkles",
                title: "Sem custo oculto",
                text: "Valor fixo por perfil ativo, sem taxas por transação ou cobranças surpresa ao final do mês.",
            },
        ],
        cta: { label: "Solicitar proposta", to: "/contato" },
    },

    integracoes: {
        heroIconKey: "Plug",
        accentColor: "#0EA5E9",
        accentBg: "#E0F2FE",
        tag: "Produto",
        title: "Integrações",
        description:
            "A Minha Clínica conecta-se a serviços externos para eliminar retrabalho e manter todos os dados sincronizados no mesmo lugar.",
        sections: [
            {
                iconKey: "Mail",
                title: "Notificações por e-mail",
                text: "Envio automático de lembretes de consulta, confirmações de cadastro e comunicados operacionais diretamente na caixa de entrada do paciente.",
            },
            {
                iconKey: "Bell",
                title: "Alertas e lembretes internos",
                text: "Sistema de notificações in-app para manter recepção, profissionais e administradores alinhados sobre eventos críticos da operação.",
            },
            {
                iconKey: "FileText",
                title: "Gestão documental",
                text: "Upload e vínculo de documentos ao histórico de cada paciente, com rastreabilidade e controle de versão centralizados.",
            },
        ],
        cta: { label: "Falar com suporte", to: "mailto:suporte@minhaclinica.com.br" },
    },

    seguranca: {
        heroIconKey: "Shield",
        accentColor: "#EA580C",
        accentBg: "#FFEDD5",
        tag: "Produto",
        title: "Segurança",
        description:
            "Dados clínicos exigem proteção máxima. Adotamos controles técnicos, processuais e de acesso alinhados à LGPD e às boas práticas de segurança da informação.",
        sections: [
            {
                iconKey: "Lock",
                title: "Autenticação segura",
                text: "Autenticação com token JWT de curta duração, verificação em dois fatores (2FA) e controle rigoroso de sessões ativas para impedir acessos não autorizados.",
            },
            {
                iconKey: "ShieldCheck",
                title: "Proteção de dados — LGPD",
                text: "Tratamento de dados sensíveis conforme a Lei Geral de Proteção de Dados: base legal definida, direitos do titular garantidos e registro de atividades de tratamento.",
            },
            {
                iconKey: "Users",
                title: "Permissões por perfil",
                text: "Cada perfil — Administrador, Profissional, Recepção e Paciente — acessa somente os recursos necessários à sua função, sem vazamento de dados entre usuários.",
            },
            {
                iconKey: "Server",
                title: "Infraestrutura confiável",
                text: "Aplicação hospedada em ambiente cloud com backups automáticos, monitoramento contínuo de disponibilidade e políticas documentadas de resposta a incidentes.",
            },
            {
                iconKey: "FileCheck",
                title: "Auditoria e rastreabilidade",
                text: "Ações críticas são registradas com data, horário e usuário responsável, facilitando investigações internas e conformidade com auditorias regulatórias.",
            },
            {
                iconKey: "RefreshCw",
                title: "Revisões contínuas de segurança",
                text: "Ciclos periódicos de avaliação de vulnerabilidades e atualização de dependências para manter a plataforma protegida contra novas ameaças.",
            },
        ],
    },

    ajuda: {
        heroIconKey: "HelpCircle",
        accentColor: "#16A34A",
        accentBg: "#DCFCE7",
        tag: "Recursos",
        title: "Central de Ajuda",
        description:
            "Guias práticos organizados por fluxo de trabalho para que sua equipe resolva dúvidas com agilidade e opere a plataforma com confiança desde o primeiro acesso.",
        sections: [
            {
                iconKey: "Building2",
                title: "Primeiros passos",
                text: "Como criar a conta da clínica, verificar o e-mail, configurar o perfil do responsável e convidar profissionais e recepcionistas para a plataforma.",
            },
            {
                iconKey: "Calendar",
                title: "Gestão de agenda",
                text: "Como criar horários disponíveis, marcar consultas, confirmar presença, registrar check-in e lidar com cancelamentos e reagendamentos.",
            },
            {
                iconKey: "Users",
                title: "Pacientes e prontuários",
                text: "Cadastro de pacientes, aprovação de pré-cadastro feito pelo próprio paciente, acesso ao histórico clínico e gestão de documentos vinculados ao atendimento.",
            },
            {
                iconKey: "FileText",
                title: "Documentos clínicos",
                text: "Emissão de receitas, atestados e laudos a partir do prontuário. Visualização pelo paciente no portal e controle de acesso por perfil de usuário.",
            },
            {
                iconKey: "Lock",
                title: "Perfis e permissões",
                text: "Entenda as diferenças entre os perfis Admin, Profissional, Recepção e Paciente, e como configurar acessos de acordo com a estrutura da sua clínica.",
            },
            {
                iconKey: "Bell",
                title: "Notificações e comunicações",
                text: "Configure lembretes automáticos de consulta, alertas internos para a equipe e comunicados enviados diretamente ao e-mail dos pacientes.",
            },
        ],
        cta: { label: "Falar com suporte", to: "mailto:suporte@minhaclinica.com.br" },
    },

    blog: {
        heroIconKey: "BookOpen",
        accentColor: "#9333EA",
        accentBg: "#F3E8FF",
        tag: "Recursos",
        title: "Blog",
        description:
            "Conteúdo prático sobre gestão clínica, produtividade médica e experiência do paciente — escrito por quem entende a rotina de consultórios e clínicas.",
        sections: [
            {
                iconKey: "Stethoscope",
                title: "Gestão clínica",
                text: "Boas práticas para organizar agenda, reduzir absenteísmo, melhorar o fluxo de atendimento e aumentar a satisfação dos pacientes no dia a dia.",
            },
            {
                iconKey: "BarChart3",
                title: "Indicadores e resultados",
                text: "Como usar métricas operacionais para tomar decisões estratégicas, identificar gargalos e escalar a clínica de forma sustentável.",
            },
            {
                iconKey: "Heart",
                title: "Experiência do paciente",
                text: "Estratégias de comunicação, acolhimento digital e fidelização para construir uma relação de longo prazo com quem você atende.",
            },
            {
                iconKey: "Sparkles",
                title: "Tecnologia na saúde",
                text: "Tendências em prontuário eletrônico, automação de processos e ferramentas que simplificam a prática clínica sem complicar a rotina.",
            },
            {
                iconKey: "Calendar",
                title: "Produtividade médica",
                text: "Dicas para otimizar o tempo de atendimento, reduzir tarefas administrativas repetitivas e manter o foco no que realmente importa.",
            },
            {
                iconKey: "Users",
                title: "Gestão de equipe",
                text: "Como estruturar funções, definir permissões e manter recepcionistas e profissionais alinhados para uma operação mais fluida.",
            },
        ],
    },

    suporte: {
        heroIconKey: "Headphones",
        accentColor: "#0EA5E9",
        accentBg: "#E0F2FE",
        tag: "Recursos",
        title: "Suporte",
        description:
            "Nossa equipe está disponível para resolver dúvidas técnicas, solicitações de configuração e qualquer necessidade operacional da sua clínica.",
        sections: [
            {
                iconKey: "Mail",
                title: "Canal de atendimento",
                text: "Envie sua solicitação para suporte@minhaclinica.com.br descrevendo o problema, o perfil de usuário afetado e o horário em que ocorreu.",
            },
            {
                iconKey: "Zap",
                title: "Chamados críticos",
                text: "Problemas que impedem o funcionamento da operação — como impossibilidade de agendar ou acessar prontuários — são priorizados e tratados com urgência.",
            },
            {
                iconKey: "Clock",
                title: "Horário de atendimento",
                text: "Suporte disponível em dias úteis, das 8h às 18h. Para situações urgentes fora do horário, envie e-mail com a palavra URGENTE no assunto.",
            },
            {
                iconKey: "HelpCircle",
                title: "Base de conhecimento",
                text: "Antes de abrir um chamado, consulte a Central de Ajuda — a maioria das dúvidas operacionais já está documentada com passo a passo detalhado.",
            },
            {
                iconKey: "CheckCircle",
                title: "Acompanhamento do chamado",
                text: "Você receberá confirmação de recebimento por e-mail e será notificado a cada atualização até a resolução completa do seu chamado.",
            },
            {
                iconKey: "RefreshCw",
                title: "Melhoria contínua",
                text: "Todo feedback de suporte é analisado para aprimorar a plataforma e reduzir a incidência de problemas recorrentes nas próximas versões.",
            },
        ],
        cta: { label: "Enviar e-mail para suporte", to: "mailto:suporte@minhaclinica.com.br" },
    },

    sobre: {
        heroIconKey: "Building2",
        accentColor: "#2563EB",
        accentBg: "#DBEAFE",
        tag: "Empresa",
        title: "Sobre Nós",
        description:
            "A Minha Clínica nasceu para simplificar a gestão de clínicas e consultórios médicos — unindo tecnologia moderna com foco absoluto no cuidado ao paciente.",
        sections: [
            {
                iconKey: "Heart",
                title: "Nossa missão",
                text: "Eliminar burocracia operacional para que médicos, enfermeiros e recepcionistas concentrem sua energia onde realmente importa: cuidar das pessoas.",
            },
            {
                iconKey: "Sparkles",
                title: "Nossa visão",
                text: "Ser a plataforma de referência para gestão clínica no Brasil — confiável, acessível e construída em parceria com profissionais de saúde.",
            },
            {
                iconKey: "Shield",
                title: "Nossos valores",
                text: "Transparência, segurança de dados, escuta ativa dos usuários e entrega contínua de valor como princípios que guiam cada decisão de produto.",
            },
            {
                iconKey: "Users",
                title: "Nosso time",
                text: "Somos um time multidisciplinar com experiências em tecnologia, saúde e design — unidos pelo propósito de transformar a gestão de saúde no Brasil.",
            },
            {
                iconKey: "Stethoscope",
                title: "Para quem construímos",
                text: "Desenvolvemos a Minha Clínica ouvindo médicos, recepcionistas e gestores de clínicas reais — cada funcionalidade resolve um problema concreto do dia a dia.",
            },
            {
                iconKey: "CheckCircle",
                title: "Compromisso com a qualidade",
                text: "Evoluímos a plataforma de forma contínua, com ciclos curtos de entrega, feedback constante dos usuários e foco em estabilidade e desempenho.",
            },
        ],
        cta: { label: "Conhecer a plataforma", to: "/funcionalidades" },
    },

    contato: {
        heroIconKey: "Mail",
        accentColor: "#16A34A",
        accentBg: "#DCFCE7",
        tag: "Empresa",
        title: "Contato",
        description:
            "Quer conhecer a plataforma, tem uma dúvida comercial ou quer reportar algo técnico? Fale com a equipe certa pelo canal mais adequado.",
        sections: [
            {
                iconKey: "Building2",
                title: "Clínicas e consultórios",
                text: "Para demonstrações, propostas e dúvidas comerciais: comercial@minhaclinica.com.br. Nossa equipe responde em até 1 dia útil com as melhores opções para o seu perfil.",
            },
            {
                iconKey: "Headphones",
                title: "Suporte técnico",
                text: "Para dúvidas operacionais e problemas no sistema: suporte@minhaclinica.com.br. Descreva o problema, o perfil de usuário afetado e o horário de ocorrência.",
            },
            {
                iconKey: "ShieldCheck",
                title: "Privacidade e dados",
                text: "Para solicitações de acesso, correção ou exclusão de dados pessoais (LGPD): privacidade@minhaclinica.com.br. Respondemos em até 15 dias úteis conforme a lei.",
            },
            {
                iconKey: "Sparkles",
                title: "Parcerias e imprensa",
                text: "Para propostas de parceria, integração e contatos de imprensa: contato@minhaclinica.com.br — inclua no assunto o tipo de solicitação para agilizar o encaminhamento.",
            },
        ],
    },

    privacidade: {
        heroIconKey: "ShieldCheck",
        accentColor: "#EA580C",
        accentBg: "#FFEDD5",
        tag: "Empresa",
        title: "Política de Privacidade",
        description:
            "A Minha Clínica trata dados pessoais com responsabilidade e transparência, em conformidade com a Lei Geral de Proteção de Dados (LGPD — Lei nº 13.709/2018).",
        sections: [
            {
                iconKey: "Database",
                title: "Dados que coletamos",
                text: "Coletamos apenas os dados necessários para o funcionamento da plataforma: nome, e-mail, dados de saúde pertinentes ao atendimento e informações de acesso ao sistema.",
            },
            {
                iconKey: "Stethoscope",
                title: "Finalidade do tratamento",
                text: "Os dados são utilizados exclusivamente para prestação dos serviços contratados: operação da agenda, prontuários, documentos e comunicações relacionadas ao atendimento.",
            },
            {
                iconKey: "Users",
                title: "Direitos do titular",
                text: "Você tem direito a confirmar a existência, acessar, corrigir, solicitar a exclusão e revogar o consentimento de seus dados. Basta enviar solicitação para privacidade@minhaclinica.com.br.",
            },
            {
                iconKey: "Lock",
                title: "Segurança e retenção",
                text: "Adotamos controles técnicos robustos para proteger os dados. As informações são mantidas pelo período necessário para as finalidades legítimas e obrigações legais aplicáveis.",
            },
            {
                iconKey: "FileText",
                title: "Compartilhamento de dados",
                text: "Não vendemos dados pessoais. O compartilhamento ocorre somente com prestadores de serviço contratados para operação da plataforma, sob obrigações contratuais de sigilo.",
            },
            {
                iconKey: "RefreshCw",
                title: "Atualizações desta política",
                text: "Esta política pode ser atualizada para refletir melhorias de produto ou novos requisitos legais. Usuários serão notificados em caso de alterações relevantes.",
            },
        ],
    },

    termos: {
        heroIconKey: "FileCheck",
        accentColor: "#4F46E5",
        accentBg: "#EEF2FF",
        tag: "Empresa",
        title: "Termos de Uso",
        description:
            "Ao utilizar a plataforma Minha Clínica, você concorda com as condições descritas neste documento. Leia com atenção antes de prosseguir.",
        sections: [
            {
                iconKey: "Building2",
                title: "Aceitação dos termos",
                text: "O uso da plataforma implica aceitação integral destes termos. Caso não concorde com alguma condição, não utilize os serviços até que suas dúvidas sejam esclarecidas.",
            },
            {
                iconKey: "Lock",
                title: "Responsabilidade do usuário",
                text: "Cada usuário é responsável por manter suas credenciais seguras, utilizar a plataforma conforme a legislação vigente e não compartilhar acesso com terceiros não autorizados.",
            },
            {
                iconKey: "Shield",
                title: "Propriedade intelectual",
                text: "Todo o código, design e conteúdo da plataforma são de propriedade da Minha Clínica. É vedada a reprodução, cópia ou engenharia reversa sem autorização expressa e por escrito.",
            },
            {
                iconKey: "Server",
                title: "Disponibilidade do serviço",
                text: "Buscamos alta disponibilidade, mas não garantimos operação ininterrupta. Manutenções planejadas são comunicadas com antecedência mínima de 24 horas.",
            },
            {
                iconKey: "FileText",
                title: "Dados e privacidade",
                text: "O tratamento de dados pessoais segue a Política de Privacidade da plataforma, em total conformidade com a LGPD — Lei nº 13.709/2018.",
            },
            {
                iconKey: "RefreshCw",
                title: "Atualizações dos termos",
                text: "Estes termos podem ser revisados a qualquer momento. O uso continuado após a publicação de alterações constitui aceite das novas condições.",
            },
        ],
    },
};