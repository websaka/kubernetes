import { themes as prismThemes } from "prism-react-renderer";
import type { Config } from "@docusaurus/types";
import type * as Preset from "@docusaurus/preset-classic";

const config: Config = {
  title: "Kubernetes Cluster",
  tagline: "Cluster Ubuntu 24.04 + CRI-O Production-ready",
  favicon: "img/favicon.ico",

  future: {
    v4: true,
  },

  url: "https://k8s-cluster.example.com",
  baseUrl: "/",

  organizationName: "your-github-org", // Ganti dengan GitHub kamu
  projectName: "k8s-cluster-docs", // Ganti dengan nama repo kamu

  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "warn",

  i18n: {
    defaultLocale: "en",
    locales: ["en"],
  },

  presets: [
    [
      "classic",
      {
        docs: {
          sidebarPath: "./sidebars.ts",
          editUrl: "https://github.com/your-github-org/k8s-cluster-docs/edit/main/",
        },
        blog: {
          showReadingTime: true,
          feedOptions: {
            type: ["rss", "atom"],
            xslt: true,
          },
          editUrl: "https://github.com/your-github-org/k8s-cluster-docs/edit/main/",
          onInlineTags: "warn",
          onInlineAuthors: "warn",
          onUntruncatedBlogPosts: "warn",
        },
        theme: {
          customCss: "./src/css/custom.css",
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    image: "img/kubernetes-social-card.jpg",
    navbar: {
      title: "K8s Cluster",
      logo: {
        alt: "Kubernetes Logo",
        src: "img/logo.svg", // Ganti dengan logo kamu di /static/img
      },
      items: [
        {
          type: "docSidebar",
          sidebarId: "tutorialSidebar",
          position: "left",
          label: "Docs",
        },
        {
          to: "/blog",
          label: "Blog",
          position: "left",
        },
        {
          href: "https://github.com/your-github-org/k8s-cluster-docs",
          label: "GitHub",
          position: "right",
        },
      ],
    },
    footer: {
      style: "dark",
      links: [
        {
          title: "Documentation",
          items: [
            {
              label: "Getting Started",
              to: "/docs/tutorial-basics/",
            },
            {
              label: "Prometheus & Grafana",
              to: "/docs/tutorial-basics/prometheus-grafana-installation",
            },
            {
              label: "Advanced Topics",
              to: "/docs/tutorial-extras/manage-docs-versions",
            },
          ],
        },
        {
          title: "Community",
          items: [
            {
              label: "Kubernetes Forum",
              href: "https://discuss.kubernetes.io/",
            },
            {
              label: "Slack",
              href: "https://kubernetes.slack.com/",
            },
            {
              label: "GitHub Discussions",
              href: "https://github.com/kubernetes/kubernetes/discussions",
            },
          ],
        },
        {
          title: "More",
          items: [
            {
              label: "Blog",
              to: "/blog",
            },
            {
              label: "GitHub",
              href: "https://github.com/your-github-org/k8s-cluster-docs",
            },
          ],
        },
      ],
      copyright: `© ${new Date().getFullYear()} Kubernetes Cluster Docs. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
