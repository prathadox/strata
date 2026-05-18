import { Reveal } from './Reveal';
import { AGENTS } from '@/lib/content';

export function Agents() {
  return (
    <section id="agents" className="section" style={{ paddingTop: 'clamp(60px, 10vh, 100px)' }}>
      <div className="wrap">
        <Reveal>
          <div className="section-head">
            <div>
              <p className="section-eyebrow">02 / Agents</p>
              <h2 className="section-title">Five agents do the work an asset manager would.</h2>
            </div>
            <p className="section-lede">
              Each agent has an on-chain identity, a public strategy document,
              and a reputation that grows only through verified actions.
            </p>
          </div>
        </Reveal>

        <div className="agents">
          {AGENTS.map((a, i) => (
            <Reveal key={a.name} delay={i * 60}>
              <div className="agent">
                <span className="num">{a.n}</span>
                <div className="agent-name">
                  <h4>{a.name}</h4>
                  <span>{a.role}</span>
                </div>
                <p className="agent-desc">{a.desc}</p>
                <div className="agent-out">
                  On-chain output
                  <b>{a.outB}</b>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
