import React from "react";

interface JsonLdProps {
  data: Record<string, unknown> | Array<Record<string, unknown>>;
}

/**
 * Composant d'injection sécurisée de données structurées Schema.org (JSON-LD).
 * Émet un bloc <script type="application/ld+json"> distinct par schéma pour garantir
 * une détection universelle par Google, Bing et les analyseurs GEO/Schema.
 * Échappe le caractère '<' pour prévenir toute vulnérabilité d'injection XSS.
 */
export function JsonLd({ data }: JsonLdProps) {
  const items = Array.isArray(data) ? data : [data];

  return (
    <>
      {items.map((item, index) => {
        const jsonString = JSON.stringify(item).replace(/</g, "\\u003c");
        return (
          <script
            key={index}
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: jsonString }}
          />
        );
      })}
    </>
  );
}
