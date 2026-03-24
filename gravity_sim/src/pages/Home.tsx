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

      <div className="w-full grid grid-cols-1 grid-rows-auto md:grid-cols-2 lg:grid-cols-4 gap-4">
        {presets.map((preset) => (
          <PresetCard
            key={preset.id}
            preset={preset}
            onDetails={openDetails}
          />
        ))}
      <div 
        className="p-10 w-full border-4 border-dashed border-primary hover:bg-primary/20 rounded-md flex flex-col items-center"
        onClick={()=>{(document.getElementById("new-preset-modal") as HTMLDialogElement | null)?.showModal()}}
        >
        <div className="flex flex-col items-center justify-center h-full w-full text-7xl text-primary hover:text-primary-content">
          +
        </div>
      </div>

      </div>

      <Link
        to="/scene?preset=-1"
        className="bg-primary hover:bg-primary/80 text-white font-semibold py-2 px-6 rounded shadow transition-colors"
      >
        Enter SpaceBox
      </Link>

      <PresetDetails preset={selectedPreset} loading={loading} />
      <NewPresetModal />
      <NewPlanetModal presetId={selectedPreset?.preset_id ?? -1} />
      <NewStarModal presetId={selectedPreset?.preset_id ?? -1} />
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
    <div className="p-10 w-full bg-neutral hover:bg-neutral/60 rounded-md flex flex-col gap-2 items-center">
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

      <div className="flex flex-row gap-2">
        <button
          className="btn btn-info text-info-content text-lg"
          onClick={() => onDetails(preset.id)}
        >
          details
        </button>
        <button 
          className="btn btn-error text-error-content text-lg"
          onClick={async () => {
            const confirmed = window.confirm("Are you sure you want to delete this preset? This action cannot be undone.");
            if (!confirmed) return;

            const success = await deletePreset(preset.id);
            if (success) {
              window.location.reload();
            } else {
              window.alert("Failed to delete preset. Please try again.");
            }
          }}
        >
          remove
        </button>
      </div>
    </div>
  );
};

/* ================= MODAL ================= */

type PresetDetailsProps = {
  preset: FullPreset | null;
  loading: boolean;
};

const PresetDetails = ({ preset, loading }: PresetDetailsProps) => {
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
              <button className="btn btn-info btn-link" onClick={() => {(document.getElementById("new-star-modal") as HTMLDialogElement)?.showModal()}}>Add Star</button>
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
              <button className="btn btn-info btn-link" onClick={() => {(document.getElementById("new-planet-modal") as HTMLDialogElement)?.showModal()}}>Add Planet</button>
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

const NewPresetModal = () => {
  return (
      <dialog id="new-preset-modal" className="modal">
        <div className="modal-box max-w-3xl flex flex-col items-center gap-4">
          <h3 className="font-bold text-2xl mb-2">Create New Preset</h3>
          <input id="preset-name-input" type="text" className="input input-lg" placeholder="Preset Name" />
          <textarea id="preset-description-input" className="textarea textarea-lg" placeholder="Preset Description"></textarea>
          <button className="btn btn-primary" onClick={async () => {
            const nameInput = document.getElementById("preset-name-input") as HTMLInputElement | null;
            const descInput = document.getElementById("preset-description-input") as HTMLTextAreaElement | null;

            if (!nameInput || !descInput) return;

            const name = nameInput.value.trim();
            const description = descInput.value.trim();

            if (!name) {
              alert("Preset name is required.");
              return;
            }

            try {
              const res = await fetch(`${DB_URL}/api/presets`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, description })
              });

              if (!res.ok) {
                const err = await res.json().catch(() => ({ message: "Unknown error" }));
                alert(`Failed to create preset: ${err.message}`);
              } else {
                window.location.reload();
              }
            } catch (error) {
              console.error("Network or fetch error:", error);
              alert("An error occurred while creating the preset.");
            }
          }}>
            Create Preset
          </button>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
  );
}

type NewPlanetModalProps = {
  presetId: number;
};

