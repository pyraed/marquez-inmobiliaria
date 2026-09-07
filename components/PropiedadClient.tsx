// Este componente existe para compatibilidad.
// La galería se llama directamente desde la ficha de propiedad.
import Galeria from "./Galeria";

export default function PropiedadClient({ imagenes, titulo }: { imagenes: string[]; titulo?: string }) {
  return <Galeria imagenes={imagenes} titulo={titulo} />;
}
