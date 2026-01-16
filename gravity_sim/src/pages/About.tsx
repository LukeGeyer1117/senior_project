export default function About() {
    return (

        <div className="p-10">
            <div className="card w-96 bg-base-100 shadow-xl">
                <div className="card-body">
                <h2 className="card-title">DaisyUI is working!</h2>
                <p>If you see a nice card and button below, you are set.</p>
                <div className="card-actions justify-end">
                    <button className="btn btn-error">Test Button</button>
                    <div className="tooltip tooltip-bottom" data-tip='ello mate'>
                        <button className="btn btn-info">TESTSTSTST</button>
                    </div>
                </div>
                </div>
            </div>
        </div>
        
    );
}