import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import ApexCharts from "apexcharts";
import axios from "axios";

	const ApexChart = () => {
	const [state, setState] = React.useState({

		series: [{
			data: []
		}],
		options: {
			chart: {
			id: 'area-datetime',
			type: 'area',
			height: 350,
			zoom: {
				autoScaleYaxis: true
			}
			},
			annotations: {
			yaxis: [{
				y: 30,
				borderColor: '#999',
				label: {
				show: true,
				text: 'Support',
				style: {
					color: "#fff",
					background: '#00E396'
				}
				}
			}],
			xaxis: [{
				x: new Date('14 Nov 2012').getTime(),
				borderColor: '#999',
				yAxisIndex: 0,
				label: {
				show: true,
				text: 'Rally',
				style: {
					color: "#fff",
					background: '#775DD0'
				}
				}
			}]
			},
			dataLabels: {
			enabled: false
			},
			markers: {
			size: 0,
			style: 'hollow',
			},
			xaxis: {
			type: 'datetime',
			min: new Date('05 May 2024').getTime(),
			tickAmount: 6,
			},
			yaxis: {
				labels: {
					formatter: function (value) {
						return value.toFixed(0);
					}
				}
			},
			tooltip: {
			x: {
				format: 'dd MMM yyyy HH:MM'
			},
			y: {
				formatter: function (value) {
					return value.toFixed(1) + ' A';
				}
			},
			style: {
				fontSize: '16px'
			}
			},
			fill: {
			type: 'gradient',
			gradient: {
				shadeIntensity: 1,
				opacityFrom: 0.7,
				opacityTo: 0.9,
				stops: [0, 100]
			}
			},
		},
		
		
		selection: 'one_month',
		
	});
	useEffect(() => {
		// Try to fetch data from your ModelAPI
		axios.get("http://0.0.0.0:8000/")
		  .then((response) => {
			console.log("Data received:", response.data);
			const fetchedData = response.data;
			const [Isc_mod, Voc_mod, Vmpp_vec, Impp_vec, mpp_vec, T_K] = fetchedData;
			// Make sure data is in format: [[timestamp, value], ...]
			setState(prev => ({
			  ...prev,
			  series: [{
				name: 'ISC (A)',
				data: Isc_mod
			  }]
			}));
			
			// Apply initial zoom to 1D view after data is loaded
			setTimeout(() => {
				ApexCharts.exec(
					'area-datetime',
					'zoomX',
					new Date('03 May 2024').getTime(),
					new Date('04 May 2024').getTime()
				);
			}, 100);
		  })
		  .catch((error) => {
			console.error("Error fetching data:", error);
		  });
	  }, []);
		const updateData = (timeline) => {
		setState({
		selection: timeline
		})

		switch (timeline) {
		case 'one_month':
			ApexCharts.exec(
			'area-datetime',
			'zoomX',
			new Date('03 May 2024').getTime(),
			new Date('04 May 2024').getTime()
			)
			break
		case 'six_months':
			ApexCharts.exec(
			'area-datetime',
			'zoomX',
			new Date('27 Sep 2023').getTime(),
			new Date('27 May 2024').getTime()
			)
			break
		case 'one_year':
			ApexCharts.exec(
			'area-datetime',
			'zoomX',
			new Date('27 Feb 2012').getTime(),
			new Date('27 Feb 2013').getTime()
			)
			break
		case 'ytd':
			ApexCharts.exec(
			'area-datetime',
			'zoomX',
			new Date('01 Jan 2013').getTime(),
			new Date('27 Feb 2013').getTime()
			)
			break
		case 'all':
			ApexCharts.exec(
			'area-datetime',
			'zoomX',
			new Date('23 Jan 2012').getTime(),
			new Date('27 Feb 2013').getTime()
			)
			break
		default:
		}
	}


	return (
		<div>
		<div id="chart">
			<div className="toolbar">
				<button id="one_month"
					
					onClick={()=>updateData('one_month')} className={ (state.selection==='one_month' ? 'active' : '')}>
				1D
				</button>
				
				<button id="six_months"
					
					onClick={()=>updateData('six_months')} className={ (state.selection==='six_months' ? 'active' : '')}>
				6M
				</button>
				
				<button id="one_year"
					
					
					onClick={()=>updateData('one_year')} className={ (state.selection==='one_year' ? 'active' : '')}>
				1Y
				</button>
				
				<button id="ytd"
					
					onClick={()=>updateData('ytd')} className={ (state.selection==='ytd' ? 'active' : '')}>
				YTD
				</button>
				
				<button id="all"
					
					onClick={()=>updateData('all')} className={ (state.selection==='all' ? 'active' : '')}>
				ALL
				</button>
			</div>
			
			<div id="chart-timeline">
			<ReactApexChart options={state.options} series={state.series} type="area" height={350} />
			</div>
			</div>
		<div id="html-dist"></div>
		</div>
	);
	}
	export default ApexChart;