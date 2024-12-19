import * as React from 'react';
import { PieChart } from '@mui/x-charts/PieChart';

// Value formatter function
const valueFormatter = (value) => `${value}%`;

export default function PieActiveArc() {
  return (
    <PieChart
        series={[
            {
            data: [
              { id: 0, value: 1000, label: 'State Tax' },
              { id: 1, value: 1500, label: 'Federal Tax' },
              { id: 2, value: 10000, label: 'Take Home' },
              { id: 3, value: 500, label: 'PatientCare+ Sub.' }
            ],
            innerRadius: 25,
            paddingAngle: 1,
            cornerRadius: 4,
            // Positioning of the chart
            cx: 95,
            cy: 100,
            labelPosition: 'outside',
            label: ({ value }) => `${valueFormatter(value)}`,
            highlightScope: { fade: 'global', highlight: 'item' },
            faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' },
            },
        ]}
        width={500}
        height={200}
    />
  );
}