import VisxCustomGraph from "./visx-graph/VisxCustomGraph";
import PixiApp from "./pixi-graph/PixiApp";

const App = ({ width, height }) => {
  return (
    <>
      <VisxCustomGraph width={width} height={height} />
      {/*<PixiStage width={width} height={height} />*/}
      <PixiApp />
    </>
  );
};

export default App;
