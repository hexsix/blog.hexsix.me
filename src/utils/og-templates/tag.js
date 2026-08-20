import satori from "satori";
import { SITE } from "@/config";
import loadGoogleFonts from "../loadGoogleFont";

/**
 * 为标签页生成 OG 图。
 * @param {string} tagName - 标签显示名（如「日常」）
 * @param {number} postCount - 该标签下的文章数
 */
export default async (tagName, postCount) => {
  const hostname = new URL(SITE.website).hostname;
  const subtitle = `共 ${postCount} 篇文章 · ${SITE.title}`;

  // 中文标签比拉丁标签占宽得多，长名字要退字号，否则会溢出 1200px 画布
  const tagFontSize = tagName.length > 10 ? 56 : tagName.length > 6 ? 72 : 96;

  return satori(
    {
      type: "div",
      props: {
        style: {
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#0f172a",
          backgroundImage:
            "radial-gradient(circle at 25px 25px, #1e293b 2%, transparent 0%), radial-gradient(circle at 75px 75px, #1e293b 2%, transparent 0%)",
          backgroundSize: "100px 100px",
          color: "white",
          position: "relative",
        },
        children: [
          // 右上装饰光晕
          {
            type: "div",
            props: {
              style: {
                position: "absolute",
                top: "-120px",
                right: "-80px",
                width: "550px",
                height: "550px",
                background: "linear-gradient(140deg, #a855f7, #6366f1)",
                filter: "blur(110px)",
                opacity: 0.35,
                borderRadius: "100%",
              },
            },
          },
          // 左下装饰光晕
          {
            type: "div",
            props: {
              style: {
                position: "absolute",
                bottom: "-120px",
                left: "-80px",
                width: "450px",
                height: "450px",
                background: "linear-gradient(140deg, #3b82f6, #6366f1)",
                filter: "blur(110px)",
                opacity: 0.25,
                borderRadius: "100%",
              },
            },
          },

          // 中央内容
          {
            type: "div",
            props: {
              style: {
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
                padding: "40px",
                width: "90%",
              },
              children: [
                // 「#标签」主视觉
                {
                  type: "div",
                  props: {
                    style: {
                      display: "flex",
                      alignItems: "baseline",
                    },
                    children: [
                      {
                        type: "span",
                        props: {
                          style: {
                            fontSize: tagFontSize * 0.8,
                            fontWeight: 700,
                            color: "#818cf8",
                            opacity: 0.75,
                            lineHeight: 1,
                            marginRight: "10px",
                          },
                          children: "#",
                        },
                      },
                      {
                        type: "span",
                        props: {
                          style: {
                            fontSize: tagFontSize,
                            fontWeight: 700,
                            color: "white",
                            lineHeight: 1.2,
                            textShadow: "0 4px 20px rgba(0,0,0,0.5)",
                          },
                          children: tagName,
                        },
                      },
                    ],
                  },
                },

                // 分隔线
                {
                  type: "div",
                  props: {
                    style: {
                      width: "80px",
                      height: "6px",
                      backgroundColor: "#818cf8",
                      borderRadius: "4px",
                      margin: "30px 0",
                    },
                  },
                },

                // 副标题
                {
                  type: "p",
                  props: {
                    style: {
                      fontSize: 32,
                      color: "#cbd5e1",
                      margin: 0,
                      lineHeight: 1.4,
                      fontWeight: 400,
                    },
                    children: subtitle,
                  },
                },
              ],
            },
          },

          // 底部域名胶囊
          {
            type: "div",
            props: {
              style: {
                position: "absolute",
                bottom: "50px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "rgba(255, 255, 255, 0.05)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                padding: "12px 30px",
                borderRadius: "100px",
              },
              children: {
                type: "span",
                props: {
                  style: {
                    fontSize: 24,
                    color: "#94a3b8",
                    fontWeight: 600,
                    letterSpacing: "1px",
                  },
                  children: hostname,
                },
              },
            },
          },
        ],
      },
    },
    {
      width: 1200,
      height: 630,
      embedFont: true,
      fonts: await loadGoogleFonts(),
    }
  );
};
