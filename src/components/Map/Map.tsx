// Map.tsx con RegionesMesas al fondo (debajo de los puntos)
import React, { useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import { Protocol } from 'pmtiles';
import 'maplibre-gl/dist/maplibre-gl.css';

type MapProps = {
  layersVisibility: { [layerId: string]: boolean };
};

const Map: React.FC<MapProps> = ({ layersVisibility }) => {
  const mapRef = useRef<maplibregl.Map | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const protocol = new Protocol();
    maplibregl.addProtocol('pmtiles', protocol.tile);

    const map = new maplibregl.Map({
      container,
      style: 'https://api.maptiler.com/maps/01976666-b449-7252-86b5-3e7b3213a9e6/style.json?key=QAha5pFBxf4hGa8Jk5zv',
      center: [-105.15135, 23.55291],
      zoom: 4.47,
      attributionControl: false,
    });

    map.on('load', () => {
      map.addControl(new maplibregl.AttributionControl({
        customAttribution: 'Secretaría de Gobernación',
        compact: true
      }), 'bottom-right');

      const sources = [
        'LocalidadesSedeINPI',
        'PresidenciasMunicipales',
        'PuntosWiFiCFE',
        'RegionesMesas',
        'asambleas_consulta',
        'asambleas_consulta_cercanas'
      ];

      sources.forEach(src => {
        map.addSource(src, {
          type: 'vector',
          url: `pmtiles://data/${src}.pmtiles`
        });
      });

      const set2Colors = ['#66c2a5', '#fc8d62', '#8da0cb', '#e78ac3', '#a6d854', '#ffd92f', '#e5c494', '#b3b3b3'];
      const matchValues: (string | number)[] = [];
      for (let i = 1; i <= 266; i++) {
        matchValues.push(i, set2Colors[i % set2Colors.length]);
      }
      const matchExpression = ['match', ['get', '_REGION'], ...matchValues, '#cccccc'] as any;

      map.addLayer({
        id: 'RegionesMesas',
        type: 'fill',
        source: 'RegionesMesas',
        'source-layer': 'regiones_zona1_tile',
        paint: {
          'fill-color': matchExpression,
          'fill-opacity': 0.5,
          'fill-outline-color': '#333333'
        }
      });

      map.setLayoutProperty('RegionesMesas', 'visibility', layersVisibility['RegionesMesas'] ? 'visible' : 'none');

      map.on('mousemove', 'RegionesMesas', (e) => {
        map.getCanvas().style.cursor = 'pointer';
        const props = e.features?.[0]?.properties;
        if (!props) return;
        document.querySelectorAll('.maplibregl-popup').forEach(p => p.remove());
        new maplibregl.Popup({ closeButton: false, closeOnClick: false })
          .setLngLat(e.lngLat)
          .setHTML(`<strong>Región:</strong> ${props._NOM_REGION || 'Desconocido'}`)
          .addTo(map);
      });
      map.on('mouseleave', 'RegionesMesas', () => {
        map.getCanvas().style.cursor = '';
        document.querySelectorAll('.maplibregl-popup').forEach(p => p.remove());
      });

map.addLayer({
        id: 'asambleas_consulta_cercanas',
        type: 'fill',
        source: 'asambleas_consulta_cercanas',
        'source-layer': 'mesas_cercanas_zona1_tile',
        paint: {
          'fill-color': '#f8e71c',
          'fill-opacity': 0.4,
          'fill-outline-color': '#333333'
        }
      });
 
     map.setLayoutProperty('asambleas_consulta_cercanas', 'visibility', layersVisibility['asambleas_consulta_cercanas'] ? 'visible' : 'none');

      map.on('mousemove', 'asambleas_consulta_cercanas', (e) => {
        map.getCanvas().style.cursor = 'pointer';
        const props = e.features?.[0]?.properties;
        if (!props) return;
        document.querySelectorAll('.maplibregl-popup').forEach(p => p.remove());
        new maplibregl.Popup({ closeButton: false, closeOnClick: false })
          .setLngLat(e.lngLat)
          .setHTML(`
            <strong>Entidad:</strong> ${props._NOM_ENT || 'Desconocido'}<br/>
            <strong>Región:</strong> ${props._NOM_REGION || 'Desconocido'}<br/>
            <strong>Zona:</strong> ${props.Zona || 'Desconocida'}
          `)
          .addTo(map);
      });

      map.on('mouseleave', 'asambleas_consulta_cercanas', () => {
        map.getCanvas().style.cursor = '';
        document.querySelectorAll('.maplibregl-popup').forEach(p => p.remove());
      });
      
      const dark2 = ['#1b9e77', '#d95f02', '#7570b3', '#e7298a', '#66a61e', '#e6ab02', '#a6761d', '#666666'];
      const pueblosMatch: (string | number)[] = [];
      for (let i = 1; i <= 72; i++) {
        pueblosMatch.push(i, dark2[i % dark2.length]);
      }
      const puebloExpression = ['match', ['get', 'id_pueblo'], ...pueblosMatch, '#666666'] as any;

      map.addLayer({
        id: 'LocalidadesSedeINPI',
        type: 'circle',
        source: 'LocalidadesSedeINPI',
        'source-layer': 'LocalidadesSedeINPI_tile',
        paint: {
          'circle-radius': 1.4,
          'circle-color': puebloExpression,
          'circle-stroke-color': '#ffffff',
          'circle-stroke-width': 0
        }
      });

      map.setLayoutProperty('LocalidadesSedeINPI', 'visibility', layersVisibility['LocalidadesSedeINPI'] ? 'visible' : 'none');

      map.on('mouseenter', 'LocalidadesSedeINPI', (e) => {
        map.getCanvas().style.cursor = 'pointer';
        const props = e.features?.[0]?.properties;
        if (!props) return;
        new maplibregl.Popup({ closeButton: false, closeOnClick: false })
          .setLngLat(e.lngLat)
          .setHTML(`
            <strong>Entidad:</strong> ${props.NOM_ENT}<br/>
            <strong>Municipio:</strong> ${props.NOM_MUN}<br/>
            <strong>Localidad:</strong> ${props.NOM_LOC}<br/>
            <strong>Pueblo:</strong> ${props.Pueblo}<br/>
            <strong>Población:</strong> ${props.POBTOT}<br/>
            <strong>Indígenas:</strong> ${props.PHOG_IND}<br/>
            <strong>Afrodescendientes:</strong> ${props.POB_AFRO}<br/>
            <strong>Marginación:</strong> ${props.GM_2020}
          `)
          .addTo(map);
      });

      map.on('mouseleave', 'LocalidadesSedeINPI', () => {
        map.getCanvas().style.cursor = '';
        document.querySelectorAll('.maplibregl-popup').forEach(p => p.remove());
      });

            map.on('mouseenter', 'asambleas_consulta', (e) => {
        map.getCanvas().style.cursor = 'pointer';
        const props = e.features?.[0]?.properties;
        if (!props) return;
        new maplibregl.Popup({ closeButton: false, closeOnClick: false })
          .setLngLat(e.lngLat)
          .setHTML(`
            <strong>Sede:</strong> ${props.Sede}<br/>
            <strong>Pueblo:</strong> ${props.Pueblo}<br/>
            <strong>Región:</strong> ${props.Regiones}<br/>
            <strong>Mesa:</strong> ${props.Mesa}<br/>
            <strong>Nombre de Mesa:</strong> ${props.NomMesa}
          `)
          .addTo(map);
      });

      map.on('mouseleave', 'asambleas_consulta', () => {
        map.getCanvas().style.cursor = '';
        document.querySelectorAll('.maplibregl-popup').forEach(p => p.remove());
      });

      map.addLayer({
        id: 'PresidenciasMunicipales',
        type: 'circle',
        source: 'PresidenciasMunicipales',
        'source-layer': 'PresidenciasMunicipales_tile',
        paint: {
          'circle-radius': 1.3,
          'circle-color': '#000000'
        }
      });
    
      map.setLayoutProperty('PresidenciasMunicipales', 'visibility', layersVisibility['PresidenciasMunicipales'] ? 'visible' : 'none');


     map.setLayoutProperty('PresidenciasMunicipales', 'visibility', layersVisibility['PresidenciasMunicipales'] ? 'visible' : 'none');


      map.on('mouseenter', 'PresidenciasMunicipales', (e) => {
        map.getCanvas().style.cursor = 'pointer';
        const props = e.features?.[0]?.properties;
        if (!props) return;
        new maplibregl.Popup({ closeButton: false, closeOnClick: false })
          .setLngLat(e.lngLat)
          .setHTML(`
            <strong>Entidad:</strong> ${props.entidad}<br/>
            <strong>Municipio:</strong> ${props.municipio}<br/>
            <strong>Dirección:</strong> ${props.direccion}
          `)
          .addTo(map);
      });

      map.on('mouseleave', 'PresidenciasMunicipales', () => {
        map.getCanvas().style.cursor = '';
        document.querySelectorAll('.maplibregl-popup').forEach(p => p.remove());
      });

      const tecnologias = [
        { id: 'PuntosWiFiCFE_4G', color: '#9f2241', filtro: '4G' },
        { id: 'PuntosWiFiCFE_FIBRA', color: '#cda578', filtro: 'FIBRA O COBRE' },
        { id: 'PuntosWiFiCFE_SATELITAL', color: '#235b4e', filtro: 'SATELITAL' },
      ];

      tecnologias.forEach(({ id, color, filtro }) => {
        map.addLayer({
          id,
          type: 'circle',
          source: 'PuntosWiFiCFE',
          'source-layer': 'PuntosWiFiCFE_tile',
          filter: ['==', ['get', 'TECNOLOGIA'], filtro],
          paint: {
            'circle-radius': 1.2,
            'circle-color': color,
            'circle-stroke-color': '#ffffff',
            'circle-stroke-width': 0
          }
        }); 
                

        map.on('mouseenter', id, (e) => {
          map.getCanvas().style.cursor = 'pointer';
          const props = e.features?.[0]?.properties;
          if (!props) return;
          new maplibregl.Popup({ closeButton: false, closeOnClick: false })
            .setLngLat(e.lngLat)
            .setHTML(`
              <strong>Nombre:</strong> ${props['INMUEBLE NOMBRE']}<br/>
              <strong>Tipo:</strong> ${props['TIPO INMUEBLE']}<br/>
              <strong>AP:</strong> ${props['NOMBRE AP']}<br/>
              <strong>Tecnología:</strong> ${props['TECNOLOGIA']}
            `)
            .addTo(map);
        });

        map.on('mouseleave', id, () => {
          map.getCanvas().style.cursor = '';
          document.querySelectorAll('.maplibregl-popup').forEach(p => p.remove());
        });


        
        map.addLayer({
        id: 'asambleas_consulta',
        type: 'circle',
        source: 'asambleas_consulta',
        'source-layer': 'asambleas_consulta_tile',
        paint: {
          'circle-radius': 5.5,
          'circle-color': '#e60026',
          'circle-stroke-color': '#ffffff',
          'circle-stroke-width': 2
        }
      });
      map.setLayoutProperty('asambleas_consulta', 'visibility', layersVisibility['asambleas_consulta'] ? 'visible' : 'none');

      });
    });

   
    mapRef.current = map;

    return () => {
      map.remove();
      maplibregl.removeProtocol('pmtiles');
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    Object.entries(layersVisibility).forEach(([id, visible]) => {
      const vis = visible ? 'visible' : 'none';
      try {
        if (map.getLayer(id)) {
          map.setLayoutProperty(id, 'visibility', vis);
        }
      } catch {}
    });
  }, [layersVisibility]);

  return <div ref={containerRef} style={{ width: '100%', height: '100vh' }} />;
};

export default Map;








