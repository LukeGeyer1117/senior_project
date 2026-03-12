import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

const DB_URL = "http://localhost:3001";

export type Preset = {
    id: number;
    name: string;
    description: string;
    created_at: string;
};

function Home() {
    const [presets, setPresets] = useState<Preset[]>([]);

    useEffect(() => {
        async function fetchPresets() {
            const response = await fetch(`${DB_URL}/api/presets`, {
                method: "GET",
            });

            if (!response.ok) {
                console.error("Failed to fetch presets from the database.");
                return;
            }

            const data = await response.json();
            setPresets(data);
        }
        fetchPresets();
    }, []);

    return (
        <div className='p-10 flex flex-col items-start gap-6'>
            <div className='text-4xl font-extrabold w-full text-center'>Welcome to SpaceBox</div>

            <div>
                <h1 className="text-2xl">Presets</h1>
                {presets.map((preset) => (
                    <Preset
                        key={preset.id}
                        preset_id={preset.id}
                        name={preset.name}
                        description={preset.description}
                        created_at={preset.created_at}
                    />
                ))}
            </div>

            <Link
                to="/scene?preset=-1"
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded shadow transition-colors"
            >
                Enter SpaceBox
            </Link>
        </div>
    );
}

type PresetProps = {
    preset_id: number;
    name: string;
    description: string;
    created_at: string;
}

const Preset = ({preset_id, name, description, created_at}: PresetProps) => {
    return (
        <Link 
            to={`/scene?preset=${preset_id}`}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded shadow transition-colors"
            data-preset-id={preset_id}
        >
            {name}
        </Link>
    );
}

export default Home;