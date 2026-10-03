import type { Dict, Plural } from './types';

const pt: Dict = {
  meta: {
    homeTitle: 'Comprimir PDF, JPG, PNG e converter imagens — grátis, sem upload',
    homeDescription:
      'Compressor e conversor de arquivos online grátis que roda no navegador. Comprima PDF, JPG, PNG, WebP, converta HEIC para JPG e mais. Sem upload, sem limites.',
    aboutTitle: 'Como o {site} funciona — tudo processado no seu navegador',
    aboutDescription:
      'Saiba como o {site} comprime e converte arquivos inteiramente no seu navegador com WebAssembly e por que eles nunca são enviados nem armazenados.',
    notFoundTitle: 'Página não encontrada',
  },
  nav: {
    allTools: 'Todas as ferramentas',
    compress: 'Comprimir',
    convert: 'Converter',
    about: 'Como funciona',
    language: 'Idioma',
    skip: 'Pular para o conteúdo',
    theme: 'Tema',
    themeLight: 'Claro',
    themeDark: 'Escuro',
    themeSystem: 'Automático',
  },
  badges: {
    private: 'Os arquivos não saem do seu dispositivo',
    free: 'Grátis, sem cadastro',
    unlimited: 'Sem limites',
    offline: 'Funciona offline',
  },
  drop: {
    title: 'Solte os arquivos aqui',
    choose: 'Escolher arquivos',
    paste: 'ou cole com Ctrl+V',
    supported: 'Formatos aceitos: {formats}',
    overlay: 'Solte para adicionar arquivos',
    addMore: 'Adicionar mais arquivos',
    local: 'Os arquivos são processados neste dispositivo. Nada é enviado.',
  },
  settings: {
    title: 'Configurações',
    convertTo: 'Converter para',
    quality: 'Qualidade',
    qualityHint: 'Menos qualidade = arquivo menor',
    format: 'Formato de saída',
    keepFormat: 'Manter original',
    resize: 'Redimensionar (lado maior)',
    originalSize: 'Tamanho original',
    pngMode: 'Compressão PNG',
    pngLossy: 'Inteligente (até 80% menor)',
    pngLossless: 'Sem perdas',
    level: 'Nível de compressão',
    levelLow: 'Leve',
    levelLowHint: 'Melhor qualidade',
    levelMedium: 'Recomendado',
    levelMediumHint: 'Boa qualidade, bem menor',
    levelHigh: 'Forte',
    levelHighHint: 'Menor tamanho',
    grayscale: 'Converter imagens para preto e branco',
    pageSize: 'Tamanho da página',
    pageFit: 'Igual à imagem',
    margin: 'Adicionar margens',
    dpi: 'Resolução',
    apply: 'Aplicar a todos os arquivos',
    changed: 'Configurações alteradas.',
  },
  status: {
    queued: 'Aguardando…',
    processing: 'Processando…',
    ready: 'Pronto',
    kept: 'Já otimizado, original mantido',
    errors: {
      unsupported: 'Este tipo de arquivo não é compatível aqui',
      encrypted: 'PDF protegido por senha. Remova a senha primeiro.',
      decode: 'O arquivo está corrompido ou não pode ser lido',
      failed: 'Não foi possível processar o arquivo (talvez seja grande demais para este dispositivo)',
    },
  },
  results: {
    download: 'Baixar',
    downloadAll: 'Baixar tudo',
    downloadZip: 'Baixar ZIP',
    clear: 'Limpar',
    remove: 'Remover',
    compare: 'Comparar',
    before: 'Antes',
    after: 'Depois',
    close: 'Fechar',
    saved: 'Economia de {size} ({percent})',
    createPdf: 'Criar PDF',
    creating: 'Criando PDF…',
    pdfReady: 'Seu PDF está pronto',
    moveUp: 'Mover para cima',
    moveDown: 'Mover para baixo',
    page: 'Página {n}',
    files: { one: '{n} arquivo', other: '{n} arquivos' } as Plural,
    pages: { one: '{n} página', other: '{n} páginas' } as Plural,
    images: { one: '{n} imagem', other: '{n} imagens' } as Plural,
  },
  home: {
    h1: 'Comprimir e converter arquivos sem fazer upload',
    subtitle:
      'PDF, JPG, PNG, WebP, AVIF e HEIC. Tudo é feito no seu navegador, então seus arquivos ficam no seu computador ou celular.',
    compressTitle: 'Comprimir',
    convertTitle: 'Converter',
    convertHint: 'Encontre à esquerda o formato que você tem e, no topo, o formato de que precisa.',
    matrixFrom: 'De',
    matrixTo: 'Para',
  },
  how: {
    title: '{tool} em 3 passos simples',
    steps: [
      'Adicione os arquivos: arraste e solte, escolha no seu dispositivo ou cole da área de transferência.',
      'O processamento começa na hora, no seu dispositivo. Ajuste as configurações se quiser outro equilíbrio entre tamanho e qualidade.',
      'Baixe cada arquivo separadamente ou todos de uma vez em um arquivo ZIP.',
    ],
  },
  why: {
    title: 'Como funciona',
    items: [
      {
        title: 'Nada é enviado',
        text: 'Ao abrir a página, o código de compressão é carregado no seu navegador. Os arquivos são lidos, processados e salvos no seu dispositivo e nunca são enviados para lugar nenhum.',
      },
      {
        title: 'Sem contas nem limites',
        text: 'Não há cadastro, marca d’água nem cota diária. O único limite é a memória do seu dispositivo.',
      },
      {
        title: 'Codificadores de código aberto consagrados',
        text: 'MozJPEG, oxipng, libwebp, libavif, pdf-lib e pdf.js, compilados para WebAssembly e rodando em todos os núcleos do processador.',
      },
      {
        title: 'Funciona offline',
        text: 'Depois que uma ferramenta carrega, ela continua funcionando sem conexão. Você também pode instalar o site como aplicativo.',
      },
    ],
  },
  faq: {
    title: 'Perguntas frequentes',
    items: [
      {
        q: 'Meus arquivos são enviados para um servidor?',
        a: 'Não. O {site} processa os arquivos inteiramente no seu navegador usando WebAssembly. Seus arquivos nunca saem do seu dispositivo, então não há nada para armazenar, vazar ou excluir. Você pode até se desconectar da internet depois que a página carregar.',
      },
      {
        q: 'A ferramenta {tool} é mesmo grátis? Tem algum limite?',
        a: 'Sim. É totalmente grátis, sem cadastro, sem marca d’água e sem limite de arquivos. O único limite é a memória do seu dispositivo: arquivos muito grandes (centenas de MB) podem não funcionar em celulares mais antigos.',
      },
      {
        q: 'Vou perder qualidade?',
        a: 'As configurações padrão são ajustadas para manter os arquivos visualmente idênticos ao original e, ao mesmo tempo, muito menores. Você pode aumentar a qualidade ou escolher o modo sem perdas a qualquer momento. Se não for possível reduzir um arquivo, o original é mantido em vez de gerar uma versão pior.',
      },
      {
        q: 'Quais dispositivos e navegadores são compatíveis?',
        a: 'Qualquer navegador moderno: Chrome, Edge, Firefox, Safari e Opera no Windows, macOS, Linux, Android e iOS. Não é preciso instalar nada, mas você pode adicionar o {site} à tela inicial para usar offline.',
      },
      {
        q: 'Os metadados pessoais das fotos são removidos?',
        a: 'Sim. Quando as imagens são recodificadas, metadados como localização GPS, modelo da câmera, data e hora são removidos. A orientação é aplicada aos pixels, então as fotos continuam aparecendo na posição certa.',
      },
      {
        q: 'Por que um arquivo não ficou menor?',
        a: 'Alguns arquivos já estão bem otimizados. Nesse caso, o original é mantido em vez de gerar um arquivo maior. Nos PDFs, a maior parte da economia vem das imagens — PDFs que contêm só texto costumam já ser compactos.',
      },
    ],
  },
  sections: {
    formats: 'Sobre os formatos',
    related: 'Ferramentas relacionadas',
  },
  tools: {
    'compress-pdf': {
      name: 'Comprimir PDF',
      title: 'Comprimir PDF online — diminuir tamanho de PDF grátis, sem upload',
      description:
        'Diminua o tamanho do PDF em até 90% direto no navegador. Grátis, sem cadastro e sem limites — seus PDFs nunca são enviados para nenhum servidor.',
      intro:
        'Deixe seus PDFs leves o bastante para e-mail, formulários online e sites de vagas. As imagens dentro do PDF são recomprimidas com MozJPEG, dados não utilizados são removidos e a estrutura do arquivo é reorganizada — o texto continua nítido e selecionável.',
      card: 'PDFs leves para e-mail e envios',
    },
    'compress-image': {
      name: 'Comprimir imagens',
      title: 'Comprimir imagem online — JPG, PNG, WebP e AVIF grátis',
      description:
        'Comprima imagens JPG, PNG, WebP e AVIF em até 80% sem perda visível de qualidade. Processamento em lote no navegador — sem upload e sem limites.',
      intro:
        'Arraste uma pasta inteira de fotos ou capturas de tela. Cada imagem é otimizada com os melhores codificadores de código aberto — MozJPEG, oxipng com redução inteligente de paleta, libwebp e libavif — e você pode redimensionar ou mudar o formato na hora.',
      card: 'JPG, PNG, WebP e AVIF juntos',
    },
    'compress-jpg': {
      name: 'Comprimir JPG',
      title: 'Comprimir JPG online — diminuir tamanho de foto JPEG grátis',
      description:
        'Deixe fotos JPG/JPEG até 80% menores com MozJPEG, direto no navegador. Sem upload, sem cadastro, sem marca d’água. Centenas de fotos de uma vez.',
      intro:
        'Fotos de celulares e câmeras costumam ter de 3 a 10 MB. O MozJPEG as recodifica com quantização mais inteligente e varredura progressiva, normalmente reduzindo o tamanho em 60–80% sem diferença visível. Por privacidade, os dados de localização e da câmera são removidos.',
      card: 'Fotos menores, mesma aparência',
    },
    'compress-png': {
      name: 'Comprimir PNG',
      title: 'Comprimir PNG online — reduzir PNG em até 80%, grátis',
      description:
        'Diminua o tamanho de PNG em até 80% com redução inteligente de cores, mantendo a transparência. Modo sem perdas disponível. Roda no navegador — sem upload.',
      intro:
        'O modo inteligente converte a imagem para uma paleta otimizada de até 256 cores com pontilhamento cuidadoso, e depois o oxipng compacta tudo ao máximo. A transparência é preservada. Precisa de um resultado idêntico pixel a pixel? Mude para o modo sem perdas.',
      card: 'Imagens transparentes, bem mais leves',
    },
    'compress-webp': {
      name: 'Comprimir WebP',
      title: 'Comprimir imagens WebP online — grátis e com privacidade',
      description:
        'Diminua o tamanho de imagens WebP com libwebp direto no navegador. Qualidade ajustável, redimensionamento e processamento em lote. Sem upload, sem limites.',
      intro:
        'O WebP já é eficiente, mas imagens exportadas na qualidade máxima ou direto de ferramentas de design geralmente podem perder mais 30–60% sem nenhuma mudança visível. Escolha um nível de qualidade, redimensione se precisar e baixe.',
      card: 'WebP mais leve, sites mais rápidos',
    },
    'image-converter': {
      name: 'Conversor de imagens',
      title: 'Conversor de imagens — JPG, PNG, WebP, AVIF e HEIC grátis',
      description:
        'Converta imagens entre JPG, PNG, WebP e AVIF e abra fotos HEIC do iPhone. Conversão em lote no navegador, nada é enviado.',
      intro:
        'Solte imagens em qualquer formato aceito e escolha o formato de que precisa. Você pode trocar o formato de destino a qualquer momento, e os arquivos são convertidos de novo na hora.',
      card: 'Qualquer imagem para JPG, PNG, WebP ou AVIF',
    },
    'jpg-to-pdf': {
      name: 'JPG para PDF',
      title: 'Converter JPG para PDF — juntar imagens em um PDF grátis',
      description:
        'Converta imagens JPG, PNG, HEIC e WebP em um único PDF no navegador. Reordene as páginas e escolha A4 ou Letter. Sem upload e sem marca d’água.',
      intro:
        'Transforme fotos de documentos, recibos ou digitalizações em um único PDF organizado. As imagens JPEG são incorporadas sem recompressão, então não há perda de qualidade. Defina a ordem, escolha o tamanho da página e baixe.',
      card: 'Junte fotos em um PDF',
    },
    'pdf-to-jpg': {
      name: 'PDF para JPG',
      title: 'Converter PDF para JPG — páginas de PDF em imagens, grátis',
      description:
        'Converta cada página de um PDF em imagens JPG de alta qualidade no navegador. Escolha a resolução, até 300 DPI. Sem upload e sem limites.',
      intro:
        'Cada página é renderizada com o pdf.js — o motor do leitor de PDF do Firefox — na resolução que você escolher e salva como JPG. Baixe as páginas uma a uma ou todas juntas em um ZIP.',
      card: 'Cada página vira uma imagem',
    },
    'pdf-to-png': {
      name: 'PDF para PNG',
      title: 'Converter PDF para PNG — páginas de PDF em PNG, grátis',
      description:
        'Converta páginas de PDF em imagens PNG sem perdas direto no navegador. Texto nítido, até 300 DPI, baixe tudo em ZIP. Sem upload.',
      intro:
        'O PNG mantém textos e traços perfeitamente nítidos, o que o torna ideal para slides, diagramas e documentos que você queira editar ou anotar. As páginas são renderizadas localmente com o pdf.js.',
      card: 'Páginas em imagens sem perdas',
    },
  },
  toPdf: {
    name: '{from} para PDF',
    title: 'Converter {from} para PDF — grátis, sem upload',
    description:
      'Transforme imagens {from} em PDF no navegador. Junte várias imagens em um só documento e escolha páginas A4 ou Letter. Nada é enviado.',
    intro:
      'Adicione um ou mais arquivos {from}, coloque-os na ordem certa e crie um único PDF. Tudo acontece no seu dispositivo, então é seguro até para digitalizações de documentos e recibos.',
    card: 'Imagens {from} em um só PDF',
  },
  converter: {
    name: '{from} para {to}',
    title: 'Converter {from} para {to} — conversor online grátis, sem upload',
    description:
      'Converta imagens {from} para {to} em segundos, direto no navegador. Conversão em lote, qualidade ajustável, sem cadastro — seus arquivos não saem do dispositivo.',
    intro:
      'Adicione quantos arquivos {from} quiser: eles são decodificados e recodificados para {to} no seu dispositivo com codecs WebAssembly rápidos. Nada é enviado, então é seguro até para fotos e documentos privados.',
    card: 'Converta imagens {from} para {to}',
  },
  formats: {
    jpg: 'JPG (JPEG) é o formato de foto mais compatível. Sua compressão com perdas é ideal para fotografias, mas não suporta transparência e pode borrar textos nítidos.',
    png: 'PNG é um formato sem perdas com suporte a transparência. É perfeito para capturas de tela, logotipos e gráficos, mas fotos salvas em PNG costumam ficar muito pesadas.',
    webp: 'WebP é um formato moderno do Google que costuma ser 25–35% menor que o JPG com a mesma qualidade e suporta transparência. Todos os navegadores atuais conseguem exibi-lo.',
    avif: 'AVIF é um formato de nova geração baseado no codec de vídeo AV1. Muitas vezes gera arquivos cerca de 50% menores que o JPG com qualidade semelhante e é suportado por todos os navegadores atuais.',
    heic: 'HEIC (HEIF) é o formato de foto padrão no iPhone e no iPad. É compacto, mas tem pouco suporte no Windows, no Android e em sites, então converter para JPG facilita o compartilhamento das fotos.',
    pdf: 'PDF é o formato universal de documentos: tem a mesma aparência em qualquer dispositivo. Documentos digitalizados e PDFs com fotos muitas vezes são bem maiores do que precisam ser.',
  },
  about: {
    h1: 'Como o {site} funciona',
    sections: [
      {
        h: 'Seus arquivos nunca saem do seu dispositivo',
        p: 'A maioria dos conversores online envia seus arquivos para os próprios servidores, processa tudo lá e guarda cópias por horas ou dias. O {site} funciona de outro jeito: o site entrega o software de compressão ao seu navegador, e todo o processamento acontece localmente no seu computador ou celular. O servidor apenas hospeda arquivos estáticos e nunca recebe seus documentos.',
      },
      {
        h: 'Como você pode conferir?',
        p: 'Abra as ferramentas de desenvolvedor do navegador e observe a aba Rede (Network) enquanto um arquivo é processado: nenhuma requisição de upload é feita. Você também pode se desconectar da internet depois que a página carregar — tudo continua funcionando. Além disso, uma Política de Segurança de Conteúdo (CSP) rigorosa impede que a página envie dados para qualquer outro site.',
      },
      {
        h: 'A tecnologia',
        p: 'As imagens são codificadas com versões em WebAssembly do MozJPEG, oxipng, libwebp e libavif. Os arquivos PNG são reduzidos com paleta adaptativa e pontilhamento. Os PDFs são otimizados com o pdf-lib: imagens incorporadas são recomprimidas, objetos não utilizados são removidos e a estrutura é reorganizada. As páginas de PDF são renderizadas com o pdf.js, e as fotos HEIC são decodificadas com o libheif.',
      },
      {
        h: 'Privacidade',
        p: 'Não há cookies, rastreadores de análise, anúncios nem contas. Como os arquivos nunca são enviados, não temos acesso a eles nem nada para excluir. As configurações que você escolhe ficam salvas apenas no seu próprio navegador.',
      },
      {
        h: 'Grátis para sempre',
        p: 'Como é o seu dispositivo que faz o trabalho, manter o {site} no ar quase não custa nada. Por isso ele pode continuar grátis, sem limites, sem marca d’água e sem planos pagos.',
      },
    ],
  },
  footer: {
    tagline: 'Compressão e conversão de arquivos grátis e privadas. Tudo roda no seu navegador.',
    tools: 'Ferramentas',
    languages: 'Idiomas',
    privacy: 'Sem upload · Sem cookies · Sem rastreamento',
  },
  notFound: {
    title: 'Página não encontrada',
    text: 'A página que você procura não existe ou foi movida.',
    back: 'Ir para a página inicial',
  },
  compat: {
    outdated:
      'Seu navegador é antigo demais para processar arquivos no seu dispositivo. Atualize-o ou abra esta página em uma versão recente do Chrome, Safari, Firefox ou Edge.',
    noWasm:
      'O WebAssembly está desativado no seu navegador (por exemplo, pelo Modo de Isolamento do iPhone) e é necessário para processar arquivos no seu dispositivo. Adicione este site como exceção ou use outro navegador.',
  },
  langBanner: {
    text: 'Esta página está disponível em português.',
    action: 'Mudar',
    dismiss: 'Fechar',
  },
};

export default pt;
