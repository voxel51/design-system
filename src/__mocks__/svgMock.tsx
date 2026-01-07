import React from "react";

// Mock SVG component for Jest tests
const SvgMock = (props: React.SVGProps<SVGSVGElement>): React.ReactElement => (
  <svg {...props} />
);

export default SvgMock;
