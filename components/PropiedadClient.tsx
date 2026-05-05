"use client";

import Galeria from "./Galeria";

export default function PropiedadClient({ imagenes }: { imagenes: string[] }) {
  return <Galeria imagenes={imagenes} />;
}