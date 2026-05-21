import React from 'react';
import '../styles/Mixer.css';

const Mixer = ({ settings, onSettingsChange }) => {
  const handleChange = (key, value) => {
    onSettingsChange({
      ...settings,
      [key]: value
    });
  };

  const handleReset = () => {
    onSettingsChange({
      bass: 0,
      treble: 0,
      reverb: 0,
      echo: 0,
      distortion: 0
    });
  };

  const sliders = [
    { key: 'bass', label: 'Bass', min: -12, max: 12, icon: '🎚' },
    { key: 'treble', label: 'Treble', min: -12, max: 12, icon: '🔊' },
    { key: 'reverb', label: 'Reverb', min: 0, max: 100, icon: '💫' },
    { key: 'echo', label: 'Echo', min: 0, max: 100, icon: '🔔' },
    { key: 'distortion', label: 'Distortion', min: 0, max: 100, icon: '⚡' }
  ];

  const isDefault = sliders.every(s => settings[s.key] === 0);

  return (
    <div className="mixer">
      <div className="mixer-header">
        <h3>🎛️ Mixer</h3>
        <button
          className="reset-btn"
          onClick={handleReset}
          disabled={isDefault}
          title="Reset to default"
        >
          ↻ Reset
        </button>
      </div>
      <div className="mixer-sliders">
        {sliders.map(slider => (
          <div key={slider.key} className="mixer-slider">
            <div className="slider-header">
              <span className="slider-icon">{slider.icon}</span>
              <label>{slider.label}</label>
            </div>
            <input
              type="range"
              min={slider.min}
              max={slider.max}
              value={settings[slider.key]}
              onChange={(e) => handleChange(slider.key, parseInt(e.target.value))}
              className="slider"
              title={`${slider.label}: ${settings[slider.key]}`}
            />
            <span className={`value ${settings[slider.key] > 0 ? 'positive' : settings[slider.key] < 0 ? 'negative' : ''}`}>
              {settings[slider.key] > 0 ? '+' : ''}{settings[slider.key]}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Mixer;
