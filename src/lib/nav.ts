export type NavLeaf = {
  label: string;
  href: string;
};

export type NavSection = {
  label: string;
  href?: string;
  comingSoon?: boolean;
  items?: NavLeaf[];
};

export const NAV_SECTIONS: NavSection[] = [
  {
    label: "Comercial",
    items: [
      { label: "Negócios", href: "/leads" },
      { label: "Dashboard", href: "/dashboard" },
      { label: "Canais", href: "/canais" },
      { label: "Config. do funil", href: "/configuracoes" },
    ],
  },
  { label: "Operação", href: "/operacao", comingSoon: true },
  { label: "Eventos", href: "/eventos", comingSoon: true },
  { label: "Financeiro", href: "/financeiro", comingSoon: true },
  { label: "Contratos", href: "/contratos", comingSoon: true },
  { label: "Configurações", href: "/ajustes", comingSoon: true },
];
