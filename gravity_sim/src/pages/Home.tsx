import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

const DB_URL = "http://localhost:3001";

/* ================= TYPES ================= */

export type PresetListItem = {
  id: number;
  name: string;
  description: string;
  created_at: string;
};

type Planet = {
  id: number;
  preset_id: number;
  mass: number;
  position_x: number;
  position_y: number;
  position_z: number;
  velocity_x: number;
  velocity_y: number;
  velocity_z: number;
  radius: number;
  spin: number;
  color: string;
  texture_path?: string;
  name?: string;
};

type Star = Planet & {
  light_intensity: number;
};

type FullPreset = {
  preset_id: number;
  name: string;
  description: string;
  created_at: string;
  planets: Planet[];
  stars: Star[];
};

/* ================= MAIN ================= */

function Home() {
  const [presets, setPresets] = useState<PresetListItem[]>([]);
  const [selectedPreset, setSelectedPreset] = useState<FullPreset | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchPresets() {
      const response = await fetch(`${DB_URL}/api/presets`);
      if (!response.ok) {
        console.error("Failed to fetch presets.");
        return;
      }

      const data = await response.json();
      setPresets(data);
    }

    fetchPresets();
  }, []);

  /* ===== OPEN MODAL + FETCH ===== */

  const openDetails = async (presetId: number) => {
    // Open immediately (better UX)
    (document.getElementById(
      "preset-details-modal"
    ) as HTMLDialogElement)?.showModal();

    setLoading(true);
    setSelectedPreset(null);

    try {
      const res = await fetch(
        `${DB_URL}/api/presets/${presetId}/full`
      );

      if (!res.ok) throw new Error("Failed to fetch preset");

      const data: FullPreset = await res.json();
      setSelectedPreset(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-10 flex flex-col items-start gap-6 w-full h-full">
      <div className="text-4xl font-extrabold w-full text-center">
        Welcome to SpaceBox
      </div>

      <div className="w-full flex flex-row flex-wrap gap-4">
        {presets.map((preset) => (
          <PresetCard
            key={preset.id}
            preset={preset}
            onDetails={openDetails}
          />
        ))}
      </div>

      <Link
        to="/scene?preset=-1"
        className="bg-primary hover:bg-primary/80 text-white font-semibold py-2 px-6 rounded shadow transition-colors"
      >
        Enter SpaceBox
      </Link>

      <Details preset={selectedPreset} loading={loading} />
    </div>
  );
}

/* ================= PRESET CARD ================= */

type PresetCardProps = {
  preset: PresetListItem;
  onDetails: (id: number) => void;
};

const PresetCard = ({ preset, onDetails }: PresetCardProps) => {
  return (
    <div className="p-10 w-1/2 md:w-1/3 lg:w-1/4 bg-primary hover:bg-primary/80 rounded-md flex flex-col items-center">
      <Link to={`/scene?preset=${preset.id}`}>
        <div className="flex flex-col items-center">
          <h2 className="text-3xl font-extrabold text-primary-content">
            {preset.name}
          </h2>
          <p className="text-lg font-semibold text-primary-content">
            {preset.description}
          </p>
          <p className="text-sm text-primary-content">
            Created {preset.created_at}
          </p>
        </div>
      </Link>

      <button
        className="btn btn-link text-primary-content"
        onClick={() => onDetails(preset.id)}
      >
        details
      </button>
    </div>
  );
};

/* ================= MODAL ================= */

type DetailsProps = {
  preset: FullPreset | null;
  loading: boolean;
};

const Details = ({ preset, loading }: DetailsProps) => {
  return (
    <dialog id="preset-details-modal" className="modal">
      <div className="modal-box max-w-3xl">

        {loading ? (
          <span className="loading loading-infinity loading-xl"></span>
        ) : !preset ? (
          <div className="text-center py-10">No data</div>
        ) : (
          <>
            <h3 className="font-bold text-2xl mb-2">{preset.name}</h3>

            <p className="text-sm opacity-70 mb-4">
              Created:{" "}
              {new Date(preset.created_at).toLocaleString()}
            </p>

            <p className="mb-6">{preset.description}</p>

            {/* ===== STARS ===== */}
            <div className="mb-6">
              <h4 className="font-semibold text-lg mb-2">Stars</h4>

              {preset.stars.length === 0 ? (
                <p className="opacity-60">No stars</p>
              ) : (
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {preset.stars.map((star) => (
                    <div
                      key={star.id}
                      className="p-2 bg-base-200 rounded flex flex-row justify-between"
                    >
                      <div>
                        <div className="font-medium">
                          {star.name || "Unnamed Star"}
                        </div>
                        <div className="text-sm opacity-70">
                          Mass: {star.mass} | Light: {star.light_intensity}
                        </div>
                      </div>
                      <button className="btn btn-ghost rounded-full text-error" onClick={async () => {
                        const success = await removeStar(preset.preset_id, star.id);
                        if (success) {
                          window.location.reload();
                        }
                        }
                      }>X</button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* ===== PLANETS ===== */}
            <div>
              <h4 className="font-semibold text-lg mb-2">Planets</h4>

              {preset.planets.length === 0 ? (
                <p className="opacity-60">No planets</p>
              ) : (
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {preset.planets.map((planet) => (
                    <div
                      key={planet.id}
                      className="p-2 bg-base-200 rounded flex flex-row justify-between"
                    >
                      <div>
                        <div className="font-medium">
                          {planet.name || "Unnamed Planet"}
                        </div>
                        <div className="text-sm opacity-70">
                          Mass: {planet.mass}
                        </div>
                      </div>
                      <button className="btn btn-ghost rounded-full text-error" onClick={async () => {
                        const success = await removePlanet(preset.preset_id, planet.id);
                        if (success) {
                          window.location.reload();  
                        }
                      }}>X</button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <Link to={`/scene?preset=${preset.preset_id}`} className="btn btn-primary mt-6">
                Load Simulation
            </Link>
          </>
        )}
      </div>

      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
};

async function removePlanet(preset_id: number, planet_id: number) {
  try {
    const response = await fetch(`${DB_URL}/api/presets/${preset_id}/planets/${planet_id}`, {
      method: "DELETE"
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({ message: "Unknown error" }));
      console.error(`Couldn't delete planet:`, err);
      return false;
    }

    console.log(`Planet ${planet_id} deleted successfully.`);
    return true;
  } catch (error) {
    console.error("Network or fetch error:", error);
    return false;
  }
}

async function removeStar(preset_id: number, star_id: number) {
  try {
    const response = await fetch(`${DB_URL}/api/presets/${preset_id}/stars/${star_id}`, {
      method: "DELETE"
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({ message: "Unknown error" }));
      console.error(`Couldn't delete star:`, err);
      return false;
    }

    console.log(`Star ${star_id} deleted successfully.`);
    return true;
  } catch (error) {
    console.error("Network or fetch error:", error);
    return false;
  }
}

export default Home;