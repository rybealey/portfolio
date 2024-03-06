import Navbar from "../components/navigation/Navbar";
import FooterSection from "../components/FooterSection";
import HeroSection from "../components/projects/index/HeroSection";
import ProjectsSection from "../components/projects/index/ProjectsSection.jsx";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col bg-[#121212]">
      <div className="container mt-24 mx-auto px-12 py-4">
        <Navbar />
        <HeroSection />
        <ProjectsSection />
        <FooterSection />
      </div>
    </main>
  );
}
