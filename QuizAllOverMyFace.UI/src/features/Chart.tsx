import React, { useContext } from 'react';
import { observer, useLocalStore } from 'mobx-react-lite';
import c3 from 'c3';
import 'c3/c3.css'
import { ReportsStoreContext, ReportsStore } from './menu-1/sub-menu-1/ReportsStore';

interface ChartProps {
    columns: any,
    chartType: "line" | "spline" | "step" | "area" | "area-spline" | "area-step" | "bar" | "scatter" | "stanford" | "pie" | "donut" | "gauge" | undefined
    data: any,
    xAxisValues: string[]
}

const Chart = (props: ChartProps) => {
let columns: any;
const store = useContext(ReportsStoreContext)

  React.useEffect(() => {
    
    async function fetchData() {
      // await store.getDeviceDescriptions()
      // await store.getDevices()
      //await store.arrangeColumns()
      console.log(props.columns)
      console.log(store.columns)
      console.log(props.xAxisValues)
    }
    
    const updateChart = () => {
      const chart = c3.generate({
        bindto: '#chart',
        data: {
          columns: store.columns,
          type: props.chartType
        },
        axis: {
          y: {
            label: {
              text: 'Count',
              position: 'outer-middle'
            }
          },
          x: {
            label: {
              text: 'Date',
              position: 'outer-center'
            },
            //type: 'timeseries',
            tick: {
              values: props.xAxisValues,
            }
          }
        }
      });
    };
    fetchData()

    updateChart()
  }, [props.columns, props.chartType])

  return (
      <div id="chart"></div>
  );
};

export default observer(Chart);