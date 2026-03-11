import useStore from '../store/useStore';

const PRESETS = {
  studio: {
    label: 'Studio',
    icon: '💡',
    bgColor: '#d8d8d8',
    groundColor: '#f0f0f0',
    ambientIntensity: 0.9,
    sunIntensity: 1.6,
    sunColor: '#fff8f0',
    envPreset: 'studio',
    preview: 'linear-gradient(180deg, #d8d8d8 55%, #f0f0f0 55%)',
  },
  sunset: {
    label: 'Sunset',
    icon: '🌅',
    bgColor: '#1a0f08',
    groundColor: '#2c1a0e',
    ambientIntensity: 0.35,
    sunIntensity: 2.8,
    sunColor: '#ff8844',
    envPreset: 'sunset',
    preview: 'linear-gradient(180deg, #ff6a1a 55%, #2c1a0e 55%)',
  },
  night: {
    label: 'Night',
    icon: '🌙',
    bgColor: '#05050f',
    groundColor: '#0c0c1e',
    ambientIntensity: 0.15,
    sunIntensity: 0.9,
    sunColor: '#4466ff',
    envPreset: 'night',
    preview: 'linear-gradient(180deg, #05050f 55%, #0c0c1e 55%)',
  },
  dawn: {
    label: 'Dawn',
    icon: '🌄',
    bgColor: '#f0c8a0',
    groundColor: '#dbb88a',
    ambientIntensity: 0.65,
    sunIntensity: 1.9,
    sunColor: '#ffcc88',
    envPreset: 'dawn',
    preview: 'linear-gradient(180deg, #f0c8a0 55%, #dbb88a 55%)',
  },
  track: {
    label: 'Track',
    icon: '🏁',
    bgColor: '#1c1c1c',
    groundColor: '#303030',
    ambientIntensity: 0.5,
    sunIntensity: 2.2,
    sunColor: '#ffffff',
    envPreset: 'warehouse',
    preview: 'linear-gradient(180deg, #1c1c1c 55%, #303030 55%)',
  },
  city: {
    label: 'City',
    icon: '🏙️',
    bgColor: '#b8c8d8',
    groundColor: '#a0b0c0',
    ambientIntensity: 0.75,
    sunIntensity: 1.4,
    sunColor: '#ddeeff',
    envPreset: 'city',
    preview: 'linear-gradient(180deg, #b8c8d8 55%, #a0b0c0 55%)',
  },
};

export default function ScenePanel() {
  const sceneConfig = useStore((s) => s.sceneConfig);
  const setSceneConfig = useStore((s) => s.setSceneConfig);

  function applyPreset(key) {
    const { label, icon, preview, ...settings } = PRESETS[key];
    setSceneConfig({ ...settings, preset: key });
  }

  return (
    <div className="scene-panel">
      <h3>Scene & Lighting</h3>

      {/* Preset swatches */}
      <div className="scene-section-label">Environment Preset</div>
      <div className="scene-presets">
        {Object.entries(PRESETS).map(([key, preset]) => (
          <button
            key={key}
            className={`scene-preset-btn ${sceneConfig.preset === key ? 'active' : ''}`}
            onClick={() => applyPreset(key)}
            title={preset.label}
          >
            <span
              className="preset-swatch"
              style={{ background: preset.preview }}
            />
            <span className="preset-icon">{preset.icon}</span>
            <span className="preset-label">{preset.label}</span>
          </button>
        ))}
      </div>

      {/* Manual controls */}
      <div className="scene-controls">
        {/* Background color */}
        <div className="scene-control-row">
          <label className="scene-control-label">Background</label>
          <div className="scene-color-row">
            <input
              type="color"
              className="scene-color-input"
              value={sceneConfig.bgColor}
              onChange={(e) => setSceneConfig({ bgColor: e.target.value, preset: 'custom' })}
            />
            <span className="scene-color-hex">{sceneConfig.bgColor}</span>
          </div>
        </div>

        {/* Ground color */}
        <div className="scene-control-row">
          <label className="scene-control-label">Ground</label>
          <div className="scene-color-row">
            <input
              type="color"
              className="scene-color-input"
              value={sceneConfig.groundColor}
              onChange={(e) => setSceneConfig({ groundColor: e.target.value, preset: 'custom' })}
            />
            <span className="scene-color-hex">{sceneConfig.groundColor}</span>
          </div>
        </div>

        {/* Sun / key light intensity */}
        <div className="scene-control-row">
          <label className="scene-control-label">
            Sun Intensity
            <span className="scene-control-value">{sceneConfig.sunIntensity.toFixed(1)}</span>
          </label>
          <input
            type="range"
            min="0"
            max="4"
            step="0.1"
            value={sceneConfig.sunIntensity}
            onChange={(e) =>
              setSceneConfig({ sunIntensity: parseFloat(e.target.value), preset: 'custom' })
            }
            className="scene-slider"
          />
        </div>

        {/* Ambient light intensity */}
        <div className="scene-control-row">
          <label className="scene-control-label">
            Ambient Light
            <span className="scene-control-value">{sceneConfig.ambientIntensity.toFixed(1)}</span>
          </label>
          <input
            type="range"
            min="0"
            max="2"
            step="0.05"
            value={sceneConfig.ambientIntensity}
            onChange={(e) =>
              setSceneConfig({ ambientIntensity: parseFloat(e.target.value), preset: 'custom' })
            }
            className="scene-slider"
          />
        </div>

        {/* Sun / key light color */}
        <div className="scene-control-row">
          <label className="scene-control-label">Light Color</label>
          <div className="scene-color-row">
            <input
              type="color"
              className="scene-color-input"
              value={sceneConfig.sunColor}
              onChange={(e) => setSceneConfig({ sunColor: e.target.value, preset: 'custom' })}
            />
            <div className="light-color-presets">
              {[
                { label: 'Warm', color: '#ffcc88' },
                { label: 'Neutral', color: '#ffffff' },
                { label: 'Cool', color: '#aabbff' },
              ].map(({ label, color }) => (
                <button
                  key={color}
                  className={`light-color-btn ${sceneConfig.sunColor === color ? 'active' : ''}`}
                  style={{ background: color }}
                  title={label}
                  onClick={() => setSceneConfig({ sunColor: color, preset: 'custom' })}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Grid toggle */}
        <div className="scene-control-row scene-toggle-row">
          <label className="scene-control-label">Show Grid</label>
          <button
            className={`scene-toggle ${sceneConfig.showGrid ? 'on' : 'off'}`}
            onClick={() => setSceneConfig({ showGrid: !sceneConfig.showGrid })}
          >
            {sceneConfig.showGrid ? 'On' : 'Off'}
          </button>
        </div>
      </div>
    </div>
  );
}
