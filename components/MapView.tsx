"use client";

import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import L from "leaflet";
import type { Estabelecimento } from "@/lib/supabase";

const CATEGORY_COLOR: Record<string, string> = {
  supermercado: "#FF7A29",
  hotel: "#2B6777",
};

const CATEGORY_LABEL: Record<string, string> = {
  supermercado: "Supermercado",
  hotel: "Hotel / Pousada",
};

const STATUS_LABEL: Record<string, string> = {
  novo: "Novo",
  ja_e_cliente: "Já é cliente",
  nao_atende: "Não atende ao perfil",
  descartado: "Descartado",
};

function pinIcon(categoria: string) {
  const color = CATEGORY_COLOR[categoria] ?? "#16211C";
  const html = `
    <div class="marker-pin" style="width:28px;height:28px;background:${color};border:2px solid #F5F6F1;">
      <span style="width:8px;height:8px;border-radius:999px;background:#F5F6F1;"></span>
    </div>
  `;

  return L.divIcon({
    html,
    className: "",
    iconSize: [28, 28],
    iconAnchor: [14, 28],
    popupAnchor: [0, -26],
  });
}

function ClickCapture({
  ativo,
  onClick,
}: {
  ativo: boolean;
  onClick: (lat: number, lng: number) => void;
}) {
  useMapEvents({
    click(e) {
      if (ativo) onClick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

export default function MapView({
  dados,
  modoAdicionar = false,
  onMapClick,
}: {
  dados: Estabelecimento[];
  modoAdicionar?: boolean;
  onMapClick?: (lat: number, lng: number) => void;
}) {
  const center: [number, number] =
    dados.length > 0
      ? [dados[0].latitude, dados[0].longitude]
      : [-15.6014, -56.0979];

  return (
    <MapContainer
      center={center}
      zoom={12}
      scrollWheelZoom={true}
      style={{ width: "100%", height: "100%", cursor: modoAdicionar ? "crosshair" : "" }}
    >
      {onMapClick && <ClickCapture ativo={modoAdicionar} onClick={onMapClick} />}
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {dados.map((item) => (
        <Marker
          key={item.id}
          position={[item.latitude, item.longitude]}
          icon={pinIcon(item.categoria)}
        >
          <Popup>
            <div style={{ minWidth: 180 }}>
              <p style={{ fontWeight: 600, marginBottom: 4 }}>{item.nome}</p>
              <p style={{ fontSize: 13, color: "#3E4A42", marginBottom: 2 }}>
                {CATEGORY_LABEL[item.categoria] ?? item.categoria}
              </p>
              {item.telefone && (
                <p style={{ fontSize: 13, color: "#3E4A42", marginBottom: 2 }}>
                  {item.telefone}
                </p>
              )}
              <p style={{ fontSize: 12, color: "#6B776E", marginTop: 6 }}>
                {STATUS_LABEL[item.status_revisao] ?? item.status_revisao}
              </p>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
