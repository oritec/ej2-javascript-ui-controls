/**
 * Default sample for smith chart
 */
import { Smithchart } from '../../src/smithchart/smithchart';
import { ISmithchartLoadedEventArgs } from '../../src/smithchart/model/interface';

let count: number = 0;
let smithchart: Smithchart = new Smithchart({
    title: {
        visible: true,
        text: 'Transmission details'
    },
    series: [
        {
            points: [
                { resistance: 10, reactance: 25 }, { resistance: 8, reactance: 6 },
                { resistance: 6, reactance: 4.5 }, { resistance: 4.5, reactance: 2 },
                { resistance: 3.5, reactance: 1.6 }, { resistance: 2.5, reactance: 1.3 },
                { resistance: 2, reactance: 1.2 }, { resistance: 1.5, reactance: 1 },
                { resistance: 1, reactance: 0.8 }, { resistance: 0.5, reactance: 0.4 },
                { resistance: 0.3, reactance: 0.2 }, { resistance: 0, reactance: 0.15 },
            ],
            name: 'Transmission1',
            enableAnimation: true,
            tooltip: { visible: true },
            marker: {
                shape: 'Circle',
                visible: true,
                border: {
                    width: 2,
                }
            }
        },
    ],
    legendSettings: {
        visible: true,
        shape: 'Circle'
    },
    loaded: (args: ISmithchartLoadedEventArgs) => {
        if (count === 0) {
            smithchart.title.text ="Loaded Event";
            smithchart.loaded = null;
            smithchart.refresh();
          }
    }
});
smithchart.appendTo('#container');
