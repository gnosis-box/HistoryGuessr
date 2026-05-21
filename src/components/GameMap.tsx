// src/components/GameMap.tsx
import { useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";
import type { GuessCoordinates } from "@/types/game";

const MAP_STYLE = "https://demotiles.maplibre.org/style.json";
const RESULT_SOURCE_ID = "result-line";
const RESULT_LAYER_ID = "result-line-layer";

interface MultiPointConfig {
  maxPoints: number;
  points: GuessCoordinates[];
  onPointsChange: (points: GuessCoordinates[]) => void;
}

interface GameMapProps {
  answerLat: number;
  answerLng: number;
  guess: GuessCoordinates | null;
  showAnswer: boolean;
  onGuess: (coords: GuessCoordinates) => void;
  onValidate: () => void;
  canValidate: boolean;
  multiPoint?: MultiPointConfig;
}

function createMarkerElement(color: string, label: string): HTMLDivElement {
  const el = document.createElement("div");
  el.className = "flex flex-col items-center";
  el.innerHTML = `
    <span style="
      background:${color};
      color:#0f172a;
      font-size:10px;
      font-weight:700;
      padding:2px 6px;
      border-radius:999px;
      margin-bottom:4px;
      white-space:nowrap;
    ">${label}</span>
    <span style="
      width:14px;
      height:14px;
      border-radius:50%;
      background:${color};
      border:2px solid #f8fafc;
      box-shadow:0 0 8px rgba(0,0,0,0.4);
    "></span>
  `;
  return el;
}

function isMapReady(map: maplibregl.Map): boolean {
  try {
    return Boolean(map.getStyle());
  } catch {
    return false;
  }
}

function removeResultOverlay(map: maplibregl.Map | null) {
  if (!map || !isMapReady(map)) return;
  try {
    if (map.getLayer(RESULT_LAYER_ID)) map.removeLayer(RESULT_LAYER_ID);
    if (map.getSource(RESULT_SOURCE_ID)) map.removeSource(RESULT_SOURCE_ID);
  } catch {
    // Map was removed between checks and cleanup.
  }
}

export function GameMap({
  answerLat,
  answerLng,
  guess,
  showAnswer,
  onGuess,
  onValidate,
  canValidate,
  multiPoint,
}: GameMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const guessMarkerRef = useRef<maplibregl.Marker | null>(null);
  const answerMarkerRef = useRef<maplibregl.Marker | null>(null);
  const multiMarkersRef = useRef<maplibregl.Marker[]>([]);
  const showAnswerRef = useRef(showAnswer);
  const onGuessRef = useRef(onGuess);
  const multiPointRef = useRef(multiPoint);

  showAnswerRef.current = showAnswer;
  onGuessRef.current = onGuess;
  multiPointRef.current = multiPoint;

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = new maplibregl.Map({
      container: containerRef.current,
      style: MAP_STYLE,
      center: [10, 30],
      zoom: 1.4,
      attributionControl: {},
    });

    map.addControl(new maplibregl.NavigationControl({ showCompass: false }), "top-right");

    map.on("click", (e) => {
      if (showAnswerRef.current) return;
      const coords = { lat: e.lngLat.lat, lng: e.lngLat.lng };
      const mp = multiPointRef.current;
      if (mp && mp.points.length < mp.maxPoints) {
        mp.onPointsChange([...mp.points, coords]);
      } else if (!mp) {
        onGuessRef.current(coords);
      }
    });

    mapRef.current = map;

    return () => {
      guessMarkerRef.current?.remove();
      guessMarkerRef.current = null;
      answerMarkerRef.current?.remove();
      answerMarkerRef.current = null;
      multiMarkersRef.current.forEach((m) => m.remove());
      multiMarkersRef.current = [];
      removeResultOverlay(map);
      map.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    if (multiPoint) {
      guessMarkerRef.current?.remove();
      guessMarkerRef.current = null;
      multiMarkersRef.current.forEach((m) => m.remove());
      multiMarkersRef.current = multiPoint.points.map((p, i) =>
        new maplibregl.Marker({
          element: createMarkerElement("#d6a94f", `Step ${i + 1}`),
          anchor: "bottom",
        })
          .setLngLat([p.lng, p.lat])
          .addTo(map),
      );
      return;
    }

    if (!guess) return;

    guessMarkerRef.current?.remove();
    guessMarkerRef.current = new maplibregl.Marker({
      element: createMarkerElement("#d6a94f", "Your guess"),
      anchor: "bottom",
    })
      .setLngLat([guess.lng, guess.lat])
      .addTo(map);
  }, [guess, multiPoint]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    if (!showAnswer) {
      removeResultOverlay(map);
      answerMarkerRef.current?.remove();
      answerMarkerRef.current = null;
      return;
    }

    if (!guess) return;

    const activeGuess = guess;

    answerMarkerRef.current?.remove();
    answerMarkerRef.current = new maplibregl.Marker({
      element: createMarkerElement("#22c55e", "History"),
      anchor: "bottom",
    })
      .setLngLat([answerLng, answerLat])
      .addTo(map);

    const geojson: GeoJSON.Feature<GeoJSON.LineString> = {
      type: "Feature",
      properties: {},
      geometry: {
        type: "LineString",
        coordinates: [
          [activeGuess.lng, activeGuess.lat],
          [answerLng, answerLat],
        ],
      },
    };

    function applyResultOverlay() {
      if (!mapRef.current || mapRef.current !== map || !isMapReady(map)) return;

      removeResultOverlay(map);

      map.addSource(RESULT_SOURCE_ID, { type: "geojson", data: geojson });
      map.addLayer({
        id: RESULT_LAYER_ID,
        type: "line",
        source: RESULT_SOURCE_ID,
        paint: {
          "line-color": "#d6a94f",
          "line-width": 2,
          "line-dasharray": [2, 2],
          "line-opacity": 0.85,
        },
      });

      const bounds = new maplibregl.LngLatBounds();
      bounds.extend([activeGuess.lng, activeGuess.lat]);
      bounds.extend([answerLng, answerLat]);
      map.fitBounds(bounds, { padding: 80, maxZoom: 8, duration: 800 });
    }

    if (map.isStyleLoaded()) {
      applyResultOverlay();
    } else {
      map.once("load", applyResultOverlay);
    }

    return () => {
      map.off("load", applyResultOverlay);
      if (mapRef.current !== map) return;
      removeResultOverlay(map);
      answerMarkerRef.current?.remove();
      answerMarkerRef.current = null;
    };
  }, [showAnswer, guess, answerLat, answerLng]);

  return (
    <div className="flex flex-col gap-3">
      <div
        ref={containerRef}
        className="h-[min(52vh,420px)] w-full overflow-hidden rounded-2xl border border-white/10 shadow-inner sm:h-[480px]"
        role="application"
        aria-label="World map for placing your historical guess"
      />
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-[var(--text-secondary)]">
          {multiPoint
            ? `Place point ${multiPoint.points.length + 1} of ${multiPoint.maxPoints} on the map`
            : showAnswer
              ? "Gold marker: your guess · Green marker: the historical location"
              : guess
                ? "Guess placed — validate when ready"
                : "Click anywhere on the map to place your guess"}
        </p>
        {!showAnswer && (
          <button
            type="button"
            className="btn-primary shrink-0"
            disabled={!canValidate}
            onClick={onValidate}
          >
            Validate guess
          </button>
        )}
      </div>
    </div>
  );
}
