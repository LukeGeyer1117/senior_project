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
        <div className='p-10 flex flex-col items-start gap-6 w-full h-full'>
            <div className='text-4xl font-extrabold w-full text-center'>Welcome to SpaceBox</div>

            <div className="w-full flex flex-row flex-wrap gap-4">
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
                className="bg-primary hover:bg-primary/80 text-white font-semibold py-2 px-6 rounded shadow transition-colors"
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
            className=" p-10 w-1/2 md:w-1/3 lg:w-1/4 bg-primary hover:bg-primary/80 rounded-md"
        >
            <div className="flex flex-col items-center">
                <h2 className="text-3xl font-extrabold text-primary-content">{name}</h2>
                <p className="text-lg font-semibold text-primary-content">{description}</p>
                <p className="text-sm text-primary-content">Created {created_at}</p>
            </div>
        </Link>
    );
}

export default Home;