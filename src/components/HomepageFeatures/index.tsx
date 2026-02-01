import type { ReactNode } from "react";
import clsx from "clsx";
import Heading from "@theme/Heading";
import styles from "./styles.module.css";

type FeatureItem = {
  title: string;
  Svg: React.ComponentType<React.ComponentProps<"svg">>;
  description: ReactNode;
};

const FeatureList: FeatureItem[] = [
  {
    title: "Cluster Siap Produksi",
    Svg: require("@site/static/img/undraw_docusaurus_mountain.svg").default,
    description: <>Infrastruktur Kubernetes disiapkan di Ubuntu 24.04 dengan CRI-O sebagai container runtime, menghasilkan cluster yang ringan, stabil, dan siap untuk lingkungan produksi.</>,
  },
  {
    title: "High Availability & Load Balancing",
    Svg: require("@site/static/img/undraw_docusaurus_tree.svg").default,
    description: (
      <>
        Dengan konfigurasi multi-node dan jaringan Calico, cluster mendukung <b>High Availability</b> dan <b>Load Balancing</b> yang andal untuk menjalankan aplikasi penting.
      </>
    ),
  },
  {
    title: "Monitoring & Integrasi CI/CD",
    Svg: require("@site/static/img/undraw_docusaurus_react.svg").default,
    description: <>Mendukung Prometheus, Grafana untuk monitoring, serta Jenkins untuk CI/CD pipeline agar DevOps berjalan otomatis dan efisien.</>,
  },
];

function Feature({ title, Svg, description }: FeatureItem) {
  return (
    <div className={clsx("col col--4")}>
      <div className="text--center">
        <Svg className={styles.featureSvg} role="img" />
      </div>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): ReactNode {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
