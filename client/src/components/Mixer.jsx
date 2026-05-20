import React from 'react';
import '../styles/Mixer.css';

const Mixer = ({ settings, onSettingsChange }) => {
  const handleChange = (key, value) => {
    onSettingsChange({
      ...settings,
      [key]: value
    });
  };

  const sliders = [
    { key: 'bass', label: 'Bass', min: -12, max: 12 },
    { key: 'treble', label: 'Treble', min: -12, max: 12 },
    { key: 'reverb', label: 'Reverb', min: 0, max: 100 },
    { key: 'echo', label: 'Echo', min: 0, max: 100 },
    { key: 'distortion', label: 'Distortion', min: 0, max: 100 }
  ];

  return (
    <div className="mixer">
      <h3>🎛️ Mixer</h3>
      <div className="mixer-sliders">
        {sliders.map(slider => (
          <div key={slider.key} className="mixer-slider">
            <label>{slider.label}</label>
            <input
              type="range"
              min={slider.min}
              max={slider.max}
              value={settings[slider.key]}
              onChange={(e) => handleChange(slider.key, parseInt(e.target.value))}
              className="slider"
            />
            <span className="value">{settings[slider.key]}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Mixer;
