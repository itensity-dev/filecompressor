import type { Dict, Plural } from './types';

const zh: Dict = {
  meta: {
    homeTitle: 'PDF压缩、图片压缩、图片格式转换——免费在线，无需上传',
    homeDescription:
      '免费在线文件压缩与格式转换工具，直接在浏览器中运行。支持压缩PDF、JPG、PNG、WebP，HEIC转JPG等。无需上传，不限次数。',
    aboutTitle: '{site} 工作原理：文件在浏览器本地处理',
    aboutDescription:
      '了解 {site} 如何借助 WebAssembly 在浏览器中完成文件压缩与转换，以及为什么您的文件绝不会被上传或存储。',
    notFoundTitle: '页面未找到',
  },
  nav: {
    allTools: '全部工具',
    compress: '压缩',
    convert: '转换',
    about: '工作原理',
    language: '语言',
    skip: '跳到主要内容',
    theme: '主题',
    themeLight: '浅色',
    themeDark: '深色',
    themeSystem: '自动',
  },
  badges: {
    private: '文件不离开您的设备',
    free: '免费，无需注册',
    unlimited: '无任何限制',
    offline: '支持离线使用',
  },
  drop: {
    title: '将文件拖放到此处',
    choose: '选择文件',
    paste: '或按 Ctrl+V 粘贴',
    supported: '支持格式：{formats}',
    overlay: '松开即可添加文件',
    addMore: '添加更多文件',
    local: '在本设备上处理，不会上传任何内容。',
  },
  settings: {
    title: '设置',
    convertTo: '转换为',
    quality: '质量',
    qualityHint: '质量越低，文件越小',
    format: '输出格式',
    keepFormat: '保持原格式',
    resize: '调整尺寸（最长边）',
    originalSize: '原始尺寸',
    pngMode: 'PNG 压缩方式',
    pngLossy: '智能（最多缩小 80%）',
    pngLossless: '无损',
    level: '压缩强度',
    levelLow: '轻度',
    levelLowHint: '画质最佳',
    levelMedium: '推荐',
    levelMediumHint: '画质好，体积小得多',
    levelHigh: '强力',
    levelHighHint: '体积最小',
    grayscale: '将图片转为黑白',
    pageSize: '页面尺寸',
    pageFit: '与图片相同',
    margin: '添加页边距',
    dpi: '分辨率',
    apply: '应用到所有文件',
    changed: '设置已更改。',
  },
  status: {
    queued: '等待中…',
    processing: '处理中…',
    ready: '完成',
    kept: '已是最优，保留原文件',
    errors: {
      unsupported: '此处不支持该文件类型',
      encrypted: 'PDF 受密码保护，请先移除密码。',
      decode: '文件已损坏或无法读取',
      failed: '无法处理此文件（可能超出了本设备的处理能力）',
    },
  },
  results: {
    download: '下载',
    downloadAll: '全部下载',
    downloadZip: '下载 ZIP',
    clear: '清空',
    remove: '移除',
    compare: '对比',
    before: '处理前',
    after: '处理后',
    close: '关闭',
    saved: '节省 {size}（{percent}）',
    createPdf: '生成 PDF',
    creating: '正在生成 PDF…',
    pdfReady: 'PDF 已生成',
    moveUp: '上移',
    moveDown: '下移',
    page: '第 {n} 页',
    files: { other: '{n} 个文件' } as Plural,
    pages: { other: '{n} 页' } as Plural,
    images: { other: '{n} 张图片' } as Plural,
  },
  home: {
    h1: '压缩和转换文件，无需上传',
    subtitle: '支持 PDF、JPG、PNG、WebP、AVIF 和 HEIC。处理过程在浏览器中完成，文件始终留在您的电脑或手机上。',
    compressTitle: '压缩',
    convertTitle: '转换',
    convertHint: '在左侧找到您现有的格式，再在顶部找到需要的格式。',
    matrixFrom: '从',
    matrixTo: '到',
  },
  how: {
    title: '{tool}，只需简单 3 步',
    steps: [
      '添加文件：拖放文件、从设备中选择，或从剪贴板粘贴。',
      '文件会立即在您的设备上开始处理。如需在体积与质量之间取得不同的平衡，可以调整设置。',
      '逐个下载文件，或打包成 ZIP 一次性全部下载。',
    ],
  },
  why: {
    title: '工作原理',
    items: [
      {
        title: '不上传任何文件',
        text: '打开页面时，压缩程序会加载到您的浏览器中。文件在您的设备上读取、处理和保存，不会发送到任何地方。',
      },
      {
        title: '无需账号，没有限制',
        text: '无需注册，没有水印，也没有每日配额。唯一的限制是设备的内存。',
      },
      {
        title: '成熟的开源编码器',
        text: 'MozJPEG、oxipng、libwebp、libavif、pdf-lib 和 pdf.js，编译为 WebAssembly，在所有 CPU 核心上并行运行。',
      },
      {
        title: '支持离线使用',
        text: '工具加载完成后，即使断网也能继续使用。您还可以将本网站安装为应用。',
      },
    ],
  },
  faq: {
    title: '常见问题',
    items: [
      {
        q: '我的文件会上传到服务器吗？',
        a: '不会。{site} 借助 WebAssembly 完全在您的浏览器中处理文件。文件从不离开您的设备，因此不存在存储、泄露或删除的问题。页面加载完成后，您甚至可以断开网络继续使用。',
      },
      {
        q: '{tool}工具真的免费吗？有没有使用限制？',
        a: '是的，完全免费：无需注册、没有水印，也不限制文件数量。唯一的限制是设备内存：在较旧的手机上，超大文件（数百 MB）可能无法处理。',
      },
      {
        q: '会损失画质吗？',
        a: '默认设置经过精心调校，能在大幅缩小文件的同时，保持与原文件在视觉上几乎一致。您可以随时提高质量或选择无损模式。如果文件无法进一步缩小，则会保留原文件，而不会生成效果更差的版本。',
      },
      {
        q: '支持哪些设备和浏览器？',
        a: '支持所有现代浏览器：Windows、macOS、Linux、Android 和 iOS 上的 Chrome、Edge、Firefox、Safari 和 Opera。无需安装任何软件，您也可以将 {site} 添加到主屏幕，以便离线使用。',
      },
      {
        q: '会删除照片中的个人元数据吗？',
        a: '会。重新编码图片时，GPS 位置、相机型号和拍摄时间等元数据都会被删除。图片方向会直接应用到像素上，因此照片仍能以正确的方向显示。',
      },
      {
        q: '为什么有的文件没有变小？',
        a: '有些文件本身已经过充分优化。这种情况下会保留原文件，而不会生成更大的文件。对于 PDF，压缩空间主要来自其中的图片——纯文本 PDF 通常本身就已经很小了。',
      },
    ],
  },
  sections: {
    formats: '关于文件格式',
    related: '相关工具',
  },
  tools: {
    'compress-pdf': {
      name: '压缩PDF',
      title: 'PDF压缩——免费在线压缩PDF文件大小，无需上传',
      description:
        '直接在浏览器中将PDF文件大小减少多达 90%。免费、无需注册、不限次数——您的PDF绝不会上传到任何服务器。',
      intro:
        '将PDF压缩到适合邮件发送、在线表单提交和求职网站上传的大小。PDF 中的图片会使用 MozJPEG 重新压缩，无用数据会被清除，文件结构也会重新打包——文字依然清晰，并可选中复制。',
      card: '轻松发送和上传PDF',
    },
    'compress-image': {
      name: '压缩图片',
      title: '图片压缩——在线压缩JPG、PNG、WebP、AVIF，免费',
      description:
        '将 JPG、PNG、WebP 和 AVIF 图片压缩多达 80%，肉眼几乎看不出画质损失。在浏览器中批量处理，无需上传，不限数量。',
      intro:
        '直接拖入整个文件夹的照片或截图。每张图片都会使用顶尖的开源编码器进行优化——MozJPEG、带智能调色板缩减的 oxipng、libwebp 和 libavif，还能随时调整尺寸或更改格式。',
      card: '多种图片格式一站搞定',
    },
    'compress-jpg': {
      name: '压缩JPG',
      title: 'JPG压缩——在线压缩JPEG图片大小，免费无需上传',
      description:
        '使用 MozJPEG 在浏览器中将 JPG/JPEG 照片缩小多达 80%。无需上传、无需注册、无水印，可批量压缩数百张照片。',
      intro:
        '手机和相机拍摄的照片通常有 3–10 MB。MozJPEG 采用更智能的量化和渐进式扫描对其重新编码，通常可将体积缩小 60–80%，且肉眼看不出差别。为保护隐私，位置和相机信息也会一并删除。',
      card: '照片更小，效果不变',
    },
    'compress-png': {
      name: '压缩PNG',
      title: 'PNG压缩——在线将PNG图片缩小多达80%，免费',
      description:
        '通过智能减色将 PNG 体积缩小多达 80%，同时保留透明背景。支持无损模式。在浏览器中运行，无需上传。',
      intro:
        '智能模式会将图片转换为最多 256 色的优化调色板，并进行精细的抖动处理，再由 oxipng 尽可能紧凑地打包。透明背景完整保留。需要像素级一致的输出？切换到无损模式即可。',
      card: '透明图片，大幅瘦身',
    },
    'compress-webp': {
      name: '压缩WebP',
      title: 'WebP压缩——在线压缩WebP图片，免费且保护隐私',
      description:
        '使用 libwebp 在浏览器中直接压缩 WebP 图片。可调节质量、调整尺寸、批量处理。无需上传，不限数量。',
      intro:
        'WebP 本身已经很高效，但以最高质量导出或直接从设计工具导出的图片，通常还能再缩小 30–60%，且看不出任何变化。选择质量等级，按需调整尺寸，然后下载即可。',
      card: 'WebP更小，网站更快',
    },
    'image-converter': {
      name: '图片格式转换',
      title: '免费图片格式转换——JPG、PNG、WebP、AVIF、HEIC',
      description:
        '在 JPG、PNG、WebP 和 AVIF 之间相互转换图片，还能转换 iPhone 的 HEIC 照片。在浏览器中批量转换，不会上传任何内容。',
      intro:
        '拖入任意受支持格式的图片，然后选择需要的格式。目标格式可以随时更改，文件会立即重新转换。',
      card: '任意图片转JPG、PNG、WebP或AVIF',
    },
    'jpg-to-pdf': {
      name: 'JPG转PDF',
      title: 'JPG转PDF——在线将多张图片合并成一个PDF，免费',
      description:
        '在浏览器中将 JPG、PNG、HEIC 和 WebP 图片转换为一个 PDF。可调整页面顺序，选择 A4 或 Letter 尺寸。无需上传，无水印。',
      intro:
        '把文档、收据或扫描件的照片整合成一个整洁的 PDF。JPEG 图片直接嵌入、不做二次压缩，因此不会损失画质。调整顺序、选择页面尺寸，然后下载即可。',
      card: '多张照片合成一个PDF',
    },
    'pdf-to-jpg': {
      name: 'PDF转JPG',
      title: 'PDF转JPG——将PDF页面转换为图片，免费在线',
      description:
        '在浏览器中将 PDF 的每一页转换为高质量 JPG 图片。分辨率最高可达 300 DPI。无需上传，不限数量。',
      intro:
        '每一页都由 pdf.js（Firefox 内置 PDF 阅读器所用的引擎）按您选择的分辨率渲染，并保存为 JPG。可以逐页下载，也可以打包成 ZIP 一次性下载。',
      card: '每一页都转成图片',
    },
    'pdf-to-png': {
      name: 'PDF转PNG',
      title: 'PDF转PNG——将PDF页面转换为PNG图片，免费',
      description:
        '直接在浏览器中将 PDF 页面转换为无损 PNG 图片。文字清晰锐利，最高 300 DPI，可打包为 ZIP 下载。无需上传。',
      intro:
        'PNG 能让文字和线条保持清晰锐利，非常适合幻灯片、图表以及需要编辑或批注的文档。所有页面都在本地使用 pdf.js 渲染。',
      card: '无损的页面图片',
    },
  },
  toPdf: {
    name: '{from}转PDF',
    title: '{from}转PDF——将{from}图片转换为PDF，免费无需上传',
    description:
      '在浏览器中将 {from} 图片转换为 PDF。可将多张图片合并为一个文档，并选择 A4 或 Letter 页面尺寸。不会上传任何内容。',
    intro:
      '添加一个或多个 {from} 文件，排好顺序，即可生成一个 PDF。整个过程都在您的设备上完成，处理文件扫描件和收据也很安全。',
    card: '{from}图片合成一个PDF',
  },
  converter: {
    name: '{from}转{to}',
    title: '{from}转{to}——免费在线格式转换，无需上传',
    description:
      '在浏览器中几秒内将 {from} 图片转换为 {to}。支持批量转换，质量可调，无需注册——文件始终保留在您的设备上。',
    intro:
      '可一次添加任意数量的 {from} 文件：它们会在您的设备上通过高速的 WebAssembly 编解码器解码，并重新编码为 {to}。整个过程不上传任何内容，即使是私人照片和文件也能放心转换。',
    card: '{from}图片一键转{to}',
  },
  formats: {
    jpg: 'JPG（JPEG）是兼容性最广的照片格式。其有损压缩非常适合照片，但不支持透明背景，还可能让清晰的文字变得模糊。',
    png: 'PNG 是一种支持透明背景的无损格式，非常适合截图、标志和图形；但用 PNG 保存照片，文件通常会非常大。',
    webp: 'WebP 是 Google 推出的现代图片格式，在相同画质下通常比 JPG 小 25–35%，并支持透明背景。目前所有主流浏览器都能显示。',
    avif: 'AVIF 是基于 AV1 视频编解码器的新一代图片格式。在画质相近的情况下，文件通常比 JPG 小 50% 左右，并已获得所有主流浏览器支持。',
    heic: 'HEIC（HEIF）是 iPhone 和 iPad 默认的照片格式。它体积小巧，但在 Windows、Android 和网站上兼容性较差，转换为 JPG 后便于分享。',
    pdf: 'PDF 是通用的文档格式：在任何设备上显示效果都一致。扫描文档和含有照片的 PDF 往往比实际需要的大得多。',
  },
  about: {
    h1: '{site} 的工作原理',
    sections: [
      {
        h: '文件从不离开您的设备',
        p: '大多数在线转换工具会把文件上传到它们的服务器进行处理，并将副本保留数小时甚至数天。{site} 的做法截然不同：网站会把压缩软件发送到您的浏览器，所有处理都在您的电脑或手机本地完成。服务器只托管静态文件，从不接收您的文档。',
      },
      {
        h: '如何验证这一点？',
        p: '打开浏览器的开发者工具，在处理文件时观察“网络”（Network）选项卡：不会产生任何上传请求。页面加载完成后，您也可以断开网络——一切照常运行。此外，严格的内容安全策略（Content Security Policy）会阻止页面向其他任何网站发送数据。',
      },
      {
        h: '技术原理',
        p: '图片使用 MozJPEG、oxipng、libwebp 和 libavif 的 WebAssembly 版本进行编码。PNG 文件通过自适应调色板和抖动处理来减小体积。PDF 使用 pdf-lib 进行优化：重新压缩嵌入的图片、删除未使用的对象并重新打包文件结构。PDF 页面由 pdf.js 渲染，HEIC 照片由 libheif 解码。',
      },
      {
        h: '隐私保护',
        p: '没有 Cookie、没有统计跟踪器、没有广告，也无需账号。由于文件从不上传，我们无法访问它们，也没有任何需要删除的内容。您选择的设置只会保存在您自己的浏览器中。',
      },
      {
        h: '永久免费',
        p: '由于处理工作由您的设备完成，运行 {site} 几乎没有成本。因此它可以一直免费，没有限制、没有水印，也没有付费推销。',
      },
    ],
  },
  footer: {
    tagline: '免费、私密的文件压缩与转换工具。一切都在您的浏览器中完成。',
    tools: '工具',
    languages: '语言',
    privacy: '无上传 · 无 Cookie · 无跟踪',
  },
  notFound: {
    title: '页面未找到',
    text: '您访问的页面不存在或已被移动。',
    back: '返回首页',
  },
  compat: {
    outdated:
      '您的浏览器版本过旧，无法在设备上处理文件。请更新浏览器，或使用最新版 Chrome、Safari、Firefox 或 Edge 打开本页。',
    noWasm:
      '您的浏览器已禁用 WebAssembly（例如 iPhone 的锁定模式），而在设备上处理文件需要它。请将本站添加为例外，或换用其他浏览器。',
  },
  langBanner: {
    text: '本页面提供简体中文版本。',
    action: '切换',
    dismiss: '关闭',
  },
};

export default zh;
