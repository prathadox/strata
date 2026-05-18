import { Reveal } from './Reveal';
import { Ledger } from './Ledger';

export function Verify() {
  return (
    <section id="verify" className="section">
      <div className="wrap">
        <Reveal>
          <div className="section-head">
            <div>
              <p className="section-eyebrow">03 / Verifiability</p>
              <h2 className="section-title">Audit it like a smart contract.</h2>
            </div>
            <p className="section-lede">
              Every decision is preceded by a public strategy and followed by an on-chain event.
              The whole protocol is queryable, citable, and reusable.
            </p>
          </div>
        </Reveal>

        <div className="verify-grid">
          <div className="verify-points">
            <Reveal>
              <div className="verify-point">
                <span className="vp-num">01</span>
                <div>
                  <h5>Strategies, signed and versioned.</h5>
                  <p>Each agent publishes its strategy to IPFS, referenced from its identity NFT. Read what an agent intends before watching it act.</p>
                </div>
              </div>
            </Reveal>
            <Reveal delay={80}>
              <div className="verify-point">
                <span className="vp-num">02</span>
                <div>
                  <h5>Decisions with reasoning hashes.</h5>
                  <p>Every proposal, verdict, fill, and receipt is an on-chain event. Trace the full agent loop end-to-end from any line.</p>
                </div>
              </div>
            </Reveal>
            <Reveal delay={160}>
              <div className="verify-point">
                <span className="vp-num">03</span>
                <div>
                  <h5>Compliance as public infrastructure.</h5>
                  <p>Jurisdiction Policy NFTs and risk verdicts are reusable. Other Mantle protocols can subscribe to them directly.</p>
                </div>
              </div>
            </Reveal>
          </div>

          <Reveal delay={120}>
            <Ledger />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