const NewPlanetModal = ({ presetId }: NewPlanetModalProps) => {

  const [form, setForm] = useState({
    name: "",
    mass: 1.5,
    radius: 1.5,
    spin: 0.2,
    color: "#FFFFFF",
    texture_path: "2k_earth_daymap.jpg",

    position_x: 0,
    position_y: 0,
    position_z: 0,

    velocity_x: 0,
    velocity_y: 0,
    velocity_z: 0,
  });

  const handleChange = (key: string, value: string | number) => {
    setForm((prev) => ({
      ...prev,
      [key]: typeof prev[key as keyof typeof prev] === "number"
        ? Number(value)
        : value
    }));
  };

  const handleSubmit = async () => {
    try {
      const res = await fetch(
        `${DB_URL}/api/presets/${presetId}/planets`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(form),
        }
      );

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        console.error("Failed to create planet:", err);
        return;
      }

      console.log("Planet created!");

      window.location.reload(); // Refresh to show new planet in details view

    } catch (err) {
      console.error("Error creating planet:", err);
    }
  };


  return (
    <dialog id="new-planet-modal" className="modal">
      <div className="modal-box max-w-3xl flex flex-col gap-4">

        <h3 className="font-bold text-lg text-center">Create New Planet</h3>

        {/* ===== BASIC INFO ===== */}
        <input
          className="input input-bordered"
          placeholder="Name"
          value={form.name}
          onChange={(e) => handleChange("name", e.target.value)}
        />

        <div className="grid grid-cols-2 gap-2">
          <input
            className="input input-bordered"
            type="number"
            placeholder="Mass"
            value={form.mass}
            onChange={(e) => handleChange("mass", e.target.value)}
          />
          <input
            className="input input-bordered"
            type="number"
            placeholder="Radius"
            value={form.radius}
            onChange={(e) => handleChange("radius", e.target.value)}
          />
        </div>

        <input
          className="input input-bordered"
          type="number"
          placeholder="Spin"
          value={form.spin}
          onChange={(e) => handleChange("spin", e.target.value)}
        />

        <input
          className="input input-bordered"
          placeholder="Texture Path"
          value={form.texture_path}
          onChange={(e) => handleChange("texture_path", e.target.value)}
        />

        <input
          className="input input-bordered"
          type="color"
          value={form.color}
          onChange={(e) => handleChange("color", e.target.value)}
        />

        {/* ===== POSITION ===== */}
        <div>
          <div className="font-semibold">Position</div>
          <div className="grid grid-cols-3 gap-2">
            <input className="input input-bordered" type="number" placeholder="X"
              value={form.position_x}
              onChange={(e) => handleChange("position_x", e.target.value)} />
            <input className="input input-bordered" type="number" placeholder="Y"
              value={form.position_y}
              onChange={(e) => handleChange("position_y", e.target.value)} />
            <input className="input input-bordered" type="number" placeholder="Z"
              value={form.position_z}
              onChange={(e) => handleChange("position_z", e.target.value)} />
          </div>
        </div>

        {/* ===== VELOCITY ===== */}
        <div>
          <div className="font-semibold">Velocity</div>
          <div className="grid grid-cols-3 gap-2">
            <input className="input input-bordered" type="number" placeholder="X"
              value={form.velocity_x}
              onChange={(e) => handleChange("velocity_x", e.target.value)} />
            <input className="input input-bordered" type="number" placeholder="Y"
              value={form.velocity_y}
              onChange={(e) => handleChange("velocity_y", e.target.value)} />
            <input className="input input-bordered" type="number" placeholder="Z"
              value={form.velocity_z}
              onChange={(e) => handleChange("velocity_z", e.target.value)} />
          </div>
        </div>

        {/* ===== ACTIONS ===== */}
        <div className="flex justify-end gap-2 mt-4">
          <button
            className="btn btn-primary"
            onClick={handleSubmit}
          >
            Create
          </button>
        </div>

      </div>

      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
}

type NewStarModalProps = {
  presetId: number;
  onCreated?: () => void;
};

