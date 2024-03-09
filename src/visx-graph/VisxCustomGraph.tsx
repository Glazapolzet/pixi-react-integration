import { Drag, raise } from "@visx/drag";
import CustomNode from "./CustomNode";
import { useCallback, useEffect, useMemo, useState } from "react";
import CustomLink from "./CustomLink";

const genNodes = (amount: number, radius: number, drop: number) => {
  return [...new Array(amount)].map((_, i) => ({
    id: i,
    x: Math.floor(drop * Math.random()),
    y: Math.floor(drop * Math.random()),
    dx: 0,
    dy: 0,
    radius: radius,
  }));
};

const genLinks = (amount: number, nodes: Array<any>) => {
  const randIndex = () => Math.floor(nodes.length * Math.random());

  return [...new Array(amount)].map((_, i) => {
    const source = nodes[randIndex()];
    let target = nodes[randIndex()];

    while (source.id === target.id) {
      target = nodes[randIndex()];
    }

    return {
      id: i,
      source: source,
      target: target,
    };
  });
};

const getDefaultNodeMoving = () => {
  return {
    id: NaN,
    x: 0,
    y: 0,
    dx: 0,
    dy: 0,
    isDragging: false,
  };
};

const VisxCustomGraph = ({ width, height }) => {
  const mockNodes = useMemo(() => genNodes(20, 15, width - 150), [width]);
  const mockLinks = useMemo(() => genLinks(10, mockNodes), [mockNodes]);

  const [nodes, setNodes] = useState(mockNodes);
  const [links, setLinks] = useState(mockLinks);
  const [nodeMovingDragData, setNodeMovingDragData] = useState(
    getDefaultNodeMoving(),
  );

  const checkWhichEndIsMoving = (link, nodeMovingId) => {
    return {
      isSourceMoving: link.source.id === nodeMovingId,
      isTargetMoving: link.target.id === nodeMovingId,
    };
  };

  const updateDeprecatedLinks = useCallback(
    (links, newNodes) => {
      for (let i = 0; i < links.length; i++) {
        const { isSourceMoving, isTargetMoving } = checkWhichEndIsMoving(
          links[i],
          nodeMovingDragData.id,
        );

        if (isSourceMoving) {
          links[i].source = newNodes[newNodes.length - 1];
        }

        if (isTargetMoving) {
          links[i].target = newNodes[newNodes.length - 1];
        }
      }

      return links;
    },
    [nodeMovingDragData.id],
  );

  useEffect(() => {
    if (!nodeMovingDragData.isDragging) {
      return;
    }

    nodes[nodes.length - 1].dx = nodeMovingDragData.dx;
    nodes[nodes.length - 1].dy = nodeMovingDragData.dy;

    // console.log({
    //   nodeMovingDragData: nodeMovingDragData,
    //   new: nodes[nodes.length - 1],
    // });

    setNodes(nodes);
    setLinks((links) => updateDeprecatedLinks(links, nodes));
  }, [links, updateDeprecatedLinks, nodeMovingDragData, nodes]);

  return (
    <div style={{ touchAction: "none" }}>
      <svg width={width} height={height}>
        <rect width={width} height={height} rx={14} fill={"#272b4d"} />
        {links.map(({ id, source, target }) => (
          <CustomLink
            id={id}
            key={`link-${id}`}
            x1={source.x + source.dx}
            y1={source.y + source.dy}
            x2={target.x + target.dx}
            y2={target.y + target.dy}
            strokeWidth={2}
            stroke="#970"
            strokeOpacity={0.9}
          />
        ))}
        {nodes.map(({ id, radius, x, y }, i) => (
          <Drag
            x={x}
            y={y}
            width={width}
            height={height}
            key={`drag-${id}`}
            onDragStart={(currDrag) => {
              setNodes(raise(nodes, i));
              setNodeMovingDragData({
                id: parseInt(currDrag.event.target.id),
                x: currDrag.x,
                y: currDrag.y,
                dx: currDrag.dx,
                dy: currDrag.dy,
                isDragging: currDrag.isDragging,
              });
            }}
            onDragMove={(currDrag) => {
              setNodeMovingDragData({
                id: parseInt(currDrag.event.target.id),
                x: currDrag.x,
                y: currDrag.y,
                dx: currDrag.dx,
                dy: currDrag.dy,
                isDragging: currDrag.isDragging,
              });
            }}
            onDragEnd={() => setNodeMovingDragData(getDefaultNodeMoving())}
          >
            {({ dragStart, dragEnd, dragMove, isDragging, x, y, dx, dy }) => (
              <CustomNode
                x={x}
                y={y}
                id={id}
                key={`dot-${id}`}
                r={isDragging ? radius + 5 : radius}
                fill={isDragging ? "#ff00a5" : "#ffffff"}
                transform={`translate(${dx}, ${dy})`}
                fillOpacity={0.9}
                onMouseMove={dragMove}
                onMouseUp={dragEnd}
                onMouseDown={dragStart}
                onTouchStart={dragStart}
                onTouchMove={dragMove}
                onTouchEnd={dragEnd}
              />
            )}
          </Drag>
        ))}
      </svg>
    </div>
  );
};

export default VisxCustomGraph;
