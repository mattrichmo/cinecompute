"use client";

import React, { useEffect } from 'react';
import sunburst from 'sunburst-chart';

export type SunburstLeaf = {
  name: string;
  size: number;
  color: string;
};

export type SunburstNode = {
  name: string;
  color: string;
  size: number;
  children: (SunburstNode | SunburstLeaf)[];
};

interface SunburstElementProps {
  data: SunburstNode | undefined;
}

export const SunburstElement: React.FC<SunburstElementProps> = ({ data }) => {
  useEffect(() => {
    if (data) {
      sunburst()
        .data(data)
        .label('name')
        .size('size')
        .height(200)
        .width(200)
        .color('color')(document.getElementById('chart')!);
    }
  }, [data]);

  return <div id="chart" />;
};

export default SunburstElement;
