export const SITE = {
  website: "https://blog.hexsix.me/",
  author: "喵小六",
  profile: "https://github.com/hexsix",
  desc: "小六家的藏宝图",
  title: "Bubble",
  ogImage: "devosfera-og.webp", // ubicado en la carpeta public
  lightAndDarkMode: true,
  postPerIndex: 6,
  postPerPage: 8,
  scheduledPostMargin: 15 * 60 * 1000, // 15 minutes
  showArchives: true,
  showGalleries: true,
  showBackButton: true, // show back button in post detail
  editPost: {
    enabled: true,
    text: "编辑此文章",
    url: "https://github.com/hexsix/blog.hexsix.me/edit/main/",
  },
  dynamicOgImage: true,
  dir: "ltr", // "rtl" | "auto"
  lang: "zh", // html lang code. Set this empty and default will be "en"
  timezone: "Asia/Shanghai", // Default global timezone (IANA format) https://en.wikipedia.org/wiki/List_of_tz_database_time_zones
  introAudio: {
    enabled: false, // 暂时关闭，待音频文件准备好后开启
    src: "/audio/intro-web.mp3", // ruta al archivo (relativa a /public)
    label: "INTRO.MP3", // etiqueta display en el reproductor
    duration: 30, // duración en segundos (para la barra de progreso fija)
  },
} as const;
