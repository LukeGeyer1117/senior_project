import type { Dispatch, SetStateAction } from "react";

interface GridControlProps {
  showGrid: boolean,
  setShowGrid: Dispatch<SetStateAction<boolean>>;
}

const GridControls = ({showGrid, setShowGrid}: GridControlProps) => {

    return (
        <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="btn m-1 bg-transparent border-none">
              <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="css-i6dzq1"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
            </div>
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