// app.jsx — Strata landing page entry.

const { useEffect } = React;

function App() {
  const [t, setTweak] = useTweaks(window.TWEAK_DEFAULTS);

  // Apply tweakable accent + grain.
  useEffect(() => {
    document.documentElement.style.setProperty("--accent", t.accent);
    document.body.classList.toggle("grain", !!t.grain);
  }, [t.accent, t.grain]);

  return (
    <>
      <Nav ctaCopy={t.ctaCopy} />
      <Hero
        headlineVariant={t.headlineVariant}
        ctaCopy={t.ctaCopy}
        showTicker={t.showTicker}
      />
      <Tranches />
      <Agents />
      <Verify />
      <Ecosystem />
      <Close ctaCopy={t.ctaCopy} />
      <Footer />

      <TweaksPanel>
        <TweakSection label="Brand accent" />
        <TweakColor
          label="Accent"
          value={t.accent}
          options={["#ff3d86", "#e91e63", "#b8195a", "#ff6f3c", "#c084fc"]}
          onChange={(v) => setTweak("accent", v)}
        />

        <TweakSection label="Hero" />
        <TweakSelect
          label="Headline"
          value={t.headlineVariant}
          options={[
            { value: "slice",  label: "Choose your slice…" },
            { value: "layers", label: "Real-world yield, in three layers." },
            { value: "agents", label: "Yield, managed by five agents." },
          ]}
          onChange={(v) => setTweak("headlineVariant", v)}
        />
        <TweakText
          label="CTA copy"
          value={t.ctaCopy}
          onChange={(v) => setTweak("ctaCopy", v)}
        />
        <TweakToggle
          label="Live agent ticker"
          value={t.showTicker}
          onChange={(v) => setTweak("showTicker", v)}
        />

        <TweakSection label="Texture" />
        <TweakToggle
          label="Film grain"
          value={t.grain}
          onChange={(v) => setTweak("grain", v)}
        />
      </TweaksPanel>
    </>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
