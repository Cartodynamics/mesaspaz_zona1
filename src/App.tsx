
import React, { useState } from 'react';
import InfoBox, { InfoBoxSection } from './components/InfoBox/InfoBox';
import Map from './components/Map/Map';
import './App.css';

const App: React.FC = () => {
  const [layersVisibility, setLayersVisibility] = useState<Record<string, boolean>>({
    LocalidadesSedeINPI: true,
    asambleas_consulta: true,
    asambleas_consulta_cercanas: false,
    PresidenciasMunicipales: false,
    PuntosWiFiCFE_4G: false,
    PuntosWiFiCFE_FIBRA: false,
    PuntosWiFiCFE_SATELITAL: false,
    RegionesMesas: false,
  });

  const handleToggle = (id: string) => {
    setLayersVisibility(prev => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const sections: InfoBoxSection[] = [
    {
      title: 'Asambleas Regionales',
      items: [
        {
          id: 'asambleas_consulta',
          label: 'Consultas Zona 1',
          color: '#e60026',
          shape: 'circle',
          switch: true,
          checked: layersVisibility['asambleas_consulta'],
        },
      ]
    },
    {
      title: 'Municipios de Mesas de Paz',
      items: [
        {
          id: 'asambleas_consulta_cercanas',
          label: 'Mesas Cercanas - Zona 1',
          color: '#f8e71c',
          shape: 'square',
          switch: true,
          checked: layersVisibility['asambleas_consulta_cercanas'],
        },
      ]
    },
    {
      title: 'Localidades Sede INPI',
      items: [
        {
          id: 'LocalidadesSedeINPI',
          label: 'Pueblos Originarios',
          color: '#666666',
          shape: 'circle',
          switch: true,
          checked: layersVisibility['LocalidadesSedeINPI'],
        },
      ]
    },
    {
      title: 'Regionalización - Mesas de Paz',
      items: [
        {
          id: 'RegionesMesas',
          label: 'Regiones Zona 1',
          color: '#66c2a5',
          shape: 'square',
          switch: true,
          checked: layersVisibility['RegionesMesas'],
        }
      ]
    },
    {
      title: 'Presidencias Municipales',
      items: [
        {
          id: 'PresidenciasMunicipales',
          label: 'Presidencias Municipales',
          color: '#000000',
          shape: 'circle',
          switch: true,
          checked: layersVisibility['PresidenciasMunicipales'],
        }
      ]
    },
    {
      title: 'Puntos WiFi CFE',
      items: [
        {
          id: 'PuntosWiFiCFE_4G',
          label: '4G',
          color: '#9f2241',
          shape: 'circle',
          switch: true,
          checked: layersVisibility['PuntosWiFiCFE_4G'],
        },
        {
          id: 'PuntosWiFiCFE_FIBRA',
          label: 'Fibra o Cobre',
          color: '#cda578',
          shape: 'circle',
          switch: true,
          checked: layersVisibility['PuntosWiFiCFE_FIBRA'],
        },
        {
          id: 'PuntosWiFiCFE_SATELITAL',
          label: 'Satelital',
          color: '#235b4e',
          shape: 'circle',
          switch: true,
          checked: layersVisibility['PuntosWiFiCFE_SATELITAL'],
        },
      ]
    },
  ];

  return (
    <div className="App">
      <InfoBox
        title="Asambleas regionales de Consulta Zona 1"
        subtitle="Capas disponibles"
        sections={sections}
        onToggle={handleToggle}
      />
      <Map layersVisibility={layersVisibility} />
    </div>
  );
};

export default App;
