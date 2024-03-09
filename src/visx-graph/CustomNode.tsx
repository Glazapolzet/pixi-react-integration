import { DefaultNode } from "@visx/network";

export interface CustomNode {
  id: string;
  radius: number;
  x: number;
  y: number;
}

const CustomNode = ({ id, radius, x, y, ...props }) => {
  return <DefaultNode id={id} radius={radius} cx={x} cy={y} {...props} />;
};

export default CustomNode;
