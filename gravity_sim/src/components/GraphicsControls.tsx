interface GraphicsControlsProps {
  antiAlias: boolean;
  setAntiAlias: React.Dispatch<React.SetStateAction<boolean>>;
  dpr: number;
  setDpr: React.Dispatch<React.SetStateAction<number>>;
  powerPreference: "default" | "high-performance" | "low-power";
  setPowerPreference: React.Dispatch<React.SetStateAction<"default" | "high-performance" | "low-power">>;
  shadows: boolean;
  setShadows: React.Dispatch<React.SetStateAction<boolean>>;
}

const GraphicsControls = ({ antiAlias, setAntiAlias, dpr, setDpr, powerPreference, setPowerPreference, shadows, setShadows }: GraphicsControlsProps) => {
  const dprPresets = [
    { label: 'Low (0.25)', value: 0.25 },
    { label: 'Medium (0.5)', value: 0.5 },
    { label: 'High (1)', value: 1 },
    { label: 'Native', value: window.devicePixelRatio },
  ];

  const powerPreferences = [
    { label: 'Default', value: 'default' },
    { label: 'High Performance', value: 'high-performance' },
    { label: 'Low Power', value: 'low-power' },
  ];

  return (
    <div className="dropdown dropdown-end">
      <div tabIndex={0} role="button" className="btn m-1 bg-transparent border-none">
        {/* Gear icon */}
        <svg
          viewBox="0 0 24 24"
          width="24"
          height="24"
          stroke="currentColor"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="css-i6dzq1"
        >
          <circle cx="12" cy="12" r="3"></circle>
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
        </svg>
      </div>

      <ul tabIndex={-1} className="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm">
        {/* Anti-alias toggle & Shadow toggle */}
        <li>
            <div>
                <fieldset className="fieldset">
                    <legend className="fieldset-legend">Anti-Alias</legend>
                    <input
                    type="checkbox"
                    className="toggle toggle-sm toggle-info"
                    checked={antiAlias}
                    onChange={(e) => setAntiAlias(e.target.checked)}
                    />
                </fieldset>
                <fieldset className="fieldset">
                    <legend className="fieldset-legend">Shadows</legend>
                    <input type="checkbox" className="toggle toggle-sm toggle-info" checked={shadows} onChange={(e) => setShadows(e.target.checked)} />
                </fieldset>
            </div>
        </li>

        {/* DPR selector */}
        <li>
          <fieldset className="fieldset">
            <legend className="fieldset-legend">DPR</legend>
            <select
              className="select select-sm select-info w-full"
              value={dpr}
              onChange={(e) => setDpr(Number(e.target.value))}
            >
              {dprPresets.map((preset) => (
                <option key={preset.value} value={preset.value}>
                  {preset.label}
                </option>
              ))}
            </select>
          </fieldset>
        </li>

        {/* Power Preference */}
        <li>
            <fieldset className="fieldset">
                <legend className="fieldset-legend">Power Preference</legend>
                <select className="select select-sm select-info w-full"
                    value={powerPreference}
                    onChange={(e) => setPowerPreference(e.target.value as "default" | "high-performance" | "low-power")}
                >
                    {powerPreferences.map((power) => (
                        <option key={power.value} value={power.value}>
                            {power.label}
                        </option>
                    ))}
                </select>
            </fieldset>
        </li>
      </ul>
    </div>
  );
};

export default GraphicsControls;