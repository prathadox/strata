import { Nav } from '@/components/Nav';
import { Hero } from '@/components/Hero';
import { Tranches } from '@/components/Tranches';
import { Agents } from '@/components/Agents';
import { Verify } from '@/components/Verify';
import { Ecosystem } from '@/components/Ecosystem';
import { Close } from '@/components/Close';
import { Footer } from '@/components/Footer';

export default function Page() {
  return (
    <>
      <Nav />
      <Hero />
      <Tranches />
      <Agents />
      <Verify />
      <Ecosystem />
      <Close />
      <Footer />
    </>
  );
}
