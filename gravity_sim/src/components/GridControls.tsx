import type { Dispatch, SetStateAction } from "react";

interface GridControlProps {
  showGrid: boolean,
  setShowGrid: Dispatch<SetStateAction<boolean>>;
}

const GridControls = ({showGrid, setShowGrid}: GridControlProps) => {

    return (
        <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="btn m-1 bg-transparent border-none">Grid Controls</div>
            <ul tabIndex={-1} className="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm">
              <li>
                <fieldset className="fieldset">
                  <legend className="fieldset-legend">Grid Size</legend>
                  <input id="grid-size-range" type="range" min={200} max={100000} defaultValue={200} className="range range-sm range-info" />
                </fieldset>
              </li>
              <li>
                <fieldset className="fieldset">
                  <legend className="fieldset-legend">Grid Density</legend>
                  <input id="grid-density-range" type="range" min={40} max={300} defaultValue={40} className="range range-sm range-info" />
                </fieldset>
              </li>
              <li>
                <fieldset className="fieldset">
                  <legend className="fieldset-legend">Grid On/Off</legend>
                  <input type="checkbox" className="toggle toggle-sm toggle-info" checked={showGrid} onChange={(e) => setShowGrid(e.target.checked)} />
                </fieldset>
              </li>
            </ul>
          </div>
    );
}

export default GridControls;