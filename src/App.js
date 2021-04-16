import './App.css';
import "bootstrap";
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file
import { DateRangePicker } from 'react-date-range';
import moment from 'moment';
import {
  Chart,
  ArcElement,
  LineElement,
  BarElement,
  PointElement,
  BarController,
  BubbleController,
  DoughnutController,
  LineController,
  PieController,
  PolarAreaController,
  RadarController,
  ScatterController,
  CategoryScale,
  LinearScale,
  LogarithmicScale,
  RadialLinearScale,
  TimeScale,
  TimeSeriesScale,
  Decimation,
  Filler,
  Legend,
  Title,
  Tooltip,
} from 'chart.js';
import {useEffect, useRef, useState} from "react";


Chart.register(
  ArcElement,
  LineElement,
  BarElement,
  PointElement,
  BarController,
  BubbleController,
  DoughnutController,
  LineController,
  PieController,
  PolarAreaController,
  RadarController,
  ScatterController,
  CategoryScale,
  LinearScale,
  LogarithmicScale,
  RadialLinearScale,
  TimeScale,
  TimeSeriesScale,
  Decimation,
  Filler,
  Legend,
  Title,
  Tooltip
);


const dataExtractor = (data, type, key) => data[type].reduce((ac, el) => [...ac, el[key]], [])

function App() {

  const chartRef = useRef();
  const chart = useRef(null);

  const [ dateRange, setDateRange] = useState(() => {
    const now = new Date()
    return [{
      startDate: moment(now).subtract(1, 'months').toDate(),
      endDate: now,
      key: 'selection',
    }]
  })

  useEffect(() => {
    const ctx = chartRef.current.getContext('2d');
    chart.current = new Chart(ctx, {
      type: 'line',
      data: {
        labels: [],
        datasets: []
      
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
    }
    });
  }, [])

  useEffect(() => {
    const from = dateRange[0].startDate.toISOString().split('T')[0];
    const to = dateRange[0].endDate.toISOString().split('T')[0];
    fetch(`${process.env.REACT_APP_BACKEND_BASE_URL}/reports?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`)
    .then(response => response.json())
    .then(data => {
      const labels = dataExtractor(data, 'numberOfOrders', 'purchaseDate')
      const numberOfCustomers = dataExtractor(data, 'numberOfCustomers', 'numberOfCustomers')
      const numberOfOrders = dataExtractor(data, 'numberOfOrders', 'numberOfOrders')
      const totalRevenue = dataExtractor(data, 'totalRevenue', 'total')
      chart.current.data.labels = labels;
      chart.current.data.datasets = [];
      chart.current.data.datasets.push({
        label: 'Number of customers',
        data: numberOfCustomers,
        fill: false,
        borderColor: 'red',
        tension: 0.1
      });
      chart.current.data.datasets.push({
        label: 'Number of orders',
        data: numberOfOrders,
        fill: false,
        borderColor: 'blue',
        tension: 0.1
      });
      chart.current.data.datasets.push({
        label: 'Revenue',
        data: totalRevenue,
        fill: false,
        borderColor: 'yellow',
        tension: 0.1
      });
      chart.current.update();
    });

  }, [chart,dateRange])

  return (
    <div className="App">
      <div className="calendar">
        <DateRangePicker
          ranges={dateRange}
          onChange={(ranges) => {
            setDateRange([
              {
                startDate: ranges.selection.startDate,
                endDate: ranges.selection.endDate,
                key: 'selection',
              }
            ])
          }}
        />
      </div>
      <div className="chart">
      <canvas ref={chartRef} id="myChart"></canvas>
      </div>
    </div>
  );
}

export default App;



// {
//   label: 'Number of orders',
//   data: [30, 59, 10, 20, 56, 55, 40],
//   fill: false,
//   borderColor: 'blue',
//   tension: 0.1
// },
// {
//   label: 'Revenue',
//   data: [20, 15, 10, 20, 56, 55, 1],
//   fill: false,
//   borderColor: 'yellow',
//   tension: 0.1
// }
