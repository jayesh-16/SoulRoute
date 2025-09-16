import { Background } from "@/components/background";
import { Footer } from "@/components/footer";
import { Newsletter } from "@/components/newsletter";
import { RotatingIcon } from "@/components/rotating-icon";

export default function Home() {
  return (
    <main className=" h-[100dvh] w-full">
      <div className="relative h-full w-full">
        <Background src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/alt-g7Cv2QzqL3k6ey3igjNYkM32d8Fld7.mp4" placeholder="/alt-placeholder.png" />
        <RotatingIcon />
        <Newsletter />
      </div>
    </main>
  );
}
