import { CelestialBody } from "../physics/CelestialBody";
import { Star } from "../physics/Star";

interface BodyInspectorProps {
  body: CelestialBody | null;
  tick?: number;
}

const BodyInspector = ({ body, tick }: BodyInspectorProps) => {
  if (!body) return null;

  const isStar = body instanceof Star;

  return (
    <div className="absolute top-[40vh] right-0 pointer-events-auto text-white p-4 rounded-lg backdrop-blur-sm min-w-64 border-solid border-3 border-white z-0">
      <h3 className="font-bold text-lg mb-2 border-b border-white/20 pb-1">
        {body.name || "Unnamed Body"}
      </h3>
      
      <div className="space-y-1 text-sm">
        <div className="flex justify-between">
          <span className="opacity-70">Mass:</span>
          <span>{body.mass.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span className="opacity-70">Radius:</span>
          <span>{body.radius.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span className="opacity-70">Spin:</span>
          <span>{body.spin.toFixed(3)}</span>
        </div>

        <div className="border-t border-white/20 pt-1 mt-1">
          <div className="text-xs opacity-50 mb-1">Position</div>
          <div className="grid grid-cols-3 gap-1 text-xs">
            <span>X: {body.position.x.toFixed(2)}</span>
            <span>Y: {body.position.y.toFixed(2)}</span>
            <span>Z: {body.position.z.toFixed(2)}</span>
          </div>
        </div>

        <div>
          <div className="text-xs opacity-50 mb-1">Velocity</div>
          <div className="grid grid-cols-3 gap-1 text-xs">
            <span>X: {body.velocity.x.toFixed(2)}</span>
            <span>Y: {body.velocity.y.toFixed(2)}</span>
            <span>Z: {body.velocity.z.toFixed(2)}</span>
          </div>
        </div>

        <div className="flex justify-between">
          <span className="opacity-70">Speed:</span>
          <span>{body.velocity.length().toFixed(2)}</span>
        </div>

        {isStar && (
          <>
            <div className="border-t border-white/20 pt-1 mt-1">
              <div className="flex justify-between">
                <span className="opacity-70">Luminosity:</span>
                <span>{(body as Star).luminosity.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="opacity-70">Light Intensity:</span>
                <span>{(body as Star).lightIntensity.toFixed(2)}</span>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default BodyInspector;