const NewStarModal = ({ presetId, onCreated }: NewStarModalProps) => {
  const [form, setForm] = useState({
    name: "",
    mass: 10,
    radius: 10,
    spin: 0.1,
    color: "#ffffff",
    texture_path: "2k_sun.jpg",

    light_intensity: 10,

    position_x: 0,
    position_y: 0,
    position_z: 0,

    velocity_x: 0,
    velocity_y: 0,
    velocity_z: 0,
  });

  const handleChange = (key: string, value: string | number) => {
    setForm((prev) => ({
      ...prev,
      [key]:
        typeof prev[key as keyof typeof prev] === "number"
          ? Number(value)
          : value,
    }));
  };

  const handleSubmit = async () => {
    if (!presetId) {
      console.error("Invalid preset ID");
      return;
    }

    try {
      const res = await fetch(
        `${DB_URL}/api/presets/${presetId}/stars`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(form),
        }
      );

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        console.error("Failed to create star:", err);
        return;
      }

      console.log("Star created!");

      window.location.reload(); // Refresh to show new star in details view

    } catch (err) {
      console.error("Error creating star:", err);
    }
  };

  return (
    <dialog id="new-star-modal" className="modal">
      <div className="modal-box max-w-3xl flex flex-col gap-4">

        <h3 className="font-bold text-lg text-center">Create New Star</h3>

        {/* ===== BASIC INFO ===== */}
        <input
          className="input input-bordered"
          placeholder="Name"
          value={form.name}
          onChange={(e) => handleChange("name", e.target.value)}
        />

        <div className="grid grid-cols-2 gap-2">
          <input
            className="input input-bordered"
            type="number"
            placeholder="Mass"
            value={form.mass}
            onChange={(e) => handleChange("mass", e.target.value)}
          />
          <input
            className="input input-bordered"
            type="number"
            placeholder="Radius"
            value={form.radius}
            onChange={(e) => handleChange("radius", e.target.value)}
          />
        </div>

        <input
          className="input input-bordered"
          type="number"
          placeholder="Spin"
          value={form.spin}
          onChange={(e) => handleChange("spin", e.target.value)}
        />

        <input
          className="input input-bordered"
          placeholder="Texture Path"
          value={form.texture_path}
          onChange={(e) => handleChange("texture_path", e.target.value)}
        />

        <input
          className="input input-bordered"
          type="color"
          value={form.color}
          onChange={(e) => handleChange("color", e.target.value)}
        />

        {/* ⭐ STAR-SPECIFIC */}
        <input
          className="input input-bordered"
          type="number"
          placeholder="Light Intensity"
          value={form.light_intensity}
          onChange={(e) => handleChange("light_intensity", e.target.value)}
        />

        {/* ===== POSITION ===== */}
        <div>
          <div className="font-semibold">Position</div>
          <div className="grid grid-cols-3 gap-2">
            <input className="input input-bordered" type="number" placeholder="X"
              value={form.position_x}
              onChange={(e) => handleChange("position_x", e.target.value)} />
            <input className="input input-bordered" type="number" placeholder="Y"
              value={form.position_y}
              onChange={(e) => handleChange("position_y", e.target.value)} />
            <input className="input input-bordered" type="number" placeholder="Z"
              value={form.position_z}
              onChange={(e) => handleChange("position_z", e.target.value)} />
          </div>
        </div>

        {/* ===== VELOCITY ===== */}
        <div>
          <div className="font-semibold">Velocity</div>
          <div className="grid grid-cols-3 gap-2">
            <input className="input input-bordered" type="number" placeholder="X"
              value={form.velocity_x}
              onChange={(e) => handleChange("velocity_x", e.target.value)} />
            <input className="input input-bordered" type="number" placeholder="Y"
              value={form.velocity_y}
              onChange={(e) => handleChange("velocity_y", e.target.value)} />
            <input className="input input-bordered" type="number" placeholder="Z"
              value={form.velocity_z}
              onChange={(e) => handleChange("velocity_z", e.target.value)} />
          </div>
        </div>

        {/* ACTIONS */}
        <div className="flex justify-end gap-2 mt-4">
          <button className="btn btn-primary" onClick={handleSubmit}>
            Create Star
          </button>
        </div>

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

async function deletePreset(preset_id: number) {
  const response = await fetch(`${DB_URL}/api/presets/${preset_id}`, {
    method: "DELETE"
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({ message: "Unknown error" }));
    console.error(`Couldn't delete preset:`, err);
    return false;
  }

  console.log(`Preset ${preset_id} deleted successfully.`);
  return true;
}

export default Home;