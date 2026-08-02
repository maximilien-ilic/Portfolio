import type { Metadata } from "next";
import Dither from "@/components/Dither";
import styles from "./layout.module.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "Maximilien Ilic — Web Developer & Cybersecurity Student",
  description:
    "Portfolio of Maximilien Ilic, cybersecurity student and web developer building secure, scalable web applications.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <div className={styles.background}>
          <Dither
            waveColor={[0.5, 0.5, 0.5]}
            disableAnimation={false}
            enableMouseInteraction={false}
            mouseRadius={0.3}
            colorNum={4}
            waveAmplitude={0.3}
            waveFrequency={3}
            waveSpeed={0.05}
          />
        </div>

        <div className={styles.content}>{children}</div>
      </body>
    </html>
  );
}
