import React from "react";

// Mock SVG component for Jest tests
const SvgMock = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} data-testid="svg-mock" />
);

export default SvgMock;
