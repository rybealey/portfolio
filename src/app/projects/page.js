import Navbar from "../components/navigation/Navbar";
import FooterSection from "../components/FooterSection";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col bg-[#121212]">
      <Navbar />
      <section className="container mt-24 mx-auto px-12 py-4">
        <div className="my-5 text-center">
          <p className="text-white">
            Don't worry, I've got them–just in the process of building out this
            page…
          </p>
        </div>
      </section>
      <FooterSection />
    </main>
  );
}
